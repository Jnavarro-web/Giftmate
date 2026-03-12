const ANTHROPIC_API_URL = "https://api.anthropic.com/v1/messages";

const ALLOWED_MODELS = ["claude-sonnet-4-20250514", "claude-3-5-haiku-20241022", "claude-3-5-sonnet-20241022", "claude-3-haiku-20240307"];
const MAX_MESSAGE_LENGTH = 4000;
const RATE_LIMIT_WINDOW_MS = 60_000;
const RATE_LIMIT_MAX = 12;

// In-memory rate limit store (persists across warm invocations)
const rateLimitStore = globalThis.__giftmateRateLimitStore || new Map();
globalThis.__giftmateRateLimitStore = rateLimitStore;

function getAllowedOrigins() {
  const origins = [
    "https://giftm8.app",
    "https://www.giftm8.app",
    "https://giftmate-sigma.vercel.app"
  ];
  if (process.env.APP_ORIGIN) origins.push(process.env.APP_ORIGIN);
  return origins;
}

function applyCors(req, res) {
  const origin = req.headers.origin || "";
  const allowed = getAllowedOrigins();
  const isLocalhost = origin.startsWith("http://localhost") || origin.startsWith("http://127.0.0.1");
  const isCapacitor = origin.startsWith("capacitor://") || origin.startsWith("ionic://") || origin === "null";
  const isVercelApp = origin.includes("vercel.app");
  const isGiftm8 = origin.includes("giftm8");
  if (allowed.includes(origin) || isLocalhost || isCapacitor || isVercelApp || isGiftm8) {
    res.setHeader("Access-Control-Allow-Origin", origin || "*");
    res.setHeader("Vary", "Origin");
  } else if (origin) {
    return false;
  }
  res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");
  return true;
}

async function parseBody(req) {
  if (req.body && typeof req.body === "object") return req.body;
  return new Promise((resolve, reject) => {
    let data = "";
    req.on("data", chunk => { data += chunk; });
    req.on("end", () => {
      try { resolve(JSON.parse(data)); } catch { reject(new Error("Invalid JSON")); }
    });
  });
}

function sanitizeMessages(messages) {
  if (!Array.isArray(messages)) throw new Error("messages must be an array");
  return messages.map(m => {
    if (!["user", "assistant"].includes(m.role)) throw new Error("Invalid message role");
    const content = typeof m.content === "string" ? m.content : JSON.stringify(m.content);
    if (content.length > MAX_MESSAGE_LENGTH) throw new Error("Message too long");
    return { role: m.role, content };
  });
}

function checkRateLimit(userId) {
  const now = Date.now();
  const entry = rateLimitStore.get(userId) || { count: 0, resetAt: now + RATE_LIMIT_WINDOW_MS };
  if (now > entry.resetAt) {
    entry.count = 0;
    entry.resetAt = now + RATE_LIMIT_WINDOW_MS;
  }
  entry.count++;
  rateLimitStore.set(userId, entry);
  // Clean up old entries periodically
  if (rateLimitStore.size > 5000) {
    for (const [k, v] of rateLimitStore) {
      if (now > v.resetAt) rateLimitStore.delete(k);
    }
  }
  return entry.count <= RATE_LIMIT_MAX;
}

function decodeJwt(token) {
  try {
    const parts = token.split(".");
    if (parts.length !== 3) return null;
    // Buffer is available in Node.js (Vercel serverless runtime)
    const payload = JSON.parse(Buffer.from(parts[1], "base64url").toString("utf8"));
    return payload;
  } catch {
    return null;
  }
}

function getAuthenticatedUser(req) {
  const authHeader = req.headers.authorization || "";
  if (!authHeader.startsWith("Bearer ")) return null;
  const accessToken = authHeader.slice(7).trim();
  if (!accessToken) return null;
  const payload = decodeJwt(accessToken);
  if (!payload?.sub) return null;
  // Check token is not expired
  const nowSecs = Math.floor(Date.now() / 1000);
  if (payload.exp && payload.exp < nowSecs) return null;
  return { accessToken, user: { id: payload.sub } };
}

export default async function handler(req, res) {
  if (!applyCors(req, res)) {
    return res.status(403).json({ error: "Origin not allowed" });
  }
  if (req.method === "OPTIONS") return res.status(200).end();
  if (req.method !== "POST") return res.status(405).json({ error: "Method not allowed" });
  if (!process.env.ANTHROPIC_API_KEY) {
    return res.status(500).json({ error: "ANTHROPIC_API_KEY is not configured" });
  }

  try {
    const auth = getAuthenticatedUser(req);
    if (!auth?.user?.id) {
      return res.status(401).json({ error: "Authentication required" });
    }
    if (!checkRateLimit(auth.user.id)) {
      return res.status(429).json({ error: "Too many AI requests. Please wait a minute and try again." });
    }

    const body = await parseBody(req);
    const model = body.model || "claude-3-5-haiku-20241022";
    if (!ALLOWED_MODELS.includes(model)) {
      return res.status(400).json({ error: "Model not allowed" });
    }
    const messages = sanitizeMessages(body.messages || []);
    const system = typeof body.system === "string" ? body.system.slice(0, 8000) : undefined;

    const anthropicPayload = {
      model,
      max_tokens: body.max_tokens || 1024,
      messages,
      ...(system ? { system } : {})
    };

    const response = await fetch(ANTHROPIC_API_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": process.env.ANTHROPIC_API_KEY,
        "anthropic-version": "2023-06-01"
      },
      body: JSON.stringify(anthropicPayload)
    });

    if (!response.ok) {
      const errText = await response.text();
      console.error("Anthropic API error:", response.status, errText);
      return res.status(response.status).json({ error: "AI service error" });
    }

    const data = await response.json();
    res.status(200).json(data);
  } catch (err) {
    console.error("Chat handler error:", err);
    res.status(500).json({ error: "Internal server error" });
  }
}
