# Assignment 3: Digital Marketing ROI Calculator With Claude Code

Build an interactive ROI calculator for a digital marketing consultant. The
calculator will help potential clients understand how marketing investment can
affect revenue over time.

## Table Of Contents

- [Business Case](#business-case)
- [Learning Goals](#learning-goals)
- [Final Product Requirements](#final-product-requirements)
- [Prerequisites](#prerequisites)
- [Project Setup](#project-setup)
- [Required Implementation Steps](#required-implementation-steps)
- [Final Checklist](#final-checklist)
- [Submission Requirements](#submission-requirements)
- [Grading Rubric](#grading-rubric)
- [Troubleshooting Tips](#troubleshooting-tips)

## Business Case

Dani is a digital marketing consultant who works with small businesses. When he
speaks with a potential client, he needs to explain how much additional revenue
the client may earn by investing in digital marketing.

Today, Dani prepares a manual calculation or presentation for each client. This
takes time, is difficult to customize quickly, and does not always make the
return on investment clear.

Your solution is an interactive calculator that a client can use independently.
The client enters basic business numbers, sees projected revenue over time,
views a chart, downloads a report, shares the result, and receives an AI-powered
recommendation.

## Learning Goals

By completing this assignment, you will practice how to:

- Use Claude Code to build a small full-stack web application.
- Create a clean, responsive HTML, CSS, and JavaScript interface.
- Implement business calculations in JavaScript.
- Visualize data with Chart.js.
- Save browser state with `localStorage`.
- Generate a PDF report with jsPDF.
- Share calculator results through URL parameters.
- Use a backend API route to protect an AI API key.
- Test each feature before moving to the next one.

## Final Product Requirements

The finished tool must include all of the following features.

### User Inputs

The calculator must ask the user for:

- Current monthly revenue in NIS.
- Proposed monthly marketing budget in NIS.
- Estimated monthly growth percentage.

### Calculated Outputs

After the user clicks `Calculate ROI`, the calculator must display:

- Projected revenue after 3 months.
- Projected revenue after 6 months.
- Projected revenue after 12 months.
- ROI as a percentage.
- Total estimated profit or loss.

Use these formulas:

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

### Required User Experience

The application must include:

- A modern design using blue `#2563eb`, white, and one accent color.
- Separate result cards for the main calculation outputs.
- A line chart showing revenue growth for months 0 through 12.
- Tooltips that explain each input field.
- A fade-in animation when results appear.
- Card shadows and clear typography.
- A calculator icon or simple visual mark in the main title.
- A footer that says `Built with Claude Code`.
- A responsive layout that works on mobile screens.

### Required Advanced Features

The following features are required, not optional:

- Save the latest inputs and results in `localStorage`.
- Restore the latest calculation when the user returns to the page.
- Add a `Download PDF Report` button using jsPDF.
- Include the chart and result summary in the PDF report.
- Add a `Share Results` button.
- Store the calculation values in the page URL when sharing.
- Read URL parameters when the page loads and restore shared results.
- Add an AI recommendation feature using a backend API route.

## Prerequisites

Before starting, make sure you have:

- VS Code installed.
- Claude Code installed and available in VS Code.
- Node.js and npm installed.
- A browser such as Chrome, Edge, Safari, or Firefox.
- An OpenAI API key from [OpenAI API keys](https://platform.openai.com/api-keys).

> [!IMPORTANT]
> Do not place the OpenAI API key inside frontend files such as
> `index.html`, `app.js`, or any file inside `public/`. Browser code is visible
> to users. Store the key only in `.env` and read it from the backend.

## Project Setup

Create a new project folder and install the required packages.

```bash
mkdir roi-calculator
cd roi-calculator
npm init -y
npm install express dotenv cors openai
npm install --save-dev nodemon
mkdir public
touch server.js public/index.html public/styles.css public/app.js .env .gitignore
```

Ask Claude Code to update the `scripts` section in `package.json`:

```json
{
  "scripts": {
    "start": "node server.js",
    "dev": "nodemon server.js"
  }
}
```

Add this to `.env`:

```bash
OPENAI_API_KEY=replace_this_with_your_real_api_key
PORT=3000
```

Add this to `.gitignore`:

```gitignore
node_modules/
.env
```

Run the project in development mode:

```bash
npm run dev
```

When the server starts, open the
[local application](http://localhost:3000) in your browser.

## Required Implementation Steps

Complete the assignment one step at a time. After every step, test the feature
in the browser before continuing.

### Step 1: Create The Backend Server

In Claude Code, ask:

```text
Create a Node.js Express server in server.js.

Requirements:
- Load environment variables from .env.
- Serve static files from the public folder.
- Use express.json() so the server can receive JSON requests.
- Add a health check route at GET /api/health.
- Start the server on process.env.PORT or 3000.
```

Check that `npm run dev` starts the server without errors and that the page
loads from [local application](http://localhost:3000).

### Step 2: Create The Base Page

In Claude Code, ask:

```text
Create the base frontend for a Digital Marketing ROI Calculator.

Files:
- public/index.html
- public/styles.css
- public/app.js

The page needs:
- A title: Digital Marketing ROI Calculator.
- A short explanation of what the calculator does.
- A form with three number inputs:
  - Current monthly revenue.
  - Monthly marketing budget.
  - Estimated monthly growth percentage.
- Tooltips next to each input.
- A Calculate ROI button.
- An empty results section.
- An empty chart section.
- An empty AI recommendation section.
- Buttons for PDF download and sharing, hidden until results exist.
```

Check that the page loads correctly and the form is visible.

### Step 3: Add Calculation Logic

In Claude Code, ask:

```text
Add JavaScript logic that calculates ROI when the user clicks Calculate ROI.

Requirements:
- Validate that revenue and marketing budget are greater than 0.
- Validate that growth percentage is between 0 and 100.
- Show a clear error message for invalid inputs.
- Calculate projected revenue after 3, 6, and 12 months.
- Calculate ROI percentage.
- Calculate total profit or loss.
- Display all results in separate cards.
- Format money values as NIS.
- Format percentages clearly.
```

Check with this example:

- Current monthly revenue: `50000`.
- Monthly marketing budget: `5000`.
- Estimated monthly growth: `10`.

Confirm that results appear and that invalid input shows an error.

### Step 4: Add The Revenue Growth Chart

In Claude Code, ask:

```text
Add a Chart.js line chart that shows revenue over 12 months.

Requirements:
- Add Chart.js through a CDN script in index.html.
- X-axis: months 0 through 12.
- Y-axis: revenue in NIS.
- Line 1: current revenue as a flat baseline.
- Line 2: projected revenue using the growth formula.
- Use blue for the baseline and green for projected revenue.
- Update the chart whenever the user recalculates.
- Destroy the old chart before creating a new one.
```

Check that the chart appears below the result cards and updates when new
numbers are entered.

### Step 5: Add AI Recommendation Through The Backend

The AI key must stay on the server. The browser should call your backend, and
the backend should call OpenAI.

In Claude Code, ask:

```text
Add an AI recommendation endpoint to server.js.

Endpoint:
POST /api/recommendation

Requirements:
- Read OPENAI_API_KEY from process.env.
- Do not expose the API key to the browser.
- Receive current revenue, marketing budget, growth percentage, ROI,
  projected annual revenue, and total profit or loss from the request body.
- Validate that required values exist.
- Call OpenAI using the installed openai npm package.
- Ask for a short, practical recommendation for a small business owner.
- Return JSON with a recommendation field.
- If the API key is missing, return a helpful error message.
- If the OpenAI request fails, return a safe error message.
```

Then ask Claude Code:

```text
Update the frontend so that a Get AI Recommendation button appears after a
successful calculation.

When clicked:
- Send the latest calculation data to POST /api/recommendation with fetch().
- Show a loading state while waiting.
- Display the recommendation below the chart.
- Show a clear error message if the request fails.
```

Check that the recommendation appears only after a calculation is complete.

> [!CAUTION]
> Never commit or upload `.env`. If an API key is accidentally shared, delete it
> from the provider dashboard and create a new one.

### Step 6: Add LocalStorage Saving

In Claude Code, ask:

```text
Add localStorage support.

Requirements:
- Save the latest input values and calculation results after each calculation.
- When the page loads, restore the latest saved values.
- If saved results exist, display them automatically.
- Add a small Reset button that clears the saved data and resets the form.
- Add comments explaining what localStorage is and why it helps here.
```

Check that the latest calculation returns after refreshing the browser.

### Step 7: Add PDF Report Download

In Claude Code, ask:

```text
Add a Download PDF Report feature using jsPDF.

Requirements:
- Add jsPDF through a CDN script in index.html.
- Show the Download PDF Report button only after a calculation.
- Include the input values, result values, and AI recommendation if available.
- Include the chart image in the PDF if possible.
- Name the file marketing-roi-report.pdf.
- Show a helpful message if no calculation exists yet.
```

Check that the downloaded PDF includes the main result summary.

### Step 8: Add Share Results

In Claude Code, ask:

```text
Add a Share Results feature.

Requirements:
- Create a URL with the input values as query parameters.
- Use URLSearchParams.
- Copy the share URL to the clipboard.
- Show a success message after copying.
- When the page loads with query parameters, fill in the form and calculate
  the results automatically.
```

Check by copying the share link, opening it in a new tab, and confirming the
same result is restored.

### Step 9: Polish The Design

In Claude Code, ask:

```text
Improve the final design and user experience.

Requirements:
- Add a fade-in animation when results appear.
- Add shadows to cards and buttons.
- Improve spacing, typography, and mobile layout.
- Make buttons easy to tap on mobile.
- Add a calculator icon or simple visual mark to the title.
- Add a footer with Built with Claude Code.
- Keep the design professional for a small business audience.
```

Check the page on a narrow browser width and confirm it is easy to use.

## Final Checklist

Before submitting, confirm that:

- The server starts with `npm run dev`.
- The frontend loads from [local application](http://localhost:3000).
- The form validates bad input.
- ROI calculations are correct.
- Results are formatted clearly in NIS.
- The chart appears and updates correctly.
- The AI recommendation works through the backend.
- The API key is only stored in `.env`.
- `.env` is listed in `.gitignore`.
- LocalStorage restores the latest calculation after refresh.
- The PDF report downloads successfully.
- The share link restores the same calculation in a new tab.
- The layout works on mobile.
- Tooltips are visible and helpful.
- The design looks clean and professional.

## Submission Requirements

Submit the completed project folder with:

- `server.js`.
- `package.json`.
- `package-lock.json`, if it exists.
- `public/index.html`.
- `public/styles.css`.
- `public/app.js`.
- Any additional frontend files you created.
- Screenshots of the calculator, chart, PDF, and AI recommendation.

Do not submit:

- `node_modules/`.
- `.env`.
- Any real API key.

## Grading Rubric

| Area | Requirement |
| ---- | ---- |
| Functionality | Calculator, chart, AI, PDF, sharing, and saving all work. |
| Security | The API key is stored only in `.env` and never exposed in frontend code. |
| Code Quality | Files are organized, readable, and easy to understand. |
| User Experience | The tool is clear, responsive, and professional. |
| Testing | Each feature was checked with realistic values and edge cases. |

## Troubleshooting Tips

- If `npm run dev` fails, check that dependencies were installed with
  `npm install`.
- If the AI feature fails, confirm that `.env` contains `OPENAI_API_KEY` and
  that the server was restarted after editing `.env`.
- If the chart does not appear, check that the Chart.js CDN script is loaded
  before `app.js`.
- If PDF export fails, check that the jsPDF CDN script is loaded before
  `app.js`.
- If the share link does not restore values, inspect the query parameters in
  the browser address bar.
- If LocalStorage behaves strangely, use the browser developer tools to clear
  site data and test again.
