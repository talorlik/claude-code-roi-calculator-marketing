# Digital Marketing ROI Calculator

An interactive web app that estimates the return on a monthly digital
marketing investment for a small business.

The app lets a consultant or client enter current revenue, marketing budget,
and expected monthly growth. It then shows projected revenue, annual ROI, total
profit or loss, a 12-month chart, a share link, an optional PDF report, and an
optional AI recommendation.

## Table Of Contents

- [What The App Does](#what-the-app-does)
- [Tech Stack](#tech-stack)
- [Project Structure](#project-structure)
- [Setup And Run](#setup-and-run)
- [Tests](#tests)
- [Useful Local Checks](#useful-local-checks)
- [Calculation Rules](#calculation-rules)
- [Security Notes](#security-notes)
- [Documentation](#documentation)

## What The App Does

- Collects current monthly revenue, monthly marketing budget, and estimated
  monthly growth.
- Validates that revenue and budget are greater than `0`, and that growth is
  between `0` and `100`.
- Calculates projected revenue after `3`, `6`, and `12` months.
- Calculates projected annual revenue, annual ROI, annual marketing budget, and
  total annual profit or loss.
- Displays the results in responsive cards with NIS and percentage formatting.
- Renders a Chart.js line chart for months `0` through `12`.
- Saves the latest calculation and AI recommendation in `localStorage`.
- Restores a calculation from URL query parameters first, then from
  `localStorage`.
- Generates a PDF report with jsPDF, including inputs, results, any AI
  recommendation, and the chart when the chart image is available.
- Creates a shareable URL and copies it to the clipboard when possible.
- Calls a backend `POST /api/recommendation` route for AI recommendations.
- Keeps the OpenAI API key on the server and returns safe browser-facing errors.

## Tech Stack

Frontend:

- HTML.
- CSS.
- Browser JavaScript.
- Chart.js from a CDN.
- jsPDF from a CDN.
- `localStorage`, `URLSearchParams`, and the Clipboard API.

Backend:

- Node.js.
- Express.
- dotenv.
- cors.
- OpenAI npm package.

Testing:

- Node's built-in `node:test` runner.
- Integration tests that mount the Express app on an ephemeral local port.

## Project Structure

```text
.
├── .env
├── .gitignore
├── .markdownlint.json
├── LICENSE
├── README.md
├── package-lock.json
├── package.json
├── server.js
├── public/
│   ├── app.js
│   ├── index.html
│   ├── styles.css
│   └── js/
│       ├── api.js
│       ├── calculator.js
│       ├── chart.js
│       ├── dom.js
│       ├── pdf.js
│       └── storage.js
├── tests/
│   ├── calculator.test.js
│   └── server.test.js
└── docs/
    ├── assignment/
    │   └── ASSIGNMENT.md
    ├── planning/
    │   ├── PRD.md
    │   ├── TASK_BREAKDOWN.md
    │   └── TECHNICAL_REQUIREMENTS.md
    └── prompts/
        ├── README.md
        ├── 00_PROJECT_BOOTSTRAP.md
        ├── 01_BACKEND_SERVER.md
        ├── 02_BASE_FRONTEND.md
        ├── 03_CALCULATION_ENGINE.md
        ├── 04_CHART_RENDERING.md
        ├── 05_AI_RECOMMENDATION_BACKEND.md
        ├── 06_FRONTEND_AI_INTEGRATION.md
        ├── 07_LOCAL_STORAGE.md
        ├── 08_PDF_REPORT.md
        ├── 09_SHARE_RESULTS.md
        ├── 10_DESIGN_SEO_JSDOC_POLISH.md
        ├── 11_UNIT_TESTS.md
        ├── 12_INTEGRATION_TESTS.md
        ├── 13_E2E_MANUAL_QA.md
        └── 14_FINAL_HARDENING_SUBMISSION.md
```

> [!NOTE]
> `.env` is local only and is ignored by Git. Do not commit real API keys.

## Setup And Run

Use Node.js `18` or newer. Node `20` or newer is recommended.

1. Install dependencies:

   ```bash
   npm install
   ```

1. Create a local `.env` file in the project root:

   ```bash
   OPENAI_API_KEY=replace_this_with_your_real_api_key
   PORT=3000
   ```

   The app still runs without a real `OPENAI_API_KEY`, but the AI
   recommendation button will show a safe configuration error.

1. Start the development server:

   ```bash
   npm run dev
   ```

1. Open the app:

   ```text
   http://localhost:3000
   ```

For a non-watch server, use:

```bash
npm start
```

## Tests

Run all automated tests:

```bash
npm test
```

The test suite currently covers:

- ROI calculation, validation, and formatting behavior.
- The Express health route.
- Serving the calculator HTML.
- Backend recommendation validation.
- The safe missing-key response for `POST /api/recommendation`.

## Useful Local Checks

After starting the server, you can verify the health route:

```bash
curl http://localhost:3000/api/health
```

Expected response:

```json
{ "status": "ok" }
```

Recommended browser smoke test:

- Enter `50000` for current monthly revenue.
- Enter `5000` for monthly marketing budget.
- Enter `10` for estimated monthly growth.
- Confirm that result cards and the revenue chart appear.
- Try the share, PDF, reset, and AI recommendation actions.
- Refresh the page and confirm the latest calculation is restored.

## Calculation Rules

```text
Projected revenue after N months =
current monthly revenue * (1 + growth percentage / 100) ^ N

Current annual revenue =
current monthly revenue * 12

Annual marketing budget =
monthly marketing budget * 12

Projected annual revenue =
projected revenue after 12 months * 12

ROI =
((projected annual revenue - current annual revenue - annual marketing budget)
/ annual marketing budget) * 100

Total profit or loss =
projected annual revenue - current annual revenue - annual marketing budget
```

## Security Notes

- Keep `OPENAI_API_KEY` in `.env` or in the server environment only.
- Do not put the API key in frontend files, browser storage, URLs, or PDFs.
- The browser sends calculation results only to `POST /api/recommendation`.
- The server validates recommendation requests before calling OpenAI.
- Backend failures return safe error messages without stack traces or raw
  OpenAI errors.

## Documentation

- [Assignment Brief](docs/assignment/ASSIGNMENT.md)
- [Product Requirements](docs/planning/PRD.md)
- [Technical Requirements](docs/planning/TECHNICAL_REQUIREMENTS.md)
- [Task Breakdown](docs/planning/TASK_BREAKDOWN.md)
- [Prompt Index](docs/prompts/README.md)
