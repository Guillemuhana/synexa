// ============================================================
//  POST /api/book  { date, time, name, company, email, phone, type, note }
//  Inserta la cita en Supabase. La restricción UNIQUE(date, time) evita
//  doble reserva: si el slot ya está tomado, Supabase devuelve 409.
// ============================================================

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
  if (req.method !== "POST") {
    res.status(405).json({ error: "Method not allowed" });
    return;
  }

  const url = process.env.SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_KEY;
  if (!url || !key) {
    res.status(500).json({ error: "Supabase no configurado" });
    return;
  }

  try {
    const b = typeof req.body === "string" ? JSON.parse(req.body || "{}") : (req.body || {});
    const { date, time, name, company, email, phone, type, note } = b;

    if (!/^\d{4}-\d{2}-\d{2}$/.test(String(date || "")) || !SLOT_TIMES.includes(time)) {
      res.status(400).json({ error: "Fecha u horario inválidos" });
      return;
    }
    if (!name || !String(name).trim() || (!email && !phone)) {
      res.status(400).json({ error: "Necesitamos tu nombre y un email o teléfono" });
      return;
    }

    const r = await fetch(`${url}/rest/v1/bookings`, {
      method: "POST",
      headers: {
        apikey: key,
        Authorization: `Bearer ${key}`,
        "Content-Type": "application/json",
        Prefer: "return=minimal",
      },
      body: JSON.stringify({
        date,
        time,
        name: String(name).slice(0, 120),
        company: company ? String(company).slice(0, 120) : null,
        email: email ? String(email).slice(0, 160) : null,
        phone: phone ? String(phone).slice(0, 40) : null,
        type: type || "llamada",
        note: note ? String(note).slice(0, 500) : null,
      }),
    });

    if (r.status === 201) {
      res.status(200).json({ ok: true });
      return;
    }
    if (r.status === 409) {
      res.status(409).json({ error: "Ese horario se acaba de ocupar. Elegí otro, por favor." });
      return;
    }
    const detail = await r.text();
    res.status(502).json({ error: "No se pudo guardar la reserva", detail: detail.slice(0, 300) });
  } catch (e) {
    res.status(500).json({ error: String((e && e.message) || e) });
  }
}
