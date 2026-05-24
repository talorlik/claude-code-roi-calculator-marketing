/**
 * dom.js — DOM rendering helpers for the ROI calculator.
 *
 * Renders result cards, status messages, and toggles visibility of the
 * advanced action buttons. Reads no module-private state; all data is
 * passed in. Loaded as a classic <script> after calculator.js.
 */

(function (window) {
  "use strict";

  var formatNis = window.RoiCalculator.formatNis;
  var formatPercentage = window.RoiCalculator.formatPercentage;

  /**
   * Render the five required result cards into the container.
   *
   * @param {HTMLElement} container - element that holds the cards.
   * @param {object} results - calculation results from calculateRoi().
   */
  function renderResultCards(container, results) {
    var cards = [
      {
        label: "Projected revenue (3 months)",
        value: formatNis(results.projectedRevenue3Months)
      },
      {
        label: "Projected revenue (6 months)",
        value: formatNis(results.projectedRevenue6Months)
      },
      {
        label: "Projected revenue (12 months)",
        value: formatNis(results.projectedRevenue12Months)
      },
      {
        label: "ROI (annual)",
        value: formatPercentage(results.roiPercentage),
        accent: results.roiPercentage >= 0
      },
      {
        label: "Total profit or loss (annual)",
        value: formatNis(results.totalProfitOrLoss),
        accent: results.totalProfitOrLoss >= 0,
        negative: results.totalProfitOrLoss < 0
      }
    ];

    container.replaceChildren();
    cards.forEach(function (card) {
      var el = document.createElement("article");
      el.className = "result-card";
      if (card.accent) el.classList.add("result-card--accent");
      if (card.negative) el.classList.add("result-card--negative");

      var label = document.createElement("p");
      label.className = "result-card__label";
      label.textContent = card.label;
      var value = document.createElement("p");
      value.className = "result-card__value";
      value.textContent = card.value;

      el.appendChild(label);
      el.appendChild(value);
      container.appendChild(el);
    });
  }

  /**
   * Show a status message in the given element. Pass kind "error" or
   * "success" to color it; null/undefined clears the area.
   *
   * @param {HTMLElement} el - status container.
   * @param {string} message - text to display (multi-line allowed).
   * @param {"error"|"success"|null} [kind] - visual variant.
   */
  function setStatus(el, message, kind) {
    el.classList.remove("status--error", "status--success");
    if (!message) {
      el.textContent = "";
      return;
    }
    if (kind === "error") el.classList.add("status--error");
    if (kind === "success") el.classList.add("status--success");
    el.textContent = message;
  }

  /**
   * Reveal or hide the post-calculation UI sections and action
   * buttons. Idempotent.
   *
   * @param {object} els - keyed DOM references (see app.js bootstrap).
   * @param {boolean} visible - true after a successful calculation.
   */
  function setResultsVisible(els, visible) {
    [
      els.results,
      els.chartSection,
      els.advancedActions
    ].forEach(function (n) {
      if (n) n.hidden = !visible;
    });
    // Individual buttons keep their own hidden attribute so the
    // container can stay visible while a feature batch hasn't been
    // wired yet. After every successful calc, the buttons that are
    // ready get revealed by app.js.
  }

  /**
   * Show or hide an action button by id.
   *
   * @param {HTMLButtonElement} button
   * @param {boolean} visible
   */
  function setButtonVisible(button, visible) {
    if (!button) return;
    button.hidden = !visible;
  }

  /**
   * Render the AI recommendation text inside the recommendation card.
   * Pass an empty string to clear it.
   *
   * @param {HTMLElement} container - element that holds the text.
   * @param {string} text
   */
  function renderRecommendation(container, text) {
    container.textContent = text || "";
  }

  window.RoiDom = {
    renderResultCards: renderResultCards,
    setStatus: setStatus,
    setResultsVisible: setResultsVisible,
    setButtonVisible: setButtonVisible,
    renderRecommendation: renderRecommendation
  };
})(window);
