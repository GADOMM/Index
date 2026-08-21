import assert from "node:assert/strict";
import test from "node:test";

test("proof uses the fixed bridge flow for exactly the two approved feeds", async () => {
  const originalArgv = process.argv;
  const originalFetch = globalThis.fetch;
  const originalWrite = process.stdout.write;
  const oidcRequestToken = "github-runner-request-token";
  const oidcToken = [
    Buffer.from(JSON.stringify({ alg: "RS256", typ: "JWT", kid: "test" })).toString("base64url"),
    Buffer.from(JSON.stringify({ exp: Math.floor(Date.now() / 1000) + 300 })).toString("base64url"),
    Buffer.from("test-signature").toString("base64url"),
  ].join(".");
  const providerToken = "a".repeat(40);
  const calls = [];
  let output = "";

  process.env.PERFUMETR_MODE = "proof";
  process.env.PERFUMETR_ORIGIN = "https://perfumetr.borodzicz85.chatgpt.site";
  process.env.ACTIONS_ID_TOKEN_REQUEST_TOKEN = oidcRequestToken;
  process.env.ACTIONS_ID_TOKEN_REQUEST_URL = "https://pipelines.actions.githubusercontent.com/test/idtoken?api-version=2.0";
  process.argv = [process.execPath, "scripts/tradedoubler-import.mjs", "112471", "118359"];
  process.stdout.write = ((value) => {
    output += String(value);
    return true;
  });
  globalThis.fetch = async (input, init = {}) => {
    const url = new URL(input instanceof URL ? input.href : typeof input === "string" ? input : input.url);
    const method = init.method ?? (input instanceof Request ? input.method : "GET");
    calls.push({ method, url: url.toString() });
    if (url.hostname === "pipelines.actions.githubusercontent.com") {
      assert.equal(init.headers.authorization, `Bearer ${oidcRequestToken}`);
      assert.equal(url.searchParams.get("audience"), "perfumetr-tradedoubler-bridge");
      return Response.json({ value: oidcToken });
    }
    if (url.hostname === "perfumetr.borodzicz85.chatgpt.site" && method === "POST") {
      assert.equal(init.headers.authorization, `Bearer ${oidcToken}`);
      const body = JSON.parse(init.body);
      if (body.action === "issue_browser_ticket") {
        assert.equal(body.mode, "query");
        assert.ok(["112471", "118359"].includes(body.feedId));
        assert.equal(Object.hasOwn(body, "q"), false);
        assert.equal(Object.hasOwn(body, "query"), false);
        assert.equal(Object.hasOwn(body, "queryIndex"), false);
        return Response.json({ ok: true, ticket: `ticket-${body.feedId}` });
      }
      assert.equal(body.action, "import_payload");
      assert.equal(Array.isArray(body.payload.products), true);
      return Response.json({
        ok: true,
        candidates: 1,
        reviewCandidates: 0,
        matchedCandidates: 1,
        liveOffers: 1,
        storeLiveOffers: 1,
      });
    }
    if (url.hostname === "perfumetr.borodzicz85.chatgpt.site") {
      const ticket = url.searchParams.get("ticket");
      assert.match(ticket, /^ticket-(112471|118359)$/);
      const feedId = ticket.slice("ticket-".length);
      return new Response(null, {
        status: 302,
        headers: {
          location: `https://api.tradedoubler.com/1.0/products.json;fid=${feedId};q=woda%20perfumowana;pageSize=100;sourceproducturl=true?token=${providerToken}`,
        },
      });
    }
    assert.equal(url.hostname, "api.tradedoubler.com");
    const feedId = url.pathname.match(/;fid=(\d+);/)?.[1];
    assert.ok(["112471", "118359"].includes(feedId));
    assert.equal(url.searchParams.get("token"), providerToken);
    return Response.json({
      productHeader: { totalHits: 1 },
      products: [{ name: "Testowa woda perfumowana", feedId }],
    });
  };

  try {
    await import(`../scripts/tradedoubler-import.mjs?test=${Date.now()}`);
    const report = JSON.parse(output);
    assert.equal(report.ok, true);
    assert.equal(report.mode, "proof");
    assert.deepEqual(report.results.map((result) => result.feedId), ["112471", "118359"]);
    assert.deepEqual(report.results.map((result) => result.receivedProducts), [1, 1]);
    assert.equal(calls.filter((call) => call.url.includes("pipelines.actions.githubusercontent.com")).length, 1);
    assert.equal(calls.filter((call) => call.url.includes("api.tradedoubler.com")).length, 2);
    assert.doesNotMatch(output, new RegExp(`${oidcRequestToken}|${oidcToken.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}|${providerToken}|ticket-`));
  } finally {
    process.argv = originalArgv;
    globalThis.fetch = originalFetch;
    process.stdout.write = originalWrite;
    delete process.env.PERFUMETR_MODE;
    delete process.env.PERFUMETR_ORIGIN;
    delete process.env.ACTIONS_ID_TOKEN_REQUEST_TOKEN;
    delete process.env.ACTIONS_ID_TOKEN_REQUEST_URL;
  }
});

test("proof checks both feeds and reports only safe provider codes when each is rejected", async () => {
  const originalArgv = process.argv;
  const originalFetch = globalThis.fetch;
  const originalStdout = process.stdout.write;
  const originalStderr = process.stderr.write;
  const originalExitCode = process.exitCode;
  const oidcRequestToken = "github-runner-request-token";
  const oidcToken = [
    Buffer.from(JSON.stringify({ alg: "RS256", typ: "JWT", kid: "test" })).toString("base64url"),
    Buffer.from(JSON.stringify({ exp: Math.floor(Date.now() / 1000) + 300 })).toString("base64url"),
    Buffer.from("test-signature").toString("base64url"),
  ].join(".");
  const providerToken = "b".repeat(40);
  const privateProviderDetail = "private provider message that must never be logged";
  const providerCalls = [];
  let stdout = "";
  let stderr = "";

  process.env.PERFUMETR_MODE = "proof";
  process.env.PERFUMETR_ORIGIN = "https://perfumetr.borodzicz85.chatgpt.site";
  process.env.ACTIONS_ID_TOKEN_REQUEST_TOKEN = oidcRequestToken;
  process.env.ACTIONS_ID_TOKEN_REQUEST_URL = "https://pipelines.actions.githubusercontent.com/test/idtoken?api-version=2.0";
  process.argv = [process.execPath, "scripts/tradedoubler-import.mjs", "112471", "118359"];
  process.stdout.write = ((value) => { stdout += String(value); return true; });
  process.stderr.write = ((value) => { stderr += String(value); return true; });
  globalThis.fetch = async (input, init = {}) => {
    const url = new URL(input instanceof URL ? input.href : typeof input === "string" ? input : input.url);
    const method = init.method ?? (input instanceof Request ? input.method : "GET");
    if (url.hostname === "pipelines.actions.githubusercontent.com") {
      return Response.json({ value: oidcToken });
    }
    if (url.hostname === "perfumetr.borodzicz85.chatgpt.site" && method === "POST") {
      const body = JSON.parse(init.body);
      assert.equal(body.action, "issue_browser_ticket");
      return Response.json({ ok: true, ticket: `ticket-${body.feedId}` });
    }
    if (url.hostname === "perfumetr.borodzicz85.chatgpt.site") {
      const feedId = (url.searchParams.get("ticket") ?? "").slice("ticket-".length);
      return new Response(null, {
        status: 302,
        headers: {
          location: `https://api.tradedoubler.com/1.0/products.json;fid=${feedId};q=woda%20perfumowana;pageSize=100;sourceproducturl=true?token=${providerToken}`,
        },
      });
    }
    assert.equal(url.hostname, "api.tradedoubler.com");
    const feedId = url.pathname.match(/;fid=(\d+);/)?.[1];
    providerCalls.push(feedId);
    return Response.json({
      errors: [{ code: feedId === "112471" ? "PF_392" : "PF_300", message: privateProviderDetail }],
    }, { status: 400 });
  };

  try {
    await import(`../scripts/tradedoubler-import.mjs?failure-test=${Date.now()}`);
    assert.equal(stdout, "");
    assert.equal(process.exitCode, 1);
    const report = JSON.parse(stderr.replace(/^proof_result=/, ""));
    assert.equal(report.ok, false);
    assert.deepEqual(providerCalls, ["112471", "118359"]);
    assert.deepEqual(report.results.map((result) => [result.feedId, result.error]), [
      ["112471", "provider_400_PF_392"],
      ["118359", "provider_400_PF_300"],
    ]);
    assert.doesNotMatch(`${stdout}${stderr}`, new RegExp(
      `${oidcRequestToken}|${oidcToken.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}|${providerToken}|${privateProviderDetail}|ticket-`,
    ));
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
