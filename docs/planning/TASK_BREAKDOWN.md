# Task Breakdown: Digital Marketing ROI Calculator

## Execution Model

Use these tasks as Claude Code implementation batches.

Rules:

1. Complete one batch at a time.
2. Test each batch before continuing.
3. Keep tasks small to medium.
4. Work from foundation to features.
5. Do not place `OPENAI_API_KEY` in frontend files.
6. Add JSDoc to important JavaScript functions as they are created.
7. Keep the implementation beginner-friendly unless a task explicitly asks for modularization.

For each batch, read the linked prompt file before making changes. Treat the
batch table as the task checklist and the prompt file as the detailed execution
instructions.

## Prompt Map

| Batch | Implementation Prompt |
| ---: | --- |
| 0 | `docs/prompts/00_PROJECT_BOOTSTRAP.md` |
| 1 | `docs/prompts/01_BACKEND_SERVER.md` |
| 2 | `docs/prompts/02_BASE_FRONTEND.md` |
| 3 | `docs/prompts/03_CALCULATION_ENGINE.md` |
| 4 | `docs/prompts/04_CHART_RENDERING.md` |
| 5 | `docs/prompts/05_AI_RECOMMENDATION_BACKEND.md` |
| 6 | `docs/prompts/06_FRONTEND_AI_INTEGRATION.md` |
| 7 | `docs/prompts/07_LOCAL_STORAGE.md` |
| 8 | `docs/prompts/08_PDF_REPORT.md` |
| 9 | `docs/prompts/09_SHARE_RESULTS.md` |
| 10 | `docs/prompts/10_DESIGN_SEO_JSDOC_POLISH.md` |
| 11 | `docs/prompts/11_UNIT_TESTS.md` |
| 12 | `docs/prompts/12_INTEGRATION_TESTS.md` |
| 13 | `docs/prompts/13_E2E_MANUAL_QA.md` |
| 14 | `docs/prompts/14_FINAL_HARDENING_SUBMISSION.md` |

## Batch 0: Project Bootstrap

### Goal

Create the Node.js project skeleton, install dependencies, and define scripts.

### Tasks

| ID | Task | Output |
| --- | --- | --- |
| B0-T01 | Create project folder and npm project. | `package.json` |
| B0-T02 | Install production dependencies. | `express`, `dotenv`, `cors`, `openai` |
| B0-T03 | Install development dependency. | `nodemon` |
| B0-T04 | Create base files and folders. | `server.js`, `public/`, `.env`, `.gitignore` |
| B0-T05 | Add npm scripts. | `start`, `dev`, `test` |
| B0-T06 | Add `.env` placeholder values. | `OPENAI_API_KEY`, `PORT` |
| B0-T07 | Add `.gitignore` entries. | `node_modules/`, `.env` |

### Validation

Run:

```bash
npm install
npm run dev
```

Expected:

- The command starts or fails only because `server.js` is not implemented yet.
- `node_modules/` and `.env` are ignored by Git.

### Prompt

Before starting this batch, read and follow
`docs/prompts/00_PROJECT_BOOTSTRAP.md`.

## Batch 1: Backend Foundation

### Goal

Create a working Express backend that serves the frontend and exposes a health check.

### Tasks

| ID | Task | Output |
| --- | --- | --- |
| B1-T01 | Configure dotenv. | `process.env` values loaded |
| B1-T02 | Create Express app. | `app` instance |
| B1-T03 | Add `cors()`. | CORS enabled |
| B1-T04 | Add `express.json()`. | JSON body support |
| B1-T05 | Serve `public/`. | static frontend |
| B1-T06 | Add `GET /api/health`. | health response |
| B1-T07 | Start server on configured port. | server listener |
| B1-T08 | Structure server for testability. | export `app` where practical |

### Validation

Run:

```bash
npm run dev
```

Open:

```text
http://localhost:3000/api/health
```

Expected:

```json
{"status":"ok"}
```

### Prompt

Before starting this batch, read and follow
`docs/prompts/01_BACKEND_SERVER.md`.

## Batch 2: Base Frontend Layout

### Goal

Create the calculator page structure without business logic.

### Tasks

| ID | Task | Output |
| --- | --- | --- |
| B2-T01 | Create semantic HTML skeleton. | `index.html` |
| B2-T02 | Add SEO metadata. | title, description, viewport |
| B2-T03 | Add heading with calculator visual mark. | page header |
| B2-T04 | Add explanatory text. | intro paragraph |
| B2-T05 | Add ROI form. | 3 number inputs |
| B2-T06 | Add tooltips. | tooltip text |
| B2-T07 | Add status/error area. | message container |
| B2-T08 | Add empty result section. | result container |
| B2-T09 | Add empty chart section. | `<canvas>` |
| B2-T10 | Add empty AI recommendation section. | recommendation container |
| B2-T11 | Add hidden action buttons. | AI, PDF, share, reset |
| B2-T12 | Add footer. | `Built with Claude Code` |
| B2-T13 | Add first responsive CSS pass. | usable layout |

### Validation

Open:

```text
http://localhost:3000
```

Expected:

- The page loads.
- Inputs and calculate button are visible.
- Advanced action buttons are hidden until results exist.
- Footer text is exact.

### Prompt

Before starting this batch, read and follow
`docs/prompts/02_BASE_FRONTEND.md`.

## Batch 3: Calculation Engine and Validation

### Goal

Implement core ROI calculation and display results.

### Tasks

| ID | Task | Output |
| --- | --- | --- |
| B3-T01 | Create input parsing function. | numeric values |
| B3-T02 | Create validation function. | validation result |
| B3-T03 | Create ROI calculation function. | result object |
| B3-T04 | Create NIS formatter. | formatted money |
| B3-T05 | Create percentage formatter. | formatted percentage |
| B3-T06 | Wire submit/click event. | calculation trigger |
| B3-T07 | Render result cards. | five result cards |
| B3-T08 | Show validation errors. | clear error messages |
| B3-T09 | Reveal relevant buttons after success. | AI, PDF, share, reset |
| B3-T10 | Add JSDoc to core functions. | documented functions |

### Validation

Test valid values:

```text
Revenue: 50000
Budget: 5000
Growth: 10
```

Expected:

- Projected revenues appear.
- ROI appears.
- Profit or loss appears.
- Invalid values show errors and do not update results.

### Prompt

Before starting this batch, read and follow
`docs/prompts/03_CALCULATION_ENGINE.md`.

## Batch 4: Chart.js Revenue Growth Chart

### Goal

Add line chart visualization for projected revenue.

### Tasks

| ID | Task | Output |
| --- | --- | --- |
| B4-T01 | Add Chart.js CDN script. | library loaded |
| B4-T02 | Generate month labels 0 through 12. | x-axis labels |
| B4-T03 | Generate baseline series. | flat current revenue |
| B4-T04 | Use monthly projected series. | projected revenue line |
| B4-T05 | Render line chart. | chart visible |
| B4-T06 | Destroy old chart on recalculation. | no duplicate charts |
| B4-T07 | Add chart JSDoc. | documented render function |
| B4-T08 | Improve chart responsiveness. | mobile readable |

### Validation

Expected:

- Chart appears after calculation.
- Recalculating updates chart.
- No duplicate canvas/chart artifacts appear.

### Prompt

Before starting this batch, read and follow
`docs/prompts/04_CHART_RENDERING.md`.

## Batch 5: Backend AI Recommendation

### Goal

Implement secure AI recommendation endpoint.

### Tasks

| ID | Task | Output |
| --- | --- | --- |
| B5-T01 | Import and initialize OpenAI client. | backend client |
| B5-T02 | Create request body validation. | backend validation |
| B5-T03 | Add `POST /api/recommendation`. | API endpoint |
| B5-T04 | Read key from `process.env.OPENAI_API_KEY`. | secure key loading |
| B5-T05 | Build safe recommendation prompt. | practical output |
| B5-T06 | Return recommendation JSON. | `{ recommendation }` |
| B5-T07 | Handle missing API key safely. | safe error |
| B5-T08 | Handle OpenAI failures safely. | safe error |
| B5-T09 | Add JSDoc where useful. | documented helper functions |

### Validation

Test:

- Missing body returns 400.
- Missing API key returns safe error.
- Valid body with configured API key returns recommendation.

### Prompt

Before starting this batch, read and follow
`docs/prompts/05_AI_RECOMMENDATION_BACKEND.md`.

## Batch 6: Frontend AI Integration

### Goal

Connect the frontend to the backend AI route.

### Tasks

| ID | Task | Output |
| --- | --- | --- |
| B6-T01 | Add `Get AI Recommendation` click handler. | button behavior |
| B6-T02 | Send latest calculation to backend. | fetch request |
| B6-T03 | Add loading state. | user feedback |
| B6-T04 | Render recommendation. | recommendation card/section |
| B6-T05 | Show clear error on failure. | frontend safe error |
| B6-T06 | Store recommendation in app state. | usable for PDF/localStorage |
| B6-T07 | Add JSDoc. | documented API function |

### Validation

Expected:

- Button appears only after calculation.
- Loading state appears while request is pending.
- Recommendation appears on success.
- Safe error appears on failure.

### Prompt

Before starting this batch, read and follow
`docs/prompts/06_FRONTEND_AI_INTEGRATION.md`.

## Batch 7: localStorage Persistence

### Goal

Save and restore the latest calculation.

### Tasks

| ID | Task | Output |
| --- | --- | --- |
| B7-T01 | Define storage key. | `roiCalculatorState` |
| B7-T02 | Save inputs and results after calculation. | persisted state |
| B7-T03 | Save AI recommendation when available. | persisted recommendation |
| B7-T04 | Restore state on page load. | restored UI |
| B7-T05 | Re-render results and chart from saved data. | complete restore |
| B7-T06 | Add reset button behavior. | clear state |
| B7-T07 | Add comments explaining localStorage. | educational comments |
| B7-T08 | Add JSDoc to storage helpers. | documented storage functions |

### Validation

Expected:

- Refresh restores latest calculation.
- Reset clears saved data and UI.
- Browser developer tools show the storage key.

### Prompt

Before starting this batch, read and follow
`docs/prompts/07_LOCAL_STORAGE.md`.

## Batch 8: PDF Report Export

### Goal

Generate a PDF report using jsPDF.

### Tasks

| ID | Task | Output |
| --- | --- | --- |
| B8-T01 | Add jsPDF CDN script. | library loaded |
| B8-T02 | Add PDF generation function. | report output |
| B8-T03 | Include generated date. | report metadata |
| B8-T04 | Include input values. | report section |
| B8-T05 | Include result values. | report section |
| B8-T06 | Include AI recommendation if available. | report section |
| B8-T07 | Include chart image if available. | report chart |
| B8-T08 | Save as `marketing-roi-report.pdf`. | downloaded file |
| B8-T09 | Handle missing calculation. | helpful message |
| B8-T10 | Add JSDoc. | documented function |

### Validation

Expected:

- Button is visible only after calculation.
- PDF downloads.
- PDF contains inputs and results.
- PDF includes AI recommendation if generated.
- PDF includes chart if export succeeds.

### Prompt

Before starting this batch, read and follow
`docs/prompts/08_PDF_REPORT.md`.

## Batch 9: Share Results With URL Parameters

### Goal

Create and restore shareable calculation URLs.

### Tasks

| ID | Task | Output |
| --- | --- | --- |
| B9-T01 | Create URL with `URLSearchParams`. | share URL |
| B9-T02 | Copy URL to clipboard. | clipboard action |
| B9-T03 | Show copy success message. | feedback |
| B9-T04 | Parse query params on page load. | restored inputs |
| B9-T05 | Auto-calculate from query params. | restored results |
| B9-T06 | Define URL precedence over localStorage. | predictable restore |
| B9-T07 | Add JSDoc. | documented helpers |

### Validation

Expected:

- Share button copies URL.
- Opening URL in new tab restores same calculation.
- Query params take priority over old localStorage values.

### Prompt

Before starting this batch, read and follow
`docs/prompts/09_SHARE_RESULTS.md`.

## Batch 10: Design Polish, SEO, Accessibility, JSDoc

### Goal

Finalize the user experience and code quality.

### Tasks

| ID | Task | Output |
| --- | --- | --- |
| B10-T01 | Add fade-in animation. | animated results |
| B10-T02 | Improve card shadows and spacing. | polished UI |
| B10-T03 | Improve buttons and mobile tap targets. | mobile UX |
| B10-T04 | Improve typography. | readability |
| B10-T05 | Verify color palette. | blue, white, accent |
| B10-T06 | Add accessible focus states. | keyboard usability |
| B10-T07 | Verify SEO metadata. | title/meta/structure |
| B10-T08 | Review and complete JSDoc. | maintainable JS |
| B10-T09 | Check mobile width. | responsive layout |

### Validation

Expected:

- Page looks professional.
- Mobile layout works.
- Results fade in.
- Required colors are used.
- Key functions have JSDoc.

### Prompt

Before starting this batch, read and follow
`docs/prompts/10_DESIGN_SEO_JSDOC_POLISH.md`.

## Batch 11: Unit Tests

### Goal

Test pure calculation and validation logic.

### Tasks

| ID | Task | Output |
| --- | --- | --- |
| B11-T01 | Create `tests/` directory. | test folder |
| B11-T02 | Add `node --test` script. | test script |
| B11-T03 | Export or isolate calculation helpers. | testable functions |
| B11-T04 | Test valid calculation. | unit test |
| B11-T05 | Test invalid revenue. | unit test |
| B11-T06 | Test invalid budget. | unit test |
| B11-T07 | Test invalid growth percentage. | unit test |
| B11-T08 | Test monthly series length. | unit test |
| B11-T09 | Test series monotonic growth for positive growth. | unit test |

### Validation

Run:

```bash
npm test
```

Expected:

- Unit tests pass.
- Tests do not require OpenAI API key.

### Prompt

Before starting this batch, read and follow
`docs/prompts/11_UNIT_TESTS.md`.

## Batch 12: Backend Integration Tests

### Goal

Test Express API behavior without exposing secrets.

### Tasks

| ID | Task | Output |
| --- | --- | --- |
| B12-T01 | Make server testable without auto-starting twice. | exported app |
| B12-T02 | Add health route test. | integration test |
| B12-T03 | Add static page response test. | integration test |
| B12-T04 | Add invalid recommendation body test. | integration test |
| B12-T05 | Add missing API key safe error test. | integration test |
| B12-T06 | Ensure tests do not call real OpenAI by default. | safe tests |

### Validation

Run:

```bash
npm test
```

Expected:

- Backend tests pass.
- No external OpenAI call is made unless explicitly mocked or configured.

### Prompt

Before starting this batch, read and follow
`docs/prompts/12_INTEGRATION_TESTS.md`.

## Batch 13: E2E and Manual QA

### Goal

Validate the full browser user flow.

### Tasks

| ID | Task | Output |
| --- | --- | --- |
| B13-T01 | Create e2e checklist. | `tests/E2E_CHECKLIST.md` |
| B13-T02 | Check valid calculation flow. | QA pass/fail |
| B13-T03 | Check invalid input flow. | QA pass/fail |
| B13-T04 | Check chart rendering and update. | QA pass/fail |
| B13-T05 | Check localStorage refresh restore. | QA pass/fail |
| B13-T06 | Check share URL restore. | QA pass/fail |
| B13-T07 | Check PDF download. | QA pass/fail |
| B13-T08 | Check AI recommendation route. | QA pass/fail |
| B13-T09 | Check mobile layout. | QA pass/fail |
| B13-T10 | Capture required screenshots. | submission assets |

### Validation

Expected:

- All checklist items pass or failures are documented.
- Screenshots are ready for submission.

### Prompt

Before starting this batch, read and follow
`docs/prompts/13_E2E_MANUAL_QA.md`.

## Batch 14: Final Hardening and Submission Review

### Goal

Prepare the project for submission.

### Tasks

| ID | Task | Output |
| --- | --- | --- |
| B14-T01 | Confirm required files exist. | file checklist |
| B14-T02 | Confirm `.env` is not committed. | security pass |
| B14-T03 | Confirm API key is backend-only. | security pass |
| B14-T04 | Confirm npm scripts work. | operational pass |
| B14-T05 | Confirm final checklist. | submission ready |
| B14-T06 | Remove debug logs. | clean code |
| B14-T07 | Add concise README if needed. | project guide |
| B14-T08 | Capture final screenshots. | submission assets |

### Validation

Run:

```bash
npm run dev
npm test
```

Expected:

- Server runs.
- Tests pass.
- Browser flows work.
- Submission excludes `node_modules/` and `.env`.

### Prompt

Before starting this batch, read and follow
`docs/prompts/14_FINAL_HARDENING_SUBMISSION.md`.

## Suggested Implementation Order Summary

```text
0. Bootstrap
1. Backend foundation
2. Base frontend
3. Calculation and validation
4. Chart
5. Backend AI endpoint
6. Frontend AI integration
7. localStorage
8. PDF
9. Share URL
10. Design, SEO, accessibility, JSDoc
11. Unit tests
12. Integration tests
13. E2E/manual QA
14. Final hardening
```
