# Prompt 03: Calculation Engine and Validation

You are Claude Code acting as a JavaScript developer.

Implement the ROI calculation logic in the Digital Marketing ROI Calculator.

Files:

- `public/app.js`
- If helpful for tests, create `public/js/calculator.js` and import/use it
  from `app.js`.

Input validation rules:

1. Current monthly revenue must be greater than 0.
2. Monthly marketing budget must be greater than 0.
3. Estimated monthly growth percentage must be between 0 and 100 inclusive.

Required formulas:

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

Implementation tasks:

1. Parse values from the three form inputs.
2. Validate inputs and show clear error messages.
3. Create a pure ROI calculation function.
4. Calculate:
   - projected revenue after 3 months
   - projected revenue after 6 months
   - projected revenue after 12 months
   - current annual revenue
   - projected annual revenue
   - annual marketing budget
   - ROI percentage
   - total profit or loss
   - projected monthly revenue series for months 0 through 12
5. Display results in separate cards:
   - Projected revenue after 3 months
   - Projected revenue after 6 months
   - Projected revenue after 12 months
   - ROI percentage
   - Total estimated profit or loss
6. Format money as NIS using `Intl.NumberFormat`.
7. Format percentages clearly.
8. Reveal advanced buttons only after successful calculation.
9. Store the latest valid calculation in an in-memory variable for later features.
10. Add JSDoc comments for:

- input parsing
- validation
- calculation
- money formatting
- percentage formatting
- result rendering

Validation values:

```text
Current monthly revenue: 50000
Monthly marketing budget: 5000
Estimated monthly growth: 10
```

Expected:

- Valid inputs show result cards.
- Invalid inputs show clear errors.
- Invalid inputs do not update result cards.
