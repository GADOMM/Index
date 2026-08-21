import assert from "node:assert/strict";
import test from "node:test";
import {
  extractProviderProducts,
  providerPayloadErrorCode,
  providerPayloadShapeCode,
} from "../scripts/tradedoubler-products.mjs";

const providerProduct = (name, feedId = "118359") => ({
  name,
  description: `${name} opis`,
  offers: [{ feedId }],
});

test("full snapshot extractor unwraps only exact, product-shaped collections", () => {
  const products = [providerProduct("Zapach A"), providerProduct("Zapach B")];
  const productMap = Object.fromEntries(products.map((product, index) => [`sku-${index}`, product]));

  assert.equal(extractProviderProducts({ products }, 2, "118359"), products);
  assert.deepEqual(extractProviderProducts(products, 2, "118359"), products);
  assert.deepEqual(extractProviderProducts({ result: { productFeed: { products: productMap } } }, 2, "118359"), products);
  assert.deepEqual(extractProviderProducts({ "118359": { data: [products] } }, 2, "118359"), products);
  assert.deepEqual(extractProviderProducts(JSON.stringify({ payload: { items: products } }), 2, "118359"), products);
  assert.deepEqual(extractProviderProducts({
    productHeader: { totalHits: 2 },
    undocumentedEnvelope: { recordsCollection: products },
    generatedAt: "2026-08-21T00:00:00Z",
  }, 2, "118359"), products);
});

test("full snapshot extractor fails closed for unsafe or ambiguous shapes", () => {
  const products = [providerProduct("Zapach A"), providerProduct("Zapach B")];
  assert.equal(extractProviderProducts({ products: products.slice(0, 1) }, 2, "118359"), null);
  assert.equal(extractProviderProducts({ products: [products[0], { name: "Kategoria", id: 2 }] }, 2, "118359"), null);
  assert.equal(extractProviderProducts({ products: [products[0], providerProduct("Obcy", "112471")] }, 2, "118359"), null);
  assert.equal(extractProviderProducts(JSON.stringify(JSON.stringify({ products })), 2, "118359"), null);
  assert.equal(extractProviderProducts({ a: { b: { c: { d: { e: { f: { g: { products } } } } } } } }, 2, "118359"), null);
  assert.throws(
    () => extractProviderProducts({ products, data: products.map((product) => ({ ...product })) }, 2, "118359"),
    /provider_snapshot_ambiguous/,
  );
});

test("full snapshot extractor recognizes only safe provider error codes", () => {
  assert.equal(providerPayloadErrorCode({ code: "429", message: "private detail" }), "429");
  assert.equal(providerPayloadErrorCode({ errors: [{ code: "PF_392", message: "private detail" }] }), "PF_392");
  assert.equal(providerPayloadErrorCode({ code: "not safe!", message: "private detail" }), null);
  assert.equal(providerPayloadErrorCode({ products: [] }), null);
  assert.equal(providerPayloadShapeCode({ productHeader: {}, undocumentedEnvelope: {}, generatedAt: "now" }),
    "object_producthea_undocument_generateda");
});

test("proof uses the fixed bridge flow for the two selected static feeds", async () => {
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

test("full import versions the unlimited file from official feed metadata", async () => {
  const originalArgv = process.argv;
  const originalFetch = globalThis.fetch;
  const originalStdout = process.stdout.write;
  const oidcRequestToken = "github-runner-request-token";
  const oidcToken = [
    Buffer.from(JSON.stringify({ alg: "RS256", typ: "JWT", kid: "test" })).toString("base64url"),
    Buffer.from(JSON.stringify({ exp: Math.floor(Date.now() / 1000) + 300 })).toString("base64url"),
    Buffer.from("test-signature").toString("base64url"),
  ].join(".");
  const providerToken = "c".repeat(40);
  const sessionId = "11111111-1111-4111-8111-111111111111";
  const issuedModes = [];
  const bridgeActions = [];
  let chunkAttempts = 0;
  let output = "";

  process.env.PERFUMETR_MODE = "full";
  process.env.PERFUMETR_ORIGIN = "https://perfumetr.borodzicz85.chatgpt.site";
  process.env.ACTIONS_ID_TOKEN_REQUEST_TOKEN = oidcRequestToken;
  process.env.ACTIONS_ID_TOKEN_REQUEST_URL = "https://pipelines.actions.githubusercontent.com/test/idtoken?api-version=2.0";
  process.argv = [process.execPath, "scripts/tradedoubler-import.mjs", "112471"];
  process.stdout.write = ((value, ...args) => {
    if (typeof value === "string" && value.startsWith("{")) {
      output += value;
      return true;
    }
    return originalStdout.call(process.stdout, value, ...args);
  });
  globalThis.fetch = async (input, init = {}) => {
    const url = new URL(input instanceof URL ? input.href : typeof input === "string" ? input : input.url);
    const method = init.method ?? (input instanceof Request ? input.method : "GET");
    if (url.hostname === "pipelines.actions.githubusercontent.com") {
      return Response.json({ value: oidcToken });
    }
    if (url.hostname === "perfumetr.borodzicz85.chatgpt.site" && method === "POST") {
      const body = JSON.parse(init.body);
      bridgeActions.push(body.action);
      if (body.action === "issue_browser_ticket") {
        issuedModes.push(body.mode);
        return Response.json({ ok: true, ticket: `${body.mode}-112471` });
      }
      if (body.action === "begin_unlimited_snapshot") {
        assert.equal(body.lastUpdated.lastModifiedTime, "2026-08-21T12:00:00Z");
        return Response.json({
          ok: true,
          required: true,
          sessionId,
          nextChunk: 0,
          rawCount: 0,
          snapshotHash: null,
        });
      }
      if (body.action === "import_unlimited_chunk") {
        assert.equal(body.sessionId, sessionId);
        assert.equal(body.chunkIndex, 0);
        assert.equal(body.rawProductCount, 2);
        assert.equal(body.payload.productHeader.totalHits, 2);
        assert.equal(body.payload.products.length, 1);
        assert.equal(body.payload.products[0].name, "Testowa Eau de Parfum 50 ml");
        chunkAttempts += 1;
        if (chunkAttempts === 1) {
          return Response.json({ ok: false, error: "already_running" }, { status: 409 });
        }
        return Response.json({ ok: true, matchedCandidates: 1, storeLiveOffers: 1 });
      }
      assert.equal(body.action, "complete_unlimited_snapshot");
      assert.equal(body.lastUpdated.lastModifiedTime, "2026-08-21T12:00:00Z");
      assert.equal(body.rawProductCount, 2);
      return Response.json({ ok: true, liveOffers: 1, importedCount: 1 });
    }
    if (url.hostname === "perfumetr.borodzicz85.chatgpt.site") {
      const ticket = url.searchParams.get("ticket") ?? "";
      const path = ticket.startsWith("feed_metadata-")
        ? "productFeeds/112471"
        : "productsUnlimited;fid=112471;sourceproducturl=true";
      return new Response(null, {
        status: 302,
        headers: { location: `https://api.tradedoubler.com/1.0/${path}?token=${providerToken}` },
      });
    }
    assert.equal(url.hostname, "api.tradedoubler.com");
    if (url.pathname.includes("/productFeeds/112471")) {
      return Response.json({
        feedId: 112471,
        lastModifiedTime: "2026-08-21T12:00:00Z",
        numberOfProducts: 2,
      });
    }
    assert.match(url.pathname, /\/productsUnlimited;fid=112471;sourceproducturl=true$/);
    return Response.json({
      data: {
        productFeed: {
          products: {
            "test-sku": { name: "Testowa Eau de Parfum 50 ml", feedId: 112471 },
            "other-sku": { name: "Szampon do włosów 250 ml", feedId: 112471 },
          },
        },
      },
    });
  };

  try {
    await import(`../scripts/tradedoubler-import.mjs?full-test=${Date.now()}`);
    const report = JSON.parse(output);
    assert.equal(report.ok, true);
    assert.equal(report.mode, "full");
    assert.deepEqual(issuedModes, ["feed_metadata", "unlimited_full", "feed_metadata"]);
    assert.equal(issuedModes.includes("last_updated"), false);
    assert.deepEqual(bridgeActions, [
      "issue_browser_ticket",
      "begin_unlimited_snapshot",
      "issue_browser_ticket",
      "import_unlimited_chunk",
      "import_unlimited_chunk",
      "issue_browser_ticket",
      "complete_unlimited_snapshot",
    ]);
    assert.equal(chunkAttempts, 2);
    assert.equal(report.results[0].providerProducts, 2);
    assert.equal(report.results[0].perfumeProducts, 1);
    assert.equal(report.results[0].liveOffers, 1);
    assert.equal(report.results[0].importedCount, 1);
    assert.doesNotMatch(output, new RegExp(`${oidcRequestToken}|${providerToken}|${sessionId}`));
  } finally {
    process.argv = originalArgv;
    globalThis.fetch = originalFetch;
    process.stdout.write = originalStdout;
    delete process.env.PERFUMETR_MODE;
    delete process.env.PERFUMETR_ORIGIN;
    delete process.env.ACTIONS_ID_TOKEN_REQUEST_TOKEN;
    delete process.env.ACTIONS_ID_TOKEN_REQUEST_URL;
  }
});

test("full import replaces a live-shaped missing Unlimited object with an exact two-page snapshot", async () => {
  const originalArgv = process.argv;
  const originalFetch = globalThis.fetch;
  const originalStdout = process.stdout.write;
  const requestToken = "github-runner-request-token";
  const oidcToken = [
    Buffer.from(JSON.stringify({ alg: "RS256", kid: "test" })).toString("base64url"),
    Buffer.from(JSON.stringify({ exp: Math.floor(Date.now() / 1000) + 300 })).toString("base64url"),
    Buffer.from("signature").toString("base64url"),
  ].join(".");
  const providerToken = "e".repeat(40);
  const sessionId = "22222222-2222-4222-8222-222222222222";
  const issuedModes = [];
  const importedChunks = [];
  let output = "";

  process.env.PERFUMETR_MODE = "full";
  process.env.PERFUMETR_ORIGIN = "https://perfumetr.borodzicz85.chatgpt.site";
  process.env.ACTIONS_ID_TOKEN_REQUEST_TOKEN = requestToken;
  process.env.ACTIONS_ID_TOKEN_REQUEST_URL = "https://pipelines.actions.githubusercontent.com/test/idtoken?api-version=2.0";
  process.argv = [process.execPath, "scripts/tradedoubler-import.mjs", "112471"];
  process.stdout.write = ((value, ...args) => {
    if (typeof value === "string" && value.startsWith("{")) {
      output += value;
      return true;
    }
    return originalStdout.call(process.stdout, value, ...args);
  });

  globalThis.fetch = async (input, init = {}) => {
    const url = new URL(input instanceof URL ? input.href : typeof input === "string" ? input : input.url);
    const method = init.method ?? (input instanceof Request ? input.method : "GET");
    if (url.hostname === "pipelines.actions.githubusercontent.com") {
      return Response.json({ value: oidcToken });
    }
    if (url.hostname === "perfumetr.borodzicz85.chatgpt.site" && method === "POST") {
      const body = JSON.parse(init.body);
      if (body.action === "issue_browser_ticket") {
        issuedModes.push(body.mode);
        if (body.mode === "page") {
          assert.ok([1, 2].includes(body.page));
          return Response.json({ ok: true, ticket: `page-${body.page}` });
        }
        return Response.json({ ok: true, ticket: `${body.mode}-112471` });
      }
      if (body.action === "begin_unlimited_snapshot") {
        return Response.json({
          ok: true,
          required: true,
          sessionId,
          nextChunk: 0,
          rawCount: 0,
          snapshotHash: null,
        });
      }
      if (body.action === "import_unlimited_chunk") {
        assert.equal(body.sessionId, sessionId);
        assert.match(body.snapshotHash, /^[a-f0-9]{64}$/);
        assert.equal(body.payload.productHeader.totalHits, 101);
        assert.equal(body.payload.products.every((product) => /Eau de Parfum/.test(product.name)), true);
        importedChunks.push({
          chunkIndex: body.chunkIndex,
          rawProductCount: body.rawProductCount,
          perfumeProducts: body.payload.products.length,
          snapshotHash: body.snapshotHash,
        });
        return Response.json({ ok: true, matchedCandidates: importedChunks.length, storeLiveOffers: 2 });
      }
      assert.equal(body.action, "complete_unlimited_snapshot");
      assert.equal(body.rawProductCount, 101);
      return Response.json({ ok: true, liveOffers: 2, importedCount: 2 });
    }
    if (url.hostname === "perfumetr.borodzicz85.chatgpt.site") {
      const ticket = url.searchParams.get("ticket") ?? "";
      const path = ticket.startsWith("feed_metadata-")
        ? "productFeeds/112471"
        : ticket.startsWith("unlimited_full-")
          ? "productsUnlimited;fid=112471;sourceproducturl=true"
          : `products.json;page=${ticket.endsWith("-2") ? 2 : 1};pageSize=100;fid=112471;sourceproducturl=true`;
      return new Response(null, {
        status: 302,
        headers: { location: `https://api.tradedoubler.com/1.0/${path}?token=${providerToken}` },
      });
    }
    assert.equal(url.hostname, "api.tradedoubler.com");
    if (url.pathname.includes("/productFeeds/112471")) {
      return Response.json({
        feedId: 112471,
        lastModifiedTime: "2026-08-21T13:00:00Z",
        numberOfProducts: 101,
      });
    }
    if (url.pathname.includes("/productsUnlimited;")) {
      return Response.json({ message: "Products Unlimited returned no product collection" });
    }
    if (url.pathname.includes(";page=1;")) {
      return Response.json({
        productHeader: { totalHits: 101 },
        products: Array.from({ length: 100 }, (_, index) => ({
          name: index === 0 ? "Aelia Eau de Parfum 50 ml" : `Aelia szampon ${index}`,
          feedId: 112471,
        })),
      });
    }
    assert.match(url.pathname, /;page=2;pageSize=100;fid=112471;/);
    return Response.json({
      productHeader: { totalHits: 101 },
      products: [{ name: "Aelia Eau de Parfum 100 ml", feedId: 112471 }],
    });
  };

  try {
    await import(`../scripts/tradedoubler-import.mjs?page-full-test=${Date.now()}`);
    const report = JSON.parse(output);
    assert.equal(report.ok, true);
    assert.deepEqual(issuedModes, [
      "feed_metadata",
      "unlimited_full",
      "page",
      "page",
      "feed_metadata",
    ]);
    assert.deepEqual(importedChunks.map(({ chunkIndex, rawProductCount, perfumeProducts }) => ({
      chunkIndex,
      rawProductCount,
      perfumeProducts,
    })), [
      { chunkIndex: 0, rawProductCount: 100, perfumeProducts: 1 },
      { chunkIndex: 1, rawProductCount: 1, perfumeProducts: 1 },
    ]);
    assert.equal(importedChunks[0].snapshotHash, importedChunks[1].snapshotHash);
    assert.equal(report.results[0].transport, "page");
    assert.equal(report.results[0].pages, 2);
    assert.equal(report.results[0].providerProducts, 101);
    assert.equal(report.results[0].scannedProducts, 101);
    assert.equal(report.results[0].perfumeProducts, 2);
    assert.equal(report.results[0].importedCount, 2);
    assert.doesNotMatch(output, new RegExp(`${requestToken}|${providerToken}|${sessionId}`));
  } finally {
    process.argv = originalArgv;
    globalThis.fetch = originalFetch;
    process.stdout.write = originalStdout;
    delete process.env.PERFUMETR_MODE;
    delete process.env.PERFUMETR_ORIGIN;
    delete process.env.ACTIONS_ID_TOKEN_REQUEST_TOKEN;
    delete process.env.ACTIONS_ID_TOKEN_REQUEST_URL;
  }
});

test("full import never turns a Products Unlimited HTTP 429 into page traffic", async () => {
  const originalArgv = process.argv;
  const originalFetch = globalThis.fetch;
  const originalStdout = process.stdout.write;
  const originalStderr = process.stderr.write;
  const originalExitCode = process.exitCode;
  const oidcToken = [
    Buffer.from(JSON.stringify({ alg: "RS256", kid: "test" })).toString("base64url"),
    Buffer.from(JSON.stringify({ exp: Math.floor(Date.now() / 1000) + 300 })).toString("base64url"),
    Buffer.from("signature").toString("base64url"),
  ].join(".");
  const providerToken = "f".repeat(40);
  const issuedModes = [];
  let stdout = "";
  let stderr = "";

  process.env.PERFUMETR_MODE = "full";
  process.env.PERFUMETR_ORIGIN = "https://perfumetr.borodzicz85.chatgpt.site";
  process.env.ACTIONS_ID_TOKEN_REQUEST_TOKEN = "github-runner-request-token";
  process.env.ACTIONS_ID_TOKEN_REQUEST_URL = "https://pipelines.actions.githubusercontent.com/test/idtoken?api-version=2.0";
  process.argv = [process.execPath, "scripts/tradedoubler-import.mjs", "112471"];
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
        issuedModes.push(body.mode);
        return Response.json({ ok: true, ticket: `${body.mode}-112471` });
      }
      if (body.action === "begin_unlimited_snapshot") {
        return Response.json({
          ok: true,
          required: true,
          sessionId: "33333333-3333-4333-8333-333333333333",
          nextChunk: 0,
          rawCount: 0,
          snapshotHash: null,
        });
      }
      assert.equal(body.action, "fail_unlimited_snapshot");
      assert.equal(body.errorCode, "provider_429");
      return Response.json({ ok: true });
    }
    if (url.hostname === "perfumetr.borodzicz85.chatgpt.site") {
      const ticket = url.searchParams.get("ticket") ?? "";
      const path = ticket.startsWith("feed_metadata-")
        ? "productFeeds/112471"
        : "productsUnlimited;fid=112471;sourceproducturl=true";
      return new Response(null, {
        status: 302,
        headers: { location: `https://api.tradedoubler.com/1.0/${path}?token=${providerToken}` },
      });
    }
    if (url.pathname.includes("/productFeeds/112471")) {
      return Response.json({
        feedId: 112471,
        lastModifiedTime: "2026-08-21T14:00:00Z",
        numberOfProducts: 1,
      });
    }
    return Response.json({ code: "429", message: "private rate limit detail" }, { status: 429 });
  };

  try {
    await import(`../scripts/tradedoubler-import.mjs?full-429-test=${Date.now()}`);
    assert.equal(stdout, "");
    assert.equal(process.exitCode, 1);
    assert.deepEqual(issuedModes, ["feed_metadata", "unlimited_full"]);
    const report = JSON.parse(stderr.replace(/^tradedoubler_result=/, ""));
    assert.equal(report.ok, false);
    assert.equal(report.results[0].error, "provider_429");
    assert.doesNotMatch(stderr, /private rate limit detail|page-/);
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
