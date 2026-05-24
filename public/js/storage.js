/**
 * storage.js — localStorage persistence and URL-param helpers.
 *
 * What is localStorage?
 *   It's a per-origin key/value store the browser keeps across page
 *   reloads. We use it to remember the user's last calculation so
 *   that refreshing the page or coming back later restores their
 *   work without re-entering numbers.
 *
 *   localStorage is plain-text and accessible to every script that
 *   runs on this origin. We MUST NOT store secrets here. The OpenAI
 *   API key never reaches the browser at all (the backend keeps it
 *   in process.env), so it does not appear in this file.
 *
 * Loaded as a classic <script> in the browser. URL-param helpers
 * (B9) are added alongside storage helpers so app.js can wire the
 * "URL params win over localStorage" precedence in one place.
 */

(function (window) {
  "use strict";

  /** Single source of truth for the storage key. */
  var STORAGE_KEY = "roiCalculatorState";

  /**
   * Persist the latest calculator state. Pass `null` for any field
   * that's currently unknown (e.g., `recommendation` until the user
   * runs the AI flow).
   *
   * @param {{
   *   inputs: object | null,
   *   results: object | null,
   *   recommendation: string | null
   * }} payload
   */
  function saveState(payload) {
    try {
      var snapshot = {
        inputs: payload.inputs || null,
        results: payload.results || null,
        recommendation: payload.recommendation || null
      };
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(snapshot));
    } catch (_err) {
      // localStorage can throw in private modes or when full. We
      // intentionally swallow — persistence is best-effort UX.
    }
  }

  /**
   * Read the latest persisted state.
   *
   * @returns {{inputs: object|null, results: object|null, recommendation: string|null} | null}
   *   the stored snapshot, or null if nothing is stored / the value
   *   is corrupt.
   */
  function loadState() {
    try {
      var raw = window.localStorage.getItem(STORAGE_KEY);
      if (!raw) return null;
      var parsed = JSON.parse(raw);
      if (!parsed || typeof parsed !== "object") return null;
      return {
        inputs: parsed.inputs || null,
        results: parsed.results || null,
        recommendation:
          typeof parsed.recommendation === "string"
            ? parsed.recommendation
            : null
      };
    } catch (_err) {
      return null;
    }
  }

  /**
   * Remove the persisted snapshot.
   */
  function clearState() {
    try {
      window.localStorage.removeItem(STORAGE_KEY);
    } catch (_err) {
      // ignore
    }
  }

  /** Query param names for shareable URLs (B9). */
  var URL_PARAMS = {
    revenue: "revenue",
    budget: "budget",
    growth: "growth"
  };

  /**
   * Build a shareable URL containing the three inputs as query
   * parameters. Uses the current origin + pathname so the URL works
   * in the same place the calculator is hosted.
   *
   * @param {{
   *   currentMonthlyRevenue: number,
   *   monthlyMarketingBudget: number,
   *   monthlyGrowthPercentage: number
   * }} inputs
   * @returns {string} the share URL.
   */
  function buildShareUrl(inputs) {
    var loc = window.location;
    var url = new URL(loc.pathname, loc.origin);
    var p = new URLSearchParams();
    p.set(URL_PARAMS.revenue, String(inputs.currentMonthlyRevenue));
    p.set(URL_PARAMS.budget, String(inputs.monthlyMarketingBudget));
    p.set(URL_PARAMS.growth, String(inputs.monthlyGrowthPercentage));
    url.search = p.toString();
    return url.toString();
  }

  /**
   * Parse and validate the three input fields from the current page
   * URL. Returns null if any expected param is missing, non-numeric,
   * or outside its allowed range.
   *
   * @returns {{
   *   currentMonthlyRevenue: number,
   *   monthlyMarketingBudget: number,
   *   monthlyGrowthPercentage: number
   * } | null}
   */
  function parseInputsFromUrl() {
    var p = new URLSearchParams(window.location.search);
    if (
      !p.has(URL_PARAMS.revenue) ||
      !p.has(URL_PARAMS.budget) ||
      !p.has(URL_PARAMS.growth)
    ) {
      return null;
    }
    var rev = Number(p.get(URL_PARAMS.revenue));
    var bud = Number(p.get(URL_PARAMS.budget));
    var gro = Number(p.get(URL_PARAMS.growth));
    if (!Number.isFinite(rev) || rev <= 0) return null;
    if (!Number.isFinite(bud) || bud <= 0) return null;
    if (!Number.isFinite(gro) || gro < 0 || gro > 100) return null;
    return {
      currentMonthlyRevenue: rev,
      monthlyMarketingBudget: bud,
      monthlyGrowthPercentage: gro
    };
  }

  /**
   * Copy text to the clipboard using the async Clipboard API, with a
   * synchronous textarea fallback for older browsers / insecure
   * contexts. Resolves true on success, false otherwise — the caller
   * is responsible for showing the URL inline when this returns
   * false so the user can copy it manually.
   *
   * @param {string} text
   * @returns {Promise<boolean>}
   */
  async function copyToClipboard(text) {
    if (
      window.navigator &&
      window.navigator.clipboard &&
      window.isSecureContext
    ) {
      try {
        await window.navigator.clipboard.writeText(text);
        return true;
      } catch (_err) {
        // fall through to legacy fallback
      }
    }
    try {
      var ta = document.createElement("textarea");
      ta.value = text;
      ta.setAttribute("readonly", "");
      ta.style.position = "fixed";
      ta.style.top = "-9999px";
      document.body.appendChild(ta);
      ta.select();
      var ok = document.execCommand("copy");
      document.body.removeChild(ta);
      return ok;
    } catch (_err2) {
      return false;
    }
  }

  window.RoiStorage = {
    STORAGE_KEY: STORAGE_KEY,
    saveState: saveState,
    loadState: loadState,
    clearState: clearState,
    URL_PARAMS: URL_PARAMS,
    buildShareUrl: buildShareUrl,
    parseInputsFromUrl: parseInputsFromUrl,
    copyToClipboard: copyToClipboard
  };
})(window);
