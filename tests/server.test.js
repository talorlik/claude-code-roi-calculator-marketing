/**
 * Integration tests for the Express backend.
 *
 * Imports `app` from server.js, mounts it on an ephemeral port, and
 * exercises the routes with Node's built-in fetch.
 *
 * The OPENAI_API_KEY is wiped from process.env before requiring the
 * app so the missing-key path is the one that gets exercised — we
 * never make a real OpenAI call.
 */

"use strict";

const test = require("node:test");
const assert = require("node:assert/strict");
const http = require("node:http");

// Wipe the key BEFORE requiring server.js so any cached check sees
// the cleared environment. The recommendation handler reads the key
// per-request, so this also covers later requests in the same run.
delete process.env.OPENAI_API_KEY;
process.env.OPENAI_API_KEY = "";

const app = require("../server.js");

/** Mount the app on an OS-assigned port and resolve the base URL. */
function startServer() {
  return new Promise((resolve) => {
    const server = http.createServer(app);
    server.listen(0, "127.0.0.1", () => {
      const { port } = server.address();
      resolve({ server, baseUrl: `http://127.0.0.1:${port}` });
    });
  });
}

/** Stop the test server, awaiting close. */
function stopServer(server) {
  return new Promise((resolve) => server.close(resolve));
}

let env;

test.before(async () => {
  env = await startServer();
});

test.after(async () => {
  if (env) await stopServer(env.server);
});

test("GET /api/health returns 200 and {status: 'ok'}", async () => {
  const res = await fetch(env.baseUrl + "/api/health");
  assert.equal(res.status, 200);
  const body = await res.json();
  assert.deepEqual(body, { status: "ok" });
});

test("GET / serves the calculator HTML", async () => {
  const res = await fetch(env.baseUrl + "/");
  assert.equal(res.status, 200);
  const ct = res.headers.get("content-type") || "";
  assert.match(ct, /text\/html/);
  const html = await res.text();
  assert.match(html, /Digital Marketing ROI Calculator/);
  assert.match(html, /Built with Claude Code/);
});

test("POST /api/recommendation rejects an empty body with 400", async () => {
  const res = await fetch(env.baseUrl + "/api/recommendation", {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: "{}"
  });
  assert.equal(res.status, 400);
  const body = await res.json();
  assert.equal(body.error, "Missing or invalid calculation data.");
});

test("POST /api/recommendation rejects out-of-range growth with 400", async () => {
  const res = await fetch(env.baseUrl + "/api/recommendation", {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify({
      currentMonthlyRevenue: 50000,
      monthlyMarketingBudget: 5000,
      monthlyGrowthPercentage: 150, // out of range
      roiPercentage: 100,
      projectedAnnualRevenue: 700000,
      totalProfitOrLoss: 50000
    })
  });
  assert.equal(res.status, 400);
});

test("POST /api/recommendation returns 503 safe error when API key missing", async () => {
  const res = await fetch(env.baseUrl + "/api/recommendation", {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify({
      currentMonthlyRevenue: 50000,
      monthlyMarketingBudget: 5000,
      monthlyGrowthPercentage: 10,
      roiPercentage: 2038.43,
      projectedAnnualRevenue: 1883057.71,
      totalProfitOrLoss: 1223057.71
    })
  });
  assert.equal(res.status, 503);
  const body = await res.json();
  assert.equal(
    body.error,
    "AI recommendation is not configured. Add OPENAI_API_KEY to the server environment."
  );
  // Belt + braces: the error message should not include any secret
  // marker or stack frame.
  const text = JSON.stringify(body);
  assert.doesNotMatch(text, /sk-/);
  assert.doesNotMatch(text, /at .*\(/);
});
