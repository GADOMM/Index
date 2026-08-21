import { createHash } from "node:crypto";
import { open, mkdtemp, readFile, rm } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";

const ALLOWED_FEED_IDS = new Set(["112471", "118359"]);
const DEFAULT_FEED_IDS = [...ALLOWED_FEED_IDS];
const BRIDGE_MAXIMUM_BYTES = 2 * 1024 * 1024;
const CHUNK_TARGET_BYTES = 1_500_000;
const PROVIDER_MAXIMUM_BYTES = 512 * 1024 * 1024;
const OIDC_AUDIENCE = "perfumetr-tradedoubler-bridge";
const OIDC_MAXIMUM_BYTES = 64 * 1024;
const mode = process.env.PERFUMETR_MODE === "full" ? "full"
  : process.env.PERFUMETR_MODE === "proof" ? "proof" : null;
const oidcRequestToken = process.env.ACTIONS_ID_TOKEN_REQUEST_TOKEN?.trim() ?? "";
const oidcRequestUrlValue = process.env.ACTIONS_ID_TOKEN_REQUEST_URL?.trim() ?? "";
const requestedFeedIds = process.argv.slice(2).length ? process.argv.slice(2) : DEFAULT_FEED_IDS;
const feedIds = [...new Set(requestedFeedIds.map((value) => value.trim()))];

if (!mode) throw new Error("invalid_mode");
if (!feedIds.length || feedIds.some((feedId) => !ALLOWED_FEED_IDS.has(feedId))) {
  throw new Error("invalid_feed_id");
}
if (!oidcRequestToken || oidcRequestToken.length > 16_384) throw new Error("invalid_oidc_environment");

let oidcRequestUrl;
try {
  oidcRequestUrl = new URL(oidcRequestUrlValue);
} catch {
  throw new Error("invalid_oidc_environment");
}
if (oidcRequestUrl.protocol !== "https:" || oidcRequestUrl.username || oidcRequestUrl.password
  || oidcRequestUrl.port || !/^[a-z0-9-]+\.actions\.githubusercontent\.com$/i.test(oidcRequestUrl.hostname)) {
  throw new Error("invalid_oidc_environment");
}
oidcRequestUrl.searchParams.set("audience", OIDC_AUDIENCE);

const siteOrigin = new URL(
  process.env.PERFUMETR_ORIGIN || "https://perfumetr.borodzicz85.chatgpt.site",
);
if (siteOrigin.protocol !== "https:" || siteOrigin.username || siteOrigin.password
  || siteOrigin.port || siteOrigin.pathname !== "/" || siteOrigin.search || siteOrigin.hash) {
  throw new Error("invalid_site_origin");
}

const bridge = new URL("/api/internal/tradedoubler-runtime-proof", siteOrigin).toString();

let cachedOidc = null;

const oidcExpiration = (token) => {
  const parts = token.split(".");
  if (parts.length !== 3 || parts.some((part) => !/^[A-Za-z0-9_-]+$/.test(part))) return null;
  try {
    const claims = JSON.parse(Buffer.from(parts[1], "base64url").toString("utf8"));
    return Number.isSafeInteger(claims.exp) ? claims.exp : null;
  } catch {
    return null;
  }
};

const getOidcToken = async () => {
  const nowSeconds = Math.floor(Date.now() / 1000);
  if (cachedOidc && cachedOidc.expiresAt > nowSeconds + 60) return cachedOidc.token;
  let response;
  try {
    response = await fetch(oidcRequestUrl, {
      headers: {
        accept: "application/json",
        authorization: `Bearer ${oidcRequestToken}`,
      },
      redirect: "error",
      signal: AbortSignal.timeout(30_000),
    });
  } catch {
    throw new Error("oidc_unavailable");
  }
  const declaredLength = Number(response.headers.get("content-length") || 0);
  if (!response.ok || (Number.isFinite(declaredLength) && declaredLength > OIDC_MAXIMUM_BYTES)) {
    await response.body?.cancel().catch(() => {});
    throw new Error("oidc_rejected");
  }
  const text = await response.text();
  if (Buffer.byteLength(text) > OIDC_MAXIMUM_BYTES) throw new Error("oidc_rejected");
  let token = "";
  try {
    const parsed = JSON.parse(text);
    token = typeof parsed.value === "string" ? parsed.value : "";
  } catch {
    throw new Error("oidc_rejected");
  }
  const expiresAt = oidcExpiration(token);
  if (!expiresAt || token.length > 16_384 || expiresAt <= nowSeconds + 30
    || expiresAt > nowSeconds + 20 * 60) throw new Error("oidc_rejected");
  cachedOidc = { token, expiresAt };
  return token;
};

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

const perfumeSignal = /(?:\bperfum|eau\s+de\s+(?:parfum|toilette|cologne)|woda\s+(?:perfumowana|toaletowa|kolonska)|\b(?:edp|edt|edc)\b|extrait\s+de\s+parfum|\bparfum\b)/i;

const isPerfumeProduct = (product) => {
  if (!product || typeof product !== "object" || Array.isArray(product)) return false;
  const categories = Array.isArray(product.categories)
    ? product.categories.flatMap((category) => category && typeof category === "object"
      ? [category.name, category.tdCategoryName] : [])
    : [];
  const text = [product.name, product.description, product.shortDescription, ...categories]
    .filter((value) => typeof value === "string").join(" ");
  return perfumeSignal.test(text);
};

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
    feedId: "118359",
    sessionId: "00000000-0000-4000-8000-000000000000",
    chunkIndex: 1_000_000,
    snapshotHash: "f".repeat(64),
    payload: chunk,
  })) > BRIDGE_MAXIMUM_BYTES)) {
    throw new Error("bridge_payload_too_large");
  }
  return chunks;
};

const feedMetadataProductCount = (payload, feedId) => {
  const records = Array.isArray(payload)
    ? payload
    : Array.isArray(payload?.feeds) ? payload.feeds : [payload];
  const exact = records.find((record) => record && typeof record === "object"
    && String(record.feedId) === String(feedId));
  const record = exact ?? (records.length === 1 ? records[0] : null);
  const productCount = Number(record?.numberOfProducts);
  return Number.isSafeInteger(productCount) && productCount > 0 ? productCount : null;
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
  const imported = await importTicketPayload(issued.ticket, payload);
  return {
    ok: true,
    mode: "proof",
    feedId,
    receivedProducts: products.length,
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
  if (expectedProductCount === null) throw new Error("provider_feed_metadata_invalid");
  const snapshot = await bridgePost({ action: "begin_unlimited_snapshot", feedId, lastUpdated: feedMetadata });
  if (!snapshot.required) return { ok: true, mode: "full", feedId, unchanged: true };

  const sessionId = snapshot.sessionId;
  try {
    const fullTicket = await issueTicket(feedId, "unlimited_full", { sessionId });
    const downloaded = await fetchUnlimitedJson(fullTicket.ticket);
    const providerProducts = Array.isArray(downloaded.payload?.products)
      ? downloaded.payload.products
      : Array.isArray(downloaded.payload) ? downloaded.payload : null;
    if (snapshot.snapshotHash && snapshot.snapshotHash !== downloaded.snapshotHash) {
      throw new Error("snapshot_file_mismatch");
    }
    if (!providerProducts || providerProducts.length !== expectedProductCount) {
      const received = providerProducts ? providerProducts.length : "missing";
      throw new Error(`provider_snapshot_incomplete_${received}_${expectedProductCount}`);
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
      latest = await importUnlimitedChunk({
        action: "import_unlimited_chunk",
        feedId,
        sessionId,
        chunkIndex: index,
        snapshotHash: downloaded.snapshotHash,
        payload: chunks[index],
      });
    }
    const confirmationTicket = await issueTicket(feedId, "feed_metadata");
    const confirmedFeedMetadata = await fetchProviderJson(confirmationTicket.ticket);
    if (feedMetadataProductCount(confirmedFeedMetadata, feedId) !== providerProducts.length) {
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
let proofFailed = false;
for (const feedId of feedIds) {
  if (mode === "full") {
    results.push(await runFullImport(feedId));
    continue;
  }
  try {
    results.push(await runProofImport(feedId));
  } catch (error) {
    proofFailed = true;
    results.push({
      ok: false,
      mode: "proof",
      feedId,
      error: error instanceof Error && /^[a-z0-9_]{1,120}$/i.test(error.message)
        ? error.message : "proof_failed",
    });
  }
}
const report = JSON.stringify({ ok: !proofFailed, mode, results });
if (proofFailed) {
  process.stderr.write(`proof_result=${report}\n`);
  process.exitCode = 1;
} else {
  process.stdout.write(`${report}\n`);
}
