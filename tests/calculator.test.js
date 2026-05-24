/**
 * Unit tests for the pure ROI calculator logic.
 *
 * Loads public/js/calculator.js via the module.exports guard at the
 * bottom of that file. No DOM, no network, no OPENAI_API_KEY.
 */

"use strict";

const test = require("node:test");
const assert = require("node:assert/strict");

const calc = require("../public/js/calculator.js");

test("calculateRoi: reference scenario 50000 / 5000 / 10", () => {
  const r = calc.calculateRoi(50000, 5000, 10);

  // Spot-check shape and headline numbers from the spec.
  assert.equal(r.monthlySeries.length, 13);
  assert.equal(r.currentAnnualRevenue, 600000);
  assert.equal(r.annualMarketingBudget, 60000);
  // ((1.1)^12) * 50000 ≈ 156921.42
  assert.ok(Math.abs(r.projectedRevenue12Months - 156921.42) < 0.05);
  // (1.1)^3 * 50000 = 66550
  assert.ok(Math.abs(r.projectedRevenue3Months - 66550) < 0.0001);
  // (1.1)^6 * 50000 ≈ 88578.05
  assert.ok(Math.abs(r.projectedRevenue6Months - 88578.05) < 0.0001);
  // ROI ≈ 2038.43%
  assert.ok(Math.abs(r.roiPercentage - 2038.43) < 0.05);
  // Profit ≈ 1,223,057
  assert.ok(Math.abs(r.totalProfitOrLoss - 1223057) < 1);
});

test("calculateRoi: series is strictly increasing for positive growth", () => {
  const r = calc.calculateRoi(50000, 5000, 10);
  for (let i = 1; i < r.monthlySeries.length; i++) {
    assert.ok(
      r.monthlySeries[i] > r.monthlySeries[i - 1],
      `month ${i} should exceed month ${i - 1}`
    );
  }
});

test("calculateRoi: zero growth produces a flat series equal to current revenue", () => {
  const r = calc.calculateRoi(50000, 5000, 0);
  assert.equal(r.monthlySeries.length, 13);
  for (const v of r.monthlySeries) assert.equal(v, 50000);
  assert.equal(r.projectedAnnualRevenue, 600000);
  // ROI = (600000 - 600000 - 60000) / 60000 * 100 = -100
  assert.equal(r.roiPercentage, -100);
  assert.equal(r.totalProfitOrLoss, -60000);
});

test("calculateRoi: 100% growth is accepted at the boundary", () => {
  const r = calc.calculateRoi(50000, 5000, 100);
  // (1+1)^3 * 50000 = 400000
  assert.equal(r.projectedRevenue3Months, 400000);
  assert.equal(r.monthlySeries.length, 13);
});

test("validateInputs: reference scenario is valid", () => {
  const v = calc.validateInputs({
    currentMonthlyRevenue: 50000,
    monthlyMarketingBudget: 5000,
    monthlyGrowthPercentage: 10
  });
  assert.equal(v.valid, true);
  assert.deepEqual(v.errors, []);
});

test("validateInputs: revenue must be > 0", () => {
  for (const bad of [0, -1, NaN, Infinity, "abc"]) {
    const v = calc.validateInputs({
      currentMonthlyRevenue: typeof bad === "string" ? Number(bad) : bad,
      monthlyMarketingBudget: 5000,
      monthlyGrowthPercentage: 10
    });
    assert.equal(v.valid, false, `input ${bad} should be invalid`);
    assert.match(v.errors.join(" "), /revenue/i);
  }
});

test("validateInputs: budget must be > 0", () => {
  for (const bad of [0, -50, NaN, Infinity]) {
    const v = calc.validateInputs({
      currentMonthlyRevenue: 50000,
      monthlyMarketingBudget: bad,
      monthlyGrowthPercentage: 10
    });
    assert.equal(v.valid, false, `input ${bad} should be invalid`);
    assert.match(v.errors.join(" "), /budget/i);
  }
});

test("validateInputs: growth must be in [0, 100]", () => {
  for (const bad of [-1, 100.01, 150, NaN]) {
    const v = calc.validateInputs({
      currentMonthlyRevenue: 50000,
      monthlyMarketingBudget: 5000,
      monthlyGrowthPercentage: bad
    });
    assert.equal(v.valid, false, `growth ${bad} should be invalid`);
    assert.match(v.errors.join(" "), /growth/i);
  }
  // Boundaries are valid.
  for (const ok of [0, 100]) {
    const v = calc.validateInputs({
      currentMonthlyRevenue: 50000,
      monthlyMarketingBudget: 5000,
      monthlyGrowthPercentage: ok
    });
    assert.equal(v.valid, true, `growth ${ok} should be valid`);
  }
});

test("validateInputs: multiple errors are reported together", () => {
  const v = calc.validateInputs({
    currentMonthlyRevenue: -1,
    monthlyMarketingBudget: 0,
    monthlyGrowthPercentage: 200
  });
  assert.equal(v.valid, false);
  assert.equal(v.errors.length, 3);
});

test("formatNis returns a string with shekels and a number", () => {
  const s = calc.formatNis(50000);
  assert.equal(typeof s, "string");
  // Use a regex that accepts the locale's bidi marks but requires
  // some digits and the shekel sign.
  assert.match(s, /50,?000/);
  assert.match(s, /₪/);
});

test("formatPercentage shows sign for positives and includes %", () => {
  assert.equal(calc.formatPercentage(12.5), "+12.50%");
  assert.equal(calc.formatPercentage(-7), "-7.00%");
  assert.equal(calc.formatPercentage(0), "0.00%");
});
