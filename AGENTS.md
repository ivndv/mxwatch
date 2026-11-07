# AGENTS.md — mxwatch

Guía operativa y técnica para agentes de IA que colaboran en el desarrollo, mantenimiento y optimización del frontend interactivo de MXWatch.

## 1. Visión general

**MXWatch** es un tablero táctico y mapa interactivo diseñado para consultar, visualizar y monitorear datos geográficos, presencia territorial y análisis de inteligencia en todo el territorio mexicano.

- **Propósito:** mapa SVG interactivo con renderizado de estados, selector táctico, panel lateral (sidebar) de búsqueda y estadísticas en tiempo real, conectado a la API backend `mxwatch-api` para consumir datos geográficos y reportes de inteligencia.
- **Dominio en producción:** [https://mxwatch.liuma.app/](https://mxwatch.liuma.app/)
- **Repositorio:** [https://github.com/ivndv/mxwatch](https://github.com/ivndv/mxwatch)
- **Idiomas:** segmento `[locale]` con diccionarios `en` y `es`.

## 2. Antes de tocar código

**CodeGraph** (índice de símbolos del repo): usa `codegraph_explore` (`query`, `maxFiles`, `projectPath`) antes de un grep masivo o de leer varios archivos; devuelve fuente verbatim, rutas de llamada e impacto.

- `codegraph sync /home/ivan/software-dev/mxwatch` tras editar, pull o cambiar de rama (incremental, uso normal).
- `codegraph index /home/ivan/software-dev/mxwatch` solo al crear el índice, tras `codegraph upgrade` o si `status` avisa `built by vX` (rebuild completo).
- `codegraph status /home/ivan/software-dev/mxwatch` para comprobar el estado.

## 3. Stack tecnológico

| Capa | Tecnología | Versión / Detalle |
| :--- | :--- | :--- |
| **Runtime & Gestor** | **Bun** | `v1.4.4` (`bun.lock`) |
| **Lenguaje** | **TypeScript** | `^7.0.2`, modo estricto (`tsconfig.json`) |
| **Frontend Framework** | **Next.js 16** + **React 19** | App Router (`next ^16.4.3`, `react ^19.3.1`, `react-dom ^19.3.1`) |
| **Adaptador Edge / Cloudflare** | **@opennextjs/cloudflare** | `^1.20.15` (compilación y ejecución en Cloudflare Workers) |
| **Visualización cartográfica** | **@visx/geo** + **d3-geo** + **topojson-client** | `@visx/geo ^4.0.0`, `d3-geo ^3.1.1`, `topojson-client ^3.1.0`; proyección `<Mercator>` y pan/zoom nativo (rueda, arrastre y pinch) en `src/lib/useMapView.ts` |
| **Estilos & UI** | **Tailwind CSS 4** | `@tailwindcss/postcss ^4.3.3`, `tailwindcss ^4.3.3`, tema claro, oscuro y sistema |
| **Animaciones & virtualización** | **framer-motion** + **react-window** | `framer-motion ^14.9.0`, `react-window ^2.5.2` |
| **Estado global** | **Zustand 5** + **TanStack Query 5** | Zustand para UI (`mapStore.ts`, `mapaSlice.ts`) y TanStack Query para datos del servidor (`src/lib/useMapaQueries.ts`) |
| **Validación de datos** | **Zod 4** | `zod ^4.6.7` (validación runtime en `src/schemas/api.ts`) |
| **Linter & Formatter** | **Biome 2** | `@biomejs/biome ^2.6.4` (`biome.json` con preset `recommended`) |
| **Infraestructura** | **Cloudflare Workers** + **Wrangler** | `wrangler ^4.156.0` (`wrangler.jsonc`, OpenNext) |
| **CDN & assets** | **Cloudflare R2** | Bucket `assets-mgdc`, dominio `https://assets.liuma.app/mxwatch/` (logos, og-image, favicon, TopoJSON) |
| **CI/CD** | **GitHub Actions** | Composite `./.github/actions/setup` (Bun `1.4.4`, Node `24.22.1`, cache de `node_modules`, `--frozen-lockfile`); lint, typecheck, build y traducciones; deploy en `main` |

## 4. Estructura del código

```plaintext
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
│   │   ├── providers.tsx          → QueryClientProvider de TanStack Query
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
│   │   ├── mapa/                  → index, MapView (isla cliente), MapaRenderizado, controles, tooltip y estados de carga
│   │   ├── sidebar/               → Panel de inteligencia (estado, cártel, búsqueda, leyenda)
│   │   └── ui/                    → Micro-componentes e iconos reutilizables
│   ├── i18n/                      → LocaleProvider para componentes cliente
│   ├── lib/                       → parseo de API, queries de TanStack, estilos del mapa y pan/zoom
│   ├── schemas/                   → Contratos Zod de la API
│   ├── store/                     → mapStore (estado de UI) y themeStore
│   └── types/                     → Interfaces TypeScript compartidas
├── src/proxy.ts                   → Rewrite a /[locale] y resolución de idioma
├── open-next.config.ts            → Configuración de OpenNext para Cloudflare
├── wrangler.jsonc                 → Cloudflare Workers con Static Assets
├── biome.json                     → Formateo y linting
└── package.json                   → Dependencias y scripts de Bun
```

## 5. Arquitectura y flujo de datos

```plaintext
[ mxwatch-api (Backend Hono / PostgreSQL / Dokploy) ]
                      ▲
                      │  HTTP (headers: { "x-api-key": API_KEY })
                      ▼
[ Server Actions: src/actions/mapData.ts ]
                      ▲
                      │  Validación runtime con Zod (api.schemas.ts)
                      ▼
[ TanStack Query: src/lib/useMapaQueries.ts ]
         ├── presencia, carteles, inteligencia y detalle
         └── caché de 5 minutos alineada con el backend
[ Zustand: src/store/mapStore.ts ]
         └── búsqueda, cártel y estado seleccionados (UI)
                      ▲
                      ▼
[ Componentes React: src/components/mapa/ & sidebar/ ]
```

1. **Server Actions (`src/actions/mapData.ts`):**
   - Ejecutan en el servidor de Next.js (Cloudflare Worker runtime).
   - Consumen los endpoints de la API (`/api/map`, `/api/cartels`, `/api/cartel/:slug`, `/api/state/:name`).
   - Envían el header secreto `x-api-key` configurado en `API_KEY`.
   - Validan cada respuesta contra los esquemas de Zod antes de entregar datos al frontend.
   - Propagan los errores HTTP/schema para que TanStack Query active `error` y `retry`; un 404 se trata como "sin datos".
2. **Consumo en cliente:**
   - `src/lib/useMapaQueries.ts` expone `usePresencia`, `useCarteles`, `useInteligencia` y `useDetalleCartel`.
   - TanStack Query cachea las respuestas; Zustand solo guarda búsqueda y selección.
   - `MapaRenderizado.tsx` proyecta el TopoJSON y colorea los estados según su nivel de presencia.
3. **Renderizado (SSG + isla cliente):**
   - `src/app/[locale]/map/page.tsx` se prerenderiza en build para `en` y `es`.
   - `MapView` es una isla cliente: el servidor pinta el skeleton y el mapa se monta tras la hidratación.
   - Así se evita el mismatch de hidratación y la API no bloquea el HTML si falla.

## 6. Variables de entorno

Configuradas en `.env.local` (local) o en las variables de entorno de Cloudflare Pages (producción):

| Variable | Tipo | Descripción |
| :--- | :--- | :--- |
| `API_URL` | Privada (servidor) | URL base del backend `mxwatch-api` (ej.: `http://localhost:3001` o `https://mxwatch-api.liuma.app`). |
| `API_KEY` | Privada (servidor) | Token secreto para autenticar peticiones server-to-server con `mxwatch-api`. |

## 7. Comandos

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

# Linter y formato con Biome: diagnóstico (biome ci, read-only)
bun run check

# Linter y formato con Biome: corrección automática
bun run lint
```

## 8. Convenciones y reglas críticas

- **Gestor de paquetes exclusivo:** usa siempre **`bun`**. Nunca ejecutes `npm`, `yarn` ni `pnpm`.
- **Integridad del linter:** ejecuta `bun run lint` o `bun run check` después de modificar archivos para garantizar conformidad con `biome.json`.
- **Secreto de API:** `API_KEY` es privada del servidor. Las llamadas a `mxwatch-api` pasan por Server Actions; nunca expongas la clave al cliente.
- **Contratos de datos:** toda respuesta nueva de la API debe validarse con Zod antes de entregarla a TanStack Query.
- **Estado del servidor:** no se copia a Zustand; Zustand solo guarda estado de UI (búsqueda y selección).
- **Traducciones:** mantén `messages/en.json` y `messages/es.json` completos; CI ejecuta `bun run check:i18n`.

## 9. Flujo de Git y despliegue

- **Prohibido realizar `git commit` o `git push` sin la confirmación y aprobación explícita del usuario.**
- **Ramas:** el desarrollo se realiza en `develop`; el merge a `main` solo se hace con aprobación explícita y es el que dispara el despliegue.
- **Mensajes de commit:** Conventional Commits en minúsculas y español (`feat: ...`, `fix: ...`, `chore: ...`, `docs: ...`, `refactor: ...`).
- **Despliegue:** en `main` se compila con OpenNext y se publica en Cloudflare (`bun run deploy`).

## 10. CI/CD

Flujo: `push`/`PR` a `main`/`develop` → **lint**, **typecheck** y **build** en paralelo → **deploy** solo en `push` a `main`.

- Setup centralizado en la composite `./.github/actions/setup` (versiones Node/Bun + cache de `node_modules` + `--frozen-lockfile`).
- `lint` corre `bun run check` (`biome ci`, read-only); además ejecuta `bun run check:i18n` para validar que las traducciones estén completas.
- `typecheck` corre `tsc --noEmit` y `build` compila con Next.js para detectar errores antes de fusionar.
- `deploy` compila con OpenNext y despliega en Cloudflare (`bun run deploy`).
- Hardening: `concurrency` (cancela runs obsoletos del mismo ref) y `permissions: contents: read`.

<!-- BEGIN:nextjs-agent-rules -->

## This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->
