import { createHash } from "node:crypto";
import { open, mkdtemp, readFile, rm } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";
import {
  extractProviderProducts,
  providerPayloadErrorCode,
  providerPayloadShapeCode,
} from "./tradedoubler-products.mjs";
import { createOidcTokenProvider, validatedSiteOrigin } from "./github-oidc.mjs";
import { isPerfumeProduct } from "./perfume-classifier.mjs";

const BRIDGE_MAXIMUM_BYTES = 2 * 1024 * 1024;
const CHUNK_TARGET_BYTES = 1_500_000;
const PROVIDER_MAXIMUM_BYTES = 512 * 1024 * 1024;
const OIDC_AUDIENCE = "perfumetr-tradedoubler-bridge";
const mode = process.env.PERFUMETR_MODE === "full" ? "full"
  : process.env.PERFUMETR_MODE === "proof" ? "proof" : null;

if (!mode) throw new Error("invalid_mode");

const sourceConfigText = await readFile(
  new URL("../config/tradedoubler-sources.json", import.meta.url),
  "utf8",
);
let sourceConfig;
try {
  sourceConfig = JSON.parse(sourceConfigText);
} catch {
  throw new Error("invalid_source_config");
}
if (sourceConfig?.schemaVersion !== 1 || !Array.isArray(sourceConfig.sources)
  || sourceConfig.sources.length < 1 || sourceConfig.sources.length > 100) {
  throw new Error("invalid_source_config");
}

const sourceKeys = new Set();
const storeSlugs = new Set();
const configuredFeedIds = new Set();
const sourceDefinitions = sourceConfig.sources.map((source) => {
  const sourceKey = typeof source?.sourceKey === "string" ? source.sourceKey.trim() : "";
  const storeSlug = typeof source?.storeSlug === "string" ? source.storeSlug.trim() : "";
  const storeName = typeof source?.storeName === "string" ? source.storeName.trim() : "";
  const currency = typeof source?.currency === "string" ? source.currency.trim() : "";
  const allowedDomains = Array.isArray(source?.allowedDomains) ? source.allowedDomains : [];
  const feedIds = Array.isArray(source?.feedIds) ? source.feedIds.map(String) : [];
  const programIds = Array.isArray(source?.programIds) ? source.programIds.map(String) : [];
  if (!/^[a-z0-9-]{2,50}$/.test(sourceKey) || sourceKeys.has(sourceKey)
    || !/^[a-z0-9-]{2,40}$/.test(storeSlug) || storeSlugs.has(storeSlug)
    || !storeName || storeName.length > 80 || currency !== "PLN"
    || !allowedDomains.length || allowedDomains.length > 10
    || allowedDomains.some((domain) => !/^(?:[a-z0-9-]+\.)+[a-z]{2,}$/i.test(domain))
    || feedIds.length > 50 || programIds.length > 20
    || (!feedIds.length && !programIds.length)
    || feedIds.some((feedId) => !/^\d{1,20}$/.test(feedId) || configuredFeedIds.has(feedId))
    || programIds.some((programId) => !/^\d{1,20}$/.test(programId))) {
    throw new Error("invalid_source_config");
  }
  sourceKeys.add(sourceKey);
  storeSlugs.add(storeSlug);
  for (const feedId of feedIds) configuredFeedIds.add(feedId);
  return {
    sourceKey,
    storeSlug,
    storeName,
    currency,
    allowedDomains: allowedDomains.map((domain) => domain.toLowerCase()),
    feedIds: [...new Set(feedIds)],
    programIds: [...new Set(programIds)],
  };
});

const selectors = process.argv.slice(2).length
  ? [...new Set(process.argv.slice(2).map((value) => value.trim()))]
  : sourceDefinitions.map((source) => source.sourceKey);
const selectedSources = [];
for (const selector of selectors) {
  const source = sourceDefinitions.find((candidate) => (
    candidate.sourceKey === selector || candidate.feedIds.includes(selector)
  ));
  if (!source) throw new Error("invalid_source_selector");
  if (!selectedSources.includes(source)) selectedSources.push(source);
}
if (!selectedSources.length) throw new Error("invalid_source_selector");

const getOidcToken = createOidcTokenProvider({ audience: OIDC_AUDIENCE });
const siteOrigin = validatedSiteOrigin();

const bridge = new URL("/api/internal/tradedoubler-runtime-proof", siteOrigin).toString();

const safeBridgeError = (payload, status) => {
  const code = typeof payload?.error === "string" && /^[a-z0-9_]{1,80}$/i.test(payload.error)
    ? payload.error : String(status);
  return new Error(`bridge_${code}`);
};

const safeProviderError = (text, status) => {
  let payload = null;
  try { payload = JSON.parse(text); } catch { /* Provider details remain private. */ }
  const candidates = payload && typeof payload === "object" && !Array.isArray(payload)
    ? [
        payload.code,
        payload.statusCode,
        payload.errorCode,
        payload.error && typeof payload.error === "object" ? payload.error.code : null,
        ...(Array.isArray(payload.errors)
          ? payload.errors.slice(0, 20).map((error) => error && typeof error === "object" ? error.code : null)
          : []),
      ]
    : [];
  const code = candidates.find((value) => typeof value === "string" && /^[A-Za-z0-9_-]{1,40}$/.test(value));
  return new Error(code ? `provider_${status}_${code}` : `provider_${status}`);
};

const bridgePost = async (body, extraHeaders = {}) => {
  const serialized = JSON.stringify(body);
  if (Buffer.byteLength(serialized) > BRIDGE_MAXIMUM_BYTES) {
    throw new Error("bridge_payload_too_large");
  }
  let response = null;
  for (let attempt = 0; attempt < 3; attempt += 1) {
    try {
      const oidcToken = await getOidcToken();
      response = await fetch(bridge, {
        method: "POST",
        headers: {
          authorization: `Bearer ${oidcToken}`,
          "content-type": "application/json",
          ...extraHeaders,
        },
        body: serialized,
        signal: AbortSignal.timeout(60_000),
      });
      if (response.status < 500 || attempt === 2) break;
    } catch {
      if (attempt === 2) throw new Error("bridge_unavailable");
    }
  }
  if (!response) throw new Error("bridge_unavailable");
  const payload = await response.json().catch(() => ({}));
  if (!response.ok || payload.ok === false) throw safeBridgeError(payload, response.status);
  return payload;
};

const importUnlimitedChunk = async (request) => {
  const retryDelays = [250, 500, 1_000, 2_000];
  for (let attempt = 0; ; attempt += 1) {
    try {
      return await bridgePost(request);
    } catch (error) {
      if (!(error instanceof Error) || error.message !== "bridge_already_running"
        || attempt >= retryDelays.length) {
        throw error;
      }
      await new Promise((resolve) => setTimeout(resolve, retryDelays[attempt]));
    }
  }
};

const issueTicket = (feedId, ticketMode, options = {}) => bridgePost({
  action: "issue_browser_ticket",
  feedId,
  mode: ticketMode,
  ...options,
});

const providerUrlForTicket = async (ticket) => {
  let response;
  try {
    response = await fetch(`${bridge}?ticket=${encodeURIComponent(ticket)}`, {
      redirect: "manual",
      signal: AbortSignal.timeout(60_000),
    });
  } catch {
    throw new Error("bridge_unavailable");
  }
  if (response.status !== 302) {
    const payload = await response.json().catch(() => ({}));
    throw safeBridgeError(payload, response.status);
  }
  let providerUrl;
  try {
    providerUrl = new URL(response.headers.get("location") || "");
  } catch {
    throw new Error("unsafe_provider_redirect");
  }
  const providerToken = providerUrl.searchParams.get("token") ?? "";
  if (providerUrl.protocol !== "https:" || providerUrl.hostname !== "api.tradedoubler.com"
    || providerUrl.username || providerUrl.password || providerUrl.port
    || !providerUrl.pathname.startsWith("/1.0/")
    || providerUrl.searchParams.size !== 1 || !/^[a-f0-9]{40}$/i.test(providerToken)) {
    throw new Error("unsafe_provider_redirect");
  }
  return providerUrl;
};

const readBoundedText = async (response, maximumBytes) => {
  const declaredLength = Number(response.headers.get("content-length") || 0);
  if (Number.isFinite(declaredLength) && declaredLength > maximumBytes) {
    throw new Error("provider_payload_too_large");
  }
  if (!response.body) throw new Error("provider_empty_body");
  const reader = response.body.getReader();
  const decoder = new TextDecoder();
  let text = "";
  let bytes = 0;
  try {
    while (true) {
      const { done, value } = await reader.read();
      if (done) return text + decoder.decode();
      bytes += value.byteLength;
      if (bytes > maximumBytes) {
        await reader.cancel();
        throw new Error("provider_payload_too_large");
      }
      text += decoder.decode(value, { stream: true });
    }
  } catch (error) {
    try { await reader.cancel(); } catch { /* Keep the original safe error. */ }
    throw error;
  }
};

const fetchProviderJson = async (ticket, maximumBytes = BRIDGE_MAXIMUM_BYTES) => {
  const providerUrl = await providerUrlForTicket(ticket);
  let response;
  try {
    response = await fetch(providerUrl, {
      headers: { accept: "application/json" },
      signal: AbortSignal.timeout(120_000),
    });
  } catch {
    throw new Error("provider_unavailable");
  }
  const text = await readBoundedText(response, maximumBytes);
  if (!response.ok) throw safeProviderError(text, response.status);
  try {
    return JSON.parse(text);
  } catch {
    throw new Error("provider_invalid_json");
  }
};

const fetchUnlimitedJson = async (ticket) => {
  const providerUrl = await providerUrlForTicket(ticket);
  let response;
  try {
    response = await fetch(providerUrl, {
      headers: { accept: "application/json" },
      signal: AbortSignal.timeout(15 * 60_000),
    });
  } catch {
    throw new Error("provider_unavailable");
  }
  if (!response.ok) {
    await response.body?.cancel().catch(() => {});
    throw new Error(`provider_${response.status}`);
  }
  const declaredLength = Number(response.headers.get("content-length") || 0);
  if (Number.isFinite(declaredLength) && declaredLength > PROVIDER_MAXIMUM_BYTES) {
    await response.body?.cancel().catch(() => {});
    throw new Error("provider_payload_too_large");
  }
  if (!response.body) throw new Error("provider_empty_body");

  const directory = await mkdtemp(join(tmpdir(), "perfumetr-td-"));
  const filePath = join(directory, "products.json");
  const file = await open(filePath, "w");
  const reader = response.body.getReader();
  const hash = createHash("sha256");
  let bytes = 0;
  try {
    while (true) {
      const { done, value } = await reader.read();
      if (done) break;
      bytes += value.byteLength;
      if (bytes > PROVIDER_MAXIMUM_BYTES) {
        await reader.cancel();
        throw new Error("provider_payload_too_large");
      }
      hash.update(value);
      await file.write(value);
    }
    await file.close();
    const text = await readFile(filePath, "utf8");
    try {
      return { payload: JSON.parse(text), snapshotHash: hash.digest("hex") };
    } catch {
      throw new Error("provider_invalid_json");
    }
  } finally {
    try { await file.close(); } catch { /* Already closed. */ }
    await rm(directory, { recursive: true, force: true });
  }
};

const importTicketPayload = (ticket, providerPayload) => bridgePost(
  { action: "import_payload", payload: providerPayload },
  { "x-perfumetr-bridge-ticket": ticket },
);

const buildChunks = (products) => {
  const chunks = [];
  let current = [];
  let currentBytes = 64;
  const makeEnvelope = (items) => ({ productHeader: { totalHits: products.length }, products: items });
  for (const product of products) {
    const productBytes = Buffer.byteLength(JSON.stringify(product)) + (current.length ? 1 : 0);
    if (current.length && (current.length >= 100 || currentBytes + productBytes > CHUNK_TARGET_BYTES)) {
      chunks.push(makeEnvelope(current));
      current = [];
      currentBytes = 64;
    }
    if (productBytes + 64 > CHUNK_TARGET_BYTES) throw new Error("single_product_too_large");
    current.push(product);
    currentBytes += productBytes;
  }
  if (current.length) chunks.push(makeEnvelope(current));
  if (chunks.some((chunk) => Buffer.byteLength(JSON.stringify({
    action: "import_unlimited_chunk",
    feedId: "999999",
    sessionId: "00000000-0000-4000-8000-000000000000",
    chunkIndex: 1_000_000,
    snapshotHash: "f".repeat(64),
    rawProductCount: chunk.products.length,
    payload: chunk,
  })) > BRIDGE_MAXIMUM_BYTES)) {
    throw new Error("bridge_payload_too_large");
  }
  return chunks;
};

const feedMetadataRecord = (payload, feedId) => {
  const records = Array.isArray(payload)
    ? payload
    : Array.isArray(payload?.feeds) ? payload.feeds : [payload];
  return records.find((record) => record && typeof record === "object"
    && String(record.feedId) === String(feedId));
};

const feedMetadataProductCount = (payload, feedId) => {
  const record = feedMetadataRecord(payload, feedId);
  const productCount = Number(record?.numberOfProducts);
  return Number.isSafeInteger(productCount) && productCount > 0 ? productCount : null;
};

const feedMetadataVersion = (payload, feedId) => {
  const record = feedMetadataRecord(payload, feedId);
  const value = record?.lastModifiedTime ?? record?.lastUpdated ?? record?.updatedAt;
  return typeof value === "string" && value.length > 0 && value.length <= 100 ? value : null;
};

const configureProgramFeed = async (source, programId) => {
  const issued = await issueTicket(programId, "program_feeds");
  const providerPayload = await fetchProviderJson(issued.ticket);
  const configured = await bridgePost({
    action: "configure_store_feed",
    store: source.storeSlug,
    payload: providerPayload,
  });
  const feedId = String(configured.feedId ?? "");
  if (!/^\d{1,20}$/.test(feedId)) throw new Error("program_feed_configuration_invalid");
  return [feedId];
};

const runProofImport = async (feedId) => {
  const issued = await issueTicket(feedId, "query");
  const payload = await fetchProviderJson(issued.ticket);
  const products = Array.isArray(payload?.products) ? payload.products : null;
  const totalHits = Number(payload?.productHeader?.totalHits);
  if (!products || products.length < 1 || products.length > 100
    || !Number.isSafeInteger(totalHits) || totalHits < products.length) {
    throw new Error("provider_proof_invalid");
  }
  const perfumeProducts = products.filter(isPerfumeProduct);
  if (!perfumeProducts.length) throw new Error("no_perfume_products");
  const imported = await importTicketPayload(issued.ticket, {
    ...payload,
    products: perfumeProducts,
  });
  return {
    ok: true,
    mode: "proof",
    feedId,
    receivedProducts: products.length,
    perfumeProducts: perfumeProducts.length,
    providerTotalHits: totalHits,
    candidates: Number(imported.candidates ?? 0),
    reviewCandidates: Number(imported.reviewCandidates ?? 0),
    matchedCandidates: Number(imported.matchedCandidates ?? 0),
    liveOffers: Number(imported.liveOffers ?? 0),
    storeLiveOffers: Number(imported.storeLiveOffers ?? 0),
  };
};

const runFullImport = async (feedId) => {
  const metadataTicket = await issueTicket(feedId, "feed_metadata");
  const feedMetadata = await fetchProviderJson(metadataTicket.ticket);
  const expectedProductCount = feedMetadataProductCount(feedMetadata, feedId);
  const expectedVersion = feedMetadataVersion(feedMetadata, feedId);
  if (expectedProductCount === null || expectedVersion === null) {
    throw new Error("provider_feed_metadata_invalid");
  }
  const snapshot = await bridgePost({ action: "begin_unlimited_snapshot", feedId, lastUpdated: feedMetadata });
  if (!snapshot.required) return { ok: true, mode: "full", feedId, unchanged: true };

  const sessionId = snapshot.sessionId;
  try {
    const fullTicket = await issueTicket(feedId, "unlimited_full", { sessionId });
    const downloaded = await fetchUnlimitedJson(fullTicket.ticket);
    const payloadErrorCode = providerPayloadErrorCode(downloaded.payload);
    if (payloadErrorCode) throw new Error(`provider_${payloadErrorCode}`);
    const providerProducts = extractProviderProducts(
      downloaded.payload,
      expectedProductCount,
      feedId,
    );
    if (snapshot.snapshotHash && snapshot.snapshotHash !== downloaded.snapshotHash) {
      throw new Error("snapshot_file_mismatch");
    }
    if (!providerProducts || providerProducts.length !== expectedProductCount) {
      const received = providerProducts ? providerProducts.length : "missing";
      const shape = providerProducts ? "products" : providerPayloadShapeCode(downloaded.payload);
      throw new Error(`provider_snapshot_incomplete_${received}_${shape}_${expectedProductCount}`);
    }
    const perfumeProducts = providerProducts.reduce(
      (count, product) => count + (isPerfumeProduct(product) ? 1 : 0),
      0,
    );
    if (!perfumeProducts) throw new Error("no_perfume_products");
    const chunks = buildChunks(providerProducts);
    const nextChunk = Number(snapshot.nextChunk ?? 0);
    if (!Number.isSafeInteger(nextChunk) || nextChunk < 0 || nextChunk > chunks.length) {
      throw new Error("invalid_snapshot_cursor");
    }
    const skippedRawCount = chunks.slice(0, nextChunk)
      .reduce((total, chunk) => total + chunk.products.length, 0);
    if (skippedRawCount !== Number(snapshot.rawCount ?? 0)) {
      throw new Error("snapshot_cursor_mismatch");
    }

    let latest = null;
    for (let index = nextChunk; index < chunks.length; index += 1) {
      const rawChunk = chunks[index];
      const perfumeChunk = {
        ...rawChunk,
        products: rawChunk.products.filter(isPerfumeProduct),
      };
      latest = await importUnlimitedChunk({
        action: "import_unlimited_chunk",
        feedId,
        sessionId,
        chunkIndex: index,
        snapshotHash: downloaded.snapshotHash,
        rawProductCount: rawChunk.products.length,
        payload: perfumeChunk,
      });
    }
    const confirmationTicket = await issueTicket(feedId, "feed_metadata");
    const confirmedFeedMetadata = await fetchProviderJson(confirmationTicket.ticket);
    if (feedMetadataProductCount(confirmedFeedMetadata, feedId) !== providerProducts.length
      || feedMetadataVersion(confirmedFeedMetadata, feedId) !== expectedVersion) {
      throw new Error("provider_snapshot_changed");
    }
    const completion = await bridgePost({
      action: "complete_unlimited_snapshot",
      feedId,
      sessionId,
      lastUpdated: confirmedFeedMetadata,
      rawProductCount: providerProducts.length,
    });
    return {
      ok: true,
      mode: "full",
      feedId,
      unchanged: false,
      providerProducts: providerProducts.length,
      perfumeProducts,
      chunks: chunks.length,
      liveOffers: Number(completion.liveOffers ?? latest?.storeLiveOffers ?? 0),
      importedCount: Number(completion.importedCount ?? latest?.matchedCandidates ?? 0),
    };
  } catch (error) {
    await bridgePost({
      action: "fail_unlimited_snapshot",
      feedId,
      sessionId,
      errorCode: error instanceof Error && /^[a-z0-9_]{1,80}$/i.test(error.message)
        ? error.message : "external_import_failed",
    }).catch(() => {});
    throw error;
  }
};

const results = [];
let failed = false;
const resolvedSources = [];
const resolvedFeedIds = new Set();
for (const source of selectedSources) {
  for (const feedId of source.feedIds) {
    if (resolvedFeedIds.has(feedId)) continue;
    resolvedFeedIds.add(feedId);
    resolvedSources.push({ ...source, feedId, programId: null });
  }
  for (const programId of source.programIds) {
    try {
      const discovered = await configureProgramFeed(source, programId);
      if (discovered.some((feedId) => resolvedFeedIds.has(feedId))) {
        throw new Error("feed_identity_conflict");
      }
      for (const feedId of discovered) {
        resolvedFeedIds.add(feedId);
        resolvedSources.push({ ...source, feedId, programId });
      }
    } catch (error) {
      failed = true;
      results.push({
        ok: false,
        mode: "configuration",
        sourceKey: source.sourceKey,
        storeName: source.storeName,
        programId,
        error: error instanceof Error && /^[a-z0-9_]{1,120}$/i.test(error.message)
          ? error.message : "program_feed_configuration_failed",
      });
    }
  }
}

for (const source of resolvedSources) {
  try {
    const result = mode === "full"
      ? await runFullImport(source.feedId)
      : await runProofImport(source.feedId);
    results.push({
      ...result,
      sourceKey: source.sourceKey,
      storeName: source.storeName,
      ...(source.programId ? { programId: source.programId } : {}),
    });
  } catch (error) {
    failed = true;
    results.push({
      ok: false,
      mode,
      feedId: source.feedId,
      sourceKey: source.sourceKey,
      storeName: source.storeName,
      ...(source.programId ? { programId: source.programId } : {}),
      error: error instanceof Error && /^[a-z0-9_]{1,120}$/i.test(error.message)
        ? error.message : `${mode}_failed`,
    });
  }
}
const report = JSON.stringify({ ok: !failed, mode, results });
if (failed) {
  const prefix = mode === "proof" ? "proof_result" : "tradedoubler_result";
  process.stderr.write(`${prefix}=${report}\n`);
  process.exitCode = 1;
} else {
  process.stdout.write(`${report}\n`);
}
