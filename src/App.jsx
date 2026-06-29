import React, { useState, useEffect, useRef, useContext } from "react";
import logo from "/synexa-logo.png";
import logoLight from "/synexa-logo-transparent.png";

// ============================================================
//  SYNEXA — Agencia de Agentes de IA
//  Paleta derivada del logo: naranja #dd7b52 + tinta #26303a.
// ============================================================

const BRAND = "SYNEXA";

// ---- Paleta: tema oscuro monocromo (negro + blanco + glow), estilo synexa.ai ----
const C = {
  orange: "#ffffff",     // acento monocromo blanco — clave 'orange' por compatibilidad
  orangeDeep: "#d4d4d8",
  violet: "#a1a1aa",     // segundo tono del glow
  grad: "linear-gradient(135deg, #ffffff, #c7c9d2)",
  ink: "#f4f5f7",        // texto principal claro
  inkSoft: "#c4c8d2",    // texto secundario
  muted: "#8b909c",      // texto atenuado
  line: "#23262e",       // bordes oscuros
  bg: "#08090c",         // fondo casi negro
  bgAlt: "#0d0f14",      // banda apenas más clara
  card: "#101218",       // superficie de tarjetas
  cardLine: "#23262e",
  white: "#ffffff",      // se mantiene blanco puro (texto sobre botones claros: se fuerza por CSS)
};

// ---- Internacionalización: inglés por defecto, con selector a español ----
const LangCtx = React.createContext({ lang: "en", L: (en) => en, setLang: () => {} });
const useLang = () => useContext(LangCtx);

// ---- Datos ----
const getClients = (L) => [
  { name: "NINIT Group", tag: "Restroom trailers · Miami, Florida, USA" },
  { name: "Nuevo Munich", tag: L("Artisanal food · Córdoba, Argentina", "Alimentos artesanales · Córdoba, Argentina") },
  { name: "CLV Financial", tag: "Tax & accounting · Miami" },
  { name: "IPIC SMO", tag: L("Clinical research", "Investigación clínica") },
];

const getCapabilities = (L) => [
  {
    title: L("Conversational assistants", "Asistentes conversacionales"),
    body: L(
      "WhatsApp, web and multichannel bots that understand context, answer with your criteria and connect to your systems to resolve end to end.",
      "Bots de WhatsApp, web y multicanal que entienden el contexto, responden con tu criterio y se conectan a tus sistemas para resolver de punta a punta."),
  },
  {
    title: L("Process automation", "Automatización de procesos"),
    body: L(
      "They detect key events (forms, messages, status changes) and trigger automated n8n flows based on the conditions you define.",
      "Detectan eventos clave (formularios, mensajes, cambios de estado) y disparan flujos automáticos en n8n según las condiciones que vos definís."),
  },
  {
    title: L("CRM with built-in AI", "CRM con IA integrada"),
    body: L(
      "Real-time inbox, bot/human toggle, follow-up, KPI dashboard and export. The AI handles it; you control when to take over the conversation.",
      "Inbox en tiempo real, toggle bot/humano, seguimiento, dashboard de KPIs y export. La IA atiende; vos controlás cuándo tomar la conversación."),
  },
  {
    title: L("Custom agents", "Agentes a medida"),
    body: L(
      "Vertical products for your industry: tax intake, sales configurators, automated prospecting. Not a generic CRM: exactly what your operation needs.",
      "Productos verticales para tu industria: intake fiscal, configuradores de venta, prospección automática. No un CRM genérico: lo que tu operación necesita."),
  },
];

const TECH = ["n8n", "Claude", "OpenAI", "Supabase", "WhatsApp API", "React"];

const getNavLinks = (L) => [
  [L("Services", "Servicios"), "#servicios"],
  ["Apps", "#apps"],
  [L("Cases", "Casos"), "#casos"],
  [L("Pricing", "Precios"), "#precios"],
];

const getCases = (L) => [
  {
    client: "NINIT Group",
    sector: L("Trailer rental & sales · Miami, Florida, USA", "Alquiler y venta de trailers · Miami, Florida, USA"),
    problem: L(
      "They lost WhatsApp inquiries after hours and CRM data entry was manual.",
      "Perdían consultas de WhatsApp fuera de horario y la carga al CRM era manual."),
    solution: L(
      "A WhatsApp sales agent + AI CRM that quotes, qualifies the lead and books on its own.",
      "Agente de ventas en WhatsApp + CRM con IA que cotiza, califica el lead y agenda solo."),
    metrics: [
      ["87%", L("inquiries resolved by AI", "consultas resueltas por IA")],
      ["24/7", L("always-on attention", "atención sin cortes")],
      ["3x", L("more qualified leads", "más leads calificados")],
    ],
    video: "/caso-ninit.mp4",
    stack: ["n8n", "openai", "whatsapp", "react", "supabase", "vercel"],
  },
  {
    client: "Nuevo Munich",
    sector: L("Artisanal food · Córdoba, Argentina", "Alimentos artesanales · Córdoba, Argentina"),
    problem: L(
      "Orders scattered across salespeople, with no tracking or unified metrics.",
      "Pedidos dispersos entre vendedores, sin seguimiento ni métricas unificadas."),
    solution: L(
      "Custom CRM with user roles (sales, admin and CEO), internal team chat, real-time inbox, bot/human toggle, follow-ups, reports with counters and PDF export.",
      "CRM a medida con roles por usuario (vendedores, administración y CEO), chat interno del equipo, inbox en tiempo real, toggle bot/humano, follow-ups, reportes con contadores y descarga de PDF."),
    metrics: [
      ["1 panel", L("for the whole team", "para todo el equipo")],
      ["-60%", L("management time", "tiempo de gestión")],
      ["100%", L("traceable orders", "pedidos trazables")],
    ],
    video: "/caso-nuevomunich.mp4",
    stack: ["react", "supabase", "mysql", "n8n", "whatsapp", "github", "vercel"],
  },
];

const getTestimonials = (L) => [
  {
    quote: L(
      "The agent resolves most inquiries on its own. We recovered the sales we used to lose overnight.",
      "El agente nos resuelve la mayoría de las consultas solo. Recuperamos las ventas que se nos escapaban de noche."),
    name: "Nicolás",
    role: "NINIT Group",
  },
  {
    quote: L(
      "We went from scattered spreadsheets to one dashboard where the whole team sees everything in real time. It changed how we work.",
      "Pasamos de planillas sueltas a un panel donde vemos todo el equipo en tiempo real. Cambió cómo trabajamos."),
    name: "Cristian",
    role: "Nuevo Munich",
  },
];

const getPricing = (L) => [
  {
    name: L("Agent", "Agente"),
    tagline: L("To start automating support", "Para empezar a automatizar atención"),
    features: [
      L("AI agent on 1 channel", "Agente de IA en 1 canal"),
      L("Up to 1 integration", "Hasta 1 integración"),
      L("Trained on your data", "Entrenado con tus datos"),
      L("30 days of support", "Soporte por 30 días"),
    ],
    highlight: false,
  },
  {
    name: L("Automation", "Automatización"),
    tagline: L("The SMB favorite", "El favorito de las pymes"),
    features: [
      L("Multichannel agent", "Agente multicanal"),
      L("Custom n8n flows", "Flujos n8n a medida"),
      L("CRM with built-in AI", "CRM con IA integrada"),
      L("Metrics dashboard", "Dashboard de métricas"),
      L("Ongoing support", "Soporte continuo"),
    ],
    highlight: true,
  },
  {
    name: L("Tailor-made", "A medida"),
    tagline: L("A complete product for your operation", "Producto completo para tu operación"),
    features: [
      L("Custom app or platform", "App o plataforma a medida"),
      L("Unlimited integrations", "Integraciones ilimitadas"),
      L("Design + development + deploy", "Diseño + desarrollo + deploy"),
      L("Dedicated support", "Acompañamiento dedicado"),
    ],
    highlight: false,
  },
];

const getApps = (L) => [
  {
    title: L("CRM & dashboards", "CRM y dashboards"),
    body: L(
      "Custom dashboards with real-time inbox, metrics, PDF/CSV export and role-based access. Built on React + Supabase.",
      "Paneles a medida con inbox en tiempo real, métricas, export PDF/CSV y accesos por rol. Construidos sobre React + Supabase."),
    tags: ["React", "Supabase", "Realtime"],
  },
  {
    title: L("Web platforms", "Plataformas web"),
    body: L(
      "Complete vertical systems: client intake, product configurators, internal portals. From design to deploy.",
      "Sistemas verticales completos: intake de clientes, configuradores de producto, portales internos. Del diseño al deploy."),
    tags: ["React", "Vite", "Vercel"],
  },
  {
    title: L("Integrations & APIs", "Integraciones y APIs"),
    body: L(
      "We connect WhatsApp, Meta, payment gateways and your existing systems into automated flows that run on their own.",
      "Conectamos WhatsApp, Meta, pasarelas de pago y tus sistemas existentes en flujos automatizados que funcionan solos."),
    tags: ["n8n", "WhatsApp API", "Webhooks"],
  },
];

const getPhases = (L) => [
  {
    n: "01",
    title: L("Discovery", "Descubrimiento"),
    body: L(
      "We map your processes, systems and real automation opportunities.",
      "Relevamos procesos, sistemas y oportunidades reales de automatización en tu operación."),
  },
  {
    n: "02",
    title: L("Working prototype", "Prototipo funcional"),
    body: L(
      "We build an agent for a concrete, measurable use case, ready to test.",
      "Desarrollamos un agente sobre un caso de uso concreto y medible, listo para probar."),
  },
  {
    n: "03",
    title: L("Scaling", "Escalamiento"),
    body: L(
      "We expand to other areas with support, metrics and continuous improvement.",
      "Expandimos a otras áreas con soporte, métricas y mejora continua."),
  },
];

const getBenefits = (L) => [
  L("Automation of repetitive tasks and key processes.", "Automatización de tareas repetitivas y procesos clave."),
  L("24/7 support without losing human control.", "Atención 24/7 sin perder el control humano."),
  L("Reduced operating times and costs.", "Reducción de tiempos operativos y costos."),
  L("Access to your information in natural language.", "Acceso a la información en lenguaje natural."),
];

// ---- Hook de reveal en scroll ----
function useReveal() {
  const ref = useRef(null);
  const [shown, setShown] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const prefersReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (prefersReduced) { setShown(true); return; }
    const io = new IntersectionObserver(
      ([e]) => { if (e.isIntersecting) { setShown(true); io.disconnect(); } },
      { threshold: 0.15 }
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);
  return [ref, shown];
}

function Reveal({ children, delay = 0, as: Tag = "div", style, ...rest }) {
  const [ref, shown] = useReveal();
  return (
    <Tag
      ref={ref}
      style={{
        opacity: shown ? 1 : 0,
        transform: shown ? "translateY(0)" : "translateY(18px)",
        transition: `opacity .7s ease ${delay}s, transform .7s cubic-bezier(.2,.7,.2,1) ${delay}s`,
        ...style,
      }}
      {...rest}
    >
      {children}
    </Tag>
  );
}

// Palabra rotatoria del hero (como "Empresas/Equipos/Decisiones..." de la ref)
function RotatingWord() {
  const { lang } = useLang();
  const words = lang === "es"
    ? ["Empresas", "Equipos", "Procesos", "Decisiones", "Negocios"]
    : ["Companies", "Teams", "Processes", "Decisions", "Business"];
  const [i, setI] = useState(0);
  useEffect(() => {
    const t = setInterval(() => setI((p) => (p + 1) % words.length), 2200);
    return () => clearInterval(t);
  }, []);
  return (
    <span style={{ color: C.orange, display: "inline-block", minWidth: 10 }}>
      <span
        key={i}
        style={{
          display: "inline-block",
          animation: "fadeUp .5s ease",
        }}
      >
        {words[i]}
      </span>
    </span>
  );
}

export default function App() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [lang, setLang] = useState(() => {
    try { return localStorage.getItem("synexa-lang") || "en"; } catch { return "en"; }
  });
  const L = (en, es) => (lang === "es" ? es : en);
  useEffect(() => { try { localStorage.setItem("synexa-lang", lang); } catch (e) {} }, [lang]);
  const sans = "'Inter', system-ui, -apple-system, sans-serif";
  const serif = "'Lora', Georgia, 'Times New Roman', serif";

  const CLIENTS = getClients(L);
  const CAPABILITIES = getCapabilities(L);
  const NAV_LINKS = getNavLinks(L);
  const CASES = getCases(L);
  const TESTIMONIALS = getTestimonials(L);
  const PRICING = getPricing(L);
  const APPS = getApps(L);
  const PHASES = getPhases(L);
  const BENEFITS = getBenefits(L);

  return (
    <LangCtx.Provider value={{ lang, L, setLang }}>
    <div style={{ fontFamily: sans, color: C.ink, background: "radial-gradient(1200px 620px at 72% -12%, rgba(255,255,255,.07), transparent 60%), #08090c", overflowX: "hidden" }}>
      {/* Fuentes + keyframes globales */}
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=Lora:ital,wght@0,500;0,600;1,500&display=swap');
        * { box-sizing: border-box; margin: 0; padding: 0; }
        html { scroll-behavior: smooth; }
        @keyframes fadeUp { from { opacity:0; transform:translateY(8px);} to {opacity:1; transform:translateY(0);} }
        @keyframes float { 0%,100%{transform:translateY(0)} 50%{transform:translateY(-10px)} }
        @keyframes pulse { 0%,100%{opacity:.5} 50%{opacity:1} }
        @keyframes flow { from { stroke-dashoffset: 95; } to { stroke-dashoffset: 0; } }
        @keyframes growBar { from { transform: scaleY(0); } to { transform: scaleY(1); } }
        @keyframes ringPulse { 0% { transform: scale(1); opacity:.7; } 100% { transform: scale(1.5); opacity:0; } }
        a { color: inherit; text-decoration: none; }
        .btn-primary { background: ${C.grad} !important; color: #0a0b0e !important; border: none !important; box-shadow: 0 8px 28px -8px rgba(255,255,255,.28); }
        .btn-primary:hover { filter: brightness(1.04); transform: translateY(-2px); }
        .btn-ghost:hover { border-color:${C.orange} !important; color:${C.orange} !important; }
        .card-hover { transition: transform .25s ease, box-shadow .25s ease, border-color .25s ease; }
        .card-hover:hover { transform: translateY(-4px); box-shadow: 0 24px 54px -28px rgba(0,0,0,.8); border-color: rgba(255,255,255,.3) !important; }
        .nav-link:hover { color:${C.orange} !important; }
        .grad-text { background: ${C.grad}; -webkit-background-clip: text; background-clip: text; color: transparent; }
        ::selection { background: rgba(255,255,255,.18); }
        @media (max-width: 820px){
          .hero-h1 { font-size: 40px !important; }
          .sec-h2 { font-size: 30px !important; }
          .grid-2 { grid-template-columns: 1fr !important; }
          .grid-3 { grid-template-columns: 1fr !important; }
          .case-grid { grid-template-columns: 1fr !important; }
          .crm-grid { grid-template-columns: 1fr !important; gap: 32px !important; }
          .grid-4 { grid-template-columns: 1fr 1fr !important; }
          .nav-links { display:none !important; }
          .nav-cta { display:none !important; }
          .burger { display:block !important; }
          .mobile-menu { display:block !important; }
          .hero-pad { padding: 120px 22px 70px !important; }
          .hero-grid { grid-template-columns: 1fr !important; gap: 40px !important; }
          .pad { padding: 70px 22px !important; }
        }
        @media (max-width: 520px){
          .grid-4 { grid-template-columns: 1fr !important; }
          .hero-h1 { font-size: 33px !important; }
        }
      `}</style>
      <span id="top" />

      {/* ===== NAV ===== */}
      <nav
        style={{
          position: "fixed", top: 0, left: 0, right: 0, zIndex: 50,
          display: "flex", alignItems: "center", justifyContent: "space-between",
          padding: "16px 40px",
          background: "rgba(8,9,12,.78)",
          backdropFilter: "blur(12px)",
          borderBottom: `1px solid ${C.line}`,
        }}
      >
        <a href="#top" style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <img src={logoLight} alt="SYNEXA" style={{ height: 26, width: "auto", display: "block", filter: "brightness(0) invert(1)" }} />
        </a>

        <div className="nav-links" style={{ display: "flex", gap: 30, fontSize: 15, color: C.inkSoft }}>
          {NAV_LINKS.map(([t, h]) => (
            <a key={t} href={h} className="nav-link" style={{ transition: "color .2s" }}>{t}</a>
          ))}
        </div>

        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          {/* selector de idioma */}
          <button
            onClick={() => setLang(lang === "en" ? "es" : "en")}
            aria-label={lang === "en" ? "Cambiar a español" : "Switch to English"}
            style={{
              background: C.card, border: `1px solid ${C.line}`, color: C.inkSoft,
              borderRadius: 9, padding: "8px 11px", fontSize: 13, fontWeight: 700, cursor: "pointer",
              fontFamily: "inherit", display: "flex", alignItems: "center", gap: 6,
            }}
          >
            <span style={{ opacity: 0.7 }}>🌐</span>{lang === "en" ? "ES" : "EN"}
          </button>
          <a href="#contacto" className="btn-primary nav-cta" style={{
            background: C.orange, color: C.white, padding: "10px 20px",
            borderRadius: 10, fontSize: 15, fontWeight: 600,
            transition: "background .2s, transform .2s",
          }}>
            {L("Contact us", "Contactanos")}
          </a>
        </div>

        {/* Botón hamburguesa (solo mobile) */}
        <button
          className="burger"
          onClick={() => setMenuOpen((o) => !o)}
          aria-label="Menú"
          aria-expanded={menuOpen}
          style={{
            display: "none", background: "none", border: "none", cursor: "pointer",
            width: 40, height: 40, position: "relative", padding: 0,
          }}
        >
          {[0, 1, 2].map((i) => (
            <span key={i} style={{
              position: "absolute", left: 8, right: 8, height: 2, borderRadius: 2,
              background: "#0c0e13", transition: "transform .3s ease, opacity .2s ease",
              top: menuOpen ? 19 : 12 + i * 7,
              transform: menuOpen
                ? (i === 0 ? "rotate(45deg)" : i === 2 ? "rotate(-45deg)" : "scaleX(0)")
                : "none",
              opacity: menuOpen && i === 1 ? 0 : 1,
            }} />
          ))}
        </button>
      </nav>

      {/* Menú mobile desplegable */}
      <div
        className="mobile-menu"
        style={{
          position: "fixed", top: 67, left: 0, right: 0, zIndex: 49,
          background: C.bg, borderBottom: `1px solid ${C.line}`,
          padding: menuOpen ? "16px 28px 24px" : "0 28px",
          maxHeight: menuOpen ? 400 : 0, overflow: "hidden",
          opacity: menuOpen ? 1 : 0,
          transition: "max-height .35s ease, opacity .25s ease, padding .35s ease",
          display: "none",
        }}
      >
        {NAV_LINKS.map(([t, h]) => (
          <a key={t} href={h} onClick={() => setMenuOpen(false)} style={{
            display: "block", padding: "14px 0", fontSize: 17, fontWeight: 500,
            color: C.inkSoft, borderBottom: `1px solid ${C.line}`,
          }}>{t}</a>
        ))}
        <a href="#contacto" onClick={() => setMenuOpen(false)} style={{
          display: "block", marginTop: 16, textAlign: "center",
          background: C.orange, color: C.white, padding: "14px", borderRadius: 10,
          fontSize: 16, fontWeight: 600,
        }}>{L("Contact us", "Contactanos")}</a>
      </div>

      {/* ===== HERO ===== */}
      <header
        className="hero-pad"
        style={{
          position: "relative",
          padding: "150px 40px 90px",
          maxWidth: 1180, margin: "0 auto",
        }}
      >
        {/* glows de fondo (gradient mesh azul/violeta) */}
        <div style={{
          position: "absolute", top: "-6%", right: "-4%", width: 540, height: 540,
          background: `radial-gradient(circle, ${C.orange}24, transparent 70%)`,
          filter: "blur(36px)", zIndex: 0, pointerEvents: "none",
        }} />
        <div style={{
          position: "absolute", top: "18%", left: "-8%", width: 480, height: 480,
          background: `radial-gradient(circle, ${C.violet}22, transparent 70%)`,
          filter: "blur(40px)", zIndex: 0, pointerEvents: "none",
        }} />
        {/* fondo de código escribiéndose (muy sutil, detrás del contenido) */}
        <CodeBackdrop />
        <div className="hero-grid" style={{
          position: "relative", zIndex: 1,
          display: "grid", gridTemplateColumns: "1.05fr .95fr", gap: 56, alignItems: "center",
        }}>
          {/* Columna izquierda: texto */}
          <div>
            <Reveal>
              <span style={{
                display: "inline-flex", alignItems: "center", gap: 8,
                fontSize: 13, fontWeight: 600, letterSpacing: 1.5, textTransform: "uppercase",
                color: C.orange, marginBottom: 24,
              }}>
                <span style={{ width: 7, height: 7, borderRadius: 99, background: C.orange, animation: "pulse 1.8s infinite" }} />
                {L("AI Agents Agency", "Agencia de Agentes de IA")}
              </span>
            </Reveal>

            <Reveal delay={0.05}>
              <h1 className="hero-h1" style={{
                fontFamily: serif, fontWeight: 600, fontSize: 56, lineHeight: 1.06,
                letterSpacing: -1.2, color: C.ink, marginBottom: 22,
              }}>
                {L("AI agents that work for your", "Agentes de IA que trabajan para tus")} <RotatingWord />
              </h1>
            </Reveal>

            <Reveal delay={0.12}>
              <p style={{ fontSize: 19, lineHeight: 1.6, color: C.muted, maxWidth: 520, marginBottom: 36 }}>
                {L(
                  "We automate tasks, improve your customer support and build the custom software your business needs.",
                  "Automatizamos tareas, mejoramos la atención a tus clientes y construimos el software a medida que tu negocio necesita.")}
              </p>
            </Reveal>

            <Reveal delay={0.18}>
              <div style={{ display: "flex", gap: 14, flexWrap: "wrap" }}>
                <a href="#asesor" className="btn-primary" style={{
                  background: C.orange, color: C.white, padding: "15px 30px",
                  borderRadius: 12, fontWeight: 600, fontSize: 16,
                  transition: "background .2s, transform .2s",
                }}>
                  {L("Try our AI advisor", "Probá nuestro asesor IA")}
                </a>
                <a href="#contacto" className="btn-ghost" style={{
                  border: `1.5px solid ${C.line}`, color: C.inkSoft, padding: "15px 30px",
                  borderRadius: 12, fontWeight: 600, fontSize: 16,
                  transition: "border-color .2s, color .2s",
                }}>
                  {L("Book a demo", "Agendá una demo")}
                </a>
              </div>
            </Reveal>
          </div>

          {/* Columna derecha: mockup de producto */}
          <Reveal delay={0.15}>
            <HeroMockup />
          </Reveal>
        </div>
      </header>

      {/* ===== CLIENTES / CONFÍAN ===== */}
      <section id="clientes" className="pad" style={{ background: C.bgAlt, padding: "64px 40px", borderTop: `1px solid ${C.line}`, borderBottom: `1px solid ${C.line}` }}>
        <div style={{ maxWidth: 1180, margin: "0 auto" }}>
          <Reveal>
            <p style={{ textAlign: "center", color: C.muted, fontSize: 15, marginBottom: 34, letterSpacing: 0.3 }}>
              {L("Companies across industries already run our AI agents", "Empresas de distintas industrias ya integran nuestros agentes de IA")}
            </p>
          </Reveal>
          <div className="grid-4" style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 16 }}>
            {CLIENTS.map((c, i) => (
              <Reveal key={c.name} delay={i * 0.06}>
                <div className="card-hover" style={{
                  background: C.card, border: `1px solid ${C.line}`, borderRadius: 14,
                  padding: "24px 22px", textAlign: "center", height: "100%",
                }}>
                  <div style={{ fontFamily: serif, fontSize: 21, fontWeight: 600, color: C.ink, marginBottom: 6 }}>
                    {c.name}
                  </div>
                  <div style={{ fontSize: 13, color: C.muted }}>{c.tag}</div>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ===== SERVICIOS / CAPACIDADES ===== */}
      <section id="servicios" className="pad" style={{ padding: "100px 40px" }}>
        <div style={{ maxWidth: 1180, margin: "0 auto" }}>
          <Reveal>
            <h2 className="sec-h2" style={{ fontFamily: serif, fontSize: 42, fontWeight: 600, letterSpacing: -0.8, marginBottom: 16, maxWidth: 640 }}>
              {L("Custom AI agent development", "Desarrollo de agentes de IA a medida")}
            </h2>
          </Reveal>
          <Reveal delay={0.06}>
            <p style={{ fontSize: 18, color: C.muted, lineHeight: 1.6, maxWidth: 680, marginBottom: 56 }}>
              {L(
                "Our agents don't just automate tasks: they understand context, decide based on your criteria, interact with your systems and improve with every use.",
                "Nuestros agentes no solo automatizan tareas: comprenden el contexto, deciden según tu criterio, interactúan con tus sistemas y mejoran con cada uso.")}
            </p>
          </Reveal>

          <div className="grid-2" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 22 }}>
            {CAPABILITIES.map((cap, i) => (
              <Reveal key={cap.title} delay={i * 0.07}>
                <div className="card-hover" style={{
                  background: C.card, border: `1px solid ${C.line}`, borderRadius: 18,
                  padding: "34px 32px", height: "100%",
                }}>
                  <div style={{
                    width: 44, height: 44, borderRadius: 12, marginBottom: 20,
                    background: `${C.orange}15`, display: "grid", placeItems: "center",
                    color: C.orange, fontFamily: serif, fontWeight: 700, fontSize: 20,
                  }}>
                    {String(i + 1).padStart(2, "0")}
                  </div>
                  <h3 style={{ fontSize: 22, fontWeight: 600, marginBottom: 12, letterSpacing: -0.3 }}>
                    {cap.title}
                  </h3>
                  <p style={{ fontSize: 16, color: C.muted, lineHeight: 1.6 }}>{cap.body}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ===== ASESOR IA INTERACTIVO ===== */}
      <section id="asesor" className="pad" style={{ padding: "40px 40px 90px" }}>
        <div style={{ maxWidth: 1180, margin: "0 auto" }}>
          <div className="grid-2" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 60, alignItems: "center" }}>
            <div>
              <Reveal>
                <span style={{
                  display: "inline-flex", alignItems: "center", gap: 8, fontSize: 13, fontWeight: 600,
                  letterSpacing: 1.5, textTransform: "uppercase", color: C.orange, marginBottom: 18,
                }}>
                  <span style={{ width: 7, height: 7, borderRadius: 99, background: C.orange, animation: "pulse 1.8s infinite" }} />
                  {L("Try it now", "Probalo ahora")}
                </span>
              </Reveal>
              <Reveal delay={0.05}>
                <h2 className="sec-h2" style={{ fontFamily: serif, fontSize: 38, fontWeight: 600, letterSpacing: -0.6, marginBottom: 18 }}>
                  {L("Your AI advisor, live", "Tu asesor de IA, en vivo")}
                </h2>
              </Reveal>
              <Reveal delay={0.1}>
                <p style={{ fontSize: 18, color: C.muted, lineHeight: 1.6, maxWidth: 460, marginBottom: 18 }}>
                  {L(
                    "Tell it what your business does and it guides you step by step to the exact solution you need: an agent, an automation, a CRM or a custom app.",
                    "Contale qué hace tu negocio y te guía paso a paso hasta la solución exacta que necesitás: un agente, una automatización, un CRM o una app a medida.")}
                </p>
              </Reveal>
              <Reveal delay={0.14}>
                <p style={{ fontSize: 14, color: C.muted, lineHeight: 1.5, maxWidth: 440, opacity: 0.85 }}>
                  {L(
                    "This is exactly what we build for you: agents that understand, advise and resolve, connected to your systems.",
                    "Esto es exactamente lo que construimos para vos: agentes que entienden, asesoran y resuelven, conectados a tus sistemas.")}
                </p>
              </Reveal>
            </div>
            <Reveal delay={0.12}>
              <ChatDemo />
            </Reveal>
          </div>
        </div>
      </section>

      {/* ===== BENEFICIOS + FLOW VISUAL ===== */}
      <section className="pad" style={{ padding: "90px 40px", background: "#0c0e13", color: "#f5f2ec" }}>
        <div style={{ maxWidth: 1180, margin: "0 auto", display: "grid", gridTemplateColumns: "1fr", gap: 50 }}>
          <div className="grid-2" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 60, alignItems: "center" }}>
            <div>
              <Reveal>
                <h2 className="sec-h2" style={{ fontFamily: serif, fontSize: 38, fontWeight: 600, letterSpacing: -0.6, marginBottom: 30, color: "#fff" }}>
                  {L("Benefits for your organization", "Beneficios para tu organización")}
                </h2>
              </Reveal>
              {BENEFITS.map((b, i) => (
                <Reveal key={b} delay={i * 0.06}>
                  <div style={{ display: "flex", gap: 14, padding: "16px 0", borderBottom: "1px solid rgba(255,255,255,.1)" }}>
                    <span style={{ color: C.orange, fontWeight: 700, fontSize: 18 }}>→</span>
                    <span style={{ fontSize: 17, lineHeight: 1.5, color: "#e8e3da" }}>{b}</span>
                  </div>
                </Reveal>
              ))}
            </div>
            {/* Mini diagrama de flujo tipo n8n */}
            <Reveal delay={0.1}>
              <FlowDiagram />
            </Reveal>
          </div>
        </div>
      </section>

      {/* ===== PROCESO ===== */}
      <section id="proceso" className="pad" style={{ padding: "100px 40px" }}>
        <div style={{ maxWidth: 1180, margin: "0 auto" }}>
          <Reveal>
            <h2 className="sec-h2" style={{ fontFamily: serif, fontSize: 42, fontWeight: 600, letterSpacing: -0.8, marginBottom: 56 }}>
              {L("How we work", "Nuestro modelo de trabajo")}
            </h2>
          </Reveal>
          <div className="grid-2" style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 0 }}>
            {PHASES.map((p, i) => (
              <Reveal key={p.n} delay={i * 0.08}>
                <div style={{
                  padding: "8px 32px 8px 0",
                  borderLeft: `2px solid ${C.orange}`,
                  paddingLeft: 26, marginBottom: 8, height: "100%",
                }}>
                  <div style={{ fontFamily: serif, fontSize: 40, color: C.orange, fontWeight: 600, marginBottom: 14 }}>{p.n}</div>
                  <h3 style={{ fontSize: 22, fontWeight: 600, marginBottom: 10 }}>{p.title}</h3>
                  <p style={{ fontSize: 16, color: C.muted, lineHeight: 1.6 }}>{p.body}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ===== APPS A MEDIDA ===== */}
      <section id="apps" className="pad" style={{ padding: "100px 40px", background: C.bgAlt, borderTop: `1px solid ${C.line}` }}>
        <div style={{ maxWidth: 1180, margin: "0 auto" }}>
          <Reveal>
            <span style={{
              display: "inline-flex", alignItems: "center", gap: 8, fontSize: 13, fontWeight: 600,
              letterSpacing: 1.5, textTransform: "uppercase", color: C.orange, marginBottom: 18,
            }}>
              <span style={{ width: 7, height: 7, borderRadius: 99, background: C.orange }} />
              No solo agentes
            </span>
          </Reveal>
          <Reveal delay={0.05}>
            <h2 className="sec-h2" style={{ fontFamily: serif, fontSize: 42, fontWeight: 600, letterSpacing: -0.8, marginBottom: 16, maxWidth: 640 }}>
              También desarrollamos apps a medida
            </h2>
          </Reveal>
          <Reveal delay={0.1}>
            <p style={{ fontSize: 18, color: C.muted, lineHeight: 1.6, maxWidth: 680, marginBottom: 56 }}>
              Diseñamos y construimos el software completo que tu negocio necesita: del primer
              boceto al deploy en producción, con la IA integrada donde suma.
            </p>
          </Reveal>

          <div className="grid-2" style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 22 }}>
            {APPS.map((a, i) => (
              <Reveal key={a.title} delay={i * 0.08}>
                <div className="card-hover" style={{
                  background: C.card, border: `1px solid ${C.line}`, borderRadius: 18,
                  padding: "32px 28px", height: "100%", display: "flex", flexDirection: "column",
                }}>
                  <h3 style={{ fontSize: 21, fontWeight: 600, marginBottom: 12, letterSpacing: -0.3 }}>{a.title}</h3>
                  <p style={{ fontSize: 15.5, color: C.muted, lineHeight: 1.6, marginBottom: 22, flex: 1 }}>{a.body}</p>
                  <div style={{ display: "flex", flexWrap: "wrap", gap: 7 }}>
                    {a.tags.map((t) => (
                      <span key={t} style={{
                        fontSize: 12, fontWeight: 600, color: C.orange, background: `${C.orange}14`,
                        padding: "5px 11px", borderRadius: 99,
                      }}>{t}</span>
                    ))}
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ===== TECNOLOGÍA ===== */}
      <section id="tech" className="pad" style={{ padding: "80px 40px", background: C.bg, borderTop: `1px solid ${C.line}`, borderBottom: `1px solid ${C.line}` }}>
        <div style={{ maxWidth: 1180, margin: "0 auto", textAlign: "center" }}>
          <Reveal>
            <h2 className="sec-h2" style={{ fontFamily: serif, fontSize: 34, fontWeight: 600, letterSpacing: -0.5, marginBottom: 38 }}>
              Tecnología que utilizamos
            </h2>
          </Reveal>
          <div style={{ display: "flex", flexWrap: "wrap", justifyContent: "center", gap: 14 }}>
            {TECH.map((t, i) => (
              <Reveal key={t} delay={i * 0.05} as="span">
                <span className="card-hover" style={{
                  display: "inline-block", background: C.card, border: `1px solid ${C.line}`,
                  borderRadius: 99, padding: "12px 26px", fontSize: 16, fontWeight: 600, color: C.inkSoft,
                }}>
                  {t}
                </span>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ===== CRM A MEDIDA (captura real, antes de Casos) ===== */}
      <section data-crm-block className="pad" style={{ padding: "96px 40px", background: C.bg, borderTop: `1px solid ${C.line}` }}>
        <div style={{ maxWidth: 1180, margin: "0 auto" }}>
          <Reveal>
            <div className="crm-grid" style={{
              display: "grid", gridTemplateColumns: "0.92fr 1.08fr", gap: 48, alignItems: "center",
            }}>
              <div>
                <span style={{
                  display: "inline-flex", alignItems: "center", gap: 8, fontSize: 13, fontWeight: 600,
                  letterSpacing: 1.5, textTransform: "uppercase", color: C.orange, marginBottom: 16,
                }}>
                  <span style={{ width: 7, height: 7, borderRadius: 99, background: C.orange }} />
                  Producto propio
                </span>
                <h2 className="sec-h2" style={{ fontFamily: serif, fontSize: 38, fontWeight: 600, letterSpacing: -0.7, marginBottom: 16, lineHeight: 1.12 }}>
                  Un CRM a medida para tu empresa
                </h2>
                <p style={{ fontSize: 17, color: C.muted, lineHeight: 1.6, marginBottom: 26 }}>
                  El mismo sistema que desarrollamos para nuestros clientes, adaptado a tu operación:
                  centralizá conversaciones, gestioná tus leads y automatizá la atención desde un solo
                  lugar. Y lo más importante: cada CRM incluye un <b style={{ color: C.ink }}>asistente
                  de IA a medida</b>, entrenado para tu empresa o negocio, que atiende y vende por vos.
                </p>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px 18px" }}>
                  {["Asistente de IA a medida", "Entrenado con tus datos", "Chats multicanal", "Reportes en tiempo real", "Gestión de leads", "Asignación de agentes", "Automatizaciones", "Flujos inteligentes"].map((f) => (
                    <div key={f} style={{ display: "flex", alignItems: "center", gap: 9, fontSize: 15, color: C.inkSoft }}>
                      <span style={{ color: C.orange, fontWeight: 700 }}>✓</span>{f}
                    </div>
                  ))}
                </div>
              </div>

              {/* captura del CRM en marco tipo navegador */}
              <div style={{
                borderRadius: 14, overflow: "hidden", background: "#15191e",
                border: `1px solid ${C.line}`, boxShadow: "0 32px 72px -34px rgba(0,0,0,.55)",
              }}>
                <div style={{
                  display: "flex", alignItems: "center", gap: 8, padding: "11px 14px",
                  background: "#1b2026", borderBottom: "1px solid rgba(255,255,255,.06)",
                }}>
                  <span style={{ width: 11, height: 11, borderRadius: 99, background: "#ff5f57" }} />
                  <span style={{ width: 11, height: 11, borderRadius: 99, background: "#febc2e" }} />
                  <span style={{ width: 11, height: 11, borderRadius: 99, background: "#28c840" }} />
                  <span style={{
                    marginLeft: 10, flex: 1, fontSize: 12, color: "#8a929c",
                    background: "#0e1216", borderRadius: 7, padding: "5px 12px",
                    fontFamily: "ui-monospace, Menlo, monospace",
                  }}>app.synexia.com/crm</span>
                </div>
                <img
                  src="/crm-synexia.png"
                  alt="CRM a medida de SYNEXA"
                  style={{ width: "100%", display: "block" }}
                  onError={(e) => {
                    const blk = e.currentTarget.closest("[data-crm-block]");
                    if (blk) blk.style.display = "none";
                  }}
                />
              </div>
            </div>
          </Reveal>
        </div>
      </section>

      {/* ===== CASOS DETALLADOS ===== */}
      <section id="casos" className="pad" style={{ padding: "100px 40px" }}>
        <div style={{ maxWidth: 1180, margin: "0 auto" }}>
          <Reveal>
            <span style={{
              display: "inline-flex", alignItems: "center", gap: 8, fontSize: 13, fontWeight: 600,
              letterSpacing: 1.5, textTransform: "uppercase", color: C.orange, marginBottom: 18,
            }}>
              <span style={{ width: 7, height: 7, borderRadius: 99, background: C.orange }} />
              Casos de éxito
            </span>
          </Reveal>
          <Reveal delay={0.05}>
            <h2 className="sec-h2" style={{ fontFamily: serif, fontSize: 42, fontWeight: 600, letterSpacing: -0.8, marginBottom: 54, maxWidth: 620 }}>
              Resultados reales en producción
            </h2>
          </Reveal>

          <div style={{ display: "flex", flexDirection: "column", gap: 26 }}>
            {CASES.map((cs, i) => (
              <Reveal key={cs.client} delay={i * 0.08}>
                <div className="card-hover case-grid" style={{
                  background: C.card, border: `1px solid ${C.line}`, borderRadius: 20,
                  padding: 0, overflow: "hidden", display: "grid",
                  gridTemplateColumns: "1.4fr 1fr",
                }} >
                  <div style={{ padding: "34px 36px", display: "flex", flexDirection: "column" }}>
                    <div style={{ fontFamily: serif, fontSize: 26, fontWeight: 600, marginBottom: 4 }}>{cs.client}</div>
                    <div style={{ fontSize: 13, color: C.orange, fontWeight: 600, marginBottom: 22, letterSpacing: 0.3 }}>{cs.sector}</div>
                    <div style={{ marginBottom: 16 }}>
                      <div style={{ fontSize: 12, textTransform: "uppercase", letterSpacing: 1, color: C.muted, marginBottom: 5, fontWeight: 600 }}>El problema</div>
                      <p style={{ fontSize: 15.5, color: C.inkSoft, lineHeight: 1.55 }}>{cs.problem}</p>
                    </div>
                    <div>
                      <div style={{ fontSize: 12, textTransform: "uppercase", letterSpacing: 1, color: C.muted, marginBottom: 5, fontWeight: 600 }}>La solución</div>
                      <p style={{ fontSize: 15.5, color: C.inkSoft, lineHeight: 1.55 }}>{cs.solution}</p>
                    </div>
                    {/* stack de herramientas usadas (rellena el espacio inferior) */}
                    {cs.stack && (
                      <div style={{ marginTop: "auto", paddingTop: 30 }}>
                        <div style={{ fontSize: 11, textTransform: "uppercase", letterSpacing: 1, color: C.muted, fontWeight: 600, marginBottom: 14 }}>
                          Stack utilizado
                        </div>
                        <div style={{ display: "flex", flexWrap: "wrap", alignItems: "center", gap: 20 }}>
                          {cs.stack.map((s) => (
                            <img
                              key={s}
                              src={`https://cdn.simpleicons.org/${s}/5b636c`}
                              alt={s} title={s} height="24" loading="lazy"
                              style={{ height: 24, width: "auto", opacity: 0.92 }}
                            />
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                  {/* panel: métricas en fila + demo en celular */}
                  <div style={{ background: "#0c0e13", padding: "32px 28px", display: "flex", flexDirection: "column", justifyContent: "center", gap: 26 }}>
                    <div style={{ display: "flex", gap: 20, flexWrap: "wrap", justifyContent: "center" }}>
                      {cs.metrics.map(([v, k]) => (
                        <div key={k} style={{ minWidth: 84 }}>
                          <div style={{ fontFamily: serif, fontSize: 30, fontWeight: 600, color: C.orange, lineHeight: 1 }}>{v}</div>
                          <div style={{ fontSize: 12.5, color: "#cfc9bf", marginTop: 4 }}>{k}</div>
                        </div>
                      ))}
                    </div>
                    {/* video real del producto en marco tipo celular (completo, sin recorte) */}
                    {cs.video ? (
                      <div style={{ display: "flex", justifyContent: "center" }}>
                        <div style={{
                          position: "relative", width: 210, maxWidth: "82%",
                          padding: "14px 9px 16px", background: "#0c0c0c",
                          borderRadius: 34, border: "1px solid #46403a",
                          boxShadow: "0 24px 52px -22px rgba(0,0,0,.9)",
                        }}>
                          {/* auricular */}
                          <div style={{ position: "absolute", top: 7, left: "50%", transform: "translateX(-50%)", width: 40, height: 4.5, borderRadius: 99, background: "#2c2926" }} />
                          <video
                            src={cs.video}
                            autoPlay muted loop playsInline preload="metadata"
                            style={{ width: "100%", height: "auto", display: "block", borderRadius: 22, background: "#000" }}
                          />
                          {/* barra inferior */}
                          <div style={{ position: "absolute", bottom: 7, left: "50%", transform: "translateX(-50%)", width: 54, height: 4.5, borderRadius: 99, background: "#2c2926" }} />
                        </div>
                      </div>
                    ) : (
                      <div style={{ marginTop: 6, fontSize: 11, color: "#7d766c", border: "1px dashed #4a453e", borderRadius: 8, padding: "8px 10px", textAlign: "center" }}>
                        ◳ captura real del producto
                      </div>
                    )}
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ===== TESTIMONIOS ===== */}
      <section className="pad" style={{ padding: "90px 40px", background: C.bgAlt, borderTop: `1px solid ${C.line}`, borderBottom: `1px solid ${C.line}` }}>
        <div style={{ maxWidth: 1180, margin: "0 auto" }}>
          <Reveal>
            <h2 className="sec-h2" style={{ fontFamily: serif, fontSize: 36, fontWeight: 600, letterSpacing: -0.6, marginBottom: 44, textAlign: "center" }}>
              Lo que dicen nuestros clientes
            </h2>
          </Reveal>
          <div className="grid-2" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 24 }}>
            {TESTIMONIALS.map((t, i) => (
              <Reveal key={t.name} delay={i * 0.1}>
                <div className="card-hover" style={{
                  background: C.card, border: `1px solid ${C.line}`, borderRadius: 18,
                  padding: "32px 32px", height: "100%",
                }}>
                  <div style={{ fontFamily: serif, fontSize: 40, color: C.orange, lineHeight: 0.5, marginBottom: 14 }}>"</div>
                  <p style={{ fontSize: 18, lineHeight: 1.6, color: C.inkSoft, fontFamily: serif, fontStyle: "italic", marginBottom: 22 }}>
                    {t.quote}
                  </p>
                  <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                    <div style={{ width: 40, height: 40, borderRadius: 99, background: `${C.orange}1c`, display: "grid", placeItems: "center", color: C.orange, fontWeight: 700, fontFamily: serif }}>
                      {t.name[0]}
                    </div>
                    <div>
                      <div style={{ fontSize: 15, fontWeight: 600 }}>{t.name}</div>
                      <div style={{ fontSize: 13, color: C.muted }}>{t.role}</div>
                    </div>
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ===== PRECIOS ===== */}
      <section id="precios" className="pad" style={{ padding: "100px 40px" }}>
        <div style={{ maxWidth: 1180, margin: "0 auto" }}>
          <Reveal>
            <h2 className="sec-h2" style={{ fontFamily: serif, fontSize: 42, fontWeight: 600, letterSpacing: -0.8, marginBottom: 14, textAlign: "center" }}>
              Planes que se adaptan a tu negocio
            </h2>
          </Reveal>
          <Reveal delay={0.05}>
            <p style={{ fontSize: 17, color: C.muted, lineHeight: 1.6, marginBottom: 54, textAlign: "center", maxWidth: 560, marginLeft: "auto", marginRight: "auto" }}>
              Cada proyecto se cotiza según el alcance. Estos son los puntos de partida más comunes.
            </p>
          </Reveal>

          <div className="grid-3" style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 22, alignItems: "stretch" }}>
            {PRICING.map((p, i) => (
              <Reveal key={p.name} delay={i * 0.08}>
                <div className="card-hover" style={{
                  background: p.highlight ? C.ink : C.white,
                  border: p.highlight ? `1px solid ${C.ink}` : `1px solid ${C.line}`,
                  borderRadius: 20, padding: "34px 30px", height: "100%",
                  display: "flex", flexDirection: "column",
                  position: "relative",
                  boxShadow: p.highlight ? "0 26px 56px -30px rgba(0,0,0,.5)" : "none",
                }}>
                  {p.highlight && (
                    <span style={{
                      position: "absolute", top: 18, right: 18, fontSize: 11, fontWeight: 700,
                      color: "#fff", background: C.orange, padding: "4px 11px", borderRadius: 99,
                      letterSpacing: 0.5,
                    }}>POPULAR</span>
                  )}
                  <div style={{ fontFamily: serif, fontSize: 26, fontWeight: 600, marginBottom: 6, color: p.highlight ? "#fff" : C.ink }}>
                    {p.name}
                  </div>
                  <div style={{ fontSize: 14, color: p.highlight ? "#cfc9bf" : C.muted, marginBottom: 24 }}>
                    {p.tagline}
                  </div>
                  <div style={{ display: "flex", flexDirection: "column", gap: 11, marginBottom: 28, flex: 1 }}>
                    {p.features.map((f) => (
                      <div key={f} style={{ display: "flex", gap: 10, alignItems: "flex-start" }}>
                        <span style={{ color: C.orange, fontWeight: 700, fontSize: 15, lineHeight: 1.4 }}>✓</span>
                        <span style={{ fontSize: 14.5, lineHeight: 1.45, color: p.highlight ? "#e8e3da" : C.inkSoft }}>{f}</span>
                      </div>
                    ))}
                  </div>
                  <a href="#contacto" style={{
                    display: "block", textAlign: "center", padding: "13px",
                    borderRadius: 11, fontWeight: 600, fontSize: 15,
                    background: p.highlight ? C.orange : "transparent",
                    color: p.highlight ? "#fff" : C.ink,
                    border: p.highlight ? "none" : `1.5px solid ${C.line}`,
                    transition: "all .2s",
                  }}>
                    Pedir cotización
                  </a>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ===== CTA / CONTACTO ===== */}
      <section id="contacto" className="pad" style={{ padding: "110px 40px" }}>
        <div style={{ maxWidth: 880, margin: "0 auto", textAlign: "center" }}>
          <Reveal>
            <h2 className="sec-h2" style={{ fontFamily: serif, fontSize: 44, fontWeight: 600, letterSpacing: -1, marginBottom: 18 }}>
              ¿Querés ver cómo un agente de IA puede ayudarte?
            </h2>
          </Reveal>
          <Reveal delay={0.06}>
            <p style={{ fontSize: 19, color: C.muted, lineHeight: 1.6, marginBottom: 38 }}>
              Agendá una demo o pedí una reunión y exploramos juntos la solución que mejor
              se adapta a tu empresa.
            </p>
          </Reveal>
          <Reveal delay={0.12}>
            <div style={{ display: "flex", gap: 14, flexWrap: "wrap", justifyContent: "center" }}>
              <a href="#agenda" className="btn-primary" style={{
                display: "inline-block", background: C.orange, color: C.white,
                padding: "17px 40px", borderRadius: 12, fontWeight: 600, fontSize: 17,
                transition: "background .2s, transform .2s",
              }}>
                Agendá tu reunión
              </a>
              <button
                onClick={() => window.dispatchEvent(new Event("open-nexa-chat"))}
                className="btn-ghost" style={{
                  display: "inline-block", background: C.card, color: C.inkSoft,
                  border: `1.5px solid ${C.line}`,
                  padding: "17px 40px", borderRadius: 12, fontWeight: 600, fontSize: 17, cursor: "pointer",
                  fontFamily: "inherit", transition: "border-color .2s, color .2s",
                }}>
                Hablá con la asistente IA
              </button>
            </div>
          </Reveal>
        </div>
      </section>

      {/* ===== AGENDA / SISTEMA DE CITAS ===== */}
      <section id="agenda" className="pad" style={{ padding: "20px 40px 110px" }}>
        <div style={{ maxWidth: 1180, margin: "0 auto" }}>
          <Reveal>
            <h2 className="sec-h2" style={{ fontFamily: serif, fontSize: 38, fontWeight: 600, letterSpacing: -0.7, marginBottom: 12, textAlign: "center" }}>
              Agendá tu llamada o reunión
            </h2>
          </Reveal>
          <Reveal delay={0.05}>
            <p style={{ fontSize: 17, color: C.muted, lineHeight: 1.6, marginBottom: 40, textAlign: "center", maxWidth: 560, marginLeft: "auto", marginRight: "auto" }}>
              Elegí el día y horario que mejor te quede. Coordinamos una reunión corta para
              entender tu caso y mostrarte cómo te podemos ayudar.
            </p>
          </Reveal>
          <Reveal delay={0.1}>
            <BookingCalendar />
          </Reveal>
        </div>
      </section>

      {/* ===== NUESTRO EQUIPO ===== */}
      <section id="equipo" className="pad" style={{ padding: "84px 40px", background: C.bgAlt, borderTop: `1px solid ${C.line}` }}>
        <div style={{ maxWidth: 880, margin: "0 auto", textAlign: "center" }}>
          <Reveal>
            <span style={{
              display: "inline-flex", alignItems: "center", gap: 8, fontSize: 13, fontWeight: 600,
              letterSpacing: 1.5, textTransform: "uppercase", color: C.orange, marginBottom: 16,
            }}>
              <span style={{ width: 7, height: 7, borderRadius: 99, background: C.orange }} />
              Nuestro equipo
            </span>
          </Reveal>
          <Reveal delay={0.05}>
            <h2 className="sec-h2" style={{ fontFamily: serif, fontSize: 34, fontWeight: 600, letterSpacing: -0.6, marginBottom: 16 }}>
              Desarrollo de la mano de programadores senior
            </h2>
          </Reveal>
          <Reveal delay={0.1}>
            <p style={{ fontSize: 18, color: C.muted, lineHeight: 1.65, marginBottom: 34 }}>
              Nuestro equipo cuenta con <b style={{ color: C.ink }}>programadores senior con más de 10 años
              de experiencia</b> construyendo software real en producción. Cada proyecto se desarrolla con
              estándares profesionales, código mantenible y acompañamiento de punta a punta.
            </p>
          </Reveal>
          <Reveal delay={0.14}>
            <div style={{ display: "flex", flexWrap: "wrap", justifyContent: "center", gap: 40 }}>
              {[["+10", "años de experiencia"], ["Senior", "desarrolladores"], ["100%", "a medida"]].map(([v, k]) => (
                <div key={k}>
                  <div style={{ fontFamily: serif, fontSize: 38, fontWeight: 600, color: C.orange, lineHeight: 1 }}>{v}</div>
                  <div style={{ fontSize: 14, color: C.muted, marginTop: 6 }}>{k}</div>
                </div>
              ))}
            </div>
          </Reveal>
        </div>
      </section>

      {/* burbuja de chat flotante (asistente de ventas IA) */}
      <FloatingChat />

      {/* ===== FOOTER ===== */}
      <footer style={{ background: "#0c0e13", color: "#cfc9bf", padding: "50px 40px 36px" }}>
        <div style={{ maxWidth: 1180, margin: "0 auto", display: "flex", flexWrap: "wrap", justifyContent: "space-between", gap: 24, alignItems: "center" }}>
          <img src={logoLight} alt="SYNEXA" style={{ height: 24, width: "auto", filter: "brightness(0) invert(1)", opacity: 0.92 }} />
          <span style={{ fontSize: 14 }}>© {new Date().getFullYear()} {BRAND}</span>
        </div>
      </footer>
    </div>
    </LangCtx.Provider>
  );
}

// ---- Mockup de producto del hero (dashboard CRM + chat) ----
// PLACEHOLDER: reemplazar por captura real del CRM cuando esté disponible.
function HeroMockup() {
  const O = "#6366f1";
  const bars = [62, 78, 45, 88, 70, 95];
  return (
    <div style={{ position: "relative", perspective: 1200 }}>
      {/* ventana principal: dashboard */}
      <div style={{
        background: "#fff", borderRadius: 18, border: "1px solid #23262e",
        boxShadow: "0 30px 70px -36px rgba(0,0,0,.4)", overflow: "hidden",
        transform: "rotateY(-4deg) rotateX(2deg)", transformStyle: "preserve-3d",
      }}>
        {/* topbar de ventana */}
        <div style={{ display: "flex", alignItems: "center", gap: 6, padding: "11px 14px", borderBottom: "1px solid #23262e", background: "#0f1218" }}>
          <span style={{ width: 10, height: 10, borderRadius: 99, background: "#e06a55" }} />
          <span style={{ width: 10, height: 10, borderRadius: 99, background: "#e8b54a" }} />
          <span style={{ width: 10, height: 10, borderRadius: 99, background: "#5ab06a" }} />
          <span style={{ marginLeft: 10, fontSize: 11, color: "#9a948a" }}>Panel CRM · {BRAND}</span>
        </div>
        {/* contenido dashboard */}
        <div style={{ padding: 18 }}>
          {/* KPIs */}
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 10, marginBottom: 16 }}>
            {[["Conversaciones", "1.284"], ["Resueltas IA", "87%"], ["Leads", "342"]].map(([k, v]) => (
              <div key={k} style={{ background: "#0f1218", borderRadius: 10, padding: "10px 12px", border: "1px solid #23262e" }}>
                <div style={{ fontSize: 10, color: "#9a948a", marginBottom: 3 }}>{k}</div>
                <div style={{ fontSize: 18, fontWeight: 700, color: "#1f1d1a", fontFamily: "Lora, serif" }}>{v}</div>
              </div>
            ))}
          </div>
          {/* gráfico de barras animado */}
          <div style={{ background: "#0f1218", borderRadius: 12, padding: "16px 16px 10px", border: "1px solid #23262e" }}>
            <div style={{ fontSize: 11, color: "#6b655c", marginBottom: 12, fontWeight: 600 }}>Actividad semanal</div>
            <div style={{ display: "flex", alignItems: "flex-end", gap: 8, height: 84 }}>
              {bars.map((b, i) => (
                <div key={i} style={{
                  flex: 1, height: `${b}%`, borderRadius: "5px 5px 0 0",
                  background: i === bars.length - 1 ? O : `${O}55`,
                  transformOrigin: "bottom",
                  animation: `growBar .8s cubic-bezier(.2,.8,.2,1) ${i * 0.08}s both`,
                }} />
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* tarjeta flotante: mensaje entrante */}
      <div style={{
        position: "absolute", bottom: -24, left: -22, width: 230,
        background: "#fff", borderRadius: 14, border: "1px solid #23262e",
        boxShadow: "0 18px 40px -22px rgba(0,0,0,.45)", padding: "12px 14px",
        animation: "float 5s ease-in-out infinite",
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 8 }}>
          <span style={{ width: 26, height: 26, borderRadius: 99, background: O, display: "grid", placeItems: "center", color: "#fff", fontSize: 13, fontWeight: 700 }}>✦</span>
          <span style={{ fontSize: 12, fontWeight: 600, color: "#1f1d1a" }}>Agente IA</span>
          <span style={{ marginLeft: "auto", width: 6, height: 6, borderRadius: 99, background: "#22a06b" }} />
        </div>
        <div style={{ fontSize: 11.5, color: "#6b655c", lineHeight: 1.4 }}>
          Resolví 12 consultas y agendé 3 reuniones mientras dormías 🌙
        </div>
      </div>
    </div>
  );
}

// ---- Fondo sutil de código "escribiéndose" (decorativo, no interactivo) ----
const CODE_SNIPPET = [
  "const agent = new Agent({",
  "  model: openai('gpt-4o'),",
  "  memory: postgres(),",
  "  tools: [whatsapp, crm, calendar],",
  "});",
  "",
  "n8n.on('whatsapp:message', async (msg) => {",
  "  const lead = await agent.run(msg);",
  "  await crm.upsert(lead);",
  "  return reply(lead.answer);",
  "});",
].join("\n");

function CodeBackdrop() {
  const [len, setLen] = useState(0);
  useEffect(() => {
    let raf, last = performance.now(), acc = 0;
    const step = 34; // ms por caracter
    const tick = (t) => {
      acc += t - last; last = t;
      if (acc >= step) {
        const add = Math.floor(acc / step); acc %= step;
        setLen((l) => (l >= CODE_SNIPPET.length + 28 ? 0 : l + add));
      }
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, []);
  return (
    <pre aria-hidden="true" style={{
      position: "absolute", inset: 0, margin: 0, padding: "120px 0 0 4px",
      fontFamily: "ui-monospace, 'SF Mono', Menlo, Consolas, monospace",
      fontSize: 14, lineHeight: 1.75, color: C.orange,
      opacity: 0.06, zIndex: 0, pointerEvents: "none",
      overflow: "hidden", whiteSpace: "pre-wrap", userSelect: "none",
    }}>
      {CODE_SNIPPET.slice(0, len)}
      <span style={{ animation: "pulse 1.1s infinite" }}>▋</span>
    </pre>
  );
}

// ---- Canvas tipo n8n: Trigger -> AI Agent (Chat Model OpenAI + Memory + Tools) -> salidas ----
function FlowDiagram() {
  const O = "#6366f1";
  const nodeFill = "#1e1b18";
  const stroke = "rgba(99,102,241,.42)";
  const wire = "rgba(180,170,160,.45)";
  const muted = "#8a847b";
  const F = "Inter, sans-serif";

  // Flujo principal (izquierda -> derecha). Centros alineados en y=115.
  const flow = [
    { x: 8,   y: 88,  w: 122, h: 54, label: "WhatsApp",  sub: "Trigger",     icon: "▸", accent: "#25d366", logo: "whatsapp" },
    { x: 192, y: 78,  w: 140, h: 74, label: "AI Agent",  sub: "Tools Agent", icon: "✦", accent: O, hot: true },
    { x: 386, y: 71,  w: 90,  h: 48, label: "Responder", sub: "WhatsApp",    icon: "↺", accent: "#25d366" },
    { x: 386, y: 129, w: 90,  h: 48, label: "CRM",       sub: "Supabase",    icon: "▦", accent: "#3ecf8e" },
  ];

  // Sub-nodos que cuelgan del AI Agent (puertos reales de n8n), alineados en y=250.
  const sub = [
    { x: 38,  y: 250, w: 130, h: 56, role: "Chat Model", label: "OpenAI",   sub: "gpt-4o",   icon: "✶", accent: "#10a37f", port: 228, cx: 103, logo: "openai" },
    { x: 198, y: 250, w: 126, h: 56, role: "Memory",     label: "Memoria",  sub: "Postgres", icon: "◈", accent: "#8b6fd6", port: 262, cx: 261 },
    { x: 350, y: 250, w: 126, h: 56, role: "Tool",       label: "Calendar", sub: "Google",   icon: "▦", accent: "#4a90d9", port: 296, cx: 413 },
  ];

  // Enlaces del flujo principal
  const links = [
    "M 130 115 C 161 115, 161 115, 192 115",          // WhatsApp -> Agent
    "M 332 115 C 359 115, 359 95,  386 95",           // Agent -> Responder
    "M 332 115 C 359 115, 359 153, 386 153",          // Agent -> CRM
  ];

  // Puerto inferior del Agent (y=152) -> top del sub-nodo (y=250)
  const subLinks = sub.map((n) => `M ${n.port} 152 C ${n.port} 205, ${n.cx} 200, ${n.cx} 250`);

  // chip de icono + textos de un nodo (estilo n8n)
  const Node = ({ n, hot }) => {
    const cs = hot ? 32 : 26;
    const cy = n.y + (n.h - cs) / 2;
    const mid = n.y + n.h / 2;
    const tx = n.x + 12 + cs + 11;
    return (
      <>
        <rect x={n.x} y={n.y} width={n.w} height={n.h} rx="13"
          fill={hot ? O : nodeFill} stroke={hot ? "#c7d2fe" : stroke} strokeWidth="1.5" />
        <rect x={n.x + 12} y={cy} width={cs} height={cs} rx="8" fill={hot ? "#fff" : n.accent} />
        {n.logo ? (
          <image
            href={`https://cdn.simpleicons.org/${n.logo}/ffffff`}
            x={n.x + 12 + cs * 0.19} y={cy + cs * 0.19}
            width={cs * 0.62} height={cs * 0.62}
          />
        ) : (
          <text x={n.x + 12 + cs / 2} y={cy + cs / 2 + (hot ? 6 : 5)} fontSize={hot ? "17" : "14"}
            textAnchor="middle" fill={hot ? O : "#fff"}>{n.icon}</text>
        )}
        <text x={tx} y={mid - 3} fontSize={hot ? "15" : "13"} fill="#fff" fontFamily={F} fontWeight="700">{n.label}</text>
        <text x={tx} y={mid + 12} fontSize="10" fontFamily={F} fontWeight="500"
          fill={hot ? "rgba(255,255,255,.82)" : muted}>{n.sub}</text>
      </>
    );
  };

  return (
    <svg viewBox="0 0 484 330" style={{ width: "100%", maxWidth: 500, display: "block", margin: "0 auto" }}>
      <defs>
        <radialGradient id="agentGlow" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor={O} stopOpacity="0.5" />
          <stop offset="100%" stopColor={O} stopOpacity="0" />
        </radialGradient>
      </defs>

      {/* grilla de puntos de fondo */}
      <g fill="rgba(255,255,255,.05)">
        {Array.from({ length: 10 }).map((_, r) =>
          Array.from({ length: 14 }).map((__, c) => (
            <circle key={`${r}-${c}`} cx={12 + c * 36} cy={14 + r * 36} r="1" />
          ))
        )}
      </g>

      {/* conexiones del Agent a sus sub-nodos (punteadas + pulso) */}
      <g fill="none" stroke={stroke} strokeWidth="1.4" strokeDasharray="3 4">
        {subLinks.map((d, i) => <path key={`s-${i}`} d={d} />)}
      </g>
      <g fill="none" strokeWidth="2">
        {subLinks.map((d, i) => (
          <path key={`sf-${i}`} d={d} stroke={O} strokeDasharray="4 70"
            style={{ animation: `flow 2.2s linear infinite`, animationDelay: `${i * 0.3}s` }} />
        ))}
      </g>

      {/* líneas del flujo principal */}
      <g fill="none" strokeWidth="2">
        {links.map((d, i) => <path key={`base-${i}`} d={d} stroke={wire} />)}
        {links.map((d, i) => (
          <path key={`flow-${i}`} d={d} stroke={O} strokeWidth="2.6" strokeDasharray="5 95"
            style={{ animation: `flow 1.7s linear infinite`, animationDelay: `${i * 0.25}s` }} />
        ))}
      </g>

      {/* puntos de puerto (conectores estilo n8n) */}
      <g fill="#2a2724" stroke={stroke} strokeWidth="1.2">
        <circle cx="130" cy="115" r="3.4" />
        <circle cx="192" cy="115" r="3.4" />
        <circle cx="332" cy="115" r="3.4" />
        <circle cx="386" cy="95" r="3.4" />
        <circle cx="386" cy="153" r="3.4" />
        {sub.map((n, i) => <circle key={`p-${i}`} cx={n.port} cy="152" r="3.2" />)}
        {sub.map((n, i) => <circle key={`pt-${i}`} cx={n.cx} cy="250" r="3.2" />)}
      </g>

      {/* etiquetas de rol bajo el Agent (Chat Model / Memory / Tool) */}
      {sub.map((n, i) => (
        <text key={`role-${i}`} x={n.cx} y={238} fontSize="8.5" textAnchor="middle"
          fill={muted} fontFamily={F} fontWeight="700" letterSpacing="0.7">{n.role.toUpperCase()}</text>
      ))}

      {/* sub-nodos: modelo (OpenAI), memoria, herramienta */}
      {sub.map((n, i) => (
        <g key={`sub-${i}`} style={{ animation: "float 5s ease-in-out infinite", animationDelay: `${i * 0.5}s` }}>
          <Node n={n} hot={false} />
        </g>
      ))}

      {/* nodos del flujo principal */}
      {flow.map((n, i) => (
        <g key={`flow-n-${i}`}>
          {n.hot && (
            <circle cx={n.x + n.w / 2} cy={n.y + n.h / 2} r="58" fill="url(#agentGlow)"
              style={{ animation: "pulse 2.4s ease-in-out infinite" }} />
          )}
          <Node n={n} hot={!!n.hot} />
          {n.hot && (
            <g fill="#fff">
              {[0, 1, 2].map((d) => (
                <circle key={d} cx={n.x + n.w / 2 - 9 + d * 9} cy={n.y + n.h - 12} r="2.4"
                  style={{ animation: "pulse 1.2s ease-in-out infinite", animationDelay: `${d * 0.2}s` }} />
              ))}
            </g>
          )}
        </g>
      ))}
    </svg>
  );
}

// ---- Asesor IA de la agencia: chat interactivo que guía paso a paso ----
// Mensajes de arranque del asesor IA
const CHAT_SEED = [
  { from: "bot", text: `¡Hola! Soy el asesor IA de ${BRAND}. Contame qué hace tu negocio y te guío paso a paso hacia la solución de IA que mejor te conviene 👇` },
];

// System prompt del asesor de la agencia (guía al visitante, no vende un producto puntual)
const AGENT_SYSTEM =
  `Sos el asesor de inteligencia artificial de ${BRAND}, una agencia que desarrolla agentes de IA, ` +
  "automatizaciones con n8n, CRMs con IA integrada y apps a medida (React, Supabase, WhatsApp API). " +
  "Tu rol es asesorar a visitantes de la web y guiarlos PASO A PASO. " +
  "Hacé UNA pregunta por vez para entender su negocio, su problema y qué tarea quieren automatizar. " +
  "A medida que entendés, recomendá cuál de estas soluciones le sirve: (1) Agente conversacional de atención/ventas, " +
  "(2) Automatización de procesos con n8n, (3) CRM con IA integrada, (4) App o plataforma a medida. " +
  "Respondé en español rioplatense, cálido, claro y breve (máximo 3 oraciones). Sé concreto y útil, no genérico. " +
  "Cuando tengas clara la necesidad, sugerí agendar una demo o escribir por WhatsApp. " +
  "No inventes precios cerrados: explicá que se cotiza según el alcance.";

function ChatDemo() {
  const { L } = useLang();
  const O = "#6366f1";
  const [msgs, setMsgs] = useState(CHAT_SEED);
  const [input, setInput] = useState("");
  const [typing, setTyping] = useState(false);
  const [err, setErr] = useState(false);
  const boxRef = useRef(null);

  // Sugerencias rápidas para arrancar la conversación
  const quickReplies = [
    "Tengo un local y quiero atender por WhatsApp",
    "Quiero automatizar tareas repetitivas",
    "Necesito un CRM para mi equipo",
  ];

  useEffect(() => {
    if (boxRef.current) boxRef.current.scrollTop = boxRef.current.scrollHeight;
  }, [msgs, typing]);

  const send = async (preset) => {
    const text = (typeof preset === "string" ? preset : input).trim();
    if (!text || typing) return;
    setErr(false);
    const next = [...msgs, { from: "user", text }];
    setMsgs(next);
    setInput("");
    setTyping(true);

    // Historial para el backend (excluye el seed inicial del bot)
    const history = next
      .filter((m, i) => !(i === 0 && m.from === "bot"))
      .map((m) => ({ role: m.from === "user" ? "user" : "assistant", content: m.text }));

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: history }),
      });
      if (!res.ok) throw new Error("HTTP " + res.status);
      const data = await res.json();
      const reply = (data.reply || "").trim();
      setTyping(false);
      setMsgs((m) => [...m, { from: "bot", text: reply || "Disculpá, no te entendí. ¿Me lo repetís?" }]);
    } catch (e) {
      setTyping(false);
      setErr(true);
      setMsgs((m) => [...m, {
        from: "bot",
        text: "Se me complicó conectarme recién. Probá de nuevo en un momento, o dejame tu nombre y un email/teléfono y el equipo te contacta.",
      }]);
    }
  };

  const bubble = (msg, i) => {
    const isBot = msg.from === "bot";
    return (
      <div key={i} style={{
        display: "flex", justifyContent: isBot ? "flex-start" : "flex-end",
        marginBottom: 10, animation: "fadeUp .35s ease",
      }}>
        <div style={{
          maxWidth: "80%", padding: "10px 14px", fontSize: 14, lineHeight: 1.45,
          borderRadius: isBot ? "4px 14px 14px 14px" : "14px 4px 14px 14px",
          background: isBot ? O : "#1b2028",
          color: isBot ? "#fff" : "#eef1f6",
          border: isBot ? "none" : "1px solid #23262e",
          boxShadow: "0 2px 8px -4px rgba(0,0,0,.15)",
        }}>
          {msg.text}
        </div>
      </div>
    );
  };

  return (
    <div style={{
      background: "#0d0f14", borderRadius: 20, border: "1px solid #23262e",
      overflow: "hidden", boxShadow: "0 24px 50px -28px rgba(0,0,0,.45)",
      maxWidth: 380, margin: "0 auto", width: "100%",
    }}>
      {/* header */}
      <div style={{ background: "#0f1218", padding: "13px 16px", display: "flex", alignItems: "center", gap: 10, borderBottom: "1px solid #23262e" }}>
        <div style={{ width: 34, height: 34, borderRadius: 99, background: O, display: "grid", placeItems: "center", color: "#fff", fontWeight: 700 }}>✦</div>
        <div>
          <div style={{ fontSize: 14, fontWeight: 600, color: "#f4f5f7" }}>{L("AI advisor", "Asesor IA")} · {BRAND}</div>
          <div style={{ fontSize: 11, color: "#22a06b", display: "flex", alignItems: "center", gap: 5 }}>
            <span style={{ width: 6, height: 6, borderRadius: 99, background: "#22a06b" }} /> en línea
          </div>
        </div>
        <span style={{ marginLeft: "auto", fontSize: 10, fontWeight: 600, color: O, background: `${O}18`, padding: "4px 9px", borderRadius: 99 }}>
          IA real
        </span>
      </div>
      {/* cuerpo */}
      <div ref={boxRef} style={{ height: 290, padding: 16, overflowY: "auto" }}>
        {msgs.map(bubble)}
        {typing && (
          <div style={{ display: "flex", justifyContent: "flex-start", marginBottom: 10 }}>
            <div style={{ background: O, borderRadius: "4px 14px 14px 14px", padding: "12px 14px", display: "flex", gap: 4 }}>
              {[0, 1, 2].map((d) => (
                <span key={d} style={{ width: 6, height: 6, borderRadius: 99, background: "#fff",
                  animation: "pulse 1.2s ease-in-out infinite", animationDelay: `${d * 0.2}s` }} />
              ))}
            </div>
          </div>
        )}
        {/* quick replies (solo al inicio) */}
        {msgs.length === 1 && !typing && (
          <div style={{ display: "flex", flexDirection: "column", gap: 7, marginTop: 6 }}>
            {quickReplies.map((q) => (
              <button key={q} onClick={() => send(q)} style={{
                textAlign: "left", background: "#fff", border: `1px solid ${O}55`,
                color: "#3d3a35", borderRadius: 10, padding: "9px 12px", fontSize: 13,
                cursor: "pointer", fontFamily: "inherit", transition: "background .15s",
              }}
              onMouseEnter={(e) => (e.currentTarget.style.background = `${O}12`)}
              onMouseLeave={(e) => (e.currentTarget.style.background = "#fff")}
              >
                {q}
              </button>
            ))}
          </div>
        )}
      </div>
      {/* input */}
      <div style={{ display: "flex", gap: 8, padding: 12, borderTop: "1px solid #23262e", background: "#0f1218" }}>
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => { if (e.key === "Enter") send(); }}
          placeholder="Escribí tu consulta..."
          disabled={typing}
          style={{
            flex: 1, border: "1px solid #23262e", borderRadius: 99, padding: "10px 16px",
            fontSize: 14, outline: "none", fontFamily: "inherit", background: "#0f1218", color: "#f4f5f7",
          }}
        />
        <button
          onClick={send}
          disabled={typing || !input.trim()}
          style={{
            background: O, color: "#fff", border: "none", borderRadius: 99,
            width: 40, height: 40, cursor: typing ? "default" : "pointer",
            fontSize: 16, display: "grid", placeItems: "center", flexShrink: 0,
            opacity: typing || !input.trim() ? 0.5 : 1, transition: "opacity .2s",
          }}
          aria-label="Enviar"
        >
          ↑
        </button>
      </div>
    </div>
  );
}

// ---- Burbuja de chat flotante: asistente de ventas IA (Groq vía /api/chat) ----
const FLOAT_SEED = [
  { role: "assistant", content: `¡Hola! 👋 Soy el asistente de ventas de ${BRAND}. Te ayudo con agentes de IA y software a medida, y coordinamos una llamada si querés. ¿Qué hace tu negocio?` },
];

function FloatingChat() {
  const { L } = useLang();
  const O = "#6366f1";
  const [open, setOpen] = useState(false);
  const [msgs, setMsgs] = useState(FLOAT_SEED);
  const [input, setInput] = useState("");
  const [typing, setTyping] = useState(false);
  const boxRef = useRef(null);

  const quick = [
    "Quiero un agente de ventas por WhatsApp",
    "Necesito un CRM o software a medida",
    "Quiero agendar una llamada",
  ];

  useEffect(() => {
    if (boxRef.current) boxRef.current.scrollTop = boxRef.current.scrollHeight;
  }, [msgs, typing, open]);

  // Permite abrir el chat desde otros botones (ej. CTA de contacto)
  useEffect(() => {
    const openHandler = () => setOpen(true);
    window.addEventListener("open-nexa-chat", openHandler);
    return () => window.removeEventListener("open-nexa-chat", openHandler);
  }, []);

  const send = async (preset) => {
    const text = (typeof preset === "string" ? preset : input).trim();
    if (!text || typing) return;
    const next = [...msgs, { role: "user", content: text }];
    setMsgs(next);
    setInput("");
    setTyping(true);
    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: next }),
      });
      if (!res.ok) throw new Error("HTTP " + res.status);
      const data = await res.json();
      const reply = (data.reply || "").trim();
      setTyping(false);
      setMsgs((m) => [...m, { role: "assistant", content: reply || "Disculpá, no te entendí. ¿Me lo repetís?" }]);
    } catch (e) {
      setTyping(false);
      setMsgs((m) => [...m, {
        role: "assistant",
        content: "Se me complicó conectarme recién 😅. Probá de nuevo en un momento; si seguís con problemas, dejame tu nombre y un email o teléfono y el equipo de SYNEXA te contacta.",
      }]);
    }
  };

  const bubble = (m, i) => {
    const isBot = m.role === "assistant";
    return (
      <div key={i} style={{
        display: "flex", justifyContent: isBot ? "flex-start" : "flex-end",
        marginBottom: 10, animation: "fadeUp .3s ease",
      }}>
        <div style={{
          maxWidth: "82%", padding: "10px 13px", fontSize: 14, lineHeight: 1.45,
          borderRadius: isBot ? "4px 14px 14px 14px" : "14px 4px 14px 14px",
          background: isBot ? O : "#1b2028",
          color: isBot ? "#fff" : "#eef1f6",
          border: isBot ? "none" : "1px solid #23262e",
          boxShadow: "0 2px 8px -4px rgba(0,0,0,.15)",
          whiteSpace: "pre-wrap",
        }}>
          {m.content}
        </div>
      </div>
    );
  };

  return (
    <>
      {/* Panel de chat */}
      {open && (
        <div style={{
          position: "fixed", bottom: 92, right: 22, zIndex: 1001,
          width: "min(370px, 92vw)", height: "min(540px, 72vh)",
          display: "flex", flexDirection: "column",
          background: "#0d0f14", borderRadius: 18, border: "1px solid #23262e",
          overflow: "hidden", boxShadow: "0 28px 60px -24px rgba(0,0,0,.5)",
          animation: "fadeUp .25s ease",
        }}>
          {/* header */}
          <div style={{ background: "#0f1218", padding: "13px 16px", display: "flex", alignItems: "center", gap: 10, borderBottom: "1px solid #23262e" }}>
            <div style={{ width: 36, height: 36, borderRadius: 99, background: O, display: "grid", placeItems: "center", color: "#fff", fontWeight: 700 }}>✦</div>
            <div style={{ lineHeight: 1.2 }}>
              <div style={{ fontSize: 14.5, fontWeight: 700, color: "#f4f5f7" }}>{L("Sales assistant", "Asistente de ventas")} · {BRAND}</div>
              <div style={{ fontSize: 11, color: "#22a06b", display: "flex", alignItems: "center", gap: 5 }}>
                <span style={{ width: 6, height: 6, borderRadius: 99, background: "#22a06b" }} /> en línea · responde al instante
              </div>
            </div>
            <button onClick={() => setOpen(false)} aria-label="Cerrar"
              style={{ marginLeft: "auto", background: "none", border: "none", cursor: "pointer", fontSize: 20, color: "#9a948b", lineHeight: 1 }}>
              ×
            </button>
          </div>
          {/* cuerpo */}
          <div ref={boxRef} style={{ flex: 1, padding: 16, overflowY: "auto" }}>
            {msgs.map(bubble)}
            {typing && (
              <div style={{ display: "flex", justifyContent: "flex-start", marginBottom: 10 }}>
                <div style={{ background: O, borderRadius: "4px 14px 14px 14px", padding: "12px 14px", display: "flex", gap: 4 }}>
                  {[0, 1, 2].map((d) => (
                    <span key={d} style={{ width: 6, height: 6, borderRadius: 99, background: "#fff",
                      animation: "pulse 1.2s ease-in-out infinite", animationDelay: `${d * 0.2}s` }} />
                  ))}
                </div>
              </div>
            )}
            {msgs.length === 1 && !typing && (
              <div style={{ display: "flex", flexDirection: "column", gap: 7, marginTop: 6 }}>
                {quick.map((q) => (
                  <button key={q} onClick={() => send(q)} style={{
                    textAlign: "left", background: "#161a21", border: `1px solid ${O}66`,
                    color: "#c4c8d2", borderRadius: 10, padding: "9px 12px", fontSize: 13,
                    cursor: "pointer", fontFamily: "inherit",
                  }}>
                    {q}
                  </button>
                ))}
              </div>
            )}
          </div>
          {/* input */}
          <div style={{ display: "flex", gap: 8, padding: 12, borderTop: "1px solid #23262e", background: "#0f1218" }}>
            <input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => { if (e.key === "Enter") send(); }}
              placeholder="Escribí tu mensaje..."
              disabled={typing}
              style={{
                flex: 1, border: "1px solid #23262e", borderRadius: 99, padding: "10px 16px",
                fontSize: 14, outline: "none", fontFamily: "inherit", background: "#0f1218", color: "#f4f5f7", color: "#f4f5f7",
              }}
            />
            <button onClick={() => send()} disabled={typing || !input.trim()} aria-label="Enviar"
              style={{
                background: O, color: "#fff", border: "none", borderRadius: 99,
                width: 40, height: 40, cursor: typing ? "default" : "pointer",
                fontSize: 16, display: "grid", placeItems: "center", flexShrink: 0,
                opacity: typing || !input.trim() ? 0.5 : 1,
              }}>
              ↑
            </button>
          </div>
        </div>
      )}

      {/* Botón burbuja */}
      <button
        onClick={() => setOpen((v) => !v)}
        aria-label={open ? "Cerrar chat" : "Abrir chat con la asistente IA"}
        style={{
          position: "fixed", bottom: 22, right: 22, zIndex: 1001,
          width: 60, height: 60, borderRadius: 99, border: "none", cursor: "pointer",
          background: O, color: "#fff", fontSize: 26, display: "grid", placeItems: "center",
          boxShadow: "0 14px 30px -10px rgba(99,102,241,.55)",
          transition: "transform .2s",
        }}
        onMouseEnter={(e) => (e.currentTarget.style.transform = "scale(1.06)")}
        onMouseLeave={(e) => (e.currentTarget.style.transform = "scale(1)")}
      >
        {open ? "×" : "💬"}
        {!open && (
          <span style={{
            position: "absolute", inset: 0, borderRadius: 99,
            border: `2px solid ${O}`, animation: "ringPulse 2s ease-out infinite",
          }} />
        )}
      </button>
    </>
  );
}

// ---- Sistema de citas: calendario + slots + formulario (guarda en Supabase) ----
const DOW_LABELS = ["Lun", "Mar", "Mié", "Jue", "Vie", "Sáb", "Dom"];
const MONTHS = ["Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio", "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre"];
const pad2 = (n) => String(n).padStart(2, "0");

function BookingCalendar() {
  const O = "#6366f1";
  const today = new Date(); today.setHours(0, 0, 0, 0);

  const [view, setView] = useState({ y: today.getFullYear(), m: today.getMonth() });
  const [selDate, setSelDate] = useState(null);
  const [slots, setSlots] = useState(null);
  const [loadingSlots, setLoadingSlots] = useState(false);
  const [slotsErr, setSlotsErr] = useState(false);
  const [selTime, setSelTime] = useState(null);
  const [form, setForm] = useState({ name: "", company: "", email: "", phone: "", type: "Llamada", note: "" });
  const [status, setStatus] = useState("idle"); // idle | submitting | done | error
  const [errMsg, setErrMsg] = useState("");

  const first = new Date(view.y, view.m, 1);
  const startOffset = (first.getDay() + 6) % 7; // lunes primero
  const daysInMonth = new Date(view.y, view.m + 1, 0).getDate();
  const cells = [];
  for (let i = 0; i < startOffset; i++) cells.push(null);
  for (let d = 1; d <= daysInMonth; d++) cells.push(d);

  const canPrev = new Date(view.y, view.m, 1) > new Date(today.getFullYear(), today.getMonth(), 1);
  const move = (delta) => { setView((v) => { const d = new Date(v.y, v.m + delta, 1); return { y: d.getFullYear(), m: d.getMonth() }; }); };

  const dateStr = (d) => `${view.y}-${pad2(view.m + 1)}-${pad2(d)}`;
  const isDisabled = (d) => {
    const dt = new Date(view.y, view.m, d); dt.setHours(0, 0, 0, 0);
    const dow = dt.getDay();
    return dt < today || dow === 0 || dow === 6;
  };

  const pickDay = async (d) => {
    const ds = dateStr(d);
    setSelDate(ds); setSelTime(null); setStatus("idle"); setSlots(null);
    setLoadingSlots(true); setSlotsErr(false);
    try {
      const r = await fetch(`/api/slots?date=${ds}`);
      const data = await r.json();
      if (!r.ok) throw new Error(data.error || "error");
      // Si es hoy, ocultamos horarios ya pasados
      const now = new Date();
      const isToday = ds === `${now.getFullYear()}-${pad2(now.getMonth() + 1)}-${pad2(now.getDate())}`;
      let list = data.slots || [];
      if (isToday) {
        const hm = now.getHours() * 60 + now.getMinutes();
        list = list.filter((t) => { const [h, m] = t.split(":").map(Number); return h * 60 + m > hm + 30; });
      }
      setSlots(list);
    } catch (e) {
      setSlotsErr(true);
    } finally {
      setLoadingSlots(false);
    }
  };

  const valid = selDate && selTime && form.name.trim() && (form.email.trim() || form.phone.trim());

  const submit = async () => {
    if (!valid || status === "submitting") return;
    setStatus("submitting"); setErrMsg("");
    try {
      const r = await fetch("/api/book", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ date: selDate, time: selTime, ...form }),
      });
      const data = await r.json().catch(() => ({}));
      if (r.ok) { setStatus("done"); return; }
      setStatus("error");
      setErrMsg(data.error || "No se pudo agendar. Probá de nuevo.");
      if (r.status === 409) { setSelTime(null); pickDay(Number(selDate.slice(8, 10))); }
    } catch (e) {
      setStatus("error"); setErrMsg("Hubo un problema de conexión. Probá de nuevo.");
    }
  };

  const fld = (k, ph, type = "text") => (
    <input
      value={form[k]} onChange={(e) => setForm((f) => ({ ...f, [k]: e.target.value }))}
      placeholder={ph} type={type}
      style={{ width: "100%", border: `1px solid ${C.line}`, borderRadius: 10, padding: "11px 14px", fontSize: 14.5, outline: "none", fontFamily: "inherit", background: C.card }}
    />
  );

  if (status === "done") {
    const [yy, mm, dd] = selDate.split("-");
    return (
      <div style={{ background: C.card, border: `1px solid ${C.line}`, borderRadius: 20, padding: "48px 36px", textAlign: "center", maxWidth: 560, margin: "0 auto" }}>
        <div style={{ width: 60, height: 60, borderRadius: 99, background: `${O}1c`, color: O, display: "grid", placeItems: "center", fontSize: 30, margin: "0 auto 18px" }}>✓</div>
        <h3 style={{ fontFamily: "'Lora', serif", fontSize: 26, fontWeight: 600, marginBottom: 10 }}>¡Reunión agendada!</h3>
        <p style={{ fontSize: 16, color: C.muted, lineHeight: 1.6 }}>
          Te esperamos el <b style={{ color: C.ink }}>{dd}/{mm}/{yy} a las {selTime} hs</b> ({form.type}).<br />
          Te vamos a contactar a {form.email || form.phone} para confirmar los detalles.
        </p>
      </div>
    );
  }

  return (
    <div className="grid-2" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 24, alignItems: "start", maxWidth: 860, margin: "0 auto" }}>
      {/* Calendario */}
      <div style={{ background: C.card, border: `1px solid ${C.line}`, borderRadius: 18, padding: 22 }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 14 }}>
          <button onClick={() => canPrev && move(-1)} disabled={!canPrev} aria-label="Mes anterior"
            style={{ width: 34, height: 34, borderRadius: 9, border: `1px solid ${C.line}`, background: C.card, cursor: canPrev ? "pointer" : "default", opacity: canPrev ? 1 : 0.4, fontSize: 16 }}>‹</button>
          <div style={{ fontWeight: 700, fontSize: 15.5 }}>{MONTHS[view.m]} {view.y}</div>
          <button onClick={() => move(1)} aria-label="Mes siguiente"
            style={{ width: 34, height: 34, borderRadius: 9, border: `1px solid ${C.line}`, background: C.card, cursor: "pointer", fontSize: 16 }}>›</button>
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(7,1fr)", gap: 4, marginBottom: 6 }}>
          {DOW_LABELS.map((d) => (
            <div key={d} style={{ textAlign: "center", fontSize: 11, fontWeight: 700, color: C.muted, padding: "4px 0" }}>{d}</div>
          ))}
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(7,1fr)", gap: 4 }}>
          {cells.map((d, i) => {
            if (!d) return <div key={`e${i}`} />;
            const dis = isDisabled(d);
            const sel = selDate === dateStr(d);
            return (
              <button key={d} onClick={() => !dis && pickDay(d)} disabled={dis}
                style={{
                  aspectRatio: "1", borderRadius: 9, fontSize: 14, fontFamily: "inherit",
                  border: sel ? `1.5px solid ${O}` : `1px solid ${dis ? "transparent" : C.line}`,
                  background: sel ? O : (dis ? "transparent" : C.white),
                  color: sel ? "#fff" : (dis ? "#c9c2b8" : C.ink),
                  cursor: dis ? "default" : "pointer", fontWeight: sel ? 700 : 500,
                }}>
                {d}
              </button>
            );
          })}
        </div>
      </div>

      {/* Horarios + formulario */}
      <div style={{ background: C.card, border: `1px solid ${C.line}`, borderRadius: 18, padding: 22, minHeight: 320 }}>
        {!selDate && (
          <div style={{ color: C.muted, fontSize: 15, lineHeight: 1.6, paddingTop: 8 }}>
            Elegí un día en el calendario para ver los horarios disponibles. <br /><br />
            <span style={{ fontSize: 13 }}>Lun a Vie · 10:00–18:00 (hora de Argentina) · reuniones de 30 min.</span>
          </div>
        )}

        {selDate && (
          <>
            <div style={{ fontSize: 12, textTransform: "uppercase", letterSpacing: 1, color: C.muted, fontWeight: 600, marginBottom: 10 }}>
              Horarios · {selDate.split("-").reverse().join("/")}
            </div>
            {loadingSlots && <div style={{ color: C.muted, fontSize: 14 }}>Cargando horarios…</div>}
            {slotsErr && (
              <div style={{ color: C.muted, fontSize: 14, lineHeight: 1.6 }}>
                No pudimos cargar los horarios ahora. <button onClick={() => pickDay(Number(selDate.slice(8, 10)))} style={{ color: O, background: "none", border: "none", cursor: "pointer", fontWeight: 600, padding: 0 }}>Reintentar</button>
              </div>
            )}
            {!loadingSlots && !slotsErr && slots && slots.length === 0 && (
              <div style={{ color: C.muted, fontSize: 14 }}>No quedan horarios libres este día. Probá con otra fecha 🗓️</div>
            )}
            {!loadingSlots && !slotsErr && slots && slots.length > 0 && (
              <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 8, marginBottom: 18 }}>
                {slots.map((t) => (
                  <button key={t} onClick={() => setSelTime(t)}
                    style={{
                      padding: "9px 0", borderRadius: 9, fontSize: 13.5, fontFamily: "inherit", cursor: "pointer",
                      border: selTime === t ? `1.5px solid ${O}` : `1px solid ${C.line}`,
                      background: selTime === t ? O : C.white, color: selTime === t ? "#fff" : C.ink,
                      fontWeight: selTime === t ? 700 : 500,
                    }}>
                    {t}
                  </button>
                ))}
              </div>
            )}

            {selTime && (
              <div style={{ display: "flex", flexDirection: "column", gap: 10, marginTop: 6, animation: "fadeUp .3s ease" }}>
                {fld("name", "Nombre y apellido *")}
                {fld("company", "Empresa")}
                {fld("email", "Email *", "email")}
                {fld("phone", "Teléfono / WhatsApp *", "tel")}
                <select value={form.type} onChange={(e) => setForm((f) => ({ ...f, type: e.target.value }))}
                  style={{ width: "100%", border: `1px solid ${C.line}`, borderRadius: 10, padding: "11px 14px", fontSize: 14.5, fontFamily: "inherit", background: C.card }}>
                  <option>Llamada</option>
                  <option>Videollamada (Meet)</option>
                </select>
                {fld("note", "Contanos brevemente qué necesitás (opcional)")}
                {status === "error" && <div style={{ color: "#c0392b", fontSize: 13.5 }}>{errMsg}</div>}
                <button onClick={submit} disabled={!valid || status === "submitting"}
                  style={{
                    background: O, color: "#fff", border: "none", borderRadius: 11, padding: "13px 0",
                    fontSize: 15.5, fontWeight: 700, fontFamily: "inherit",
                    cursor: valid && status !== "submitting" ? "pointer" : "default",
                    opacity: valid && status !== "submitting" ? 1 : 0.55,
                  }}>
                  {status === "submitting" ? "Agendando…" : "Confirmar reunión"}
                </button>
                <div style={{ fontSize: 11.5, color: C.muted, textAlign: "center" }}>* Nombre y al menos un medio de contacto.</div>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
