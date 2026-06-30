// ============================================================
//  POST /api/book  { date, time, name, company, email, phone, type, note }
//  Inserta la cita en Supabase. La restricción UNIQUE(date, time) evita
//  doble reserva: si el slot ya está tomado, Supabase devuelve 409.
// ============================================================

import { guard, fail } from "./_lib/security.js";

function slotTimes() {
  const out = [];
  for (let h = 10; h < 18; h++) {
    out.push(`${String(h).padStart(2, "0")}:00`);
    out.push(`${String(h).padStart(2, "0")}:30`);
  }
  return out;
}
const SLOT_TIMES = slotTimes();

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export default async function handler(req, res) {
  // Método + origin + rate limit (evita spam de reservas).
  if (!guard(req, res, { methods: ["POST"], limit: 8, windowMs: 60_000, name: "book" })) return;

  const url = process.env.SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_KEY;
  if (!url || !key) {
    fail(res, 500, "Booking is temporarily unavailable", "Supabase no configurado");
    return;
  }

  try {
    const b = typeof req.body === "string" ? JSON.parse(req.body || "{}") : (req.body || {});
    const { date, time, name, company, email, phone, type, note } = b;

    if (!/^\d{4}-\d{2}-\d{2}$/.test(String(date || "")) || !SLOT_TIMES.includes(time)) {
      fail(res, 400, "Invalid date or time");
      return;
    }
    if (!name || !String(name).trim() || (!email && !phone)) {
      fail(res, 400, "We need your name and an email or phone");
      return;
    }
    if (email && !EMAIL_RE.test(String(email).slice(0, 160))) {
      fail(res, 400, "Invalid email address");
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
    fail(res, 502, "We couldn't save your booking. Please try again.", detail.slice(0, 500));
  } catch (e) {
    fail(res, 500, "Something went wrong. Please try again.", e);
  }
}
