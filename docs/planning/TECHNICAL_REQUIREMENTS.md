# Technical Requirements Specification: Digital Marketing ROI Calculator

## 1. System Overview

The system is a small full-stack web application.

Frontend:

- HTML.
- CSS.
- Browser JavaScript.
- Chart.js loaded by CDN.
- jsPDF loaded by CDN.
- localStorage.
- URLSearchParams.
- Clipboard API.

Backend:

- Node.js.
- Express.
- dotenv.
- cors.
- openai npm package.
- nodemon for development.

The frontend performs calculations and renders the UI. The backend serves
static files and exposes API routes. The OpenAI API is called only from the
backend.

## 2. Recommended Project Structure

```text
roi-calculator/
├── .env
├── .gitignore
├── package.json
├── package-lock.json
├── server.js
├── public/
│   ├── index.html
│   ├── styles.css
│   ├── app.js
│   └── js/
│       ├── calculator.js
│       ├── dom.js
│       └── storage.js
├── tests/
│   ├── calculator.test.js
│   ├── server.test.js
│   └── E2E_CHECKLIST.md
└── docs/
    ├── PRD.md
    ├── TECHNICAL_REQUIREMENTS.md
    ├── TASK_BREAKDOWN.md
    └── prompts/
```

Notes:

- `public/app.js` may contain all frontend logic for a beginner implementation.
- If tests are required, separating pure calculation logic into
  `public/js/calculator.js` is recommended.
- Do not over-engineer the assignment. Keep modules small.

## 3. Runtime Requirements

### 3.1 Node.js

Use a current LTS version of Node.js.

### 3.2 npm Packages

Production dependencies:

```bash
npm install express dotenv cors openai
```

Development dependencies:

```bash
npm install --save-dev nodemon
```

Optional test dependencies:

- Prefer Node's built-in `node:test` where possible.
- Add external test libraries only if required by the course or instructor.

## 4. package.json Requirements

Required scripts:

```json
{
  "scripts": {
    "start": "node server.js",
    "dev": "nodemon server.js",
    "test": "node --test"
  }
}
```

## 5. Environment Configuration

### 5.1 .env

```bash
OPENAI_API_KEY=replace_this_with_your_real_api_key
PORT=3000
```

### 5.2 .gitignore

```gitignore
node_modules/
.env
```

Security rule:

- `OPENAI_API_KEY` must never appear in `public/index.html`,
  `public/app.js`, browser console logs, localStorage, URL query parameters, or
  PDF output.

## 6. Backend Requirements

### 6.1 Express Server

File: `server.js`

Required behavior:

1. Load `.env` with dotenv.
2. Initialize Express.
3. Enable CORS.
4. Enable JSON body parsing with `express.json()`.
5. Serve static files from `public`.
6. Expose health check route.
7. Expose recommendation route.
8. Start on `process.env.PORT || 3000`.

### 6.2 Health Check API

Route:

```text
GET /api/health
```

Success response:

```json
{
  "status": "ok"
}
```

Acceptance criteria:

- Returns HTTP 200.
- Does not require request body.
- Used for simple server validation.

### 6.3 AI Recommendation API

Route:

```text
POST /api/recommendation
```

Request body:

```json
{
  "currentMonthlyRevenue": 50000,
  "monthlyMarketingBudget": 5000,
  "monthlyGrowthPercentage": 10,
  "roiPercentage": 2038.43,
  "projectedAnnualRevenue": 1883057.71,
  "totalProfitOrLoss": 1223057.71
}
```

Validation:

- All required values must exist.
- All required values must be finite numbers.
- Revenue and marketing budget must be greater than 0.
- Growth percentage must be between 0 and 100.

Success response:

```json
{
  "recommendation": "Short practical recommendation text."
}
```

Missing API key response:

- HTTP 500 or 503.
- Safe error JSON.
- No secret leakage.

Suggested response:

```json
{
  "error": "AI recommendation is not configured. Add OPENAI_API_KEY to the server environment."
}
```

Invalid request response:

- HTTP 400.

Suggested response:

```json
{
  "error": "Missing or invalid calculation data."
}
```

OpenAI failure response:

- HTTP 502 or 500.
- Safe error JSON.
- No raw stack trace.

Suggested response:

```json
{
  "error": "AI recommendation is temporarily unavailable. Try again later."
}
```

### 6.4 OpenAI Prompt Requirements

The backend prompt should instruct the model to:

- Produce a short, practical recommendation.
- Write for a small business owner.
- Mention ROI and profit/loss context.
- Avoid guarantees.
- Avoid financial advice language.
- Use simple, direct business language.

## 7. Frontend Requirements

### 7.1 index.html

Required elements:

- `<title>Digital Marketing ROI Calculator</title>`.
- Meta description.
- Responsive viewport meta tag.
- Main heading with calculator icon or simple visual mark.
- Short explanatory paragraph.
- Form with three number inputs.
- Tooltip next to each input.
- Error/status message area.
- Results section.
- Chart canvas.
- AI recommendation section.
- Buttons:
  - Calculate ROI.
  - Get AI Recommendation.
  - Download PDF Report.
  - Share Results.
  - Reset.
- Footer with exact text: `Built with Claude Code`.
- Chart.js CDN script before `app.js`.
- jsPDF CDN script before `app.js`.

Recommended CDN order:

1. Chart.js.
2. jsPDF.
3. Application scripts.

### 7.2 styles.css

Required style features:

- Use primary blue `#2563eb`.
- Use white.
- Use one accent color, recommended `#16a34a`.
- Responsive layout.
- Result cards.
- Card shadows.
- Button shadows.
- Clear typography.
- Mobile tap-friendly buttons.
- Fade-in animation for results.
- Tooltip styling.
- Accessible focus states.

### 7.3 app.js

Required responsibilities:

1. Read DOM elements.
2. Validate form inputs.
3. Call calculation functions.
4. Render result cards.
5. Render Chart.js chart.
6. Save and restore localStorage.
7. Read and write URLSearchParams.
8. Call backend AI route.
9. Trigger PDF generation.
10. Reset the UI.

## 8. Calculation Requirements

### 8.1 Core Formulas

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

### 8.2 Implementation Notes

Recommended function:

```js
/**
 * Calculates digital marketing ROI projections.
 *
 * @param {number} currentMonthlyRevenue - Current monthly revenue in NIS.
 * @param {number} monthlyMarketingBudget - Proposed monthly marketing budget in NIS.
 * @param {number} monthlyGrowthPercentage - Estimated monthly growth percentage.
 * @returns {object} ROI calculation results and monthly revenue series.
 */
function calculateRoi(currentMonthlyRevenue, monthlyMarketingBudget, monthlyGrowthPercentage) {}
```

Required output:

- `projectedRevenue3Months`.
- `projectedRevenue6Months`.
- `projectedRevenue12Months`.
- `currentAnnualRevenue`.
- `projectedAnnualRevenue`.
- `annualMarketingBudget`.
- `roiPercentage`.
- `totalProfitOrLoss`.
- `monthlySeries`.

### 8.3 Formatting

Money:

- Use `Intl.NumberFormat`.
- Locale: `he-IL` or `en-IL` is acceptable.
- Currency: `ILS`.

Percentage:

- Display with 1 or 2 decimal places.
- Include `%`.

Example:

```js
new Intl.NumberFormat("he-IL", {
  style: "currency",
  currency: "ILS"
});
```

## 9. Validation Requirements

Validation rules:

- `currentMonthlyRevenue > 0`.
- `monthlyMarketingBudget > 0`.
- `monthlyGrowthPercentage >= 0`.
- `monthlyGrowthPercentage <= 100`.

Error behavior:

- Prevent calculation.
- Show a clear error message.
- Do not update chart or saved state with invalid data.
- Do not show AI, PDF, or share buttons until valid results exist.

## 10. Chart Requirements

Library:

- Chart.js.

Chart type:

- Line chart.

Data:

- Labels: `0, 1, 2, ..., 12`.
- Dataset 1: current revenue baseline.
- Dataset 2: projected revenue by growth formula.

Colors:

- Baseline: blue.
- Projected: green.

Behavior:

- The chart must update after recalculation.
- Destroy the previous chart instance before creating the next one.
- Chart image must be available for PDF export when possible.

## 11. localStorage Requirements

Storage key:

```text
roiCalculatorState
```

Stored shape:

```json
{
  "inputs": {
    "currentMonthlyRevenue": 50000,
    "monthlyMarketingBudget": 5000,
    "monthlyGrowthPercentage": 10
  },
  "results": {
    "projectedRevenue3Months": 66550,
    "projectedRevenue6Months": 88578.05,
    "projectedRevenue12Months": 156921.48,
    "currentAnnualRevenue": 600000,
    "projectedAnnualRevenue": 1883057.71,
    "annualMarketingBudget": 60000,
    "roiPercentage": 2038.43,
    "totalProfitOrLoss": 1223057.71,
    "monthlySeries": []
  },
  "recommendation": "Optional AI recommendation text."
}
```

Restore precedence:

1. URL query parameters should take priority.
2. If no query parameters exist, restore localStorage.
3. If neither exists, show empty form.

Reset behavior:

- Clear localStorage.
- Clear URL query parameters if present.
- Clear form fields.
- Clear results, chart, AI recommendation, and status messages.

## 12. Sharing Requirements

Use URLSearchParams.

Recommended query parameters:

- `revenue`
- `budget`
- `growth`

Example:

```text
http://localhost:3000/?revenue=50000&budget=5000&growth=10
```

Behavior:

- Click `Share Results`.
- Generate URL from current valid input values.
- Copy URL to clipboard.
- Show success message.
- On page load, parse URL and calculate automatically.

Do not include:

- AI recommendation.
- API key.
- Internal server data.
- Any sensitive data.

## 13. PDF Report Requirements

Library:

- jsPDF.

Filename:

```text
marketing-roi-report.pdf
```

PDF content:

1. Report title.
2. Generated date.
3. Input values.
4. Result summary.
5. AI recommendation if available.
6. Chart image if available.
7. Simple disclaimer that estimates are projections, not guarantees.

Chart inclusion:

- Use `chartCanvas.toDataURL("image/png")` if chart exists.
- If chart export fails, still generate the PDF without the chart and show a
  non-blocking message.

## 14. SEO and Accessibility Requirements

SEO:

- Descriptive title.
- Meta description.
- Semantic headings.
- Clean page structure.
- Human-readable visible content.

Accessibility:

- Labels connected to inputs.
- Tooltip text available to keyboard or screen readers.
- Buttons have descriptive text.
- Error messages should be readable.
- Color should not be the only signal for errors.

## 15. JSDoc Requirements

Add JSDoc for:

- Calculation functions.
- Validation functions.
- Formatting functions.
- Chart rendering function.
- localStorage save/restore functions.
- URL sharing functions.
- PDF generation function.
- AI recommendation fetch function.

JSDoc should include:

- Purpose.
- Parameters.
- Return value.
- Error behavior where relevant.

## 16. Testing Requirements

### 16.1 Unit Tests

Recommended targets:

- ROI formula.
- Monthly projection series.
- Input validation.
- Money formatting.
- URL parameter parsing if separated into a pure function.

Test command:

```bash
npm test
```

### 16.2 Integration Tests

Recommended targets:

- `GET /api/health` returns 200.
- `POST /api/recommendation` rejects invalid body.
- `POST /api/recommendation` returns safe error when API key is missing.
- Static frontend loads from `/`.

### 16.3 E2E / Manual Browser Checks

Required flows:

1. Valid calculation.
2. Invalid input.
3. Chart update.
4. localStorage restore after refresh.
5. Share URL restore in new tab.
6. PDF download.
7. AI recommendation success or safe error.
8. Mobile layout check.

## 17. Security Requirements

Hard rules:

1. Never commit `.env`.
2. Never expose `OPENAI_API_KEY` to frontend files.
3. Do not store API keys in localStorage.
4. Do not put API keys in URL parameters.
5. Do not include API keys in PDF reports.
6. Do not return raw OpenAI errors to the browser.
7. Validate backend request data before calling OpenAI.

## 18. Acceptance Test Values

Use the following values for a standard smoke test:

```text
Current monthly revenue: 50000
Monthly marketing budget: 5000
Estimated monthly growth: 10
```

Expected calculation characteristics:

- Month 3 projected revenue is greater than 50000.
- Month 6 projected revenue is greater than month 3.
- Month 12 projected revenue is greater than month 6.
- ROI is calculated from annual values.
- Total profit or loss is visible.
- Chart shows increasing projected line.
