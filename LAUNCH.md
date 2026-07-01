# 🚀 ERGAGORA — Checklist de producción

Lo que hace el código ya está. Esto es lo que tenés que verificar **vos** en
Vercel / Supabase antes de largar a producción.

## 1. Variables de entorno (Vercel → Project → Settings → Environment Variables)
Marcá las tres para el entorno **Production** (y Preview si querés probar):

- [ ] `GROQ_API_KEY` — para el asistente de ventas (`/api/chat`).
- [ ] `SUPABASE_URL` — URL del proyecto Supabase.
- [ ] `SUPABASE_SERVICE_KEY` — **service role key** (server-side, NO la anon key).

> Nunca pongas estas claves en el frontend ni las commitees. `.env` está en `.gitignore`.

## 2. Base de datos (Supabase)
- [ ] Tabla `bookings` creada con columnas: `date`, `time`, `name`, `company`,
      `email`, `phone`, `type`, `note`.
- [ ] **Restricción `UNIQUE(date, time)`** (evita doble reserva → devuelve 409).
- [ ] RLS activado en la tabla (el acceso va solo por la service key del backend).

## 3. SEO
- [ ] Verificar el sitio en **Google Search Console** y enviar el sitemap:
      `https://ergagora.com/sitemap.xml`
- [ ] Probar los datos estructurados en https://search.google.com/test/rich-results
- [ ] Probar la preview social (Open Graph) en https://www.opengraph.xyz/
- [ ] (Local SEO Florida) Crear un **Google Business Profile** con NAP real
      cuando lo tengas, y agregar `address` + `telephone` al JSON-LD de `index.html`.

## 4. Seguridad (ya aplicado en código)
- [x] Headers de seguridad + CSP en `vercel.json` (HSTS, X-Frame-Options, etc.).
- [x] Rate-limiting + control de origin + errores sanitizados en `/api/*`.
- [ ] **Recomendado:** activar **Vercel Firewall / Rate Limiting** en el dashboard
      (Project → Firewall) para límites duros y persistentes a escala — el
      rate-limit del código es en memoria (best-effort por instancia).
- [ ] Verificar headers en https://securityheaders.com/ después del deploy.

## 5. Cuando compres el dominio propio
Reemplazá `https://ergagora.com` por tu dominio en:
- [ ] `index.html` (canonical, og:url, og:image, twitter:image, JSON-LD)
- [ ] `public/robots.txt` (línea `Sitemap:`)
- [ ] `public/sitemap.xml` (`<loc>`)
- [ ] `api/_lib/security.js` → agregar el host a `ALLOWED_HOSTS`

## 6. Verificación final
- [ ] `npm run build` sin errores.
- [ ] Probar en el deploy: chat, calendario de reservas (elegir día → horarios →
      reservar), selector de idioma EN/ES, menú mobile, página de Pricing.
