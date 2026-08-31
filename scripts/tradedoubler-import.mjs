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
import {
  PERFUME_CLASSIFIER_VERSION,
  isPerfumeProduct,
} from "./perfume-classifier.mjs";

const BRIDGE_MAXIMUM_BYTES = 2 * 1024 * 1024;
const PROVIDER_MAXIMUM_BYTES = 512 * 1024 * 1024;
const PAGE_SIZE = 100;
const PROOF_PAGE_LIMIT = 10;
const FULL_PAGE_LIMIT = 10_000;
const IMPORT_STRUCTURE_MAXIMUM_NODES = 25_000;
const IMPORT_STRUCTURE_MAXIMUM_DEPTH = 16;
const RAW_CHUNK_MAXIMUM_PRODUCTS = 100;
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

const pagePayloadProducts = (payload, page, expectedTotal = null) => {
  const products = Array.isArray(payload?.products) ? payload.products : null;
  const totalHits = Number(payload?.productHeader?.totalHits);
  if (!Number.isSafeInteger(page) || page < 1 || page > FULL_PAGE_LIMIT
    || !products || products.length > PAGE_SIZE
    || !Number.isSafeInteger(totalHits) || totalHits < 0
    || (expectedTotal !== null && totalHits !== expectedTotal)) {
    throw new Error("provider_page_invalid");
  }
  const remaining = Math.max(0, totalHits - ((page - 1) * PAGE_SIZE));
  const expectedPageCount = Math.min(PAGE_SIZE, remaining);
  if (products.length !== expectedPageCount) {
    throw new Error("provider_page_count_mismatch");
  }
  return { products, totalHits };
};

const fetchPagedSnapshot = async (feedId, expectedProductCount) => {
  const pageCount = Math.ceil(expectedProductCount / PAGE_SIZE);
  if (!Number.isSafeInteger(pageCount) || pageCount < 1 || pageCount > FULL_PAGE_LIMIT) {
    throw new Error("provider_page_limit_exceeded");
  }
  const products = [];
  let encodedProductBytes = 0;
  for (let page = 1; page <= pageCount; page += 1) {
    const issued = await issueTicket(feedId, "page", { page });
    const payload = await fetchProviderJson(issued.ticket);
    const pageResult = pagePayloadProducts(payload, page, expectedProductCount);
    const validatedProducts = extractProviderProducts(
      { products: pageResult.products },
      pageResult.products.length,
      feedId,
    );
    if (!validatedProducts || validatedProducts.length !== pageResult.products.length) {
      throw new Error("provider_page_products_invalid");
    }
    encodedProductBytes += Buffer.byteLength(JSON.stringify(validatedProducts));
    if (encodedProductBytes > PROVIDER_MAXIMUM_BYTES) {
      throw new Error("provider_payload_too_large");
    }
    products.push(...validatedProducts);
  }
  if (products.length !== expectedProductCount) {
    throw new Error("provider_page_total_mismatch");
  }
  const payload = {
    productHeader: { totalHits: expectedProductCount },
    products,
  };
  const serialized = JSON.stringify(payload);
  if (Buffer.byteLength(serialized) > PROVIDER_MAXIMUM_BYTES) {
    throw new Error("provider_payload_too_large");
  }
  return {
    payload,
    products,
    snapshotHash: createHash("sha256").update(serialized).digest("hex"),
    transport: "page",
    pages: pageCount,
  };
};

const boundedStructureNodeCount = (root, initialDepth = 0) => {
  const stack = [{ key: null, value: root, depth: initialDepth }];
  let nodes = 0;
  while (stack.length) {
    const current = stack.pop();
    nodes += 1;
    if (nodes > IMPORT_STRUCTURE_MAXIMUM_NODES
      || current.depth > IMPORT_STRUCTURE_MAXIMUM_DEPTH) return null;
    if (typeof current.value === "string") {
      if (current.value.length > 20_000) return null;
      continue;
    }
    if (!current.value || typeof current.value !== "object") continue;
    if (Array.isArray(current.value)) {
      const key = current.key?.toLocaleLowerCase() ?? "";
      const maximum = key === "products" ? 100
        : key === "offers" ? 20
          : key === "pricehistory" ? 50
            : key === "fields" ? 100
              : key === "categories" ? 50
                : 500;
      if (current.value.length > maximum) return null;
      for (const value of current.value) {
        stack.push({ key: null, value, depth: current.depth + 1 });
      }
      continue;
    }
    const entries = Object.entries(current.value);
    if (entries.length > 100) return null;
    for (const [key, value] of entries) {
      stack.push({ key, value, depth: current.depth + 1 });
    }
  }
  return nodes;
};

const makeUnlimitedChunkPayload = (rawProducts, totalHits) => ({
  productHeader: { totalHits },
  products: rawProducts.filter(isPerfumeProduct),
  rawProducts,
  classifierVersion: PERFUME_CLASSIFIER_VERSION,
});

const makeUnlimitedChunkRequest = ({
  feedId,
  sessionId,
  snapshotHash,
  chunkIndex,
  rawProducts,
  totalHits,
}) => ({
  action: "import_unlimited_chunk",
  feedId,
  sessionId,
  chunkIndex,
  snapshotHash,
  rawProductCount: rawProducts.length,
  payload: makeUnlimitedChunkPayload(rawProducts, totalHits),
});

const isRecord = (value) => Boolean(value && typeof value === "object" && !Array.isArray(value));

const trimmedIdentityPart = (value) => {
  if (typeof value !== "string" && typeof value !== "number") return null;
  if (typeof value === "number" && !Number.isFinite(value)) return null;
  const normalized = String(value).trim();
  return normalized || null;
};

const nonNegativeInteger = (value) => {
  if (typeof value === "number") return Number.isSafeInteger(value) && value >= 0 ? value : null;
  if (typeof value !== "string" || !/^-?\d+$/.test(value.trim())) return null;
  const parsed = Number(value.trim());
  return Number.isSafeInteger(parsed) && parsed >= 0 ? parsed : null;
};

const snapshotOfferRecords = (product) => {
  if (!isRecord(product)) return [];
  if (Array.isArray(product.offers)) return product.offers.filter(isRecord);
  const hasFlatOffer = [
    "feedId",
    "productUrl",
    "sourceProductId",
    "id",
    "price",
    "priceHistory",
  ].some((field) => product[field] !== undefined);
  return hasFlatOffer ? [product] : [];
};

const assertUniqueSnapshotOfferIdentities = (products, configuredFeedId) => {
  const seenOfferIds = new Set();
  for (const product of products) {
    for (const offer of snapshotOfferRecords(product)) {
      const sourceProductId = trimmedIdentityPart(offer.sourceProductId);
      const upstreamOfferId = trimmedIdentityPart(offer.id);
      if (sourceProductId === null && upstreamOfferId === null) continue;
      const parsedFeedId = nonNegativeInteger(offer.feedId ?? configuredFeedId);
      const externalOfferId = upstreamOfferId
        ?? `tradedoubler:${parsedFeedId ?? "unknown"}:${sourceProductId}`;
      if (seenOfferIds.has(externalOfferId)) {
        throw new Error("provider_snapshot_duplicate_offer_id");
      }
      seenOfferIds.add(externalOfferId);
    }
  }
};

const buildChunks = (products, { feedId, sessionId, snapshotHash }) => {
  const chunks = [];
  let currentProducts = [];
  let currentRawBytes = 0;
  let currentPerfumeBytes = 0;
  let currentPerfumeCount = 0;
  let currentStructureNodes = boundedStructureNodeCount(
    makeUnlimitedChunkPayload([], products.length),
  );
  if (currentStructureNodes === null) throw new Error("bridge_payload_too_large");

  const emptyRequestBytes = (chunkIndex, rawProductCount) => {
    const emptyRequest = makeUnlimitedChunkRequest({
      feedId,
      sessionId,
      snapshotHash,
      chunkIndex,
      rawProducts: [],
      totalHits: products.length,
    });
    emptyRequest.rawProductCount = rawProductCount;
    return Buffer.byteLength(JSON.stringify(emptyRequest));
  };

  const pushCurrent = () => {
    const request = makeUnlimitedChunkRequest({
      feedId,
      sessionId,
      snapshotHash,
      chunkIndex: chunks.length,
      rawProducts: currentProducts,
      totalHits: products.length,
    });
    if (Buffer.byteLength(JSON.stringify(request)) > BRIDGE_MAXIMUM_BYTES
      || boundedStructureNodeCount(request.payload) === null) {
      throw new Error("bridge_payload_too_large");
    }
    chunks.push(request);
    currentProducts = [];
    currentRawBytes = 0;
    currentPerfumeBytes = 0;
    currentPerfumeCount = 0;
    currentStructureNodes = boundedStructureNodeCount(
      makeUnlimitedChunkPayload([], products.length),
    );
  };

  for (const product of products) {
    const serializedProduct = JSON.stringify(product);
    const productBytes = Buffer.byteLength(serializedProduct);
    const productNodes = boundedStructureNodeCount(product, 2);
    const perfume = isPerfumeProduct(product);
    if (productNodes === null) throw new Error("single_product_too_large");

    const candidateState = () => {
      const rawCount = currentProducts.length + 1;
      const perfumeCount = currentPerfumeCount + (perfume ? 1 : 0);
      const rawBytes = currentRawBytes + productBytes + (currentProducts.length ? 1 : 0);
      const perfumeBytes = currentPerfumeBytes
        + (perfume ? productBytes + (currentPerfumeCount ? 1 : 0) : 0);
      const requestBytes = emptyRequestBytes(chunks.length, rawCount) + rawBytes + perfumeBytes;
      const structureNodes = currentStructureNodes + productNodes * (perfume ? 2 : 1);
      return {
        rawCount,
        perfumeCount,
        rawBytes,
        perfumeBytes,
        structureNodes,
        fits: rawCount <= RAW_CHUNK_MAXIMUM_PRODUCTS
          && requestBytes <= BRIDGE_MAXIMUM_BYTES
          && structureNodes <= IMPORT_STRUCTURE_MAXIMUM_NODES,
      };
    };

    let candidate = candidateState();
    if (!candidate.fits && currentProducts.length) {
      pushCurrent();
      candidate = candidateState();
    }
    if (!candidate.fits) throw new Error("single_product_too_large");

    currentProducts.push(product);
    currentRawBytes = candidate.rawBytes;
    currentPerfumeBytes = candidate.perfumeBytes;
    currentPerfumeCount = candidate.perfumeCount;
    currentStructureNodes = candidate.structureNodes;
  }
  if (currentProducts.length) pushCurrent();
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

const proofPayloadProducts = (payload) => {
  const products = Array.isArray(payload?.products) ? payload.products : null;
  const totalHits = Number(payload?.productHeader?.totalHits);
  if (!products || products.length < 1 || products.length > 100
    || !Number.isSafeInteger(totalHits) || totalHits < products.length) {
    throw new Error("provider_proof_invalid");
  }
  return { products, totalHits };
};

const proofResult = (feedId, imported, details) => ({
  ok: true,
  mode: "proof",
  feedId,
  receivedProducts: details.products.length,
  scannedProducts: details.scannedProducts,
  perfumeProducts: details.perfumeProducts.length,
  providerTotalHits: details.totalHits,
  transport: details.transport,
  ...(details.page ? { page: details.page } : {}),
  candidates: Number(imported.candidates ?? 0),
  reviewCandidates: Number(imported.reviewCandidates ?? 0),
  matchedCandidates: Number(imported.matchedCandidates ?? 0),
  liveOffers: Number(imported.liveOffers ?? 0),
  storeLiveOffers: Number(imported.storeLiveOffers ?? 0),
});

const runPageProofImport = async (feedId) => {
  let scannedProducts = 0;
  let expectedTotal = null;
  for (let page = 1; page <= PROOF_PAGE_LIMIT; page += 1) {
    const issued = await issueTicket(feedId, "page", { page });
    const payload = await fetchProviderJson(issued.ticket);
    const pageResult = pagePayloadProducts(payload, page, expectedTotal);
    if (expectedTotal === null) expectedTotal = pageResult.totalHits;
    scannedProducts += pageResult.products.length;
    const perfumeProducts = pageResult.products.filter(isPerfumeProduct);
    if (perfumeProducts.length) {
      const imported = await importTicketPayload(issued.ticket, {
        ...payload,
        products: perfumeProducts,
      });
      return proofResult(feedId, imported, {
        products: pageResult.products,
        scannedProducts,
        perfumeProducts,
        totalHits: pageResult.totalHits,
        transport: "page",
        page,
      });
    }
    if (page * PAGE_SIZE >= pageResult.totalHits) break;
  }
  throw new Error("no_perfume_products");
};

const proofFallbackErrors = new Set([
  "bridge_feed_not_configured",
  "no_perfume_products",
  "provider_empty_body",
  "provider_invalid_json",
  "provider_proof_invalid",
]);

const runProofImport = async (feedId) => {
  try {
    const issued = await issueTicket(feedId, "query");
    const payload = await fetchProviderJson(issued.ticket);
    const { products, totalHits } = proofPayloadProducts(payload);
    const perfumeProducts = products.filter(isPerfumeProduct);
    if (!perfumeProducts.length) throw new Error("no_perfume_products");
    const imported = await importTicketPayload(issued.ticket, {
      ...payload,
      products: perfumeProducts,
    });
    return proofResult(feedId, imported, {
      products,
      scannedProducts: products.length,
      perfumeProducts,
      totalHits,
      transport: "query",
    });
  } catch (error) {
    if (!(error instanceof Error) || !proofFallbackErrors.has(error.message)) throw error;
  }
  return runPageProofImport(feedId);
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
    let downloaded = await fetchUnlimitedJson(fullTicket.ticket);
    const payloadErrorCode = providerPayloadErrorCode(downloaded.payload);
    if (payloadErrorCode) throw new Error(`provider_${payloadErrorCode}`);
    let providerProducts = extractProviderProducts(
      downloaded.payload,
      expectedProductCount,
      feedId,
    );
    if (!providerProducts || providerProducts.length !== expectedProductCount) {
      const received = providerProducts ? providerProducts.length : "missing";
      const shape = providerProducts ? "products" : providerPayloadShapeCode(downloaded.payload);
      const incompleteCode = `provider_snapshot_incomplete_${received}_${shape}_${expectedProductCount}`;
      const safePageFallback = new RegExp(
        `^provider_snapshot_incomplete_missing_object_[a-z0-9_]+_${expectedProductCount}$`,
      );
      if (!safePageFallback.test(incompleteCode)) throw new Error(incompleteCode);
      downloaded = await fetchPagedSnapshot(feedId, expectedProductCount);
      providerProducts = downloaded.products;
    }
    if (snapshot.snapshotHash && snapshot.snapshotHash !== downloaded.snapshotHash) {
      throw new Error("snapshot_file_mismatch");
    }
    assertUniqueSnapshotOfferIdentities(providerProducts, feedId);
    const perfumeProducts = providerProducts.reduce(
      (count, product) => count + (isPerfumeProduct(product) ? 1 : 0),
      0,
    );
    if (!perfumeProducts) throw new Error("no_perfume_products");
    const chunks = buildChunks(providerProducts, {
      feedId,
      sessionId,
      snapshotHash: downloaded.snapshotHash,
    });
    const nextChunk = Number(snapshot.nextChunk ?? 0);
    if (!Number.isSafeInteger(nextChunk) || nextChunk < 0 || nextChunk > chunks.length) {
      throw new Error("invalid_snapshot_cursor");
    }
    const skippedRawCount = chunks.slice(0, nextChunk)
      .reduce((total, chunk) => total + chunk.rawProductCount, 0);
    if (skippedRawCount !== Number(snapshot.rawCount ?? 0)) {
      throw new Error("snapshot_cursor_mismatch");
    }

    let latest = null;
    for (let index = nextChunk; index < chunks.length; index += 1) {
      latest = await importUnlimitedChunk(chunks[index]);
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
      scannedProducts: providerProducts.length,
      perfumeProducts,
      chunks: chunks.length,
      transport: downloaded.transport ?? "unlimited",
      ...(downloaded.pages ? { pages: downloaded.pages } : {}),
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
