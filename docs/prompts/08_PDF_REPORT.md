# Prompt 08: PDF Report Download

You are Claude Code acting as a frontend developer.

Add PDF report export using jsPDF.

Files:

- `public/index.html`
- `public/app.js`
- `public/styles.css` if needed

Requirements:

1. Add jsPDF through a CDN script in `index.html`.
2. Load jsPDF before `app.js`.
3. Show `Download PDF Report` only after a successful calculation.
4. When clicked, generate a PDF named:

   ```text
   marketing-roi-report.pdf
   ```

5. The PDF must include:
   - Report title: `Digital Marketing ROI Report`
   - Generated date
   - Input values
   - Result values
   - AI recommendation if available
   - Chart image if available
   - A short note that projections are estimates, not guarantees
6. Use the current result state. Do not recalculate from the DOM if current
   state exists.
7. Include chart image with `canvas.toDataURL("image/png")` if possible.
8. If chart export fails, still generate the PDF without the chart.
9. If no calculation exists, show a helpful message and do not generate an
   empty report.
10. Add JSDoc to the PDF generation function.
11. Do not include the OpenAI API key or any secrets in the PDF.

Validation:

1. Calculate ROI.
2. Download PDF.
3. Confirm the PDF includes inputs and results.
4. Generate AI recommendation.
5. Download PDF again.
6. Confirm the recommendation appears.
