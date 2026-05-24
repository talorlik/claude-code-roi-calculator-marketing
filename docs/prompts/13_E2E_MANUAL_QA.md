# Prompt 13: E2E and Manual QA Checklist

You are Claude Code acting as a QA engineer.

Create an end-to-end manual QA checklist for the Digital Marketing ROI Calculator.

File:

- `tests/E2E_CHECKLIST.md`

Requirements:
Create a markdown checklist with these sections:

1. Environment setup
   - `npm install`
   - `.env` configured
   - `npm run dev`
   - app opens at `http://localhost:3000`

2. Valid calculation flow
   - Use:

     ```text
     Current monthly revenue: 50000
     Monthly marketing budget: 5000
     Estimated monthly growth: 10
     ```

   - Confirm results appear.
   - Confirm values are formatted in NIS.
   - Confirm buttons appear.

3. Invalid input flow
   - Empty fields.
   - Zero revenue.
   - Negative budget.
   - Growth below 0.
   - Growth above 100.
   - Confirm clear errors.

4. Chart flow
   - Chart appears after valid calculation.
   - Chart updates after recalculation.
   - No duplicate chart appears.

5. AI recommendation flow
   - Button appears only after calculation.
   - Loading state appears.
   - Recommendation appears or safe error appears.
   - API key is not visible in frontend.

6. localStorage flow
   - Calculate.
   - Refresh.
   - Inputs and results restore.
   - Reset clears data.

7. Share URL flow
   - Click Share Results.
   - Open copied URL in new tab.
   - Same calculation restores.
   - Query params override old localStorage.

8. PDF flow
   - Download PDF.
   - Confirm PDF includes inputs, results, and chart if possible.
   - Confirm AI recommendation is included when available.

9. Mobile responsive flow
   - Resize to narrow width.
   - Confirm no horizontal overflow.
   - Confirm buttons are easy to tap.
   - Confirm chart is readable.

10. Submission screenshot checklist

- Calculator form.
- Result cards.
- Chart.
- PDF report.
- AI recommendation.

Use markdown checkboxes.
Keep the checklist practical and direct.
