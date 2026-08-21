const MAXIMUM_DEPTH = 6;
const MAXIMUM_VISITED_NODES = 128;
const MAXIMUM_ENCODED_BYTES = 512 * 1024 * 1024;

const WRAPPER_KEYS = new Set([
  "data",
  "items",
  "payload",
  "product",
  "productfeed",
  "productlist",
  "products",
  "response",
  "result",
  "results",
]);

const PRODUCT_MARKERS = [
  "brand",
  "categories",
  "description",
  "feedId",
  "gtin",
  "language",
  "manufacturer",
  "offers",
  "price",
  "productImage",
  "productUrl",
  "shortDescription",
  "sourceProductId",
  "sourceProductUrl",
];

const isRecord = (value) => Boolean(value && typeof value === "object" && !Array.isArray(value));

export const providerPayloadErrorCode = (payload) => {
  if (!isRecord(payload)) return null;
  const candidates = [
    payload.code,
    payload.statusCode,
    payload.errorCode,
    isRecord(payload.error) ? payload.error.code : null,
    ...(Array.isArray(payload.errors)
      ? payload.errors.slice(0, 20).map((error) => isRecord(error) ? error.code : null)
      : []),
  ];
  const code = candidates.find((value) => (
    ["string", "number"].includes(typeof value)
    && /^[A-Za-z0-9_-]{1,40}$/.test(String(value))
  ));
  return code === undefined ? null : String(code);
};

export const providerPayloadShapeCode = (payload) => {
  if (Array.isArray(payload)) return `array_${Math.min(payload.length, 9_999_999)}`;
  if (!isRecord(payload)) return payload === null ? "null" : typeof payload;
  const keys = Object.keys(payload).slice(0, 3).map((key) => (
    key.toLowerCase().replace(/[^a-z0-9]/g, "").slice(0, 10) || "key"
  ));
  return `object_${keys.length ? keys.join("_") : "empty"}`;
};

const explicitFeedIds = (product) => {
  const identifiers = [];
  for (const [key, value] of Object.entries(product)) {
    if (/^feed_?id$/i.test(key) && ["string", "number"].includes(typeof value)) {
      identifiers.push(String(value));
    }
  }
  if (Array.isArray(product.offers)) {
    for (const offer of product.offers) {
      if (!isRecord(offer)) continue;
      for (const [key, value] of Object.entries(offer)) {
        if (/^feed_?id$/i.test(key) && ["string", "number"].includes(typeof value)) {
          identifiers.push(String(value));
        }
      }
    }
  }
  return identifiers;
};

const isProductRecord = (value, feedId) => {
  if (!isRecord(value) || typeof value.name !== "string" || !value.name.trim()) return false;
  if (!PRODUCT_MARKERS.some((key) => Object.hasOwn(value, key))) return false;
  const identifiers = explicitFeedIds(value);
  return identifiers.every((identifier) => identifier === feedId);
};

const collectionCandidate = (value, expectedProductCount, feedId) => {
  if (Array.isArray(value)) {
    if (value.length !== expectedProductCount
      || !value.every((product) => isProductRecord(product, feedId))) return null;
    return value;
  }
  if (!isRecord(value)) return null;
  const products = Object.values(value);
  if (products.length !== expectedProductCount
    || !products.every((product) => isProductRecord(product, feedId))) return null;
  return products;
};

export const extractProviderProducts = (payload, expectedProductCount, requestedFeedId) => {
  if (!Number.isSafeInteger(expectedProductCount) || expectedProductCount < 1) {
    throw new Error("invalid_expected_product_count");
  }
  const feedId = String(requestedFeedId ?? "").trim();
  if (!/^\d+$/.test(feedId)) throw new Error("invalid_feed_id");

  const candidates = [];
  let visitedNodes = 0;

  const visit = (value, depth, decoded) => {
    if (depth > MAXIMUM_DEPTH || visitedNodes >= MAXIMUM_VISITED_NODES) return;
    visitedNodes += 1;

    if (typeof value === "string") {
      if (decoded || Buffer.byteLength(value) > MAXIMUM_ENCODED_BYTES) return;
      const trimmed = value.trim();
      if (!trimmed || !["[", "{", "\""].includes(trimmed[0])) return;
      try {
        visit(JSON.parse(trimmed), depth + 1, true);
      } catch {
        // A malformed or multiply encoded wrapper is not a valid snapshot.
      }
      return;
    }

    const candidate = collectionCandidate(value, expectedProductCount, feedId);
    if (candidate) {
      candidates.push(candidate);
      return;
    }

    if (Array.isArray(value)) {
      if (value.length === 1) visit(value[0], depth + 1, decoded);
      return;
    }
    if (!isRecord(value)) return;

    const entries = Object.entries(value);
    const controlled = entries.filter(([key]) => (
      WRAPPER_KEYS.has(key.toLowerCase()) || key === feedId
    ));
    const remaining = entries.filter(([key]) => (
      !WRAPPER_KEYS.has(key.toLowerCase()) && key !== feedId
    ));
    for (const [, child] of [...controlled, ...remaining]) {
      if (typeof child === "string" || Array.isArray(child) || isRecord(child)) {
        visit(child, depth + 1, decoded);
      }
    }
  };

  visit(payload, 0, false);
  if (candidates.length > 1) throw new Error("provider_snapshot_ambiguous");
  return candidates[0] ?? null;
};
