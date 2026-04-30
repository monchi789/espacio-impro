# Agente: Impronakuy 2026 — Landing dentro de Espacio Impro

## Contexto del repositorio

Estás trabajando en el repositorio existente de **Espacio Impro** ubicado en:
`/home/monchi789/Projects/espacio-impro/frontend/`

Este proyecto ya está en producción con Astro + React. Tu trabajo es **agregar** una nueva sección `/impronakuy-2026` sin tocar nada del código existente.

## Stack existente (NO modificar)

- **Astro** (framework principal, SSG)
- **React** (componentes interactivos con `client:` directives)
- **TypeScript**
- **CSS global** en `src/styles/global.css`
- **Fuentes self-hosted** en `public/fonts/` (Gliker, Inter, Lovelo, Manrope)
- Estructura de páginas en `src/pages/`
- Layout compartido en `src/layouts/Layout.astro`

## Tu misión

Crear la sub-sección del torneo como una **página Astro independiente** en:
```
src/pages/impronakuy-2026/index.astro
```

Con sus componentes propios en:
```
src/components/impronakuy/
```

Y sus assets en:
```
public/images/impronakuy/
  ├── equipos/
  │   ├── Cercano Oeste/
  │   ├── El mal Organizado/
  │   ├── Las Culiprincess/
  │   ├── Los Fachonistas/
  │   └── Tetris/
  └── Todos Juntos.png
```

## Reglas de integración — NUNCA romper

1. **No modificar** `src/layouts/Layout.astro`, `src/styles/global.css`, ni ningún componente existente.
2. **No agregar dependencias globales** al `package.json` que puedan romper el build existente.
3. El layout de la nueva página **NO usa** el `Layout.astro` del sitio principal — tiene su propio layout galáctico inline.
4. Las fuentes self-hosted ya disponibles (`Inter`, `Manrope`, `Lovelo`) **pueden y deben reutilizarse** para evitar cargar Google Fonts.
5. La navegación del sitio principal (Header/Footer de Astro) **no aparece** en `/impronakuy-2026` — es una experiencia inmersiva propia.
6. Después del evento, la página queda como archivo de recuerdo — el código debe ser autocontenido.

## Stack para los componentes nuevos

- **Astro** para la estructura estática de la página (secciones, layout)
- **React** (`.tsx`) solo para los componentes interactivos:
  - `HeroBanner.tsx` — carrusel animado (necesita estado)
  - `MemberCard.tsx` — foto rotatoria (necesita estado)
  - `VotingPanel.tsx` — votación en tiempo real (necesita estado + WS)
- **CSS Modules** (`.module.css`) para estilos específicos de Impronakuy, sin contaminar el CSS global
- **Framer Motion** — ya puede estar disponible; verificar `package.json`. Si no está, usar CSS animations puro.
- **Zod** — para validar responses de la API de votación
- **NO usar Tailwind** — el proyecto existente no lo usa y agregarlo puede romper el build

## Paleta de colores — Impronakuy 2026

```css
/* Variables locales, definidas solo en los componentes de impronakuy */
--ik-bg-deep:    #030712;
--ik-bg-dark:    #0a0f1e;
--ik-bg-card:    #111827;
--ik-text:       #e2e8f0;
--ik-text-muted: #94a3b8;

/* Color por equipo */
--ik-culiprincess: #e879f9;
--ik-tetris:       #4ade80;
--ik-cercano:      #fb923c;
--ik-mal:          #f87171;
--ik-fachonistas:  #fbbf24;
```

## Fuentes disponibles (self-hosted, ya en public/fonts/)

- `Lovelo-Black.woff2` → títulos del evento (equivale a Orbitron)
- `Lovelo-LineBold.woff2` → subtítulos de equipo
- `Manrope-Bold.woff2`, `Manrope-SemiBold.woff2` → nombres artísticos
- `Inter_18pt-Regular.woff2`, `Inter_18pt-Medium.woff2` → texto de cuerpo

Usar estas fuentes en el `<style>` de la página Astro con `@font-face` que referencien `/fonts/`.

## Datos de equipos

Los 5 equipos y sus integrantes están definidos en `src/data/impronakuy-teams.ts` (a crear).
Las fotos se sirven desde `/images/impronakuy/equipos/`.

## Comportamiento de la página — dos modos

### Modo recuerdo/normal (post-evento o sin match activo)
- Página completa estática: hero, sección de equipos, foto grupal
- El HeroBanner rota entre los 5 equipos decorativamente

### Modo votación en vivo (solo durante el evento, con match activo)
- El VotingPanel aparece prominentemente
- Se conecta a la API del backend FastAPI via fetch + WebSocket
- Variable de entorno `PUBLIC_API_URL` para la URL del backend

## Comandos del proyecto

```bash
cd /home/monchi789/Projects/espacio-impro/frontend
npm run dev      # desarrollo
npm run build    # build de producción
npm run preview  # preview del build
```

## Convenciones del proyecto existente

- Componentes React: PascalCase en `src/components/{seccion}/NombreComponente.tsx`
- Páginas Astro: `src/pages/ruta/index.astro`
- Imágenes estáticas pesadas: en `public/images/`
- Datos: en `src/data/`
- Los componentes React se montan con `client:load` o `client:visible` en Astro
