// ============================================================
//  GET /api/slots?date=YYYY-MM-DD
//  Devuelve los horarios LIBRES de ese día (config menos los ya reservados).
//  Lee las reservas desde Supabase (PostgREST) con la service key (server-side).
// ============================================================

import { guard, fail } from "./_lib/security.js";

// Horario laboral: 10:00 a 18:00, slots de 30 min (último arranque 17:30).
function slotTimes() {
  const out = [];
  for (let h = 10; h < 18; h++) {
    out.push(`${String(h).padStart(2, "0")}:00`);
    out.push(`${String(h).padStart(2, "0")}:30`);
  }
  return out;
}
const SLOT_TIMES = slotTimes();

export default async function handler(req, res) {
  if (!guard(req, res, { methods: ["GET"], limit: 60, windowMs: 60_000, name: "slots" })) return;

  const date = String((req.query && req.query.date) || "").slice(0, 10);
  if (!/^\d{4}-\d{2}-\d{2}$/.test(date)) {
    fail(res, 400, "Invalid date");
    return;
  }

  // Sin fines de semana
  const dow = new Date(date + "T00:00:00").getUTCDay(); // 0 dom, 6 sáb
  if (dow === 0 || dow === 6) {
    res.status(200).json({ slots: [] });
    return;
  }

  const url = process.env.SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_KEY;
  if (!url || !key) {
    fail(res, 500, "Service temporarily unavailable", "Supabase no configurado");
    return;
  }

  try {
    // date ya está validado por regex (sin riesgo de inyección en la query).
    const r = await fetch(`${url}/rest/v1/bookings?date=eq.${date}&select=time`, {
      headers: { apikey: key, Authorization: `Bearer ${key}` },
    });
    const taken = r.ok ? (await r.json()).map((x) => x.time) : [];
    const slots = SLOT_TIMES.filter((t) => !taken.includes(t));
    res.status(200).json({ slots });
  } catch (e) {
    fail(res, 500, "Something went wrong. Please try again.", e);
  }
}
