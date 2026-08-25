import { createOidcTokenProvider, validatedSiteOrigin } from "./github-oidc.mjs";

const OIDC_AUDIENCE = "perfumetr-tradedoubler-bridge";
const ALLOWED_SOURCE_IDS = new Set([
  "tradedoubler:vouchers",
  "awin:flaconi",
  "cj:notino",
  "cj:brasty",
]);
const EXPECTED_BLOCKERS = new Set([
  "orchestrator_feed_not_found",
  "orchestrator_feed_access_denied",
  "orchestrator_not_configured",
]);
const FLACONI_STEP_INTERVAL_MS = 12_500;
const VOUCHER_REJECTION_REASONS = new Set([
  "program_not_allowed",
  "technical_program",
  "program_not_verified",
  "invalid_date",
  "inactive_window",
  "missing_tracking_url",
  "missing_title",
  "missing_voucher_code",
  "missing_discount",
  "voucher_not_publishable",
  "tracking_url_not_approved",
  "tracking_program_mismatch",
  "landing_domain_mismatch",
  "tracking_destination_mismatch",
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
const wait = (milliseconds) => new Promise((resolve) => setTimeout(resolve, milliseconds));

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
  "automaticReviewCount",
  "pendingFreshOfferCount",
  "maintenanceProcessedCount",
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
const responseVoucherRejectionReasons = (source, payload) => {
  if (source !== "tradedoubler:vouchers" || payload?.overview?.rejectionReasons === undefined) {
    return null;
  }
  const reasons = payload.overview.rejectionReasons;
  if (!reasons || typeof reasons !== "object" || Array.isArray(reasons)) {
    throw new Error("orchestrator_invalid_response");
  }
  const safeReasons = {};
  for (const [reason, count] of Object.entries(reasons)) {
    if (!VOUCHER_REJECTION_REASONS.has(reason)
      || typeof count !== "number"
      || !Number.isSafeInteger(count)
      || count < 0) {
      throw new Error("orchestrator_invalid_response");
    }
    safeReasons[reason] = count;
  }
  return safeReasons;
};
const cjMaintenanceCounters = (source, counters) => {
  if (!source.startsWith("cj:")) return null;
  const required = ["automaticReviewCount", "pendingFreshOfferCount", "maintenanceProcessedCount"];
  if (required.some((key) => counters[key] === undefined)) {
    throw new Error("orchestrator_invalid_response");
  }
  return {
    automaticReviewCount: counters.automaticReviewCount,
    pendingFreshOfferCount: counters.pendingFreshOfferCount,
    maintenanceProcessedCount: counters.maintenanceProcessedCount,
  };
};
const hasMaintenanceBacklog = (maintenance) => Boolean(maintenance
  && (maintenance.automaticReviewCount > 0 || maintenance.pendingFreshOfferCount > 0));
const runSource = async (source) => {
  const initial = await post({ action: "status", source });
  let state = responseState(initial);
  let latest = initial;
  let steps = 0;
  let skipped = responseSkipped(initial);
  let busy = responseBusy(initial);
  let counters = responseCounters(initial);
  let rejectionReasons = responseVoucherRejectionReasons(source, initial);
  let inCjMaintenance = state === "completed"
    && hasMaintenanceBacklog(cjMaintenanceCounters(source, counters));
  while (!skipped && !busy && steps < configuredSteps) {
    if (source === "awin:flaconi" && steps > 0) {
      await wait(FLACONI_STEP_INTERVAL_MS);
    }
    latest = await post({ action: "advance_source", source });
    state = responseState(latest);
    skipped = responseSkipped(latest);
    busy = responseBusy(latest);
    const stepCounters = responseCounters(latest);
    const stepRejectionReasons = responseVoucherRejectionReasons(source, latest);
    const maintenance = cjMaintenanceCounters(source, stepCounters);
    counters = { ...counters, ...stepCounters };
    if (stepRejectionReasons !== null) rejectionReasons = stepRejectionReasons;
    steps += 1;
    if (skipped || busy || state === "failed") break;
    if (state !== "completed") {
      inCjMaintenance = false;
      continue;
    }
    if (!maintenance || !hasMaintenanceBacklog(maintenance)) break;
    if (inCjMaintenance && maintenance.maintenanceProcessedCount === 0) break;
    inCjMaintenance = true;
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
    ...(rejectionReasons === null ? {} : { rejectionReasons }),
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
    const errorCode = error instanceof Error && /^[a-z0-9_]{1,120}$/i.test(error.message)
      ? error.message : "orchestrator_failed";
    if (EXPECTED_BLOCKERS.has(errorCode)) {
      results.push({
        ok: true,
        source,
        blocked: true,
        error: errorCode,
      });
      continue;
    }
    failed = true;
    results.push({
      ok: false,
      source,
      error: errorCode,
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
