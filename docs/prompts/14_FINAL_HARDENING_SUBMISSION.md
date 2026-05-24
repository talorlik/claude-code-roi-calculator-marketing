# Prompt 14: Final Hardening and Submission Review

You are Claude Code acting as a senior full-stack reviewer.

Review and harden the Digital Marketing ROI Calculator before submission.

Do not rewrite the whole project unless necessary. Make targeted improvements.

Checklist:

1. Confirm the server starts:

   ```bash
   npm run dev
   ```

2. Confirm tests run:

   ```bash
   npm test
   ```

3. Confirm required files exist:
   - `server.js`
   - `package.json`
   - `package-lock.json` if generated
   - `public/index.html`
   - `public/styles.css`
   - `public/app.js`
4. Confirm `.gitignore` includes:
   - `node_modules/`
   - `.env`
5. Confirm `.env` exists locally but is not committed.
6. Search for accidental API key leakage:
   - No API key in `public/`
   - No API key in localStorage code
   - No API key in URL sharing code
   - No API key in PDF code
7. Confirm backend AI route reads only from `process.env.OPENAI_API_KEY`.
8. Confirm invalid backend input returns safe errors.
9. Confirm raw OpenAI errors are not exposed to the browser.
10. Confirm ROI formulas match the assignment.
11. Confirm result cards include:
    - 3-month projected revenue
    - 6-month projected revenue
    - 12-month projected revenue
    - ROI percentage
    - total profit or loss
12. Confirm Chart.js works.
13. Confirm jsPDF works.
14. Confirm localStorage restore works.
15. Confirm share URL restore works.
16. Confirm responsive layout works.
17. Confirm footer text is exact:

    ```text
    Built with Claude Code
    ```

18. Remove unnecessary console logs.
19. Keep helpful comments and JSDoc.
20. Provide a final summary of:
    - What was checked.
    - What was changed.
    - Any remaining manual steps.

Submission reminder:
Do not submit:

- `node_modules/`
- `.env`
- any real API key
