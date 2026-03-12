/**
 * Serves og-image.png for link previews (WhatsApp, Facebook, etc.).
 * Bypasses static file serving issues on Vercel.
 */
import fs from "node:fs";
import path from "node:path";

export default function handler(req, res) {
  if (req.method !== "GET") {
    res.setHeader("Allow", "GET");
    return res.status(405).end();
  }
  try {
    const filePath = path.join(process.cwd(), "og-image.png");
    if (!fs.existsSync(filePath)) {
      return res.status(404).send("Not found");
    }
    const buffer = fs.readFileSync(filePath);
    res.setHeader("Content-Type", "image/png");
    res.setHeader("Cache-Control", "public, max-age=86400, immutable");
    res.setHeader("Content-Length", buffer.length);
    res.send(buffer);
  } catch (err) {
    console.error("og-image handler error:", err);
    res.status(500).send("Internal server error");
  }
}
