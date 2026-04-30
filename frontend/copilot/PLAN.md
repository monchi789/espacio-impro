# PLAN.md — Impronakuy 2026 dentro de Espacio Impro

## Objetivo

Agregar la ruta `/impronakuy-2026` al sitio web existente de Espacio Impro en Astro, sin romper nada de lo existente. La página funciona como landing del torneo durante el evento y como archivo de recuerdo a futuro.

---

## Estrategia de integración

```
Sitio actual (NO TOCAR)          Nuevo (AGREGAR)
─────────────────────────        ──────────────────────────────
src/pages/index.astro            src/pages/impronakuy-2026/
src/pages/nosotros.astro           └── index.astro  ← nueva página
src/pages/portafolio.astro
src/pages/galeria.astro          src/components/impronakuy/
src/components/home/               ├── ImpronakuyLayout.astro
src/components/nosotros/           ├── Navbar.astro
src/layouts/Layout.astro           ├── HeroBanner.tsx  (React)
src/styles/global.css              ├── TeamSection.astro
                                   ├── TeamCard.astro
                                   ├── MemberCard.tsx  (React)
                                   ├── GroupPhoto.astro
                                   └── VotingPanel.tsx (React)

                                 src/data/
                                   └── impronakuy-teams.ts

                                 public/images/impronakuy/
                                   ├── equipos/
                                   └── Todos Juntos.png
```

## Por qué NO usar Layout.astro del sitio principal

El layout principal incluye el Header y Footer de Espacio Impro (navegación, logo de la empresa, colores de marca). El landing de Impronakuy 2026 es una experiencia inmersiva con estética propia galáctica. Mezclar ambos rompería la inmersión visual y la identidad del evento.

La página de Impronakuy tiene su propio navbar mínimo con link de regreso a `espacio-impro.com`.

---

## Arquitectura de la página

```
/impronakuy-2026
│
├── ImpronakuyLayout.astro     ← <html> propio, fuentes, CSS vars
│   │
│   ├── Navbar.astro           ← logo evento + "← Volver a Espacio Impro"
│   │
│   ├── HeroBanner.tsx         ← client:load
│   │   ├── Modo normal: carrusel 5 equipos
│   │   └── Modo votación: 2 equipos + VS eléctrico
│   │
│   ├── VotingPanel.tsx        ← client:load (solo renderiza si hay match activo)
│   │   ├── Ronda actual
│   │   ├── Botones de voto
│   │   ├── Barras de progreso en tiempo real (WS)
│   │   └── Marcador de rondas ganadas
│   │
│   ├── TeamSection.astro      ← estático SSG
│   │   └── TeamCard.astro × 5
│   │       └── MemberCard.tsx × 3   ← client:visible (lazy)
│   │
│   └── GroupPhoto.astro       ← estático SSG
```

---

## Decisión: Astro estático + React solo donde hay interactividad

| Componente | Tecnología | Razón |
|---|---|---|
| Navbar | Astro | Estático, sin estado |
| HeroBanner | React `client:load` | Carrusel necesita `useState` + `useEffect` |
| VotingPanel | React `client:load` | WebSocket + polling + estado de voto |
| TeamSection | Astro | Renderizado en build, 5 teams son datos fijos |
| TeamCard | Astro | Layout estático del equipo |
| MemberCard | React `client:visible` | Foto rotatoria con `useState`. `client:visible` = lazy hydration solo al hacer scroll |
| GroupPhoto | Astro | Completamente estático |

---

## Fuentes — reutilizar self-hosted existentes

```css
/* En ImpronakuyLayout.astro <style> */
@font-face {
  font-family: 'Lovelo';
  src: url('/fonts/Lovelo-Black.woff2') format('woff2');
  font-weight: 900;
  font-display: swap;
}
@font-face {
  font-family: 'Lovelo';
  src: url('/fonts/Lovelo-LineBold.woff2') format('woff2');
  font-weight: 700;
  font-display: swap;
}
@font-face {
  font-family: 'Manrope';
  src: url('/fonts/Manrope-Bold.woff2') format('woff2');
  font-weight: 700;
  font-display: swap;
}
/* etc. — Inter y Manrope ya están disponibles */
```

**Lovelo** reemplaza a Orbitron para los títulos del evento. Es dramática, geométrica, perfecta para la estética galáctica.

---

## Paleta de colores y variables CSS

Definidas en `ImpronakuyLayout.astro` dentro de `<style is:global>` scoped al selector `body.impronakuy-page`:

```css
body.impronakuy-page {
  --ik-bg-deep:    #030712;
  --ik-bg-dark:    #0a0f1e;
  --ik-bg-card:    #111827;
  --ik-text:       #e2e8f0;
  --ik-text-muted: #94a3b8;
  --ik-border:     #1e293b;

  /* Colores por equipo */
  --ik-culiprincess:      #e879f9;
  --ik-culiprincess-dark: #a21caf;
  --ik-tetris:            #4ade80;
  --ik-tetris-dark:       #15803d;
  --ik-cercano:           #fb923c;
  --ik-cercano-dark:      #c2410c;
  --ik-mal:               #f87171;
  --ik-mal-dark:          #b91c1c;
  --ik-fachonistas:       #fbbf24;
  --ik-fachonistas-dark:  #b45309;

  background-color: var(--ik-bg-deep);
  color: var(--ik-text);
  font-family: 'Manrope', sans-serif;
}
```

El `body.impronakuy-page` evita que estas variables contaminen el resto del sitio.

---

## Estructura de datos: `src/data/impronakuy-teams.ts`

```typescript
export interface IKMember {
  id: string
  realName: string
  artisticName: string
  photo1: string  // ruta desde /
  photo2: string
}

export interface IKTeam {
  id: string
  name: string
  color: string
  colorDark: string
  teamPhoto: string
  members: IKMember[]
}

export const IK_TEAMS: IKTeam[] = [
  {
    id: 'culiprincess',
    name: 'Las Culiprincess',
    color: '#e879f9',
    colorDark: '#a21caf',
    teamPhoto: '/images/impronakuy/equipos/Las Culiprincess/Las Culiprincess.png',
    members: [
      {
        id: 'katherine',
        realName: 'Luisa',
        artisticName: 'Katherine II de la via expresa',
        photo1: '/images/impronakuy/equipos/Las Culiprincess/Katherine II de la via expresa - 1.png',
        photo2: '/images/impronakuy/equipos/Las Culiprincess/Katherine II de la via expresa - 2.png',
      },
      // ...
    ],
  },
  // ... 4 equipos más
]
```

---

## API de votación

Variables de entorno (en `.env`):
```
PUBLIC_API_URL=http://localhost:8000
PUBLIC_WS_URL=ws://localhost:8000
PUBLIC_POLLING_INTERVAL=5000
```

En Astro, las variables con prefijo `PUBLIC_` son accesibles en el cliente:
```typescript
const apiUrl = import.meta.env.PUBLIC_API_URL
```

---

## Estados del VotingPanel

```
sin match activo  → componente no renderiza nada (null)
ronda abierta     → botones de voto activos
ya votó           → botones deshabilitados, mensaje confirmación
ronda cerrada     → ganador de la ronda, esperando siguiente
match terminado   → ganador del match, confetti/animación épica
```

---

## Nota sobre el futuro (modo recuerdo)

Una vez termine el evento:
1. La variable `PUBLIC_API_URL` puede apuntar a un servidor apagado — el `VotingPanel` simplemente no muestra nada (el fetch falla silenciosamente)
2. La sección queda como galería de los equipos y sus personajes
3. Se puede agregar un link desde el portafolio del sitio principal bajo "ImproNakuy" (ya existe esa carpeta en `public/images/presentaciones/ImproNakuy/`)

---

## Link desde el sitio principal (a agregar después)

En `src/data/shows.ts` ya existe la categoría ImproNakuy. Después de construir el landing, agregar en `shows.ts`:
```typescript
{
  slug: 'impronakuy-2026',
  externalLink: '/impronakuy-2026',  // link a la nueva sección
  // ...
}
```
