import assert from "node:assert/strict";
import test from "node:test";

import { validateFullImportCompletion } from "../scripts/import-result-contract.mjs";

test("accepts explicit non-zero completion counters", () => {
  assert.deepEqual(validateFullImportCompletion({
    liveOffers: 896,
    importedCount: 896,
  }, 1_031), {
    liveOffers: 896,
    importedCount: 896,
  });
});

test("rejects a missing completion counter instead of silently coercing it to zero", () => {
  assert.throws(
    () => validateFullImportCompletion({ liveOffers: 896 }, 1_031),
    /bridge_completion_counts_invalid/,
  );
});

test("fails the run when a non-empty perfume snapshot would publish zero offers", () => {
  assert.throws(
    () => validateFullImportCompletion({ liveOffers: 0, importedCount: 0 }, 1_031),
    /bridge_zero_publication_blocked/,
  );
});
