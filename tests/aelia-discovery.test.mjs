import assert from "node:assert/strict";
import test from "node:test";

test("Aelia feed is configured from program 397216 and only perfumes reach the bridge", async () => {
  const originalArgv = process.argv;
  const originalFetch = globalThis.fetch;
  const originalWrite = process.stdout.write;
  const requestToken = "github-runner-request-token";
  const oidcToken = [
    Buffer.from(JSON.stringify({ alg: "RS256", kid: "test" })).toString("base64url"),
    Buffer.from(JSON.stringify({ exp: Math.floor(Date.now() / 1000) + 300 })).toString("base64url"),
    Buffer.from("signature").toString("base64url"),
  ].join(".");
  const providerToken = "d".repeat(40);
  const programPayload = {
    feeds: [
      { feedId: "220001", programId: "397216", currency: "PLN", domain: "aelia.pl" },
      { feedId: "220002", programId: "397216", currency: "EUR", domain: "aelia.pl" },
    ],
  };
  const calls = [];
  let output = "";

  process.env.PERFUMETR_MODE = "proof";
  process.env.PERFUMETR_ORIGIN = "https://perfumetr.borodzicz85.chatgpt.site";
  process.env.ACTIONS_ID_TOKEN_REQUEST_TOKEN = requestToken;
  process.env.ACTIONS_ID_TOKEN_REQUEST_URL = "https://pipelines.actions.githubusercontent.com/test/idtoken?api-version=2.0";
  process.argv = [process.execPath, "scripts/tradedoubler-import.mjs", "aelia-pl"];
  process.stdout.write = ((value, ...args) => {
    if (typeof value === "string" && value.startsWith("{")) {
      output += value;
      return true;
    }
    return originalWrite.call(process.stdout, value, ...args);
  });

  globalThis.fetch = async (input, init = {}) => {
    const url = new URL(input instanceof URL ? input.href : typeof input === "string" ? input : input.url);
    const method = init.method ?? (input instanceof Request ? input.method : "GET");
    if (url.hostname === "pipelines.actions.githubusercontent.com") {
      return Response.json({ value: oidcToken });
    }
    if (url.hostname === "perfumetr.borodzicz85.chatgpt.site" && method === "POST") {
      assert.equal(init.headers.authorization, `Bearer ${oidcToken}`);
      const body = JSON.parse(init.body);
      calls.push(body.action);
      if (body.action === "issue_browser_ticket") {
        if (body.mode === "program_feeds") {
          assert.equal(body.feedId, "397216");
          return Response.json({ ok: true, ticket: "program-feeds-aelia" });
        }
        assert.equal(body.mode, "query");
        assert.equal(body.feedId, "220001");
        return Response.json({ ok: true, ticket: "ticket-aelia" });
      }
      if (body.action === "configure_store_feed") {
        assert.equal(body.store, "aelia");
        assert.deepEqual(body.payload, programPayload);
        return Response.json({ ok: true, feedId: "220001" });
      }
      assert.equal(body.action, "import_payload");
      assert.equal(body.payload.products.length, 1);
      assert.equal(body.payload.products[0].name, "Aelia Eau de Parfum 50 ml");
      return Response.json({ ok: true, matchedCandidates: 1, storeLiveOffers: 1 });
    }
    if (url.hostname === "perfumetr.borodzicz85.chatgpt.site") {
      const ticket = url.searchParams.get("ticket");
      const path = ticket === "program-feeds-aelia"
        ? "productFeeds.json"
        : "products.json;fid=220001;q=woda%20perfumowana;pageSize=100;sourceproducturl=true";
      return new Response(null, {
        status: 302,
        headers: {
          location: `https://api.tradedoubler.com/1.0/${path}?token=${providerToken}`,
        },
      });
    }
    if (url.pathname.endsWith("/productFeeds.json")) return Response.json(programPayload);
    return Response.json({
      productHeader: { totalHits: 2 },
      products: [
        { name: "Aelia Eau de Parfum 50 ml", feedId: "220001" },
        { name: "Perfumowany balsam do ciała", feedId: "220001" },
      ],
    });
  };

  try {
    await import(`../scripts/tradedoubler-import.mjs?aelia-test=${Date.now()}`);
    const report = JSON.parse(output);
    assert.equal(report.ok, true);
    assert.deepEqual(calls, [
      "issue_browser_ticket",
      "configure_store_feed",
      "issue_browser_ticket",
      "import_payload",
    ]);
    assert.equal(report.results[0].sourceKey, "aelia-pl");
    assert.equal(report.results[0].programId, "397216");
    assert.equal(report.results[0].feedId, "220001");
    assert.equal(report.results[0].receivedProducts, 2);
    assert.equal(report.results[0].perfumeProducts, 1);
    assert.doesNotMatch(output, new RegExp(`${requestToken}|${providerToken}|ticket-aelia|program-feeds-aelia`));
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
