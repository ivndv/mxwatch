# MXWatch

## Descripción

Tablero táctico y mapa interactivo diseñado para consultar, visualizar y monitorear la presencia territorial, zonas de cobertura y datos analíticos en todo el territorio mexicano. Conectado a un backend especializado, permite examinar organizaciones registradas, presencia geográfica y eventos relevantes a nivel estatal.

## Características

- **Mapa Táctico Interactivo**: Proyección cartográfica vectorial de la República Mexicana con renderizado de estados, niveles de presencia y cobertura territorial.
- **Panel Lateral de Inteligencia**: Barra lateral táctica con buscador en tiempo real para localizar organizaciones, liderazgos y territorios al instante.
- **Fichas de Análisis por Estado**: Desglose detallado al seleccionar cualquier entidad federativa: organizaciones registradas, nivel de presencia y eventos recientes.
- **Perfiles de Organizaciones**: Ficha técnica por grupo con liderazgos, zonas de cobertura, alianzas y registros asociados.
- **Diseño Táctico Optimizado**: Interfaz inmersiva en tema oscuro diseñada para lectura operativa y visualización analítica.

## Secciones

1. **Mapa General**: Vista cartográfica principal con controles de zoom, navegación interactiva y tooltips informativos por entidad.
2. **Panel de Búsqueda y Estadísticas**: Métricas rápidas del territorio nacional y buscador dinámico de organizaciones y estados.
3. **Detalle de Estado**: Panel de inteligencia con el inventario de organizaciones operando en la zona y cronología de eventos.
4. **Detalle de Organización**: Métricas consolidadas, presencia nacional y estructura de cada organización.

## Uso

- **Acceder a la Plataforma**: Explora el tablero en vivo directamente aquí: [MXWatch](https://mxwatch.mgdc.site/).
- **Navegar por el Mapa**: Haz clic en cualquier estado de la República Mexicana para desplegar su ficha de inteligencia y organizaciones presentes.
- **Filtrar por Organización**: Usa el buscador del panel lateral para resaltar los estados donde opera una organización específica y consultar su estructura.
- **Controles de Mapa**: Utiliza los controles flotantes para acercar, alejar o restablecer la vista panorámica del territorio.

## Tecnologías Utilizadas

- **Frontend**: Next.js 16 (App Router), React 19, Tailwind CSS 4
- **Cartografía & Visualización**: react-simple-maps, d3-geo, topojson-client
- **Estado Global**: Zustand 5
- **Validación de Datos**: Zod 4
- **Herramientas & Linter**: Bun, Biome, TypeScript
- **Infraestructura & Edge**: Cloudflare Pages (@opennextjs/cloudflare), Cloudflare R2

## Instalación

1. **Clonar el Repositorio**:

```bash
git clone https://github.com/ivndv/mxwatch.git
```

2. **Instalar Dependencias**:

```bash
bun install
```

3. **Variables de Entorno**: Crea un archivo `.env.local` con las credenciales de conexión al backend `mxwatch-api`:

```env
API_URL=http://localhost:3001
API_KEY=tu_clave_secreta_aqui
```

4. **Iniciar el Proyecto**:

```bash
# Desarrollo local con Next.js:
bun run dev

# Preview local con entorno Cloudflare (OpenNext):
bun run dev:full
```

## Despliegue

Desplegado en Cloudflare Pages: [mxwatch.mgdc.site](https://mxwatch.mgdc.site/)

## Licencia

Licencia de Uso Personal:

Este software es propiedad de **Ivan Cruz**. Se permite el uso de este software solo para fines personales y no comerciales. No se permite la distribución, modificación ni uso comercial de este software sin el consentimiento expreso de **Ivan Cruz**.

Cualquier uso no autorizado puede resultar en acciones legales.
