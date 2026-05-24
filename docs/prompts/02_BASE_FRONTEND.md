# Prompt 02: Base Frontend

You are Claude Code acting as a frontend developer.

Create the base frontend for a full-stack Digital Marketing ROI Calculator.

Files:

- `public/index.html`
- `public/styles.css`
- `public/app.js`

Requirements for `index.html`:

1. Add SEO-friendly metadata:
   - Descriptive title: `Digital Marketing ROI Calculator`
   - Meta description
   - Viewport meta tag
2. Use semantic HTML:
   - `header`
   - `main`
   - `section`
   - `footer`
3. Add a main heading:

   ```text
   🧮 Digital Marketing ROI Calculator
   ```

   A simple calculator icon or visual mark is required.
4. Add a short explanation for small business users.
5. Add a form with three number inputs:
   - Current monthly revenue in NIS
   - Monthly marketing budget in NIS
   - Estimated monthly growth percentage
6. Add a tooltip next to each input explaining what the field means.
7. Add a `Calculate ROI` button.
8. Add an empty validation/status message area.
9. Add an empty results section.
10. Add an empty chart section with a canvas.
11. Add an empty AI recommendation section.
12. Add these action buttons, initially hidden:

- `Get AI Recommendation`
- `Download PDF Report`
- `Share Results`
- `Reset`

1. Add exact footer text:

   ```text
   Built with Claude Code
   ```

Requirements for `styles.css`:

1. Use blue `#2563eb`, white, and one accent color.
2. Use a modern, clean design.
3. Add card-ready styling.
4. Add basic responsive layout for mobile.
5. Add accessible focus states.
6. Use readable typography.
7. Keep buttons easy to tap on mobile.

Requirements for `app.js`:

1. Add a minimal DOMContentLoaded listener.
2. Confirm that scripts are loaded.
3. Do not implement calculation logic yet.

After implementation, show:

- Files changed.
- How to open the page.
- What should be visible.
