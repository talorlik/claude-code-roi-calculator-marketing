/**
 * api.js — thin client for the backend's /api/recommendation route.
 *
 * No OpenAI library, no API key — the browser only talks to our own
 * server. The key never reaches this code.
 */

(function (window) {
  "use strict";

  /**
   * Request an AI recommendation from the backend.
   *
   * @param {{
   *   currentMonthlyRevenue: number,
   *   monthlyMarketingBudget: number,
   *   monthlyGrowthPercentage: number,
   *   roiPercentage: number,
   *   projectedAnnualRevenue: number,
   *   totalProfitOrLoss: number
   * }} payload - the six fields the backend validates.
   * @returns {Promise<string>} resolves to the recommendation text on
   *   success. Rejects with an Error whose `.message` is a safe,
   *   user-facing string (no stack traces, no secrets).
   */
  async function fetchRecommendation(payload) {
    let res;
    try {
      res = await fetch("/api/recommendation", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      });
    } catch (_networkErr) {
      throw new Error(
        "Could not reach the server. Check your connection and try again."
      );
    }
    let body = null;
    try {
      body = await res.json();
    } catch (_parseErr) {
      // fall through
    }
    if (!res.ok) {
      var msg =
        (body && typeof body.error === "string" && body.error) ||
        "AI recommendation failed. Try again later.";
      throw new Error(msg);
    }
    if (!body || typeof body.recommendation !== "string") {
      throw new Error("AI recommendation failed. Try again later.");
    }
    return body.recommendation;
  }

  window.RoiApi = { fetchRecommendation: fetchRecommendation };
})(window);
