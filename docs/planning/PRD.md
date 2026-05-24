# PRD: Digital Marketing ROI Calculator

## 1. Product Summary

The product is a full-stack web application that helps a digital marketing
consultant show small-business prospects the potential financial impact of
investing in digital marketing.

The user enters current monthly revenue, proposed monthly marketing budget, and
expected monthly growth percentage. The application calculates projected
revenue, ROI, and estimated profit or loss, visualizes revenue growth over 12
months, persists the latest calculation, allows sharing results through a URL,
exports a PDF report, and returns an AI-generated recommendation from a backend
API route.

## 2. Business Context

Dani is a digital marketing consultant working with small businesses. Today,
explaining ROI requires manual calculations or custom presentations. This
creates friction during sales conversations and makes it harder for potential
clients to understand expected value quickly.

The application converts that manual explanation into a self-service, visual,
shareable tool.

## 3. Product Goals

| Goal | Description |
| --- | --- |
| Reduce manual explanation effort | Replace one-off ROI calculations and presentation work with an interactive calculator. |
| Improve client understanding | Show projected revenue and ROI using clear result cards and a line chart. |
| Improve sales follow-up | Allow users to download a PDF and share a URL containing calculation inputs. |
| Protect AI credentials | Call the OpenAI API only from the backend. |
| Make the project suitable for learning | Keep implementation small, readable, testable, and built with HTML, CSS, JavaScript, Node.js, and Express. |

## 4. Target Users

### 4.1 Primary User: Small Business Prospect

A business owner or decision maker evaluating whether to invest in digital marketing.

Needs:

- Fast estimate of potential business growth.
- Simple input fields.
- Clear result cards.
- Visual explanation of projected revenue.
- A downloadable or shareable summary.

### 4.2 Secondary User: Digital Marketing Consultant

Dani or a similar consultant using the calculator as a sales enablement tool.

Needs:

- Professional-looking interface.
- Easy way to share estimates.
- AI-generated recommendation to support discussion.
- PDF report for follow-up.

### 4.3 Technical User: Student / Developer

The assignment implementer using Claude Code to build the project.

Needs:

- Clear task order.
- Small implementation steps.
- Testable business logic.
- Secure backend handling for the OpenAI API key.

## 5. In Scope

The product must include:

1. ROI calculator form.
2. Input validation.
3. Result cards.
4. Chart.js line chart.
5. AI recommendation through backend Express API.
6. localStorage persistence.
7. PDF report generation using jsPDF.
8. Shareable URL using URLSearchParams.
9. Responsive design.
10. SEO-friendly HTML metadata.
11. JSDoc comments for functions.
12. Basic unit, integration, and e2e test coverage.

## 6. Out of Scope

The product will not include:

1. User accounts or authentication.
2. Database persistence.
3. Payment processing.
4. Admin dashboard.
5. Multi-language support.
6. Real marketing campaign data integration.
7. CRM integration.
8. Real financial advice or guaranteed predictions.
9. Frontend calls directly to OpenAI.
10. Committing `.env` or API keys.

## 7. Functional Requirements

### FR-001: Revenue Input

The application must provide a number input for current monthly revenue in NIS.

Acceptance criteria:

- The field is required.
- The value must be greater than 0.
- The field must have a tooltip explaining the expected value.
- Invalid values must show a clear error message.

### FR-002: Marketing Budget Input

The application must provide a number input for proposed monthly marketing
budget in NIS.

Acceptance criteria:

- The field is required.
- The value must be greater than 0.
- The field must have a tooltip explaining the expected value.
- Invalid values must show a clear error message.

### FR-003: Growth Percentage Input

The application must provide a number input for estimated monthly growth percentage.

Acceptance criteria:

- The field is required.
- The value must be between 0 and 100 inclusive.
- The field must have a tooltip explaining the expected value.
- Invalid values must show a clear error message.

### FR-004: Calculate ROI

When the user clicks `Calculate ROI`, the application must validate inputs and
calculate the required outputs.

Formula requirements:

```text
Projected revenue after N months =
current monthly revenue * (1 + growth percentage / 100) ^ N

Current annual revenue =
current monthly revenue * 12

Annual marketing budget =
monthly marketing budget * 12

ROI =
((projected annual revenue - current annual revenue - annual marketing budget)
/ annual marketing budget) * 100

Total profit or loss =
projected annual revenue - current annual revenue - annual marketing budget
```

Acceptance criteria:

- Valid inputs produce all required results.
- Invalid inputs prevent calculation.
- Error messages are visible and specific.
- Output values are formatted clearly.

### FR-005: Result Cards

The application must display separate cards for:

- Projected revenue after 3 months.
- Projected revenue after 6 months.
- Projected revenue after 12 months.
- ROI percentage.
- Total estimated profit or loss.

Acceptance criteria:

- Each result appears in a distinct card.
- Money values use NIS formatting.
- Percentages are formatted consistently.
- Result cards appear with a fade-in animation.

### FR-006: Revenue Growth Chart

The application must render a Chart.js line chart for months 0 through 12.

Acceptance criteria:

- The X-axis shows months 0 through 12.
- The Y-axis shows revenue in NIS.
- The chart includes a current revenue baseline.
- The chart includes projected revenue.
- The chart updates after each recalculation.
- The previous chart instance is destroyed before rendering a new one.

### FR-007: AI Recommendation

The application must provide a backend-powered AI recommendation.

Acceptance criteria:

- The frontend shows `Get AI Recommendation` only after a successful calculation.
- The frontend sends calculation data to `POST /api/recommendation`.
- The backend reads `OPENAI_API_KEY` from `.env`.
- The API key is never exposed to frontend code.
- The backend validates required request body values.
- The backend returns `{ "recommendation": "..." }` on success.
- Missing API key returns a helpful backend error.
- OpenAI failures return a safe frontend-facing error.

### FR-008: localStorage Persistence

The application must save the latest input values and calculation results in localStorage.

Acceptance criteria:

- Values are saved after each successful calculation.
- Saved inputs and results are restored on page load.
- Restored results display automatically.
- A reset button clears localStorage and resets the form.
- Code includes comments explaining the purpose of localStorage.

### FR-009: PDF Report Download

The application must generate a PDF report using jsPDF.

Acceptance criteria:

- `Download PDF Report` is visible only after calculation.
- The PDF includes input values.
- The PDF includes result values.
- The PDF includes AI recommendation if available.
- The PDF includes the chart image if available.
- The file name is `marketing-roi-report.pdf`.
- A helpful message appears if no calculation exists.

### FR-010: Share Results

The application must allow sharing calculation inputs through a URL.

Acceptance criteria:

- `Share Results` is visible only after calculation.
- The app creates a URL using URLSearchParams.
- The URL contains input values as query parameters.
- The share URL is copied to the clipboard.
- A success message appears after copying.
- Opening the URL in a new tab restores the same calculation.

### FR-011: Responsive UI

The application must work on mobile screens.

Acceptance criteria:

- Form fields are usable on narrow screens.
- Buttons are easy to tap.
- Result cards stack cleanly.
- The chart remains visible and readable.
- Layout does not overflow horizontally.

### FR-012: Footer

The application must include a footer with:

```text
Built with Claude Code
```

Acceptance criteria:

- The footer appears at the bottom of the page.
- The text is exact.

## 8. Non-Functional Requirements

### NFR-001: Security

- `OPENAI_API_KEY` must be stored only in `.env`.
- `.env` must be listed in `.gitignore`.
- The frontend must never contain the OpenAI API key.
- The backend must validate request data before calling OpenAI.
- The OpenAI error response must not leak secrets or internal stack traces.

### NFR-002: Usability

- UI must use clear typography.
- Inputs must have helpful labels and tooltips.
- Error and success messages must be clear.
- Main actions must be visible after results exist.
- The design must be professional for a small-business audience.

### NFR-003: Maintainability

- JavaScript functions must include JSDoc where appropriate.
- Business logic should be separated from DOM manipulation where practical.
- Constants should be named clearly.
- No hard-coded API key or secret.
- Code should be readable for beginner-level full-stack development.

### NFR-004: Performance

- The page should load quickly.
- Chart rendering should destroy old chart instances.
- localStorage payload should remain small.
- API calls should only occur when the user requests AI recommendation.

### NFR-005: SEO

The HTML must include:

- Descriptive `<title>`.
- Meta description.
- Proper heading hierarchy.
- Semantic landmarks where useful: `header`, `main`, `section`, `footer`.
- Accessible labels for form controls.

## 9. UX Requirements

### 9.1 Visual Style

Required colors:

- Primary blue: `#2563eb`.
- White background or card areas.
- One accent color, recommended: green `#16a34a`.

Design requirements:

- Modern small-business SaaS style.
- Card shadows.
- Clear typography.
- Calculator icon or simple visual mark in the title.
- Fade-in animation when results appear.

### 9.2 Main Screen Structure

Recommended order:

1. Header with title and short explanation.
2. ROI input form.
3. Validation/status message area.
4. Result cards.
5. Chart section.
6. Action buttons: AI recommendation, PDF download, share, reset.
7. AI recommendation section.
8. Footer.

## 10. Data Requirements

### 10.1 Input Data

| Field | Type | Validation | Example |
| --- | ---: | --- | ---: |
| currentMonthlyRevenue | number | > 0 | 50000 |
| monthlyMarketingBudget | number | > 0 | 5000 |
| monthlyGrowthPercentage | number | 0 to 100 | 10 |

### 10.2 Calculation Result Data

| Field | Type | Description |
| --- | ---: | --- |
| projectedRevenue3Months | number | Revenue after 3 months. |
| projectedRevenue6Months | number | Revenue after 6 months. |
| projectedRevenue12Months | number | Revenue after 12 months. |
| currentAnnualRevenue | number | Current monthly revenue multiplied by 12. |
| projectedAnnualRevenue | number | Projected monthly revenue at month 12 multiplied by 12. |
| annualMarketingBudget | number | Monthly marketing budget multiplied by 12. |
| roiPercentage | number | ROI percentage. |
| totalProfitOrLoss | number | Estimated profit or loss after budget. |
| monthlySeries | number[] | Projected revenue values for months 0 through 12. |

## 11. Example Test Scenario

Inputs:

- Current monthly revenue: `50000`.
- Monthly marketing budget: `5000`.
- Estimated monthly growth: `10`.

Expected behavior:

- Form validates successfully.
- Result cards appear.
- Chart appears.
- Buttons for AI, PDF, and sharing become visible.
- Results are saved to localStorage.
- Refresh restores the calculation.
- Share URL restores the calculation in a new tab.

## 12. Release Criteria

The project is complete when:

1. `npm run dev` starts the server.
2. The frontend loads from `http://localhost:3000`.
3. Bad input is rejected with clear messages.
4. ROI calculations match the required formulas.
5. Results are formatted in NIS.
6. Chart appears and updates.
7. AI recommendation works through the backend.
8. `.env` is ignored by Git.
9. localStorage restores latest calculation.
10. PDF report downloads.
11. Share link restores calculation.
12. Layout works on mobile.
13. Tooltips are visible.
14. JSDoc is added to key functions.
15. Tests pass or documented manual test checklist is complete.
