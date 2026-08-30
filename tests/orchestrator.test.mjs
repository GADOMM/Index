import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

test("schedules Douglas only in its isolated catalog cycle", async () => {
  const workflow = await readFile(new URL("../.github/workflows/tradedoubler.yml", import.meta.url), "utf8");
  const partnerStep = workflow.match(
    /- name: Advance partner sources through the shared orchestrator[\s\S]*?(?=\n      - name: Advance the isolated Douglas source only)/,
  )?.[0] ?? "";
  const douglasStep = workflow.match(
    /- name: Advance the isolated Douglas source only[\s\S]*?(?=\n      - name: Publish the first live import result)/,
  )?.[0] ?? "";
  assert.match(workflow, /options:[\s\S]*?- douglas/);
  assert.match(workflow, /cron: "23 5 \* \* \*"/);
  assert.match(partnerStep, /github\.event\.schedule != '23 5 \* \* \*'/);
  assert.doesNotMatch(partnerStep, /awin:douglas/);
  assert.match(douglasStep, /github\.event_name == 'workflow_dispatch' && inputs\.mode == 'douglas'/);
  assert.match(douglasStep, /github\.event_name == 'schedule' && github\.event\.schedule == '23 5 \* \* \*'/);
  assert.match(douglasStep, /PERFUMETR_ORCHESTRATOR_STEPS: 48/);
  assert.match(douglasStep, /node scripts\/catalog-orchestrator\.mjs awin:douglas/);
});

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
          overview: {
            state: "paused", receivedCount: 100, reviewCount: 5,
            automaticReviewCount: 5, pendingFreshOfferCount: 0, maintenanceProcessedCount: 0,
          },
        });
      }
      if (body.source === "tradedoubler:vouchers") {
        return Response.json({
          ok: true,
          overview: { state: "completed" },
        });
      }
      return Response.json({
        ok: true,
        overview: {
          state: "running",
          automaticReviewCount: 0,
          pendingFreshOfferCount: 0,
          maintenanceProcessedCount: 0,
        },
      });
    }
    if (body.source === "awin:flaconi") {
      return Response.json({ ok: true, overview: { state: "failed" } });
    }
    if (body.source === "tradedoubler:vouchers") {
      return Response.json({
        ok: true,
        overview: {
          state: "completed",
          activeCoupons: 7,
          rejectionReasons: {
            tracking_url_not_approved: 4,
            missing_discount: 0,
          },
        },
        skipped: "fresh",
      });
    }
    if (body.source === "cj:brasty") {
      return Response.json({
        ok: true,
        overview: {
          state: "running",
          automaticReviewCount: 0,
          pendingFreshOfferCount: 0,
          maintenanceProcessedCount: 0,
        },
        busy: true,
      });
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
        automaticReviewCount: 0,
        pendingFreshOfferCount: 0,
        maintenanceProcessedCount: 0,
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
      automaticReviewCount: 0,
      pendingFreshOfferCount: 0,
      maintenanceProcessedCount: 0,
    });
    assert.equal(report.sources[2].source, "tradedoubler:vouchers");
    assert.equal(report.sources[2].ok, true);
    assert.equal(report.sources[2].skipped, "fresh");
    assert.equal(report.sources[2].completed, true);
    assert.deepEqual(report.sources[2].counters, { activeCoupons: 7 });
    assert.deepEqual(report.sources[2].rejectionReasons, {
      tracking_url_not_approved: 4,
      missing_discount: 0,
    });
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

test("rejects non-allowlisted or non-integer voucher rejection summaries without forwarding them", async () => {
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
  const invalidSummaries = [
    { unexpected_provider_payload: 1 },
    { tracking_url_not_approved: -1 },
    { tracking_url_not_approved: 1.5 },
    { tracking_url_not_approved: "1" },
  ];

  process.env.PERFUMETR_ORIGIN = "https://perfumetr.borodzicz85.chatgpt.site";
  process.env.ACTIONS_ID_TOKEN_REQUEST_TOKEN = requestToken;
  process.env.ACTIONS_ID_TOKEN_REQUEST_URL = "https://pipelines.actions.githubusercontent.com/test/idtoken?api-version=2.0";
  process.argv = [process.execPath, "scripts/catalog-orchestrator.mjs", "tradedoubler:vouchers"];

  try {
    for (const [index, rejectionReasons] of invalidSummaries.entries()) {
      let stdout = "";
      let stderr = "";
      process.exitCode = originalExitCode;
      process.stdout.write = ((value, ...args) => {
        if (typeof value === "string" && value.startsWith("{")) {
          stdout += value;
          return true;
        }
        return originalStdout.call(process.stdout, value, ...args);
      });
      process.stderr.write = ((value) => { stderr += String(value); return true; });
      globalThis.fetch = async (input) => {
        const url = new URL(input instanceof URL ? input.href : typeof input === "string" ? input : input.url);
        if (url.hostname === "pipelines.actions.githubusercontent.com") {
          return Response.json({ value: oidcToken });
        }
        return Response.json({
          ok: true,
          overview: { state: "completed", rejectionReasons },
          skipped: "fresh",
        });
      };

      await import(`../scripts/catalog-orchestrator.mjs?voucher-rejection-validation=${Date.now()}-${index}`);
      assert.equal(stdout, "");
      assert.equal(process.exitCode, 1);
      const report = JSON.parse(stderr.replace(/^catalog_orchestrator_result=/, ""));
      assert.deepEqual(report.sources, [{
        ok: false,
        source: "tradedoubler:vouchers",
        error: "orchestrator_invalid_response",
      }]);
      assert.doesNotMatch(stderr, /unexpected_provider_payload/);
      assert.doesNotMatch(stderr, new RegExp(requestToken));
    }
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

test("drains completed CJ maintenance batches and stops a zero-progress cooldown", async () => {
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
  const notinoSteps = [
    { automaticReviewCount: 2, pendingFreshOfferCount: 2, maintenanceProcessedCount: 0 },
    { automaticReviewCount: 1, pendingFreshOfferCount: 1, maintenanceProcessedCount: 4 },
    { automaticReviewCount: 0, pendingFreshOfferCount: 0, maintenanceProcessedCount: 2 },
  ];
  let stdout = "";
  let stderr = "";

  process.env.PERFUMETR_ORIGIN = "https://perfumetr.borodzicz85.chatgpt.site";
  process.env.PERFUMETR_ORCHESTRATOR_STEPS = "6";
  process.env.ACTIONS_ID_TOKEN_REQUEST_TOKEN = requestToken;
  process.env.ACTIONS_ID_TOKEN_REQUEST_URL = "https://pipelines.actions.githubusercontent.com/test/idtoken?api-version=2.0";
  process.argv = [process.execPath, "scripts/catalog-orchestrator.mjs", "cj:notino", "cj:brasty"];
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
    calls.push([body.source, body.action]);
    if (body.action === "status" && body.source === "cj:notino") {
      return Response.json({ ok: true, overview: {
        state: "paused",
        automaticReviewCount: 2,
        pendingFreshOfferCount: 0,
        maintenanceProcessedCount: 0,
      } });
    }
    if (body.source === "cj:notino") {
      const counters = notinoSteps.shift();
      assert.ok(counters);
      return Response.json({ ok: true, overview: { state: "completed", ...counters } });
    }
    if (body.action === "status") {
      return Response.json({ ok: true, overview: {
        state: "completed",
        automaticReviewCount: 0,
        pendingFreshOfferCount: 3,
        maintenanceProcessedCount: 0,
      } });
    }
    return Response.json({ ok: true, overview: {
      state: "completed",
      automaticReviewCount: 0,
      pendingFreshOfferCount: 3,
      maintenanceProcessedCount: 0,
    } });
  };

  try {
    await import(`../scripts/catalog-orchestrator.mjs?maintenance-test=${Date.now()}`);
    assert.equal(stderr, "");
    assert.notEqual(process.exitCode, 1);
    const report = JSON.parse(stdout);
    assert.equal(report.ok, true);
    assert.deepEqual(calls, [
      ["cj:notino", "status"],
      ["cj:notino", "advance_source"],
      ["cj:notino", "advance_source"],
      ["cj:notino", "advance_source"],
      ["cj:brasty", "status"],
      ["cj:brasty", "advance_source"],
    ]);
    assert.equal(report.sources[0].steps, 3);
    assert.equal(report.sources[0].completed, true);
    assert.deepEqual(report.sources[0].counters, {
      automaticReviewCount: 0,
      pendingFreshOfferCount: 0,
      maintenanceProcessedCount: 2,
    });
    assert.equal(report.sources[1].steps, 1);
    assert.equal(report.sources[1].completed, true);
    assert.deepEqual(report.sources[1].counters, {
      automaticReviewCount: 0,
      pendingFreshOfferCount: 3,
      maintenanceProcessedCount: 0,
    });
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

test("drains completed Flaconi catalog maintenance without feed pacing delays", async () => {
  const originalArgv = process.argv;
  const originalFetch = globalThis.fetch;
  const originalSetTimeout = globalThis.setTimeout;
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
  const delays = [];
  const maintenanceSteps = [
    { automaticReviewCount: 400, maintenanceProcessedCount: 400 },
    { automaticReviewCount: 0, maintenanceProcessedCount: 400 },
  ];
  let stdout = "";
  let stderr = "";

  process.env.PERFUMETR_ORIGIN = "https://perfumetr.borodzicz85.chatgpt.site";
  process.env.PERFUMETR_ORCHESTRATOR_STEPS = "6";
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
  globalThis.setTimeout = ((callback, milliseconds, ...args) => {
    delays.push(milliseconds);
    callback(...args);
    return 0;
  });

  globalThis.fetch = async (input, init = {}) => {
    const url = new URL(input instanceof URL ? input.href : typeof input === "string" ? input : input.url);
    if (url.hostname === "pipelines.actions.githubusercontent.com") {
      return Response.json({ value: oidcToken });
    }
    const body = JSON.parse(init.body);
    calls.push([body.source, body.action]);
    if (body.action === "status") {
      return Response.json({ ok: true, overview: {
        state: "completed",
        importedCount: 933,
        automaticReviewCount: 800,
        maintenanceProcessedCount: 0,
      } });
    }
    const counters = maintenanceSteps.shift();
    assert.ok(counters);
    return Response.json({ ok: true, overview: {
      state: "completed",
      importedCount: 933 + (800 - counters.automaticReviewCount),
      ...counters,
    } });
  };

  try {
    await import(`../scripts/catalog-orchestrator.mjs?flaconi-maintenance-test=${Date.now()}`);
    assert.equal(stderr, "");
    assert.notEqual(process.exitCode, 1);
    assert.deepEqual(calls, [
      ["awin:flaconi", "status"],
      ["awin:flaconi", "advance_source"],
      ["awin:flaconi", "advance_source"],
    ]);
    assert.deepEqual(delays, []);
    const report = JSON.parse(stdout);
    assert.equal(report.ok, true);
    assert.equal(report.sources[0].steps, 2);
    assert.equal(report.sources[0].completed, true);
    assert.equal(report.sources[0].counters.automaticReviewCount, 0);
    assert.equal(report.sources[0].counters.maintenanceProcessedCount, 400);
  } finally {
    process.argv = originalArgv;
    globalThis.fetch = originalFetch;
    globalThis.setTimeout = originalSetTimeout;
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

test("paces consecutive Flaconi feed chunks above the Sites safety interval", async () => {
  const originalArgv = process.argv;
  const originalFetch = globalThis.fetch;
  const originalSetTimeout = globalThis.setTimeout;
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
  const delays = [];
  let stdout = "";
  let stderr = "";

  process.env.PERFUMETR_ORIGIN = "https://perfumetr.borodzicz85.chatgpt.site";
  process.env.PERFUMETR_ORCHESTRATOR_STEPS = "3";
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
  globalThis.setTimeout = ((callback, milliseconds, ...args) => {
    delays.push(milliseconds);
    callback(...args);
    return 0;
  });

  let advances = 0;
  globalThis.fetch = async (input, init = {}) => {
    const url = new URL(input instanceof URL ? input.href : typeof input === "string" ? input : input.url);
    if (url.hostname === "pipelines.actions.githubusercontent.com") {
      return Response.json({ value: oidcToken });
    }
    const body = JSON.parse(init.body);
    calls.push([body.source, body.action]);
    if (body.action === "status") {
      return Response.json({ ok: true, overview: { state: "paused", receivedCount: 0 } });
    }
    advances += 1;
    return Response.json({
      ok: true,
      overview: {
        state: advances === 1 ? "paused" : "completed",
        receivedCount: advances * 1_500,
        importedCount: advances * 40,
        liveOffers: advances * 40,
        ...(advances === 1 ? {} : {
          automaticReviewCount: 0,
          maintenanceProcessedCount: 0,
        }),
      },
    });
  };

  try {
    await import(`../scripts/catalog-orchestrator.mjs?flaconi-pacing-test=${Date.now()}`);
    assert.equal(stderr, "");
    assert.notEqual(process.exitCode, 1);
    assert.deepEqual(calls, [
      ["awin:flaconi", "status"],
      ["awin:flaconi", "advance_source"],
      ["awin:flaconi", "advance_source"],
    ]);
    assert.deepEqual(delays, [12_500]);
    const report = JSON.parse(stdout);
    assert.equal(report.ok, true);
    assert.equal(report.sources[0].steps, 2);
    assert.equal(report.sources[0].completed, true);
    assert.equal(report.sources[0].counters.liveOffers, 80);
  } finally {
    process.argv = originalArgv;
    globalThis.fetch = originalFetch;
    globalThis.setTimeout = originalSetTimeout;
    process.stdout.write = originalStdout;
    process.stderr.write = originalStderr;
    process.exitCode = originalExitCode;
    delete process.env.PERFUMETR_ORIGIN;
    delete process.env.PERFUMETR_ORCHESTRATOR_STEPS;
    delete process.env.ACTIONS_ID_TOKEN_REQUEST_TOKEN;
    delete process.env.ACTIONS_ID_TOKEN_REQUEST_URL;
  }
});

test("paces consecutive Douglas feed chunks above the Sites safety interval", async () => {
  const originalArgv = process.argv;
  const originalFetch = globalThis.fetch;
  const originalSetTimeout = globalThis.setTimeout;
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
  const delays = [];
  let stdout = "";
  let stderr = "";

  process.env.PERFUMETR_ORIGIN = "https://perfumetr.borodzicz85.chatgpt.site";
  process.env.PERFUMETR_ORCHESTRATOR_STEPS = "3";
  process.env.ACTIONS_ID_TOKEN_REQUEST_TOKEN = requestToken;
  process.env.ACTIONS_ID_TOKEN_REQUEST_URL = "https://pipelines.actions.githubusercontent.com/test/idtoken?api-version=2.0";
  process.argv = [process.execPath, "scripts/catalog-orchestrator.mjs", "awin:douglas"];
  process.stdout.write = ((value, ...args) => {
    if (typeof value === "string" && value.startsWith("{")) {
      stdout += value;
      return true;
    }
    return originalStdout.call(process.stdout, value, ...args);
  });
  process.stderr.write = ((value) => { stderr += String(value); return true; });
  globalThis.setTimeout = ((callback, milliseconds, ...args) => {
    delays.push(milliseconds);
    callback(...args);
    return 0;
  });

  let advances = 0;
  globalThis.fetch = async (input, init = {}) => {
    const url = new URL(input instanceof URL ? input.href : typeof input === "string" ? input : input.url);
    if (url.hostname === "pipelines.actions.githubusercontent.com") {
      return Response.json({ value: oidcToken });
    }
    const body = JSON.parse(init.body);
    calls.push([body.source, body.action]);
    if (body.action === "status") {
      return Response.json({ ok: true, overview: { state: "paused", receivedCount: 0 } });
    }
    advances += 1;
    return Response.json({
      ok: true,
      overview: {
        state: advances === 1 ? "paused" : "completed",
        receivedCount: advances * 1_500,
        importedCount: advances * 40,
        liveOffers: advances * 40,
        ...(advances === 1 ? {} : {
          automaticReviewCount: 0,
          maintenanceProcessedCount: 0,
        }),
      },
    });
  };

  try {
    await import(`../scripts/catalog-orchestrator.mjs?douglas-pacing-test=${Date.now()}`);
    assert.equal(stderr, "");
    assert.notEqual(process.exitCode, 1);
    assert.deepEqual(calls, [
      ["awin:douglas", "status"],
      ["awin:douglas", "advance_source"],
      ["awin:douglas", "advance_source"],
    ]);
    assert.deepEqual(delays, [12_500]);
    const report = JSON.parse(stdout);
    assert.equal(report.ok, true);
    assert.equal(report.sources[0].steps, 2);
    assert.equal(report.sources[0].completed, true);
    assert.equal(report.sources[0].counters.liveOffers, 80);
  } finally {
    process.argv = originalArgv;
    globalThis.fetch = originalFetch;
    globalThis.setTimeout = originalSetTimeout;
    process.stdout.write = originalStdout;
    process.stderr.write = originalStderr;
    process.exitCode = originalExitCode;
    delete process.env.PERFUMETR_ORIGIN;
    delete process.env.PERFUMETR_ORCHESTRATOR_STEPS;
    delete process.env.ACTIONS_ID_TOKEN_REQUEST_TOKEN;
    delete process.env.ACTIONS_ID_TOKEN_REQUEST_URL;
  }
});

test("keeps Douglas out of the default scheduled source set until explicit activation", async () => {
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
  process.env.ACTIONS_ID_TOKEN_REQUEST_TOKEN = requestToken;
  process.env.ACTIONS_ID_TOKEN_REQUEST_URL = "https://pipelines.actions.githubusercontent.com/test/idtoken?api-version=2.0";
  process.argv = [process.execPath, "scripts/catalog-orchestrator.mjs"];
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
    assert.deepEqual(body, { action: "status", source: body.source });
    calls.push(body.source);
    const maintenance = body.source.startsWith("cj:")
      ? { automaticReviewCount: 0, pendingFreshOfferCount: 0, maintenanceProcessedCount: 0 }
      : body.source === "awin:flaconi"
        ? { automaticReviewCount: 0, maintenanceProcessedCount: 0 }
        : {};
    return Response.json({
      ok: true,
      skipped: "fresh",
      overview: { state: "completed", ...maintenance },
    });
  };

  try {
    await import(`../scripts/catalog-orchestrator.mjs?default-source-test=${Date.now()}`);
    assert.equal(stderr, "");
    assert.notEqual(process.exitCode, 1);
    assert.deepEqual(calls, [
      "tradedoubler:vouchers",
      "awin:flaconi",
      "cj:notino",
      "cj:brasty",
    ]);
    assert.equal(calls.includes("awin:douglas"), false);
    const report = JSON.parse(stdout);
    assert.equal(report.ok, true);
    assert.deepEqual(report.sources.map(({ source }) => source), calls);
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
