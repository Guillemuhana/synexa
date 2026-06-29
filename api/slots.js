// ============================================================
//  GET /api/slots?date=YYYY-MM-DD
//  Devuelve los horarios LIBRES de ese día (config menos los ya reservados).
//  Lee las reservas desde Supabase (PostgREST) con la service key (server-side).
// ============================================================

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
  const date = String((req.query && req.query.date) || "").slice(0, 10);
  if (!/^\d{4}-\d{2}-\d{2}$/.test(date)) {
    res.status(400).json({ error: "Fecha inválida" });
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
    res.status(500).json({ error: "Supabase no configurado" });
    return;
  }

  try {
    const r = await fetch(`${url}/rest/v1/bookings?date=eq.${date}&select=time`, {
      headers: { apikey: key, Authorization: `Bearer ${key}` },
    });
    const taken = r.ok ? (await r.json()).map((x) => x.time) : [];
    const slots = SLOT_TIMES.filter((t) => !taken.includes(t));
    res.status(200).json({ slots });
  } catch (e) {
    res.status(500).json({ error: String((e && e.message) || e) });
  }
}
