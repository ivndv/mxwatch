# AGENTS.md — Guía para Agentes en MXWatch

Guía operativa y técnica para agentes de Inteligencia Artificial que colaboren en el desarrollo, mantenimiento y optimización del frontend interactivo de **MXWatch**.

---

## 1. Visión General del Proyecto

**MXWatch** es un tablero táctico y mapa interactivo diseñado para consultar, visualizar y monitorear datos geográficos, presencia territorial y análisis de inteligencia en todo el territorio mexicano.

* **Propósito:** Ofrecer un mapa SVG interactivo con renderizado de estados, selector táctico, panel lateral (sidebar) de búsqueda y estadísticas en tiempo real, conectándose a una API backend (`mxwatch-api`) para consumir datos geográficos y reportes de inteligencia.
* **Dominio en Producción:** [https://mxwatch.mgdc.site/](https://mxwatch.mgdc.site/)
* **Repositorio:** [https://github.com/Ivandv19/mxwatch](https://github.com/Ivandv19/mxwatch)

---

## 2. Antes de Tocar Código

* **Uso del MCP CodeGraph:** Antes de realizar exploraciones a ciegas o búsquedas masivas de texto, invoca la herramienta `codegraph_explore` para inspeccionar el flujo de llamadas y el código fuente verbatim de los símbolos en una sola llamada eficiente.
* **Estado y Sincronización:**
  ```bash
  # Verificar el estado del índice de CodeGraph
  codegraph status /home/ivan/software-dev/mxwatch

  # Sincronizar cambios en el árbol de archivos
  codegraph sync /home/ivan/software-dev/mxwatch
  ```

---

## 3. Stack Tecnológico

| Capa | Tecnología | Versión / Detalle |
| :--- | :--- | :--- |
| **Runtime & Gestor** | **Bun** | `v1.4.4` (`bun.lock`) |
| **Lenguaje** | **TypeScript** | `^7.0.2`, modo estricto (`tsconfig.json`) |
| **Frontend Framework** | **Next.js 16** + **React 19** | App Router (`next ^16.4.3`, `react ^19.3.1`, `react-dom ^19.3.1`) |
| **Adaptador Edge / Cloudflare** | **@opennextjs/cloudflare** | `^1.20.15` (compilación y ejecución en Cloudflare Pages) |
| **Visualización Cartográfica** | **@visx/geo** + **d3-geo** + **topojson-client** | `@visx/geo ^4.0.0`, `d3-geo ^3.1.1`, `topojson-client ^3.1.0`; proyección `<Mercator>` y pan/zoom nativo (rueda, arrastre y pinch) en `src/lib/useMapView.ts` |
| **Estilos & UI** | **Tailwind CSS 4** | `@tailwindcss/postcss ^4.3.3`, `tailwindcss ^4.3.3`, tema oscuro táctico |
| **Animaciones & Virtualización** | **framer-motion** + **react-window** | `framer-motion ^14.9.0`, `react-window ^2.5.2` |
| **Estado Global** | **Zustand 5** | `zustand ^5.0.16` (stores modulares `mapStore.ts`, `datosSlice.ts`, `mapaSlice.ts`) |
| **Validación de Datos** | **Zod 4** | `zod ^4.6.7` (validación runtime en `src/schemas/api.ts`) |
| **Linter & Formatter** | **Biome 2** | `@biomejs/biome ^2.6.4` (`biome.json` con preset `recommended`) |
| **Infraestructura** | **Cloudflare Workers** + **Wrangler** | `wrangler ^4.156.0` (`wrangler.jsonc`, OpenNext) |
| **CDN & Almacenamiento de Assets** | **Cloudflare R2** | Bucket `assets-mgdc`, dominio `https://assets.mgdc.site/mxwatch/` (logos, og-image, favicon, TopoJSON) |
| **CI/CD** | **GitHub Actions** | Composite `./.github/actions/setup` (Bun `1.4.4`, Node `24.22.1`, cache de `node_modules`, `--frozen-lockfile`); lint, typecheck, build y traducciones; deploy en `main` |

---

## 4. Estructura del Código

```
mxwatch/
├── .github/                       → Automatización (GitHub Actions)
│   ├── actions/setup/action.yml   → Composite: Node/Bun + cache + install
│   └── workflows/ci-cd.yml        → lint, typecheck, build y deploy en main
├── messages/                      → Diccionarios i18n (en.json, es.json)
├── project.inlang/                → Proyecto inlang + configuración de Paraglide
├── src/
│   ├── actions/                   → Server Actions de Next.js
│   │   └── mapData.ts             → Fetch server-to-server hacia mxwatch-api con Zod y API_KEY
│   ├── app/                       → App Router de Next.js
│   │   ├── [locale]/              → Segmento raíz localizado (en, es)
│   │   │   ├── layout.tsx         → Layout raíz: fuentes, tema, i18n y estructura global
│   │   │   ├── page.tsx           → Landing
│   │   │   ├── map/page.tsx       → Vista principal del mapa interactivo
│   │   │   ├── legal/             → Términos y privacidad
│   │   │   ├── [...rest]/         → Catch-all que lanza el 404 localizado
│   │   │   └── not-found.tsx      → Manejo 404
│   │   ├── globals.css            → Tokens de tema (claro/oscuro) y Tailwind 4
│   │   └── robots.ts & sitemap.ts → SEO y metadatos por idioma
│   ├── components/
│   │   ├── layout/                → Navbar, Footer, LanguagePicker, ThemeToggle, ThemeSync, NotFoundContent
│   │   ├── mapa/                  → index, MapaRenderizado, controles, tooltip y estados de carga
│   │   ├── sidebar/               → Panel de inteligencia (estado, cártel, búsqueda, leyenda)
│   │   └── ui/                    → Micro-componentes e iconos reutilizables
│   ├── i18n/                      → LocaleProvider para componentes cliente
│   ├── lib/                       → parseo de API, estilos del mapa y pan/zoom
│   ├── schemas/                   → Contratos Zod de la API
│   ├── store/                     → mapStore (datos + mapa) y themeStore
│   └── types/                     → Interfaces TypeScript compartidas
├── src/proxy.ts                   → Rewrite a /[locale] y resolución de idioma
├── open-next.config.ts            → Configuración de OpenNext para Cloudflare
├── wrangler.jsonc                 → Cloudflare Workers con Static Assets
├── biome.json                     → Formateo y linting
└── package.json                   → Dependencias y scripts de Bun
```

---

## 5. Arquitectura y Flujo de Datos

```
[ mxwatch-api (Backend Hono / PostgreSQL / Dokploy) ]
                      ▲
                      │  HTTP (headers: { "x-api-key": API_KEY })
                      ▼
[ Server Actions: src/actions/mapData.ts ]
                      ▲
                      │  Validación runtime con Zod (api.schemas.ts)
                      ▼
[ Zustand: src/store/mapStore.ts ]
         ├── datosSlice: presencia, carteles, detalles
         └── mapaSlice: estadoSeleccionado, zoom, tooltip
                      ▲
                      ▼
[ Componentes React: src/components/mapa/ & sidebar/ ]
```

1. **Server Actions (`src/actions/mapData.ts`):**
   - Ejecutan en el servidor de Next.js (Cloudflare Worker runtime).
   - Consumen los endpoints de la API (`/api/map`, `/api/cartels`, `/api/cartel/:slug`, `/api/state/:name`).
   - Envían el header secreto `x-api-key` configurado en `API_KEY`.
   - Validan cada respuesta contra los esquemas de Zod antes de entregar datos al frontend.
2. **Consumo en Cliente:**
   - La vista (`src/app/[locale]/map/page.tsx`) hidrata el store de Zustand con los datos validados.
   - `MapaRenderizado.tsx` proyecta el TopoJSON y colorea los estados según su nivel de presencia.

---

## 6. Variables de Entorno

Configuradas en `.env.local` (local) o en las variables de entorno de Cloudflare Pages (producción):

| Variable | Tipo | Descripción |
| :--- | :--- | :--- |
| `API_URL` | Privada (Servidor) | URL base del backend `mxwatch-api` (ej: `http://localhost:3001` o `https://mxwatch-api.fluxdv.icu`). |
| `API_KEY` | Privada (Servidor) | Token secreto para autenticar peticiones server-to-server con `mxwatch-api`. |

---

## 7. Comandos Operativos (Bun)

```bash
# Desarrollo local con Next.js
bun run dev

# Build de producción estándar de Next.js
bun run build

# Build adaptado para Cloudflare Pages con OpenNext
bun run build:cf

# Preview local emulando el entorno de Cloudflare
bun run preview

# Flujo completo de build + preview
bun run dev:full

# Despliegue directo a Cloudflare Pages
bun run deploy

# Verificación de tipos
bun run typecheck

# Compila los mensajes de Paraglide
bun run i18n

# Verifica que las traducciones estén completas
bun run check:i18n

# Linter y Formato con Biome
bun run check     # Diagnóstico (biome ci, read-only)
bun run lint      # Corrección automática
```

---

## 8. CI/CD (GitHub Actions)

Flujo: `push`/`PR` a `main`/`develop` → **lint**, **typecheck** y **build** en paralelo → **deploy** solo en `push` a `main`.

* Setup centralizado en la composite `./.github/actions/setup` (versiones Node/Bun + cache de `node_modules` + `--frozen-lockfile`).
* `lint` corre `bun run check` (`biome ci`, read-only), `typecheck` corre `tsc --noEmit` y `build` compila con Next.js para detectar errores antes de fusionar.
* `lint` ejecuta además `bun run check:i18n` para validar que las traducciones estén completas.
* `deploy` compila con OpenNext y despliega en Cloudflare (`bun run deploy`).
* Hardening: `concurrency` (cancela runs obsoletos del mismo ref) y `permissions: contents: read`.

---

## 9. Reglas Críticas para Agentes

1. **Gestor de Paquetes Exclusivo:** Utiliza siempre **`bun`**. Nunca ejecutes `npm`, `yarn` ni `pnpm`.
2. **Integridad de Linter:** Ejecuta `bun run lint` o `bun run check` después de modificar archivos para garantizar conformidad con `biome.json`.
3. **Flujo de Git:** **NO realices `git commit` ni `git push` sin la confirmación explícita del usuario**.
4. **Sincronización de CodeGraph:** Tras crear o renombrar archivos, ejecuta `codegraph sync /home/ivan/software-dev/mxwatch` para mantener actualizado el grafo de símbolos.
