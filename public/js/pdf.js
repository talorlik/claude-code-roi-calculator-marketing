/**
 * pdf.js — jsPDF report generator for the ROI calculator.
 *
 * Loaded after the jsPDF CDN script and after js/calculator.js +
 * js/chart.js. Exposes window.RoiPdf.generateReport(state).
 *
 * Never writes secrets (e.g. the OpenAI API key) into the PDF — the
 * browser never holds the key at all, so this is automatic.
 */

(function (window) {
  "use strict";

  /** PDF filename mandated by the assignment. */
  var PDF_FILENAME = "marketing-roi-report.pdf";

  /** Page margin in mm. */
  var MARGIN = 16;

  /**
   * Generate and download the PDF report from current app state.
   *
   * @param {{
   *   inputs: object | null,
   *   results: object | null,
   *   recommendation: string | null
   * }} state - the in-memory app state.
   * @returns {{ok: boolean, message?: string}} on failure, includes a
   *   user-facing message; on success, ok = true.
   */
  function generateReport(state) {
    if (!state || !state.inputs || !state.results) {
      return {
        ok: false,
        message:
          "Calculate ROI before downloading a report — there's nothing to export yet."
      };
    }
    var jsPDFCtor = resolveJsPdfConstructor();
    if (!jsPDFCtor) {
      return {
        ok: false,
        message:
          "PDF library could not be loaded. Check your network connection and retry."
      };
    }

    var fmtNis = window.RoiCalculator.formatNis;
    var fmtPct = window.RoiCalculator.formatPercentage;

    var doc = new jsPDFCtor({ unit: "mm", format: "a4" });
    var pageWidth = doc.internal.pageSize.getWidth();
    var pageHeight = doc.internal.pageSize.getHeight();
    var contentWidth = pageWidth - MARGIN * 2;
    var y = MARGIN;

    // Title
    doc.setFont("helvetica", "bold");
    doc.setFontSize(18);
    doc.text("Digital Marketing ROI Report", MARGIN, y);
    y += 8;

    // Generated date
    doc.setFont("helvetica", "normal");
    doc.setFontSize(10);
    doc.setTextColor(90, 90, 90);
    doc.text(
      "Generated " + new Date().toLocaleString(),
      MARGIN,
      y
    );
    doc.setTextColor(20, 20, 20);
    y += 8;

    // Inputs
    y = sectionHeading(doc, "Inputs", y);
    y = labeledRow(
      doc,
      "Current monthly revenue",
      fmtNis(state.inputs.currentMonthlyRevenue),
      y
    );
    y = labeledRow(
      doc,
      "Monthly marketing budget",
      fmtNis(state.inputs.monthlyMarketingBudget),
      y
    );
    y = labeledRow(
      doc,
      "Estimated monthly growth",
      fmtPct(state.inputs.monthlyGrowthPercentage).replace("+", ""),
      y
    );
    y += 4;

    // Results
    y = sectionHeading(doc, "Results", y);
    y = labeledRow(
      doc,
      "Projected revenue (3 months)",
      fmtNis(state.results.projectedRevenue3Months),
      y
    );
    y = labeledRow(
      doc,
      "Projected revenue (6 months)",
      fmtNis(state.results.projectedRevenue6Months),
      y
    );
    y = labeledRow(
      doc,
      "Projected revenue (12 months)",
      fmtNis(state.results.projectedRevenue12Months),
      y
    );
    y = labeledRow(
      doc,
      "Projected annual revenue",
      fmtNis(state.results.projectedAnnualRevenue),
      y
    );
    y = labeledRow(
      doc,
      "Annual marketing budget",
      fmtNis(state.results.annualMarketingBudget),
      y
    );
    y = labeledRow(doc, "ROI (annual)", fmtPct(state.results.roiPercentage), y);
    y = labeledRow(
      doc,
      "Total profit or loss (annual)",
      fmtNis(state.results.totalProfitOrLoss),
      y
    );
    y += 4;

    // Recommendation (optional)
    if (state.recommendation) {
      y = sectionHeading(doc, "AI recommendation", y);
      doc.setFont("helvetica", "normal");
      doc.setFontSize(11);
      var wrapped = doc.splitTextToSize(state.recommendation, contentWidth);
      y = ensureRoom(doc, y, wrapped.length * 5 + 4);
      doc.text(wrapped, MARGIN, y);
      y += wrapped.length * 5 + 4;
    }

    // Chart image (optional)
    var chartImg =
      window.RoiChart && typeof window.RoiChart.getChartImage === "function"
        ? safeChartImage()
        : null;
    if (chartImg) {
      y = sectionHeading(doc, "Revenue projection", y);
      var imgW = contentWidth;
      var imgH = imgW * (9 / 16);
      y = ensureRoom(doc, y, imgH + 4);
      try {
        doc.addImage(chartImg, "PNG", MARGIN, y, imgW, imgH);
        y += imgH + 4;
      } catch (_err) {
        // Skip the chart silently rather than failing the whole PDF.
      }
    }

    // Disclaimer
    y = ensureRoom(doc, y, 12);
    doc.setFont("helvetica", "italic");
    doc.setFontSize(9);
    doc.setTextColor(90, 90, 90);
    doc.text(
      doc.splitTextToSize(
        "These figures are projections, not guarantees. They depend on " +
          "the inputs above and on real-world conditions outside the " +
          "model.",
        contentWidth
      ),
      MARGIN,
      y
    );
    void pageHeight; // pageHeight referenced through ensureRoom

    doc.save(PDF_FILENAME);
    return { ok: true };
  }

  /**
   * Locate jsPDF's constructor across the two UMD shapes it ships
   * under: `window.jspdf.jsPDF` (current builds) and `window.jsPDF`
   * (older builds).
   *
   * @returns {Function | null}
   */
  function resolveJsPdfConstructor() {
    if (window.jspdf && window.jspdf.jsPDF) return window.jspdf.jsPDF;
    if (window.jsPDF) return window.jsPDF;
    return null;
  }

  /**
   * Pull the chart canvas as a PNG data URL, swallowing any failure
   * so the PDF can still be generated without the chart.
   *
   * @returns {string | null}
   */
  function safeChartImage() {
    try {
      return window.RoiChart.getChartImage();
    } catch (_err) {
      return null;
    }
  }

  /**
   * Write a bold section heading at the current y and return the new
   * y position (heading + small gap).
   *
   * @param {object} doc - jsPDF document.
   * @param {string} text
   * @param {number} y
   * @returns {number}
   */
  function sectionHeading(doc, text, y) {
    y = ensureRoom(doc, y, 10);
    doc.setFont("helvetica", "bold");
    doc.setFontSize(13);
    doc.setTextColor(37, 99, 235); // primary blue
    doc.text(text, MARGIN, y);
    doc.setTextColor(20, 20, 20);
    return y + 6;
  }

  /**
   * Write a single "Label: value" row in 11pt and return the new y.
   *
   * @param {object} doc
   * @param {string} label
   * @param {string} value
   * @param {number} y
   * @returns {number}
   */
  function labeledRow(doc, label, value, y) {
    y = ensureRoom(doc, y, 6);
    doc.setFont("helvetica", "normal");
    doc.setFontSize(11);
    doc.text(label + ":", MARGIN, y);
    doc.setFont("helvetica", "bold");
    doc.text(value, MARGIN + 80, y);
    return y + 6;
  }

  /**
   * Add a new page if `needed` mm wouldn't fit before the bottom
   * margin, and return the y position at which to continue drawing.
   *
   * @param {object} doc
   * @param {number} y
   * @param {number} needed
   * @returns {number}
   */
  function ensureRoom(doc, y, needed) {
    var pageHeight = doc.internal.pageSize.getHeight();
    if (y + needed > pageHeight - MARGIN) {
      doc.addPage();
      return MARGIN;
    }
    return y;
  }

  window.RoiPdf = {
    generateReport: generateReport,
    PDF_FILENAME: PDF_FILENAME
  };
})(window);
