# Prompt 05: Backend AI Recommendation Route

You are Claude Code acting as a backend developer.

Add a secure AI recommendation route to `server.js`.

Critical security rule:

- The OpenAI API key must be read only from `process.env.OPENAI_API_KEY`.
- Never expose the key to the frontend.
- Never place the key in `public/` files.
- Never return the key in any response.

Endpoint:

```text
POST /api/recommendation
```

Request body fields:

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

Requirements:

1. Import the `openai` npm package.
2. Read `OPENAI_API_KEY` from `process.env`.
3. Validate that all required values exist.
4. Validate that all required values are finite numbers.
5. Validate:
   - revenue > 0
   - budget > 0
   - growth >= 0
   - growth <= 100
6. If validation fails, return HTTP 400:

   ```json
   { "error": "Missing or invalid calculation data." }
   ```

7. If the API key is missing, return a safe error:

   ```json
   { "error": "AI recommendation is not configured. Add OPENAI_API_KEY to the server environment." }
   ```

8. Call OpenAI using the installed `openai` package.
9. Ask for a short, practical recommendation for a small business owner.
10. The recommendation must:
    - Be concise.
    - Be practical.
    - Mention that the estimate is a projection, not a guarantee.
    - Avoid financial advice language.
11. Return:

    ```json
    { "recommendation": "..." }
    ```

12. If the OpenAI request fails, return a safe error:

    ```json
    { "error": "AI recommendation is temporarily unavailable. Try again later." }
    ```

13. Do not return raw stack traces or raw OpenAI error messages to the browser.
14. Add JSDoc to validation/helper functions where useful.
15. Keep `GET /api/health` working.

After implementation, show:

- Files changed.
- Example curl request for testing.
- Security notes confirming the key is backend-only.
