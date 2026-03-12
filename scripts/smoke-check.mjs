import fs from "node:fs";
import path from "node:path";

const root = process.cwd();

const requiredFiles = [
  "public/index.html",
  "public/app.js",
  "public/boot.js",
  "public/sw.js",
  "public/manifest.json",
  "public/icon-192.png",
  "public/icon-512.png",
  "public/og-image.png",
  "public/privacy.html",
  "public/terms.html",
  "public/account-deletion.html",
  "public/vendor/react.production.min.js",
  "public/vendor/react-dom.production.min.js",
  "public/vendor/htm.umd.js",
  "public/vendor/supabase.js",
  "api/chat.js",
  ".env.example",
  "LAUNCH_RUNBOOK.md",
  "launch_ready_supabase.sql",
  "vercel.json",
  "README.md"
];

const failures = [];

for (const file of requiredFiles) {
  if (!fs.existsSync(path.join(root, file))) {
    failures.push(`Missing required file: ${file}`);
  }
}

const indexHtml = fs.readFileSync(path.join(root, "public/index.html"), "utf8");
if (indexHtml.includes("unsafe-eval")) failures.push("CSP still includes unsafe-eval.");
if (indexHtml.includes("default-src *")) failures.push("CSP is still using wildcard default-src.");
if (!indexHtml.includes('/vendor/react.production.min.js')) failures.push("Frontend is not loading vendored React.");

const apiChat = fs.readFileSync(path.join(root, "api/chat.js"), "utf8");
if (!apiChat.includes("Authentication required")) failures.push("API chat auth protection is missing.");
if (!apiChat.includes("Origin not allowed")) failures.push("API chat origin restriction is missing.");
if (!apiChat.includes("Too many AI requests")) failures.push("API chat rate limit is missing.");

const readme = fs.readFileSync(path.join(root, "README.md"), "utf8");
if (!readme.includes("ANTHROPIC_API_KEY")) failures.push("README is missing Anthropic env var documentation.");
if (!readme.includes("Launch checklist")) failures.push("README is missing the launch checklist.");
if (!readme.includes("launch_ready_supabase.sql")) failures.push("README is missing the consolidated Supabase launch script.");
if (!readme.includes("LAUNCH_RUNBOOK.md")) failures.push("README is missing the exact launch sequence reference.");

if (failures.length) {
  console.error("Smoke check failed:\n");
  for (const failure of failures) console.error(`- ${failure}`);
  process.exit(1);
}

console.log("Smoke check passed.");
