# Prompt 07: localStorage Persistence

You are Claude Code acting as a frontend developer.

Add localStorage support to the Digital Marketing ROI Calculator.

Files:

- `public/app.js`
- If helpful, create `public/js/storage.js`.

Storage key:

```text
roiCalculatorState
```

Requirements:

1. Save the latest input values after every successful calculation.
2. Save the latest result values after every successful calculation.
3. Save the AI recommendation after it is generated.
4. On page load, restore saved inputs if no URL query parameters are present.
5. If saved results exist, display them automatically.
6. Re-render the chart from saved results.
7. Add a reset button that:
   - Clears localStorage.
   - Clears the form.
   - Clears result cards.
   - Clears chart.
   - Clears AI recommendation.
   - Hides advanced buttons.
   - Clears status messages.
8. Add comments explaining:
   - What localStorage is.
   - Why it helps restore the latest calculation.
   - Why it should not store secrets.
9. Do not store the OpenAI API key.
10. Add JSDoc to:
    - save function
    - restore function
    - reset function

Restore precedence:

1. URL query parameters will be implemented later and should take priority.
2. For now, restore localStorage on page load.

Validation:

1. Enter valid values.
2. Calculate.
3. Refresh the page.
4. Confirm inputs, results, and chart restore.
5. Click reset.
6. Refresh again.
7. Confirm the app starts empty.
