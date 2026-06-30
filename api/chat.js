// ============================================================
//  Función serverless (Vercel) — proxy seguro a Groq.
//  La API key NUNCA se expone al navegador: vive en process.env.
//  El frontend hace POST /api/chat con { messages: [{role, content}] }.
// ============================================================

import { guard, fail } from "./_lib/security.js";

const SYSTEM_PROMPT = `
Sos el asistente de ventas con IA de SYNEXA (no tenés nombre propio; si te preguntan tu nombre, decí que sos simplemente el asistente de SYNEXA). SYNEXA es una agencia que construye:
- Agentes de IA conversacionales (WhatsApp, web, multicanal) para atención y ventas.
- Automatizaciones de procesos con n8n.
- CRMs a medida con IA integrada (inbox en tiempo real, roles, reportes, automatizaciones).
- Apps y software a medida (React, Supabase, integraciones, WhatsApp API).

TU OBJETIVO: asesorar al visitante y llevarlo, paso a paso, hasta AGENDAR una llamada o reunión con el equipo.

CÓMO TRABAJÁS:
- Hablás en español rioplatense (vos/tenés), cálida, cercana y profesional.
- Respuestas BREVES: máximo 3 oraciones. Hacés UNA sola pregunta por turno.
- Guiás la conversación con un orden natural: (1) entender su negocio/rubro, (2) entender el problema o qué quiere automatizar/construir, (3) recomendar cuál de nuestras soluciones le sirve y por qué, (4) resolver dudas, (5) proponer agendar una llamada/reunión.
- Sos concreta y útil, nunca genérica. Mostrás que entendés su caso.
- No inventás precios cerrados: explicás que se cotiza según el alcance y que en una llamada corta lo definimos.
- No prometas funciones que no existan ni inventes datos.

PARA AGENDAR (cuando ya entendiste la necesidad):
- Pedí: nombre, nombre de la empresa, y el mejor contacto (teléfono o email) y el día/horario que le queda cómodo.
- Pedí estos datos de a uno, de forma natural.
- Cuando tengas nombre + contacto + preferencia de horario, confirmá un resumen breve y decile que el equipo de SYNEXA lo va a contactar para coordinar la llamada/meet.

Si el usuario escribe en otro idioma, respondé en ese idioma.
`.trim();

export default async function handler(req, res) {
  // Método + origin + rate limit (el chat consume tokens de Groq → cuesta dinero).
  if (!guard(req, res, { methods: ["POST"], limit: 15, windowMs: 60_000, name: "chat" })) return;

  const apiKey = process.env.GROQ_API_KEY;
  if (!apiKey) {
    fail(res, 500, "Service temporarily unavailable", "GROQ_API_KEY no configurada");
    return;
  }

  try {
    // Vercel parsea el body JSON automáticamente; por las dudas soportamos string.
    const raw = typeof req.body === "string" ? req.body : JSON.stringify(req.body || {});
    if (raw && raw.length > 24_000) {
      fail(res, 413, "Payload too large");
      return;
    }
    const body = typeof req.body === "string" ? JSON.parse(req.body || "{}") : (req.body || {});
    const incoming = Array.isArray(body.messages) ? body.messages : [];

    // Sanitizamos y limitamos el historial.
    const history = incoming
      .slice(-20)
      .filter((m) => m && (m.role === "user" || m.role === "assistant") && typeof m.content === "string" && m.content.trim())
      .map((m) => ({ role: m.role, content: String(m.content).slice(0, 2000) }));

    if (!history.length) {
      fail(res, 400, "No message provided");
      return;
    }

    // Timeout defensivo para no dejar la función colgada si Groq no responde.
    const ctrl = new AbortController();
    const timer = setTimeout(() => ctrl.abort(), 25_000);

    let r;
    try {
      r = await fetch("https://api.groq.com/openai/v1/chat/completions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${apiKey}`,
        },
        signal: ctrl.signal,
        body: JSON.stringify({
          model: "llama-3.3-70b-versatile",
          temperature: 0.6,
          max_tokens: 500,
          messages: [{ role: "system", content: SYSTEM_PROMPT }, ...history],
        }),
      });
    } finally {
      clearTimeout(timer);
    }

    if (!r.ok) {
      const detail = await r.text();
      // El detalle del proveedor queda en logs, NO se devuelve al cliente.
      fail(res, 502, "The assistant is unavailable right now. Please try again.", detail.slice(0, 500));
      return;
    }

    const data = await r.json();
    const reply = data?.choices?.[0]?.message?.content?.trim() || "";
    res.status(200).json({ reply });
  } catch (e) {
    fail(res, 500, "Something went wrong. Please try again.", e);
  }
}
