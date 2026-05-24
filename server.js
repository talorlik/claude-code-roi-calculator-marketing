/**
 * Digital Marketing ROI Calculator — backend server.
 *
 * Routes:
 *   GET  /api/health            — liveness probe
 *   POST /api/recommendation    — proxies an OpenAI chat completion
 *                                 so the API key stays on the server.
 *                                 The browser never sees the key.
 *
 * Exports `app` so integration tests can mount it on an ephemeral
 * port without auto-starting a listener (see tests/server.test.js).
 */

require("dotenv").config();

const path = require("path");
const express = require("express");
const cors = require("cors");
const OpenAI = require("openai");

const app = express();

/**
 * Centralized OpenAI model name.
 *
 * `gpt-5.4-mini` was requested but is not a valid OpenAI model ID at
 * the time of writing, so the API returned an error and the safe
 * 502 path engaged. Falling back to `gpt-4o-mini` — current,
 * inexpensive, and well-suited for a short business recommendation.
 * Swap this constant if a newer model becomes preferable; nothing
 * else in the codebase depends on the model name.
 */
const OPENAI_MODEL = "gpt-4o-mini";

app.use(cors());
app.use(express.json());

app.use(express.static(path.join(__dirname, "public")));

/**
 * GET /api/health — simple liveness probe.
 * @returns {{status: "ok"}}
 */
app.get("/api/health", (_req, res) => {
  res.json({ status: "ok" });
});

/**
 * Validate the recommendation request body shape and ranges.
 *
 * @param {unknown} body - request body, expected to be an object with
 *   six finite-number fields.
 * @returns {boolean} true when every required field is a finite number
 *   and each business-rule check passes.
 */
function isValidRecommendationBody(body) {
  if (!body || typeof body !== "object") return false;
  const requiredKeys = [
    "currentMonthlyRevenue",
    "monthlyMarketingBudget",
    "monthlyGrowthPercentage",
    "roiPercentage",
    "projectedAnnualRevenue",
    "totalProfitOrLoss"
  ];
  for (const k of requiredKeys) {
    const v = body[k];
    if (typeof v !== "number" || !Number.isFinite(v)) return false;
  }
  if (body.currentMonthlyRevenue <= 0) return false;
  if (body.monthlyMarketingBudget <= 0) return false;
  if (body.monthlyGrowthPercentage < 0) return false;
  if (body.monthlyGrowthPercentage > 100) return false;
  return true;
}

/**
 * Build the messages array sent to the OpenAI chat completion API.
 * Keeps the prompt construction in one place so changes (and tests)
 * can target it. Numbers are formatted with one decimal place to
 * keep the prompt compact.
 *
 * @param {{
 *   currentMonthlyRevenue: number,
 *   monthlyMarketingBudget: number,
 *   monthlyGrowthPercentage: number,
 *   roiPercentage: number,
 *   projectedAnnualRevenue: number,
 *   totalProfitOrLoss: number
 * }} data
 * @returns {Array<{role: string, content: string}>}
 */
function buildRecommendationMessages(data) {
  const fmt = (n) => Number(n).toLocaleString("en-US", {
    maximumFractionDigits: 2
  });
  const system =
    "You are a pragmatic small-business marketing advisor. " +
    "Write a short recommendation (3 to 5 sentences) for a small " +
    "business owner based on the numbers provided. State plainly " +
    "that these are projections, not guarantees, and avoid " +
    "financial-advice language. Be practical and specific. Do not " +
    "use bullet points; write in plain prose.";
  const user =
    "Inputs (NIS): current monthly revenue " +
    fmt(data.currentMonthlyRevenue) +
    ", monthly marketing budget " +
    fmt(data.monthlyMarketingBudget) +
    ", expected monthly growth " +
    fmt(data.monthlyGrowthPercentage) +
    "%. Projected annual revenue " +
    fmt(data.projectedAnnualRevenue) +
    ", annual ROI " +
    fmt(data.roiPercentage) +
    "%, total projected profit or loss " +
    fmt(data.totalProfitOrLoss) +
    ". Give a short, practical recommendation.";
  return [
    { role: "system", content: system },
    { role: "user", content: user }
  ];
}

/**
 * POST /api/recommendation — call OpenAI and return a short
 * recommendation string. Returns:
 *   400 + { error } when the body fails validation,
 *   503 + { error } when no API key is configured,
 *   502 + { error } when the OpenAI call throws,
 *   200 + { recommendation } on success.
 */
app.post("/api/recommendation", async (req, res) => {
  if (!isValidRecommendationBody(req.body)) {
    return res
      .status(400)
      .json({ error: "Missing or invalid calculation data." });
  }

  const apiKey = process.env.OPENAI_API_KEY;
  if (
    !apiKey ||
    apiKey === "replace_this_with_your_real_api_key" ||
    apiKey.trim() === ""
  ) {
    return res.status(503).json({
      error:
        "AI recommendation is not configured. Add OPENAI_API_KEY to the server environment."
    });
  }

  try {
    const client = new OpenAI({ apiKey });
    const completion = await client.chat.completions.create({
      model: OPENAI_MODEL,
      messages: buildRecommendationMessages(req.body),
      temperature: 0.7,
      max_tokens: 300
    });
    const text = completion?.choices?.[0]?.message?.content?.trim();
    if (!text) {
      return res.status(502).json({
        error: "AI recommendation is temporarily unavailable. Try again later."
      });
    }
    return res.json({ recommendation: text });
  } catch (_err) {
    // Never leak raw OpenAI errors or stack traces to the browser.
    return res.status(502).json({
      error: "AI recommendation is temporarily unavailable. Try again later."
    });
  }
});

const PORT = Number(process.env.PORT) || 3000;

if (require.main === module) {
  app.listen(PORT, () => {
    console.log(`ROI calculator server listening on http://localhost:${PORT}`);
  });
}

module.exports = app;
