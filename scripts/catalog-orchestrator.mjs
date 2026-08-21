import { createOidcTokenProvider, validatedSiteOrigin } from "./github-oidc.mjs";

const OIDC_AUDIENCE = "perfumetr-tradedoubler-bridge";
const ALLOWED_SOURCE_IDS = new Set([
  "tradedoubler:vouchers",
  "awin:flaconi",
  "cj:notino",
  "cj:brasty",
]);
const requested = process.argv.slice(2).length ? process.argv.slice(2) : [...ALLOWED_SOURCE_IDS];
const sources = [...new Set(requested.map((value) => value.trim()))];
if (!sources.length || sources.some((source) => !ALLOWED_SOURCE_IDS.has(source))) {
  throw new Error("invalid_catalog_source");
}

const configuredSteps = Number(process.env.PERFUMETR_ORCHESTRATOR_STEPS || 24);
if (!Number.isSafeInteger(configuredSteps) || configuredSteps < 1 || configuredSteps > 48) {
  throw new Error("invalid_orchestrator_steps");
}

const getOidcToken = createOidcTokenProvider({ audience: OIDC_AUDIENCE });
const endpoint = new URL("/api/internal/catalog-orchestrator", validatedSiteOrigin()).toString();

const safeError = (payload, status) => {
  const code = typeof payload?.error === "string" && /^[a-z0-9_]{1,80}$/i.test(payload.error)
    ? payload.error : String(status);
  return new Error(`orchestrator_${code}`);
};

const post = async (body) => {
  const serialized = JSON.stringify(body);
  if (Buffer.byteLength(serialized) > 64 * 1024) throw new Error("orchestrator_payload_too_large");
  let response;
  try {
    response = await fetch(endpoint, {
      method: "POST",
      headers: {
        authorization: `Bearer ${await getOidcToken()}`,
        "content-type": "application/json",
      },
      body: serialized,
      signal: AbortSignal.timeout(90_000),
    });
  } catch {
    throw new Error("orchestrator_unavailable");
  }
  const payload = await response.json().catch(() => ({}));
  if (!response.ok || payload.ok === false) throw safeError(payload, response.status);
  return payload;
};

const allowedStates = new Set(["not_started", "paused", "running", "completed", "failed"]);
const responseState = (payload) => {
  const state = typeof payload?.overview?.state === "string" ? payload.overview.state : "";
  if (!allowedStates.has(state)) throw new Error("orchestrator_invalid_state");
  return state;
};
const responseBusy = (payload) => {
  if (payload?.busy === undefined) return false;
  if (typeof payload.busy !== "boolean") throw new Error("orchestrator_invalid_response");
  return payload.busy;
};
const responseSkipped = (payload) => {
  if (payload?.skipped === undefined) return null;
  if (payload.skipped !== "fresh") throw new Error("orchestrator_invalid_response");
  return payload.skipped;
};
const safeCounterKeys = [
  "rawProducts",
  "perfumeProducts",
  "liveOffers",
  "rawCount",
  "acceptedCount",
  "receivedCount",
  "reviewCount",
  "excludedCount",
  "importedCount",
  "processedCount",
  "storedProducts",
  "activeCoupons",
  "matchedCandidates",
  "reviewCandidates",
  "storeLiveOffers",
];
const responseCounters = (payload) => {
  const counters = {};
  for (const key of safeCounterKeys) {
    if (payload?.overview?.[key] === undefined) continue;
    const value = Number(payload.overview[key]);
    if (!Number.isSafeInteger(value) || value < 0) {
      throw new Error("orchestrator_invalid_count");
    }
    counters[key] = value;
  }
  return counters;
};
const runSource = async (source) => {
  const initial = await post({ action: "status", source });
  let state = responseState(initial);
  let latest = initial;
  let steps = 0;
  let skipped = responseSkipped(initial);
  let busy = responseBusy(initial);
  let counters = responseCounters(initial);
  while (!skipped && !busy && steps < configuredSteps) {
    latest = await post({ action: "advance_source", source });
    state = responseState(latest);
    skipped = responseSkipped(latest);
    busy = responseBusy(latest);
    counters = { ...counters, ...responseCounters(latest) };
    steps += 1;
    if (["completed", "failed"].includes(state)) break;
  }
  return {
    ok: state !== "failed",
    source,
    state,
    steps,
    completed: state === "completed",
    skipped,
    busy,
    counters,
  };
};

const results = [];
let failed = false;
for (const source of sources) {
  try {
    const result = await runSource(source);
    if (!result.ok) failed = true;
    results.push(result);
  } catch (error) {
    failed = true;
    results.push({
      ok: false,
      source,
      error: error instanceof Error && /^[a-z0-9_]{1,120}$/i.test(error.message)
        ? error.message : "orchestrator_failed",
    });
  }
}

const report = JSON.stringify({ ok: !failed, sources: results });
if (failed) {
  process.stderr.write(`catalog_orchestrator_result=${report}\n`);
  process.exitCode = 1;
} else {
  process.stdout.write(`${report}\n`);
}
