/**
 * calculator.js — pure ROI calculation, validation, and formatting.
 *
 * No DOM access here. Loaded as a classic <script> in the browser
 * (exposes window.RoiCalculator) and also require()-able from
 * node:test in tests/calculator.test.js via the module.exports guard
 * at the bottom of the file.
 */

(function (root) {
  "use strict";

  /** Number of months in the projection horizon, inclusive (0..12). */
  var MONTHS = 12;

  /**
   * Read the three numeric inputs from the form element.
   *
   * @param {HTMLFormElement} form - the ROI input form.
   * @returns {{currentMonthlyRevenue: number, monthlyMarketingBudget: number, monthlyGrowthPercentage: number}}
   *   Parsed numbers. Empty or non-numeric fields are coerced to NaN
   *   so validateInputs() can reject them with a clear message.
   */
  function parseInputs(form) {
    var data = new FormData(form);
    return {
      currentMonthlyRevenue: toNumber(data.get("currentMonthlyRevenue")),
      monthlyMarketingBudget: toNumber(data.get("monthlyMarketingBudget")),
      monthlyGrowthPercentage: toNumber(data.get("monthlyGrowthPercentage"))
    };
  }

  /**
   * Coerce a form value to a finite number, or NaN if it isn't one.
   * Empty strings become NaN (we want validation to flag them).
   *
   * @param {unknown} value
   * @returns {number}
   */
  function toNumber(value) {
    if (value === null || value === undefined) return NaN;
    var s = String(value).trim();
    if (s === "") return NaN;
    var n = Number(s);
    return Number.isFinite(n) ? n : NaN;
  }

  /**
   * Validate the three ROI inputs against the assignment rules:
   *   - currentMonthlyRevenue > 0
   *   - monthlyMarketingBudget > 0
   *   - monthlyGrowthPercentage in [0, 100]
   * All values must be finite numbers.
   *
   * @param {{currentMonthlyRevenue: number, monthlyMarketingBudget: number, monthlyGrowthPercentage: number}} inputs
   * @returns {{valid: boolean, errors: string[]}}
   */
  function validateInputs(inputs) {
    var errors = [];
    var rev = inputs.currentMonthlyRevenue;
    var bud = inputs.monthlyMarketingBudget;
    var gro = inputs.monthlyGrowthPercentage;

    if (!Number.isFinite(rev) || rev <= 0) {
      errors.push("Current monthly revenue must be a number greater than 0.");
    }
    if (!Number.isFinite(bud) || bud <= 0) {
      errors.push("Monthly marketing budget must be a number greater than 0.");
    }
    if (!Number.isFinite(gro) || gro < 0 || gro > 100) {
      errors.push(
        "Estimated monthly growth percentage must be a number between 0 and 100."
      );
    }
    return { valid: errors.length === 0, errors: errors };
  }

  /**
   * Run the ROI projection.
   *
   * Formulas (verbatim from the spec):
   *   Projected revenue after N months
   *     = current monthly revenue * (1 + growth percentage / 100) ^ N
   *   Current annual revenue
   *     = current monthly revenue * 12
   *   Annual marketing budget
   *     = monthly marketing budget * 12
   *   Projected annual revenue
   *     = projected revenue after 12 months * 12
   *   ROI
   *     = ((projected annual revenue - current annual revenue
   *         - annual marketing budget) / annual marketing budget) * 100
   *   Total profit or loss
   *     = projected annual revenue - current annual revenue
   *       - annual marketing budget
   *
   * Inputs are assumed to be already validated by validateInputs().
   *
   * @param {number} currentMonthlyRevenue - in NIS, > 0.
   * @param {number} monthlyMarketingBudget - in NIS, > 0.
   * @param {number} monthlyGrowthPercentage - percent, in [0, 100].
   * @returns {{
   *   projectedRevenue3Months: number,
   *   projectedRevenue6Months: number,
   *   projectedRevenue12Months: number,
   *   currentAnnualRevenue: number,
   *   projectedAnnualRevenue: number,
   *   annualMarketingBudget: number,
   *   roiPercentage: number,
   *   totalProfitOrLoss: number,
   *   monthlySeries: number[]
   * }}
   */
  function calculateRoi(
    currentMonthlyRevenue,
    monthlyMarketingBudget,
    monthlyGrowthPercentage
  ) {
    var growthFactor = 1 + monthlyGrowthPercentage / 100;
    var projected = function (n) {
      return currentMonthlyRevenue * Math.pow(growthFactor, n);
    };

    var monthlySeries = [];
    for (var m = 0; m <= MONTHS; m++) {
      monthlySeries.push(projected(m));
    }

    var projectedRevenue12Months = projected(MONTHS);
    var currentAnnualRevenue = currentMonthlyRevenue * 12;
    var projectedAnnualRevenue = projectedRevenue12Months * 12;
    var annualMarketingBudget = monthlyMarketingBudget * 12;

    var netGain =
      projectedAnnualRevenue - currentAnnualRevenue - annualMarketingBudget;
    var roiPercentage = (netGain / annualMarketingBudget) * 100;

    return {
      projectedRevenue3Months: projected(3),
      projectedRevenue6Months: projected(6),
      projectedRevenue12Months: projectedRevenue12Months,
      currentAnnualRevenue: currentAnnualRevenue,
      projectedAnnualRevenue: projectedAnnualRevenue,
      annualMarketingBudget: annualMarketingBudget,
      roiPercentage: roiPercentage,
      totalProfitOrLoss: netGain,
      monthlySeries: monthlySeries
    };
  }

  var nisFormatter = new Intl.NumberFormat("he-IL", {
    style: "currency",
    currency: "ILS",
    maximumFractionDigits: 0
  });

  /**
   * Format a NIS money amount using the he-IL locale.
   *
   * @param {number} amount - amount in shekels.
   * @returns {string} localized currency string, e.g. "‏50,000 ₪".
   */
  function formatNis(amount) {
    if (!Number.isFinite(amount)) return "—";
    return nisFormatter.format(amount);
  }

  /**
   * Format a number as a percentage with 2 decimal places.
   *
   * @param {number} value - the percentage (e.g. 12.5 → "12.50%").
   * @returns {string}
   */
  function formatPercentage(value) {
    if (!Number.isFinite(value)) return "—";
    var sign = value > 0 ? "+" : "";
    return sign + value.toFixed(2) + "%";
  }

  var api = {
    parseInputs: parseInputs,
    validateInputs: validateInputs,
    calculateRoi: calculateRoi,
    formatNis: formatNis,
    formatPercentage: formatPercentage,
    MONTHS: MONTHS
  };

  // Browser global.
  if (root) {
    root.RoiCalculator = api;
  }

  // Node test harness.
  if (typeof module !== "undefined" && module.exports) {
    module.exports = api;
  }
})(typeof window !== "undefined" ? window : null);
