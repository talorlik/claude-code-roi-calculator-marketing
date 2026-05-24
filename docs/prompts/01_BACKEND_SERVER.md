# Prompt 01: Backend Server

You are Claude Code acting as a Node.js and Express developer.

Create the backend server for the Digital Marketing ROI Calculator in `server.js`.

Requirements:

1. Load environment variables from `.env` using `dotenv`.
2. Import and configure:
   - express
   - cors
   - path if needed
3. Create an Express app.
4. Enable CORS with `app.use(cors())`.
5. Enable JSON body parsing with `app.use(express.json())`.
6. Serve static files from the `public` folder.
7. Add this health route:

   ```text
   GET /api/health
   ```

   It must return:

   ```json
   { "status": "ok" }
   ```

8. Start the server on `process.env.PORT || 3000`.
9. Structure the file so it can be tested later:
   - Export `app` if practical.
   - Only call `app.listen()` when the file is run directly.
10. Do not add the AI recommendation route yet.
11. Do not expose `OPENAI_API_KEY`.

Validation:

- `npm run dev` starts the server.
- `http://localhost:3000/api/health` returns `{ "status": "ok" }`.
- `http://localhost:3000` serves the frontend once `index.html` exists.

After implementation, show:

- Files changed.
- How to test the health route.
