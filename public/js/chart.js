/**
 * chart.js — Chart.js rendering for the projected revenue line chart.
 *
 * Loaded after the Chart.js CDN script and after js/calculator.js.
 * Exposes window.RoiChart with renderChart() and destroyChart().
 */

(function (window) {
  "use strict";

  /** @type {import("chart.js").Chart | null} */
  var instance = null;

  /**
   * Render (or re-render) the revenue line chart on the given canvas.
   * Destroys any prior Chart.js instance first so we never stack two
   * charts on the same canvas.
   *
   * @param {HTMLCanvasElement} canvas - target canvas element.
   * @param {object} results - calculation results from calculateRoi();
   *   uses `monthlySeries` (length 13) for the projected line.
   * @param {number} currentMonthlyRevenue - the baseline value,
   *   repeated 13 times for the flat baseline series.
   * @returns {void}
   */
  function renderChart(canvas, results, currentMonthlyRevenue) {
    if (typeof window.Chart === "undefined") {
      console.warn("Chart.js not loaded; skipping chart render.");
      return;
    }
    destroyChart();

    var labels = [];
    for (var m = 0; m <= 12; m++) labels.push(String(m));

    var baseline = new Array(13).fill(currentMonthlyRevenue);

    instance = new window.Chart(canvas, {
      type: "line",
      data: {
        labels: labels,
        datasets: [
          {
            label: "Current revenue baseline",
            data: baseline,
            borderColor: "#2563eb",
            backgroundColor: "rgba(37, 99, 235, 0.15)",
            borderWidth: 2,
            tension: 0,
            pointRadius: 0
          },
          {
            label: "Projected revenue",
            data: results.monthlySeries,
            borderColor: "#16a34a",
            backgroundColor: "rgba(22, 163, 74, 0.15)",
            borderWidth: 2,
            tension: 0.25,
            pointRadius: 3
          }
        ]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        interaction: { mode: "index", intersect: false },
        scales: {
          x: { title: { display: true, text: "Month" } },
          y: {
            title: { display: true, text: "Revenue (NIS)" },
            ticks: {
              callback: function (value) {
                return window.RoiCalculator.formatNis(Number(value));
              }
            }
          }
        },
        plugins: {
          legend: { position: "bottom" },
          tooltip: {
            callbacks: {
              label: function (ctx) {
                var v = Number(ctx.parsed.y);
                return ctx.dataset.label + ": " +
                  window.RoiCalculator.formatNis(v);
              }
            }
          }
        }
      }
    });
  }

  /**
   * Destroy the current chart instance, if any. Idempotent.
   */
  function destroyChart() {
    if (instance) {
      instance.destroy();
      instance = null;
    }
  }

  /**
   * @returns {boolean} true while a chart instance is mounted.
   */
  function hasChart() {
    return !!instance;
  }

  /**
   * Return the chart canvas as a PNG data URL, or null if no chart
   * is currently rendered. Used by PDF export in B8.
   *
   * @returns {string|null}
   */
  function getChartImage() {
    if (!instance) return null;
    try {
      return instance.toBase64Image("image/png");
    } catch (err) {
      console.warn("Chart image export failed:", err);
      return null;
    }
  }

  window.RoiChart = {
    renderChart: renderChart,
    destroyChart: destroyChart,
    hasChart: hasChart,
    getChartImage: getChartImage
  };
})(window);
