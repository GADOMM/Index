import assert from "node:assert/strict";
import test from "node:test";

test("a failed full TradeDoubler source does not stop the next store", async () => {
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
  const providerToken = "e".repeat(40);
  const beginCalls = [];
  let stdout = "";
  let stderr = "";

  process.env.PERFUMETR_MODE = "full";
  process.env.PERFUMETR_ORIGIN = "https://perfumetr.borodzicz85.chatgpt.site";
  process.env.ACTIONS_ID_TOKEN_REQUEST_TOKEN = requestToken;
  process.env.ACTIONS_ID_TOKEN_REQUEST_URL = "https://pipelines.actions.githubusercontent.com/test/idtoken?api-version=2.0";
  process.argv = [
    process.execPath,
    "scripts/tradedoubler-import.mjs",
    "cocolita-pl",
    "drogeria-pl",
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
    const method = init.method ?? (input instanceof Request ? input.method : "GET");
    if (url.hostname === "pipelines.actions.githubusercontent.com") {
      return Response.json({ value: oidcToken });
    }
    if (url.hostname === "perfumetr.borodzicz85.chatgpt.site" && method === "POST") {
      const body = JSON.parse(init.body);
      if (body.action === "issue_browser_ticket") {
        assert.equal(body.mode, "feed_metadata");
        return Response.json({ ok: true, ticket: `metadata-${body.feedId}` });
      }
      assert.equal(body.action, "begin_unlimited_snapshot");
      beginCalls.push(body.feedId);
      if (body.feedId === "112471") {
        return Response.json({ ok: false, error: "source_busy" }, { status: 409 });
      }
      return Response.json({ ok: true, required: false });
    }
    if (url.hostname === "perfumetr.borodzicz85.chatgpt.site") {
      const feedId = (url.searchParams.get("ticket") ?? "").replace("metadata-", "");
      return new Response(null, {
        status: 302,
        headers: {
          location: `https://api.tradedoubler.com/1.0/productFeeds/${feedId}?token=${providerToken}`,
        },
      });
    }
    const feedId = url.pathname.split("/").at(-1);
    return Response.json({
      feedId,
      lastModifiedTime: "2026-08-21T12:00:00Z",
      numberOfProducts: 10,
    });
  };

  try {
    await import(`../scripts/tradedoubler-import.mjs?full-isolation-test=${Date.now()}`);
    assert.equal(stdout, "");
    assert.equal(process.exitCode, 1);
    const report = JSON.parse(stderr.replace(/^tradedoubler_result=/, ""));
    assert.equal(report.ok, false);
    assert.deepEqual(beginCalls, ["112471", "118359"]);
    assert.equal(report.results[0].sourceKey, "cocolita-pl");
    assert.equal(report.results[0].error, "bridge_source_busy");
    assert.equal(report.results[1].sourceKey, "drogeria-pl");
    assert.equal(report.results[1].ok, true);
    assert.equal(report.results[1].unchanged, true);
    assert.doesNotMatch(stderr, new RegExp(`${requestToken}|${providerToken}|metadata-`));
  } finally {
    process.argv = originalArgv;
    globalThis.fetch = originalFetch;
    process.stdout.write = originalStdout;
    process.stderr.write = originalStderr;
    process.exitCode = originalExitCode;
    delete process.env.PERFUMETR_MODE;
    delete process.env.PERFUMETR_ORIGIN;
    delete process.env.ACTIONS_ID_TOKEN_REQUEST_TOKEN;
    delete process.env.ACTIONS_ID_TOKEN_REQUEST_URL;
  }
});
