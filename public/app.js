/**
 * app.js — frontend entry / event wiring for the ROI calculator.
 *
 * Loads after public/js/{calculator,chart,dom,storage,api}.js.
 * Holds the in-memory app state used by every feature (chart, AI,
 * PDF, localStorage, sharing) and is the single place that decides
 * what is visible on screen.
 */

(function (window, document) {
  "use strict";

  /** Latest valid calculation, or null if no successful calc yet. */
  var state = {
    inputs: null,
    results: null,
    recommendation: null
  };

  /** DOM handles — resolved once on DOMContentLoaded. */
  var els = {};

  document.addEventListener("DOMContentLoaded", function () {
    els = {
      form: document.getElementById("roi-form"),
      status: document.getElementById("status"),
      results: document.getElementById("results"),
      resultCards: document.getElementById("result-cards"),
      chartSection: document.getElementById("chart-section"),
      chartCanvas: document.getElementById("revenue-chart"),
      aiSection: document.getElementById("ai-section"),
      aiRecommendation: document.getElementById("ai-recommendation"),
      advancedActions: document.getElementById("advanced-actions"),
      btnAi: document.getElementById("btn-ai"),
      btnPdf: document.getElementById("btn-pdf"),
      btnShare: document.getElementById("btn-share"),
      btnReset: document.getElementById("btn-reset"),
      revenueInput: document.getElementById("currentMonthlyRevenue"),
      budgetInput: document.getElementById("monthlyMarketingBudget"),
      growthInput: document.getElementById("monthlyGrowthPercentage")
    };

    if (!els.form) {
      console.warn("ROI calculator: form not found.");
      return;
    }

    els.form.addEventListener("submit", onSubmit);
    if (els.btnAi) els.btnAi.addEventListener("click", onRequestRecommendation);
    if (els.btnPdf) els.btnPdf.addEventListener("click", onDownloadPdf);
    if (els.btnShare) els.btnShare.addEventListener("click", onShare);
    if (els.btnReset) els.btnReset.addEventListener("click", onReset);

    restoreOnLoad();
  });

  /**
   * Form-submit handler: parse, validate, compute, render, persist.
   *
   * @param {SubmitEvent} event
   */
  function onSubmit(event) {
    event.preventDefault();
    var calc = window.RoiCalculator;
    var dom = window.RoiDom;

    var inputs = calc.parseInputs(els.form);
    var validation = calc.validateInputs(inputs);

    if (!validation.valid) {
      dom.setStatus(els.status, validation.errors.join(" "), "error");
      hideResultsUi(dom);
      window.RoiChart && window.RoiChart.destroyChart();
      state.inputs = null;
      state.results = null;
      state.recommendation = null;
      dom.renderRecommendation(els.aiRecommendation, "");
      return;
    }

    var results = calc.calculateRoi(
      inputs.currentMonthlyRevenue,
      inputs.monthlyMarketingBudget,
      inputs.monthlyGrowthPercentage
    );

    state.inputs = inputs;
    state.results = results;
    // A fresh calculation invalidates any earlier AI recommendation.
    state.recommendation = null;
    dom.renderRecommendation(els.aiRecommendation, "");
    if (els.aiSection) els.aiSection.hidden = true;

    dom.setStatus(els.status, "", null);
    renderState(true);
    persist();
  }

  /**
   * Hide the post-calculation UI (results, chart, AI, action buttons).
   *
   * @param {object} dom - the RoiDom helper module.
   */
  function hideResultsUi(dom) {
    dom.setResultsVisible(els, false);
    if (els.aiSection) els.aiSection.hidden = true;
    [els.btnAi, els.btnPdf, els.btnShare, els.btnReset].forEach(function (b) {
      dom.setButtonVisible(b, false);
    });
  }

  /**
   * Reveal action buttons whose underlying features are wired. Each
   * batch updates this allowlist as it lands.
   *
   * All four are wired now: AI (B6), Reset (B7), PDF (B8), Share (B9).
   *
   * @param {object} dom - the RoiDom helper module.
   */
  function revealReadyButtons(dom) {
    dom.setButtonVisible(els.btnAi, true);
    dom.setButtonVisible(els.btnPdf, true);
    dom.setButtonVisible(els.btnShare, true);
    dom.setButtonVisible(els.btnReset, true);
  }

  /**
   * Render the current `state` into the DOM (cards + chart + optional
   * recommendation). Used by both the submit handler and the initial
   * localStorage restore so they stay in sync.
   *
   * @param {boolean} renderChart - whether to (re)render the chart.
   *   Always true today; the parameter is kept so future call sites
   *   can opt out for performance reasons.
   */
  function renderState(renderChart) {
    var dom = window.RoiDom;
    if (!state.results) return;
    dom.renderResultCards(els.resultCards, state.results);
    dom.setResultsVisible(els, true);
    if (renderChart && window.RoiChart && els.chartCanvas) {
      window.RoiChart.renderChart(
        els.chartCanvas,
        state.results,
        state.inputs.currentMonthlyRevenue
      );
    }
    if (state.recommendation && els.aiSection) {
      els.aiSection.hidden = false;
      dom.renderRecommendation(els.aiRecommendation, state.recommendation);
    }
    revealReadyButtons(dom);
  }

  /**
   * Click handler for the Get AI Recommendation button. Sends the
   * latest valid calculation to the backend, shows a loading state,
   * and renders either the recommendation or a safe error.
   *
   * @returns {Promise<void>}
   */
  async function onRequestRecommendation() {
    var dom = window.RoiDom;
    if (!state.results || !state.inputs) return;
    if (els.btnAi.disabled) return;

    var payload = {
      currentMonthlyRevenue: state.inputs.currentMonthlyRevenue,
      monthlyMarketingBudget: state.inputs.monthlyMarketingBudget,
      monthlyGrowthPercentage: state.inputs.monthlyGrowthPercentage,
      roiPercentage: state.results.roiPercentage,
      projectedAnnualRevenue: state.results.projectedAnnualRevenue,
      totalProfitOrLoss: state.results.totalProfitOrLoss
    };

    var prevLabel = els.btnAi.textContent;
    els.btnAi.disabled = true;
    els.btnAi.setAttribute("aria-busy", "true");
    els.btnAi.textContent = "Generating recommendation…";
    if (els.aiSection) els.aiSection.hidden = false;
    dom.renderRecommendation(
      els.aiRecommendation,
      "Generating recommendation…"
    );
    dom.setStatus(els.status, "", null);

    try {
      var text = await window.RoiApi.fetchRecommendation(payload);
      state.recommendation = text;
      dom.renderRecommendation(els.aiRecommendation, text);
      persist();
    } catch (err) {
      state.recommendation = null;
      dom.renderRecommendation(els.aiRecommendation, "");
      if (els.aiSection) els.aiSection.hidden = true;
      dom.setStatus(els.status, err.message, "error");
    } finally {
      els.btnAi.disabled = false;
      els.btnAi.removeAttribute("aria-busy");
      els.btnAi.textContent = prevLabel;
    }
  }

  /**
   * Click handler for the Download PDF Report button.
   */
  function onDownloadPdf() {
    var dom = window.RoiDom;
    if (!window.RoiPdf) {
      dom.setStatus(
        els.status,
        "PDF export is not available.",
        "error"
      );
      return;
    }
    var outcome = window.RoiPdf.generateReport(state);
    if (!outcome.ok) {
      dom.setStatus(els.status, outcome.message, "error");
    }
  }

  /**
   * Click handler for the Share Results button. Builds a shareable
   * URL from current state, copies it to the clipboard, and shows a
   * success status. If the clipboard write fails, the URL is shown
   * inline so the user can copy it manually.
   *
   * @returns {Promise<void>}
   */
  async function onShare() {
    var dom = window.RoiDom;
    if (!state.inputs) return;
    var url = window.RoiStorage.buildShareUrl(state.inputs);
    var copied = await window.RoiStorage.copyToClipboard(url);
    if (copied) {
      dom.setStatus(
        els.status,
        "Share link copied to clipboard.",
        "success"
      );
    } else {
      dom.setStatus(
        els.status,
        "Copy failed. Use this URL: " + url,
        "success"
      );
    }
  }

  /**
   * Click handler for the Reset button. Clears in-memory state,
   * localStorage, the form, the result cards, the chart, the AI
   * recommendation, status messages, and hides advanced buttons.
   */
  function onReset() {
    var dom = window.RoiDom;
    state = { inputs: null, results: null, recommendation: null };
    window.RoiStorage && window.RoiStorage.clearState();
    els.form.reset();
    dom.setStatus(els.status, "", null);
    dom.renderRecommendation(els.aiRecommendation, "");
    hideResultsUi(dom);
    window.RoiChart && window.RoiChart.destroyChart();
  }

  /**
   * Save the latest state to localStorage. Called after every
   * successful calculation and after each successful AI fetch.
   * Best-effort — failures are silently swallowed by the storage
   * helper.
   */
  function persist() {
    if (!window.RoiStorage) return;
    window.RoiStorage.saveState({
      inputs: state.inputs,
      results: state.results,
      recommendation: state.recommendation
    });
  }

  /**
   * Restore state on page load. URL query parameters take priority
   * over localStorage so a shared link always wins.
   *
   * URL path: parse + validate → fill form → calculate → render +
   *   persist (so subsequent loads from this device remember it).
   * localStorage path: read the snapshot → fill form → render the
   *   stored results (no recalculation).
   */
  function restoreOnLoad() {
    if (!window.RoiStorage) return;

    var fromUrl = window.RoiStorage.parseInputsFromUrl();
    if (fromUrl) {
      fillForm(fromUrl);
      var results = window.RoiCalculator.calculateRoi(
        fromUrl.currentMonthlyRevenue,
        fromUrl.monthlyMarketingBudget,
        fromUrl.monthlyGrowthPercentage
      );
      state.inputs = fromUrl;
      state.results = results;
      state.recommendation = null;
      renderState(true);
      persist();
      return;
    }

    var snap = window.RoiStorage.loadState();
    if (!snap || !snap.inputs || !snap.results) return;

    fillForm(snap.inputs);
    state.inputs = snap.inputs;
    state.results = snap.results;
    state.recommendation = snap.recommendation;
    renderState(true);
  }

  /**
   * Populate the three form inputs from an inputs object.
   *
   * @param {{
   *   currentMonthlyRevenue: number,
   *   monthlyMarketingBudget: number,
   *   monthlyGrowthPercentage: number
   * }} inputs
   */
  function fillForm(inputs) {
    if (els.revenueInput)
      els.revenueInput.value = String(inputs.currentMonthlyRevenue);
    if (els.budgetInput)
      els.budgetInput.value = String(inputs.monthlyMarketingBudget);
    if (els.growthInput)
      els.growthInput.value = String(inputs.monthlyGrowthPercentage);
  }

  // Public surface for later batches.
  window.RoiApp = {
    getState: function () {
      return state;
    },
    _setState: function (next) {
      state = next;
    }
  };
})(window, document);
