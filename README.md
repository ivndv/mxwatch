# MXWatch

## Descripción

Tablero táctico y mapa interactivo diseñado para consultar, visualizar y monitorear la presencia territorial, zonas de cobertura y datos analíticos en todo el territorio mexicano. Conectado a un backend especializado, permite examinar organizaciones registradas, presencia geográfica y eventos relevantes a nivel estatal.

## Características

- **Mapa Táctico Interactivo**: Proyección cartográfica vectorial de la República Mexicana con renderizado de estados, niveles de presencia y cobertura territorial.
- **Panel Lateral de Inteligencia**: Barra lateral táctica con buscador en tiempo real para localizar organizaciones, liderazgos y territorios al instante.
- **Fichas de Análisis por Estado**: Desglose detallado al seleccionar cualquier entidad federativa: organizaciones registradas, nivel de presencia y eventos recientes.
- **Perfiles de Organizaciones**: Ficha técnica por grupo con liderazgos, zonas de cobertura, alianzas y registros asociados.
- **Diseño Táctico Optimizado**: Interfaz inmersiva en tema claro, oscuro o sistema, con lectura operativa y visualización analítica en español e inglés.

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
- **Cartografía & Visualización**: @visx/geo, d3-geo, topojson-client
- **Estado Global**: Zustand 5
- **Validación de Datos**: Zod 4
- **Internacionalización**: Paraglide JS 2 (español e inglés)
- **Herramientas & Linter**: Bun, Biome, TypeScript
- **Infraestructura & Edge**: Cloudflare Workers (@opennextjs/cloudflare), Cloudflare R2


## Despliegue

Desplegado en Cloudflare Workers: [MXWatch](https://mxwatch.mgdc.site/)

## Licencia

[PolyForm Noncommercial 1.0.0](LICENSE). Uso personal y no comercial; el uso comercial requiere permiso.

© 2026 Ivan Cruz
