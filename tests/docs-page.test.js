"use strict";

const test = require("node:test");
const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");

const root = path.join(__dirname, "..");
const docsDir = path.join(root, "docs");

function readDocsFile(fileName) {
  return fs.readFileSync(path.join(docsDir, fileName), "utf8");
}

test("GitHub Page includes project metadata, assets, and README-only CTA", () => {
  const html = readDocsFile("index.html");

  assert.match(html, /Digital Marketing ROI Calculator \| Project Showcase/);
  assert.match(html, /<html lang="en" data-theme="dark">/);
  assert.match(html, /<link rel="icon" href=".\/favicon\.ico" type="image\/x-icon" \/>/);
  assert.match(html, /src=".\/header_banner\.png"/);
  assert.match(html, /Read README/);
  assert.match(
    html,
    /https:\/\/github\.com\/talorlik\/claude-code-roi-calculator-marketing\/blob\/main\/README\.md/
  );
  assert.doesNotMatch(html, /Open Live App/i);
  assert.doesNotMatch(html, /localhost:3000/);
});

test("GitHub Page links to the expected project documentation", () => {
  const html = readDocsFile("index.html");

  for (const expectedPath of [
    "docs/assignment/ASSIGNMENT.md",
    "docs/planning/PRD.md",
    "docs/planning/TECHNICAL_REQUIREMENTS.md",
    "docs/planning/TASK_BREAKDOWN.md",
    "docs/prompts"
  ]) {
    assert.match(html, new RegExp(expectedPath.replace(/[/.]/g, "\\$&")));
  }
});

test("GitHub Page script supports theme persistence and structured data", () => {
  const js = readDocsFile("main.js");

  assert.match(js, /roi-calculator-docs-theme/);
  assert.match(js, /prefers-color-scheme: light/);
  assert.match(js, /application\/ld\+json/);
  assert.match(js, /SoftwareSourceCode/);
  assert.match(js, /claude-code-roi-calculator-marketing/);
});

test("GitHub Page styles define both light and dark themes", () => {
  const css = readDocsFile("styles.css");

  assert.match(css, /\[data-theme="dark"\]/);
  assert.match(css, /\[data-theme="light"\]/);
  assert.match(css, /\.hero-banner/);
  assert.match(css, /\.theme-toggle/);
});
