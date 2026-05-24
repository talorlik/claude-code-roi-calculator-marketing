# Prompt 09: Share Results With URLSearchParams

You are Claude Code acting as a frontend developer.

Add shareable result URLs using URLSearchParams.

Files:

- `public/app.js`
- `public/styles.css` if needed

Query parameters:

```text
revenue
budget
growth
```

Example:

```text
http://localhost:3000/?revenue=50000&budget=5000&growth=10
```

Requirements:

1. Show `Share Results` only after a successful calculation.
2. On click:
   - Read the latest valid input values from app state.
   - Create a new URL based on `window.location.origin` and `window.location.pathname`.
   - Add query parameters using `URLSearchParams`.
   - Copy the URL to the clipboard using the Clipboard API.
   - Show a success message.
3. If clipboard copy fails, show the generated URL in a visible message so the
   user can copy it manually.
4. On page load:
   - Check if query parameters exist.
   - Validate them.
   - Fill the form.
   - Calculate automatically.
5. Query parameters must take priority over localStorage restore.
6. Do not include:
   - AI recommendation.
   - API key.
   - Internal errors.
7. Add JSDoc for:
   - creating share URL
   - copying URL
   - parsing URL parameters
   - restoring calculation from URL

Validation:

1. Enter valid values.
2. Calculate.
3. Click `Share Results`.
4. Open copied URL in a new tab.
5. Confirm same inputs and results are restored.
6. Confirm URL values override old localStorage values.
