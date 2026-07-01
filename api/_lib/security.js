// ============================================================
//  Utilidades de seguridad compartidas para las funciones /api.
//  (Vercel ignora las carpetas que empiezan con "_" como rutas,
//   así que esto NO es un endpoint: solo se importa.)
//
//  NOTA sobre el rate-limit: es en memoria y por instancia. En
//  serverless cada instancia "caliente" tiene su propio contador,
//  así que es una defensa best-effort (sube la vara contra abuso
//  trivial). Para límites duros y persistentes a escala, agregá
//  Upstash Redis / Vercel KV, o activá el Vercel Firewall /
//  Rate Limiting en el dashboard del proyecto.
// ============================================================

// --- IP del cliente (detrás del proxy de Vercel) ---
export function getClientIp(req) {
  const xff = req.headers["x-forwarded-for"];
  if (typeof xff === "string" && xff.length) return xff.split(",")[0].trim();
  return (req.socket && req.socket.remoteAddress) || "unknown";
}

// --- Rate limit en memoria (ventana deslizante simple) ---
const buckets = new Map(); // key -> { count, resetAt }

export function rateLimit(key, { limit = 30, windowMs = 60_000 } = {}) {
  const now = Date.now();
  const entry = buckets.get(key);

  if (!entry || now > entry.resetAt) {
    buckets.set(key, { count: 1, resetAt: now + windowMs });
    return { ok: true, remaining: limit - 1, retryAfter: 0 };
  }
  if (entry.count >= limit) {
    return { ok: false, remaining: 0, retryAfter: Math.ceil((entry.resetAt - now) / 1000) };
  }
  entry.count += 1;
  return { ok: true, remaining: limit - entry.count, retryAfter: 0 };
}

// Limpieza ocasional para que el Map no crezca indefinidamente.
function sweep() {
  const now = Date.now();
  for (const [k, v] of buckets) if (now > v.resetAt) buckets.delete(k);
}

// --- Allowlist de orígenes (bloquea uso cross-site desde el navegador) ---
// Permite same-origin (sin header Origin), *.vercel.app (incluye previews)
// y localhost en desarrollo. Cuando tengas dominio propio, agregalo acá.
const ALLOWED_HOSTS = [
  "ergagora.com",
  "www.ergagora.com",
];

export function isAllowedOrigin(req) {
  const origin = req.headers.origin;
  if (!origin) return true; // same-origin / server-to-server / GET sin Origin
  try {
    const host = new URL(origin).hostname;
    if (host === "localhost" || host === "127.0.0.1") return true;
    if (host.endsWith(".vercel.app")) return true;
    return ALLOWED_HOSTS.includes(host);
  } catch {
    return false;
  }
}

// --- Respuesta de error sanitizada (no filtra internals al cliente) ---
export function fail(res, status, publicMessage, internalError) {
  if (internalError) {
    // Queda en los logs del servidor (Vercel), nunca se envía al cliente.
    console.error(`[api] ${status} ${publicMessage}:`, internalError);
  }
  res.status(status).json({ error: publicMessage });
}

// --- Guard combinado: método + origin + rate limit. ---
// Devuelve true si la request puede continuar; si no, ya respondió.
export function guard(req, res, { methods = ["POST"], limit = 30, windowMs = 60_000, name = "api" } = {}) {
  if (Math.random() < 0.02) sweep();

  if (!methods.includes(req.method)) {
    res.setHeader("Allow", methods.join(", "));
    fail(res, 405, "Method not allowed");
    return false;
  }
  if (!isAllowedOrigin(req)) {
    fail(res, 403, "Forbidden");
    return false;
  }
  const ip = getClientIp(req);
  const rl = rateLimit(`${name}:${ip}`, { limit, windowMs });
  if (!rl.ok) {
    res.setHeader("Retry-After", String(rl.retryAfter));
    fail(res, 429, "Too many requests. Please slow down.");
    return false;
  }
  return true;
}
