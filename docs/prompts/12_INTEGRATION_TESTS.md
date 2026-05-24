# Prompt 12: Backend Integration Tests

You are Claude Code acting as a backend test engineer.

Add integration tests for the Express backend.

Preferred approach:

- Use Node's built-in `node:test`.
- Use Node's built-in `fetch` if available.
- Start the Express server on a test port inside the test file.
- Do not call the real OpenAI API in tests.

Files:

- `tests/server.test.js`
- `server.js` if needed for testability

Requirements:

1. Update `server.js` so the Express app can be imported without automatically
   starting a duplicate server.
2. Keep normal `npm run dev` behavior unchanged.
3. Test `GET /api/health`.
   Expected:
   - HTTP 200
   - JSON `{ "status": "ok" }`
4. Test static frontend loading from `/`.
   Expected:
   - HTTP 200
   - HTML response includes `Digital Marketing ROI Calculator`
5. Test `POST /api/recommendation` with missing/invalid body.
   Expected:
   - HTTP 400
   - safe JSON error
6. Test `POST /api/recommendation` with valid body but missing API key.
   Expected:
   - safe error
   - no secret leakage
7. Do not test real OpenAI completion unless explicitly mocked.
8. Tests must not require a real `.env` API key.
9. Tests must clean up the test server after running.

Validation:
Run:

```bash
npm test
```

Expected:

- Backend integration tests pass.
- No real external API calls happen.
