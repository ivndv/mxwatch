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
| **Runtime & Gestor** | **Bun** | `v1.3.x` (`bun.lock`) |
| **Lenguaje** | **TypeScript** | Modo estricto (`tsconfig.json`) |
| **Frontend Framework** | **Next.js 16** + **React 19** | App Router (`next ^16.3.4`, `react ^19.3.0`, `react-dom ^19.3.0`) |
| **Adaptador Edge / Cloudflare** | **@opennextjs/cloudflare** | `^1.20.6` (compilación y ejecución en Cloudflare Pages) |
| **Visualización Cartográfica** | **react-simple-maps** + **d3-geo** + **topojson-client** | Proyecciones geográficas y renderizado de geometrías SVG de México (`public/maps/mexico.json`) |
| **Estilos & UI** | **Tailwind CSS 4** | `@tailwindcss/postcss ^4.3.3`, `tailwindcss ^4.3.3`, tema oscuro táctico |
| **Animaciones & Virtualización** | **framer-motion** + **react-window** | `framer-motion ^12.43.0`, `react-window ^2.3.1` |
| **Estado Global** | **Zustand 5** | `zustand ^5.0.15` (stores modulares `mapStore.ts`, `datosSlice.ts`, `mapaSlice.ts`) |
| **Validación de Datos** | **Zod 4** | `zod ^4.6.2` (validación runtime en `src/schemas/api.schemas.ts`) |
| **Linter & Formatter** | **Biome 2** | `@biomejs/biome ^2.5.13` (`biome.json` con preset `recommended`) |
| **Infraestructura** | **Cloudflare Workers** + **Wrangler** | `wrangler ^4.131.0` (`wrangler.jsonc`, OpenNext) |
| **CDN & Almacenamiento de Assets** | **Cloudflare R2** | Bucket `mxwatch-assets`, dominio `https://mxwatch-assets.mgdc.site` (logos, og-image, favicon, TopoJSON) |

---

## 4. Estructura del Código

```
mxwatch/
├── .open-next/                    → Build artifacts generados por OpenNext
├── public/                        → Assets públicos estáticos (logos, favicons, topojson)
├── src/
│   ├── actions/                   → Server Actions de Next.js
│   │   └── mapData.ts             → Fetch server-to-server hacia mxwatch-api con Zod y API_KEY
│   ├── app/                       → App Router de Next.js
│   │   ├── globals.css            → Estilos globales y tokens de Tailwind CSS 4
│   │   ├── layout.tsx             → Layout principal con Navbar y Footer
│   │   ├── page.tsx               → Página de inicio / Hero
│   │   ├── mapa/
│   │   │   └── page.tsx           → Vista principal del mapa interactivo
│   │   ├── legal/                 → Términos y privacidad
│   │   ├── robots.ts & sitemap.ts → SEO y metadatos
│   │   └── not-found.tsx          → Manejo 404
│   ├── components/
│   │   ├── Navbar.tsx & Footer.tsx→ Navegación global
│   │   ├── mapa/                  → Componentes del mapa táctico
│   │   │   ├── index.tsx          → Contenedor orquestador del mapa
│   │   │   ├── MapaRenderizado.tsx→ Render SVG interactivo con react-simple-maps
│   │   │   ├── MapaControles.tsx  → Zoom, reset y controles flotantes
│   │   │   ├── TooltipEstrategico.tsx → Tooltip en hover sobre estados
│   │   │   ├── EstadosCarga.tsx   → Skeleton loaders y feedback visual
│   │   │   └── estilosCartel.ts   → Paleta de colores e identidades visuales
│   │   └── sidebar/               → Barra lateral interactiva
│   │       ├── index.tsx          → Orquestador de la barra lateral
│   │       ├── PanelEstadoSeleccionado.tsx → Detalle del estado enfocado
│   │       ├── PanelDetalleCartel.tsx      → Métricas e inteligencia del cártel
│   │       ├── ResultadosBusqueda.tsx      → Resultados filtrados dinámicamente
│   │       ├── EstadisticasRapidas.tsx     → Resumen general del territorio
│   │       └── LeyendaCarteles.tsx         → Guía de simbología táctica
│   ├── schemas/
│   │   └── api.schemas.ts         → Contratos de Zod para las respuestas del backend
│   └── store/
│       ├── mapStore.ts            → Store principal unificado de Zustand
│       ├── datosSlice.ts          → Estado de datos de inteligencia y presencia
│       └── mapaSlice.ts           → Estado visual (zoom, selección, hover, proyección)
├── open-next.config.ts            → Configuración de OpenNext para Cloudflare
├── wrangler.jsonc                 → Configuración de Cloudflare Pages y Workers assets
├── biome.json                     → Configuración de formateo y linting
└── package.json                   → Dependencias y scripts operativos de Bun
```

---

## 5. Arquitectura y Flujo de Datos

```
[ mxwatch-api (Backend Hono / D1 / Hyperdrive) ]
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
   - La vista (`src/app/mapa/page.tsx`) hidrata el store de Zustand con los datos validados.
   - `MapaRenderizado.tsx` proyecta el TopoJSON y colorea los estados según su nivel de presencia.

---

## 6. Variables de Entorno

Configuradas en `.env.local` (local) o en las variables de entorno de Cloudflare Pages (producción):

| Variable | Tipo | Descripción |
| :--- | :--- | :--- |
| `API_URL` | Privada (Servidor) | URL base del backend `mxwatch-api` (ej: `http://localhost:3001` o `https://api.mxwatch.mgdc.site`). |
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

# Linter y Formato con Biome
bun run check     # Diagnóstico
bun run lint      # Corrección automática
```

---

## 8. Reglas Críticas para Agentes

1. **Gestor de Paquetes Exclusivo:** Utiliza siempre **`bun`**. Nunca ejecutes `npm`, `yarn` ni `pnpm`.
2. **Integridad de Linter:** Ejecuta `bun run lint` o `bun run check` después de modificar archivos para garantizar conformidad con `biome.json`.
3. **Flujo de Git:** **NO realices `git commit` ni `git push` sin la confirmación explícita del usuario**.
4. **Sincronización de CodeGraph:** Tras crear o renombrar archivos, ejecuta `codegraph sync /home/ivan/software-dev/mxwatch` para mantener actualizado el grafo de símbolos.
