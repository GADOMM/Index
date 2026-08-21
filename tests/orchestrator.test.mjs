import assert from "node:assert/strict";
import test from "node:test";

test("one partner failure does not prevent CJ and TradeDoubler vouchers from advancing", async () => {
  const originalArgv = process.argv;
  const originalFetch = globalThis.fetch;
  const originalStdout = process.stdout.write;
  const originalStderr = process.stderr.write;
  const originalExitCode = process.exitCode;
  const requestToken = "github-runner-request-token";
  const oidcToken = [
    Buffer.from(JSON.stringify({ alg: "RS256", kid: "test" })).toString("base64url"),
    Buffer.from(JSON.stringify({ exp: Math.floor(Date.now() / 1000) + 300 })).toString("base64url"),
    Buffer.from("signature").toString("base64url"),
  ].join(".");
  const calls = [];
  let stdout = "";
  let stderr = "";

  process.env.PERFUMETR_ORIGIN = "https://perfumetr.borodzicz85.chatgpt.site";
  process.env.PERFUMETR_ORCHESTRATOR_STEPS = "2";
  process.env.ACTIONS_ID_TOKEN_REQUEST_TOKEN = requestToken;
  process.env.ACTIONS_ID_TOKEN_REQUEST_URL = "https://pipelines.actions.githubusercontent.com/test/idtoken?api-version=2.0";
  process.argv = [
    process.execPath,
    "scripts/catalog-orchestrator.mjs",
    "awin:flaconi",
    "cj:notino",
    "tradedoubler:vouchers",
    "cj:brasty",
  ];
  process.stdout.write = ((value, ...args) => {
    if (typeof value === "string" && value.startsWith("{")) {
      stdout += value;
      return true;
    }
    return originalStdout.call(process.stdout, value, ...args);
  });
  process.stderr.write = ((value) => { stderr += String(value); return true; });

  globalThis.fetch = async (input, init = {}) => {
    const url = new URL(input instanceof URL ? input.href : typeof input === "string" ? input : input.url);
    if (url.hostname === "pipelines.actions.githubusercontent.com") {
      return Response.json({ value: oidcToken });
    }
    const body = JSON.parse(init.body);
    assert.equal(Object.hasOwn(body, "sourceId"), false);
    calls.push([body.source, body.action]);
    if (body.action === "status") {
      if (body.source === "awin:flaconi") {
        return Response.json({ ok: true, overview: { state: "failed" } });
      }
      if (body.source === "cj:notino") {
        return Response.json({
          ok: true,
          overview: { state: "paused", receivedCount: 100, reviewCount: 5 },
        });
      }
      if (body.source === "tradedoubler:vouchers") {
        return Response.json({
          ok: true,
          overview: { state: "completed" },
        });
      }
      return Response.json({ ok: true, overview: { state: "running" } });
    }
    if (body.source === "awin:flaconi") {
      return Response.json({ ok: true, overview: { state: "failed" } });
    }
    if (body.source === "tradedoubler:vouchers") {
      return Response.json({
        ok: true,
        overview: { state: "completed", activeCoupons: 7 },
        skipped: "fresh",
      });
    }
    if (body.source === "cj:brasty") {
      return Response.json({ ok: true, overview: { state: "running" }, busy: true });
    }
    return Response.json({
      ok: true,
      overview: {
        state: "completed",
        receivedCount: 200,
        reviewCount: 2,
        excludedCount: 156,
        importedCount: 42,
        liveOffers: 35,
      },
    });
  };

  try {
    await import(`../scripts/catalog-orchestrator.mjs?isolation-test=${Date.now()}`);
    assert.equal(stdout, "");
    assert.equal(process.exitCode, 1);
    const report = JSON.parse(stderr.replace(/^catalog_orchestrator_result=/, ""));
    assert.equal(report.ok, false);
    assert.deepEqual(calls, [
      ["awin:flaconi", "status"],
      ["awin:flaconi", "advance_source"],
      ["cj:notino", "status"],
      ["cj:notino", "advance_source"],
      ["tradedoubler:vouchers", "status"],
      ["tradedoubler:vouchers", "advance_source"],
      ["cj:brasty", "status"],
      ["cj:brasty", "advance_source"],
    ]);
    assert.equal(report.sources[0].ok, false);
    assert.equal(report.sources[0].state, "failed");
    assert.equal(report.sources[1].ok, true);
    assert.equal(report.sources[1].state, "completed");
    assert.equal(report.sources[1].completed, true);
    assert.deepEqual(report.sources[1].counters, {
      receivedCount: 200,
      reviewCount: 2,
      excludedCount: 156,
      importedCount: 42,
      liveOffers: 35,
    });
    assert.equal(report.sources[2].source, "tradedoubler:vouchers");
    assert.equal(report.sources[2].ok, true);
    assert.equal(report.sources[2].skipped, "fresh");
    assert.equal(report.sources[2].completed, true);
    assert.deepEqual(report.sources[2].counters, { activeCoupons: 7 });
    assert.equal(report.sources[3].source, "cj:brasty");
    assert.equal(report.sources[3].busy, true);
    assert.equal(report.sources[3].completed, false);
    assert.doesNotMatch(stderr, new RegExp(requestToken));
  } finally {
    process.argv = originalArgv;
    globalThis.fetch = originalFetch;
    process.stdout.write = originalStdout;
    process.stderr.write = originalStderr;
    process.exitCode = originalExitCode;
    delete process.env.PERFUMETR_ORIGIN;
    delete process.env.PERFUMETR_ORCHESTRATOR_STEPS;
    delete process.env.ACTIONS_ID_TOKEN_REQUEST_TOKEN;
    delete process.env.ACTIONS_ID_TOKEN_REQUEST_URL;
  }
});

test("AWIN feed pending provider approval is reported as blocked without failing automation", async () => {
  const originalArgv = process.argv;
  const originalFetch = globalThis.fetch;
  const originalStdout = process.stdout.write;
  const originalStderr = process.stderr.write;
  const originalExitCode = process.exitCode;
  const requestToken = "github-runner-request-token";
  const oidcToken = [
    Buffer.from(JSON.stringify({ alg: "RS256", kid: "test" })).toString("base64url"),
    Buffer.from(JSON.stringify({ exp: Math.floor(Date.now() / 1000) + 300 })).toString("base64url"),
    Buffer.from("signature").toString("base64url"),
  ].join(".");
  let stdout = "";
  let stderr = "";

  process.env.PERFUMETR_ORIGIN = "https://perfumetr.borodzicz85.chatgpt.site";
  process.env.ACTIONS_ID_TOKEN_REQUEST_TOKEN = requestToken;
  process.env.ACTIONS_ID_TOKEN_REQUEST_URL = "https://pipelines.actions.githubusercontent.com/test/idtoken?api-version=2.0";
  process.argv = [process.execPath, "scripts/catalog-orchestrator.mjs", "awin:flaconi"];
  process.stdout.write = ((value, ...args) => {
    if (typeof value === "string" && value.startsWith("{")) {
      stdout += value;
      return true;
    }
    return originalStdout.call(process.stdout, value, ...args);
  });
  process.stderr.write = ((value) => { stderr += String(value); return true; });

  globalThis.fetch = async (input, init = {}) => {
    const url = new URL(input instanceof URL ? input.href : typeof input === "string" ? input : input.url);
    if (url.hostname === "pipelines.actions.githubusercontent.com") {
      return Response.json({ value: oidcToken });
    }
    const body = JSON.parse(init.body);
    assert.deepEqual(body, { action: "status", source: "awin:flaconi" });
    return Response.json({ ok: false, error: "feed_not_found" }, { status: 404 });
  };

  try {
    await import(`../scripts/catalog-orchestrator.mjs?awin-blocked-test=${Date.now()}`);
    const report = JSON.parse(stdout);
    assert.equal(report.ok, true);
    assert.equal(stderr, "");
    assert.deepEqual(report.sources, [{
      ok: true,
      source: "awin:flaconi",
      blocked: true,
      error: "orchestrator_feed_not_found",
    }]);
    assert.notEqual(process.exitCode, 1);
    assert.doesNotMatch(stdout, new RegExp(requestToken));
  } finally {
    process.argv = originalArgv;
    globalThis.fetch = originalFetch;
    process.stdout.write = originalStdout;
    process.stderr.write = originalStderr;
    process.exitCode = originalExitCode;
    delete process.env.PERFUMETR_ORIGIN;
    delete process.env.ACTIONS_ID_TOKEN_REQUEST_TOKEN;
    delete process.env.ACTIONS_ID_TOKEN_REQUEST_URL;
  }
});
