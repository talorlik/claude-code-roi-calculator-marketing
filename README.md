# Digital Marketing ROI Calculator

An interactive ROI calculator for a digital marketing consultant. The
application helps small-business clients estimate how a monthly marketing
investment can affect revenue over time.

This repository contains the assignment brief, planning documents, technical
requirements, and Claude Code prompts needed to build the full application.

## Table Of Contents

- [Project Purpose](#project-purpose)
- [What The Final App Must Do](#what-the-final-app-must-do)
- [Tech Stack](#tech-stack)
- [Repository Contents](#repository-contents)
- [Required Project Structure](#required-project-structure)
- [Setup Instructions](#setup-instructions)
- [Environment Variables](#environment-variables)
- [Implementation Workflow](#implementation-workflow)
- [Core Calculation Rules](#core-calculation-rules)
- [Security Requirements](#security-requirements)
- [Testing And Validation](#testing-and-validation)
- [Submission Checklist](#submission-checklist)
- [Documentation Links](#documentation-links)

## Project Purpose

Dani is a digital marketing consultant who works with small businesses. During
sales conversations, he needs to show prospects how their revenue may change if
they invest in digital marketing.

Instead of preparing a custom spreadsheet or presentation for each client, this
project creates a self-service calculator. A client can enter business numbers,
view projected revenue, see a chart, download a report, share the result, and
request an AI-powered recommendation.

## What The Final App Must Do

The finished calculator must include all required assignment features:

- Accept current monthly revenue in NIS.
- Accept proposed monthly marketing budget in NIS.
- Accept estimated monthly growth percentage.
- Validate all inputs before calculating.
- Display projected revenue after 3, 6, and 12 months.
- Display ROI as a percentage.
- Display total estimated profit or loss.
- Show each output in a separate result card.
- Render a Chart.js line chart for months 0 through 12.
- Save the latest inputs and results in `localStorage`.
- Restore saved results when the user returns.
- Generate a PDF report with jsPDF.
- Include the chart and result summary in the PDF when possible.
- Create a shareable URL with query parameters.
- Restore shared calculations from URL parameters.
- Provide an AI recommendation through a backend API route.
- Keep the OpenAI API key on the server only.
- Use a modern responsive design with blue `#2563eb`, white, and one
  accent color.
- Include tooltips, card shadows, clear typography, a fade-in result
  animation, and a calculator icon or visual mark.
- Include a footer with the exact text `Built with Claude Code`.

## Tech Stack

The assignment is intentionally small and beginner-friendly.

Frontend:

- HTML.
- CSS.
- Browser JavaScript.
- Chart.js from a CDN.
- jsPDF from a CDN.
- `localStorage`.
- `URLSearchParams`.
- Clipboard API.

Backend:

- Node.js.
- Express.
- dotenv.
- cors.
- OpenAI npm package.
- nodemon for development.

Testing:

- Node's built-in `node:test` runner where practical.
- Manual browser QA for user flows that require a browser.

## Repository Contents

```text
docs/
├── assignment/
│   └── ASSIGNMENT.md
├── planning/
│   ├── PRD.md
│   ├── TECHNICAL_REQUIREMENTS.md
│   └── TASK_BREAKDOWN.md
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

## Required Project Structure

The final implementation should use this structure or a close equivalent:

```text
.
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
```

> [!NOTE]
> A beginner implementation may keep all frontend logic in `public/app.js`.
> If tests are added, pure calculation logic is easier to test when moved into
> a small module such as `public/js/calculator.js`.

## Setup Instructions

Create the Node.js project and install dependencies:

```bash
npm init -y
npm install express dotenv cors openai
npm install --save-dev nodemon
mkdir -p public tests
touch server.js public/index.html public/styles.css public/app.js .env
```

Add scripts to `package.json`:

```json
{
  "scripts": {
    "start": "node server.js",
    "dev": "nodemon server.js",
    "test": "node --test"
  }
}
```

Run the development server:

```bash
npm run dev
```

Open the local application in the browser:

```text
http://localhost:3000
```

## Environment Variables

Create a `.env` file in the project root:

```bash
OPENAI_API_KEY=replace_this_with_your_real_api_key
PORT=3000
```

Add these entries to `.gitignore`:

```gitignore
node_modules/
.env
```

> [!IMPORTANT]
> Never place `OPENAI_API_KEY` in frontend files such as
> `public/index.html`, `public/app.js`, browser storage, URL parameters, or PDF
> output. Browser code is visible to users.

## Implementation Workflow

Build the app in small batches. After each batch, test the feature before
continuing.

| Order | Batch | Main Output |
| ----: | ---- | ---- |
| 0 | Project bootstrap | npm project, dependencies, base files |
| 1 | Backend foundation | Express server and `GET /api/health` |
| 2 | Base frontend layout | HTML, CSS, form, empty sections |
| 3 | Calculation engine | validation, ROI formulas, result cards |
| 4 | Chart rendering | Chart.js revenue growth chart |
| 5 | Backend AI route | secure `POST /api/recommendation` |
| 6 | Frontend AI integration | recommendation button and response UI |
| 7 | localStorage | save, restore, and reset |
| 8 | PDF report | jsPDF report export |
| 9 | Share results | URL parameters and clipboard copy |
| 10 | Design polish | responsive UI, SEO, accessibility, JSDoc |
| 11 | Unit tests | calculation and validation tests |
| 12 | Integration tests | Express route tests |
| 13 | E2E manual QA | browser checklist and screenshots |
| 14 | Final hardening | submission and security review |

Use the matching prompt in `docs/prompts/` for each batch.

## Core Calculation Rules

Use the formulas required by the assignment:

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

Recommended test values:

```text
Current monthly revenue: 50000
Monthly marketing budget: 5000
Estimated monthly growth: 10
```

Expected behavior:

- The form validates successfully.
- Projected revenue increases over time.
- Result cards appear.
- The chart appears and shows an increasing projected line.
- AI, PDF, share, and reset actions become available after calculation.

## Security Requirements

Follow these rules throughout the project:

- Store `OPENAI_API_KEY` only in `.env`.
- Keep `.env` ignored by Git.
- Never expose the API key in frontend code.
- Never store the API key in `localStorage`.
- Never add the API key to URL parameters.
- Never include the API key in PDF output.
- Validate backend request data before calling OpenAI.
- Return safe error messages from the backend.
- Do not send raw OpenAI errors or stack traces to the browser.

The frontend must call the backend route:

```text
POST /api/recommendation
```

The backend then calls OpenAI using `process.env.OPENAI_API_KEY`.

## Testing And Validation

Run automated tests when available:

```bash
npm test
```

Before submission, verify these flows manually:

- `npm run dev` starts the server.
- The frontend loads from the local application URL.
- `GET /api/health` returns `{ "status": "ok" }`.
- Invalid input shows a clear error.
- Valid input calculates all required outputs.
- Money values are formatted as NIS.
- Percentages are formatted clearly.
- The Chart.js chart appears and updates after recalculation.
- The AI recommendation uses the backend route.
- Missing AI configuration returns a safe error.
- Refreshing the page restores the latest calculation.
- Reset clears saved data and the UI.
- PDF download includes inputs, results, and the chart when possible.
- Share URL restores the same calculation in a new browser tab.
- The layout works on a narrow mobile screen.
- Tooltips are visible and helpful.
- The footer says `Built with Claude Code`.

## Submission Checklist

Submit the completed project folder with:

- `server.js`.
- `package.json`.
- `package-lock.json`, if it exists.
- `public/index.html`.
- `public/styles.css`.
- `public/app.js`.
- Any additional frontend files created for the implementation.
- Test files or a completed manual QA checklist.
- Screenshots of the calculator, chart, PDF, and AI recommendation.

Do not submit:

- `node_modules/`.
- `.env`.
- Any real API key.

## Documentation Links

- [Assignment Brief](docs/assignment/ASSIGNMENT.md)
- [Product Requirements](docs/planning/PRD.md)
- [Technical Requirements](docs/planning/TECHNICAL_REQUIREMENTS.md)
- [Task Breakdown](docs/planning/TASK_BREAKDOWN.md)
- [Prompt Index](docs/prompts/README.md)
