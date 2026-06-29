# SYNEXA · Landing de agentes de IA

Landing one-page para la agencia **SYNEXA**, hecha en **React 18 + Vite**. Sin dependencias
externas de UI: todo el estilo es inline y las animaciones son CSS/SVG/Canvas.

## Requisitos

- Node.js 18 o superior
- npm (o pnpm / yarn)

## Cómo correrlo en local

```bash
npm install      # instala dependencias
npm run dev      # levanta el server de desarrollo en http://localhost:5173
```

## Build de producción

```bash
npm run build    # genera la carpeta /dist
npm run preview  # previsualiza el build localmente
```

## Estructura

```
synexa/
├─ index.html
├─ vite.config.js
├─ vercel.json            # rewrites para que funcione como SPA
├─ .env.example           # plantilla de variables de entorno
├─ public/
│  ├─ synexa-logo.png            # logo (nav)
│  ├─ synexa-logo-transparent.png# logo sin fondo (footer)
│  └─ favicon.png
└─ src/
   ├─ main.jsx
   ├─ index.css
   └─ App.jsx             # toda la landing
```

## El asesor IA (chat)

El chat de la sección "Tu asesor de IA" llama a un webhook configurable por variable de entorno.

1. Copiá `.env.example` a `.env` y completá:

   ```
   VITE_AGENT_WEBHOOK=https://tu-instancia.n8n.cloud/webhook/synexa-asesor
   ```

2. En n8n armá un workflow con un nodo **Webhook (POST)** que reciba este body:

   ```json
   {
     "system": "instrucciones del asesor...",
     "messages": [
       { "role": "user", "content": "hola" }
     ]
   }
   ```

3. Conectalo a un nodo de **AI Agent / OpenAI / Anthropic** usando `system` como system
   prompt y `messages` como historial.

4. Respondé desde n8n con un JSON que tenga la respuesta en cualquiera de estas claves:
   `reply`, `output`, `text`, o el formato `content[]` de la API de Anthropic.

   ```json
   { "reply": "¡Hola! Contame qué hace tu negocio..." }
   ```

> Si `VITE_AGENT_WEBHOOK` está vacío, el chat funciona en **modo demo**: invita al visitante a
> escribir por WhatsApp. Así nunca queda "roto" aunque el backend no esté listo.

**Importante:** nunca pongas tu API key de Anthropic/OpenAI en el frontend. La key vive en n8n.

## Deploy en Vercel

1. Subí el proyecto a un repo de GitHub.
2. En Vercel: *New Project* → importá el repo.
3. Framework preset: **Vite** (lo detecta solo). Build: `npm run build`, output: `dist`.
4. En *Settings → Environment Variables* agregá `VITE_AGENT_WEBHOOK` con tu URL de n8n.
5. Deploy.

## Cosas para personalizar

- **WhatsApp:** en `src/App.jsx` buscá `549351XXXXXXX` y poné tu número real.
- **Capturas reales:** hay placeholders marcados con borde punteado ("captura real del
  producto") en los casos de éxito y el mockup del hero. Reemplazalos por imágenes reales
  del CRM cuando las tengas.
- **Textos / clientes / precios:** están en arrays arriba de `App.jsx` (`CLIENTS`, `CASES`,
  `TESTIMONIALS`, `PRICING`, etc.), fáciles de editar.
