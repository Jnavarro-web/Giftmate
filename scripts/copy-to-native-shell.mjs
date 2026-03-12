#!/usr/bin/env node
/**
 * Copies the web app into native-shell for Capacitor iOS/Android.
 * Run before: npx cap sync
 * This avoids blank screen when loading from remote server.url on iOS simulator.
 */
import fs from "node:fs";
import path from "node:path";

const root = process.cwd();
const out = path.join(root, "native-shell");

const files = [
  ["index.html", "index.html"],
  ["app.js", "app.js"],
  ["manifest.json", "manifest.json"],
  ["reset-password.html", "reset-password.html"],
  ["icon-192.png", "icon-192.png"],
  ["icon-512.png", "icon-512.png"],
  ["og-image.png", "og-image.png"],
];

if (!fs.existsSync(out)) fs.mkdirSync(out, { recursive: true });

for (const [src, dest] of files) {
  const srcPath = path.join(root, src);
  const destPath = path.join(out, dest);
  if (fs.existsSync(srcPath)) {
    fs.copyFileSync(srcPath, destPath);
    console.log(`Copied ${src} -> native-shell/${dest}`);
  } else {
    console.warn(`Skip ${src} (not found)`);
  }
}

console.log("Done. Run: npx cap sync ios");
