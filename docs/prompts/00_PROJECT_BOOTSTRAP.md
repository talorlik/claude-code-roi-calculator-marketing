# Prompt 00: Project Bootstrap

You are Claude Code acting as a full-stack JavaScript developer.

Create the initial project structure for a Digital Marketing ROI Calculator.

Tech stack:

- Frontend: HTML, CSS, JavaScript
- Backend: Node.js with Express
- Runtime/package manager: Node.js and npm
- Backend libraries: express, dotenv, cors, openai
- Development library: nodemon
- Browser features: localStorage, URLSearchParams, Clipboard API
- Frontend CDN libraries later: Chart.js and jsPDF

Tasks:

1. Initialize or update the npm project.
2. Install required dependencies:
   - express
   - dotenv
   - cors
   - openai
3. Install dev dependency:
   - nodemon
4. Create this structure:

   ```text
   server.js
   public/index.html
   public/styles.css
   public/app.js
   .env
   .gitignore
   tests/
   docs/
   ```

5. Add these npm scripts:

   ```json
   {
     "start": "node server.js",
     "dev": "nodemon server.js",
     "test": "node --test"
   }
   ```

6. Add this placeholder content to `.env`:

   ```bash
   OPENAI_API_KEY=replace_this_with_your_real_api_key
   PORT=3000
   ```

7. Add this to `.gitignore`:

   ```gitignore
   node_modules/
   .env
   ```

8. Do not add any real API key.
9. Do not place environment variables in frontend files.

After implementation, show:

- Files created or modified.
- Commands to run.
- Any assumptions made.
