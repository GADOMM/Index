const OIDC_MAXIMUM_BYTES = 64 * 1024;

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

export const createOidcTokenProvider = ({ audience }) => {
  if (typeof audience !== "string" || !/^[a-z0-9-]{1,80}$/.test(audience)) {
    throw new Error("invalid_oidc_audience");
  }
  const requestToken = process.env.ACTIONS_ID_TOKEN_REQUEST_TOKEN?.trim() ?? "";
  const requestUrlValue = process.env.ACTIONS_ID_TOKEN_REQUEST_URL?.trim() ?? "";
  if (!requestToken || requestToken.length > 16_384) throw new Error("invalid_oidc_environment");

  let requestUrl;
  try {
    requestUrl = new URL(requestUrlValue);
  } catch {
    throw new Error("invalid_oidc_environment");
  }
  if (requestUrl.protocol !== "https:" || requestUrl.username || requestUrl.password
    || requestUrl.port || !/^[a-z0-9-]+\.actions\.githubusercontent\.com$/i.test(requestUrl.hostname)) {
    throw new Error("invalid_oidc_environment");
  }
  requestUrl.searchParams.set("audience", audience);

  let cached = null;
  return async () => {
    const nowSeconds = Math.floor(Date.now() / 1000);
    if (cached && cached.expiresAt > nowSeconds + 60) return cached.token;
    let response;
    try {
      response = await fetch(requestUrl, {
        headers: {
          accept: "application/json",
          authorization: `Bearer ${requestToken}`,
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
    cached = { token, expiresAt };
    return token;
  };
};

export const validatedSiteOrigin = () => {
  let origin;
  try {
    origin = new URL(
      process.env.PERFUMETR_ORIGIN || "https://perfumetr.borodzicz85.chatgpt.site",
    );
  } catch {
    throw new Error("invalid_site_origin");
  }
  if (origin.protocol !== "https:" || origin.username || origin.password
    || origin.port || origin.hostname !== "perfumetr.borodzicz85.chatgpt.site"
    || origin.pathname !== "/" || origin.search || origin.hash) {
    throw new Error("invalid_site_origin");
  }
  return origin;
};
