# Prompt 04: Chart.js Revenue Growth Chart

You are Claude Code acting as a frontend developer.

Add Chart.js revenue growth visualization to the Digital Marketing ROI Calculator.

Files:

- `public/index.html`
- `public/app.js`
- `public/styles.css`

Requirements:

1. Add Chart.js through a CDN script in `index.html`.
2. Make sure Chart.js is loaded before `app.js`.
3. Use the existing chart canvas.
4. Render a line chart after a successful calculation.
5. X-axis labels must be months 0 through 12.
6. Y-axis must show revenue in NIS.
7. Dataset 1:
   - Label: current revenue baseline
   - Flat line using current monthly revenue for all 13 points
   - Use blue
8. Dataset 2:
   - Label: projected revenue
   - Use the projected monthly revenue series
   - Use green
9. Destroy the old Chart.js instance before creating a new one.
10. Update the chart whenever the user recalculates.
11. Keep the chart responsive.
12. Add JSDoc to the chart rendering function.
13. Do not break existing calculation behavior.

Validation:

1. Run the app.
2. Calculate with:

   ```text
   Revenue: 50000
   Budget: 5000
   Growth: 10
   ```

3. Confirm the chart appears.
4. Change values and recalculate.
5. Confirm the chart updates without duplicate charts.
