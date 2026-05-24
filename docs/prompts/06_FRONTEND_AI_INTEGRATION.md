# Prompt 06: Frontend AI Recommendation Integration

You are Claude Code acting as a frontend developer.

Connect the frontend to the backend AI recommendation route.

Files:

- `public/app.js`
- `public/styles.css`
- `public/index.html` if needed

Requirements:

1. Show `Get AI Recommendation` only after a successful calculation.
2. When clicked, send the latest calculation data to:

   ```text
   POST /api/recommendation
   ```

3. Use `fetch()` with JSON:

   ```js
   {
     method: "POST",
     headers: { "Content-Type": "application/json" },
     body: JSON.stringify(...)
   }
   ```

4. Send:
   - currentMonthlyRevenue
   - monthlyMarketingBudget
   - monthlyGrowthPercentage
   - roiPercentage
   - projectedAnnualRevenue
   - totalProfitOrLoss
5. Show a loading state while waiting.
6. Disable the AI button while the request is pending.
7. Display the recommendation below the chart.
8. Show a clear error message if the request fails.
9. Store the recommendation in the current app state so the PDF and
   localStorage features can use it later.
10. Do not expose the OpenAI API key anywhere in frontend code.
11. Add JSDoc for the AI fetch function and recommendation rendering function.
12. Preserve existing calculator and chart behavior.

Validation:

1. Calculate ROI.
2. Confirm the AI button appears.
3. Click the AI button.
4. Confirm loading state appears.
5. Confirm recommendation or safe error appears.
