# E2E and Manual QA Checklist

Use this checklist before submitting. Run through it in a fresh browser
tab with the dev server running. All boxes should be ticked or carry a
written note explaining why a check was skipped.

## 1. Environment Setup

- [x] `npm install` completes without errors.
- [x] `.env` exists locally with `OPENAI_API_KEY` set (not committed).
- [x] `npm run dev` starts the server with no errors.
- [x] App opens at `http://localhost:3000` and the form is visible.

## 2. Valid Calculation Flow

Inputs:

```text
Current monthly revenue: 50000
Monthly marketing budget: 5000
Estimated monthly growth: 10
```

- [x] Five result cards render after clicking `Calculate ROI`.
- [x] Money values are formatted as NIS (e.g. `66,550 ₪`,
      `1,223,057 ₪`).
- [x] ROI is shown as a signed percentage (e.g. `+2038.43%`).
- [x] `Get AI Recommendation`, `Download PDF Report`,
      `Share Results`, and `Reset` buttons all become visible.

## 3. Invalid Input Flow

For each row, expect a clear, specific error in the status area and no
result cards or chart:

- [x] All three fields empty.
- [x] Revenue = 0.
- [x] Budget = -1.
- [x] Growth = -5.
- [x] Growth = 150.
- [x] Non-numeric values (e.g. "abc" via dev tools) rejected.

## 4. Chart Flow

- [x] Chart appears immediately after a valid calculation.
- [x] Blue baseline line is flat at `currentMonthlyRevenue`; green
      projected line follows the growth curve.
- [x] Recalculating with different inputs updates the chart in place;
      `document.querySelectorAll("canvas").length` stays at 1.
- [x] Y-axis tick labels use NIS formatting.

## 5. AI Recommendation Flow

- [x] `Get AI Recommendation` is hidden before any calculation, and
      appears only after a successful one.
- [x] Clicking the button disables it and shows
      "Generating recommendation…" while pending.
- [x] On success, a short prose recommendation appears in the
      `AI recommendation` section below the chart.
- [x] The recommendation mentions that the figures are projections
      (not guarantees) per the system prompt.
- [x] On failure (e.g. without an API key set on the server), the
      safe error message appears in the status area and the section
      does not get stuck in a loading state.
- [x] Inspecting `public/` source confirms no API key is present
      anywhere in frontend code or runtime DOM.

## 6. localStorage Flow

- [x] After a calculation, `localStorage.roiCalculatorState` contains
      a JSON snapshot with `inputs`, `results`, and (optionally)
      `recommendation`.
- [x] Refreshing the page restores form, result cards, and chart
      without re-clicking `Calculate ROI`.
- [x] Clicking `Reset` clears the storage key, form, cards, chart,
      and the AI section; a subsequent refresh shows the empty
      state.

## 7. Share URL Flow

- [x] `Share Results` builds a URL of the form
      `http://localhost:3000/?revenue=50000&budget=5000&growth=10`.
- [x] The URL is copied to the clipboard and a success status appears.
- [x] If clipboard access is blocked, the URL is shown inline so the
      user can copy it manually.
- [x] Opening the shared URL in a new tab fills the form and
      auto-calculates without further user interaction.
- [x] URL query params override an existing (different) value in
      `localStorage` on load.

## 8. PDF Flow

- [x] `Download PDF Report` saves a file named exactly
      `marketing-roi-report.pdf`.
- [x] The PDF contains the report title, generated date, input
      values, all result values, and a disclaimer about projections
      not being guarantees.
- [x] When an AI recommendation exists in state, it is included in
      the PDF.
- [x] When a chart is rendered, its image is included in the PDF.
      If chart export fails, the PDF still downloads without the
      image (no broken or empty report).
- [x] Triggering `Download PDF Report` before any calculation shows
      a helpful inline message and does not generate an empty PDF.

## 9. Mobile Responsive Flow

- [x] At 375 × 812 (iPhone-class width):
  - [x] No horizontal overflow on any section.
  - [x] Form fields stack into a single column.
  - [x] Result cards stack into a single column.
  - [x] Chart remains visible and readable; axis labels still fit.
  - [x] All buttons remain at least 44 px tall and easy to tap.
- [x] Footer reads exactly `Built with Claude Code`.

## 10. Submission Screenshots

Capture and store with the submission:

- [ ] Calculator form (empty state).
- [ ] Result cards (after the reference calculation).
- [ ] Chart (showing baseline + projected).
- [ ] PDF report (open in a PDF viewer).
- [ ] AI recommendation (rendered below the chart).
