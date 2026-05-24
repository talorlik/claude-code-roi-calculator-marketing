# Prompt 11: Unit Tests

You are Claude Code acting as a JavaScript test engineer.

Add unit tests for the Digital Marketing ROI Calculator.

Preferred approach:

- Use Node's built-in `node:test` and `assert`.
- Avoid adding external test libraries unless necessary.

Files:

- `tests/calculator.test.js`
- Any required small refactor to make calculation logic testable

Requirements:

1. Ensure `package.json` includes:

   ```json
   {
     "scripts": {
       "test": "node --test"
     }
   }
   ```

2. Refactor calculation logic into a testable pure function if needed.
3. Test valid calculation with:

   ```text
   revenue = 50000
   budget = 5000
   growth = 10
   ```

4. Test that projected values increase when growth is positive.
5. Test that monthly series includes months 0 through 12, meaning 13 values.
6. Test invalid revenue:
   - 0
   - negative number
   - non-number
7. Test invalid budget:
   - 0
   - negative number
   - non-number
8. Test invalid growth:
   - negative number
   - greater than 100
   - non-number
9. Test valid growth boundaries:
   - 0
   - 100
10. Tests must not depend on DOM.
11. Tests must not require OpenAI API key.
12. Keep implementation beginner-readable.

Validation:
Run:

```bash
npm test
```

Expected:

- All unit tests pass.
