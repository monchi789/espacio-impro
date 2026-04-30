# TASKS.md — Impronakuy 2026 en Espacio Impro (Astro)

Tareas ordenadas para ejecución secuencial en el repo existente.
Directorio de trabajo: `/home/monchi789/Projects/espacio-impro/frontend/`

---

## FASE 0 — Preparación

### TASK-001: Verificar el entorno existente
```bash
cd /home/monchi789/Projects/espacio-impro/frontend
cat package.json
npm run dev
```
Verificar:
- Versión de Astro instalada
- Si `framer-motion` ya está en dependencias
- Si `zod` ya está en dependencias
- Que `npm run dev` corre sin errores

**Done cuando**: Confirmado el stack y las dependencias disponibles.

---

### TASK-002: Instalar dependencias faltantes (solo si no existen)
```bash
# Solo ejecutar las que NO estén en package.json
npm install zod           # si no está
npm install framer-motion # si no está — OPCIONAL, ver TASK-002b
```

**TASK-002b — Si framer-motion NO está disponible**:
No instalarlo. Usar CSS animations puras para el carrusel y las transiciones. Las animaciones de Impronakuy se pueden lograr completamente con `@keyframes` CSS sin Framer Motion.

**Done cuando**: Las dependencias requeridas están disponibles sin errores de build.

---

### TASK-003: Crear estructura de carpetas
```bash
cd /home/monchi789/Projects/espacio-impro/frontend

# Componentes
mkdir -p src/components/impronakuy

# Datos
# (src/data/ ya existe)

# Imágenes
mkdir -p public/images/impronakuy/equipos
```

**Done cuando**: Las carpetas existen.

---

### TASK-004: Copiar fotos de equipos
El usuario debe copiar la carpeta `Impronakuy 2026/` a `public/images/impronakuy/equipos/` manteniendo la estructura:
```
public/images/impronakuy/
├── equipos/
│   ├── Cercano Oeste/
│   │   ├── Amy White Face - 1.png
│   │   ├── Amy White Face - 2.png
│   │   ├── Cercano Oeste.png
│   │   ├── Sheriff Calamity - 1.png
│   │   ├── Sheriff Calamity - 2.png
│   │   ├── Sucio Moe - 1.png
│   │   └── Sucio Moe - 2.png
│   ├── El mal Organizado/
│   ├── Las Culiprincess/
│   ├── Los Fachonistas/
│   └── Tetris/
└── Todos Juntos.png
```

**Done cuando**: `http://localhost:4321/images/impronakuy/equipos/Las%20Culiprincess/Las%20Culiprincess.png` retorna la imagen.

---

## FASE 1 — Tipos y datos

### TASK-005: Crear `src/data/impronakuy-teams.ts`
Tipos e interfaz de datos de los 5 equipos con las rutas exactas de imágenes.

```typescript
export interface IKMember {
  id: string
  realName: string
  artisticName: string
  photo1: string
  photo2: string
}

export interface IKTeam {
  id: string
  name: string
  color: string
  colorDark: string
  teamPhoto: string
  cssVar: string   // ej: '--ik-culiprincess' para usar en style={}
  members: IKMember[]
}

export const IK_TEAMS: IKTeam[] = [
  {
    id: 'culiprincess',
    name: 'Las Culiprincess',
    color: '#e879f9',
    colorDark: '#a21caf',
    cssVar: '--ik-culiprincess',
    teamPhoto: '/images/impronakuy/equipos/Las Culiprincess/Las Culiprincess.png',
    members: [
      {
        id: 'katherine',
        realName: 'Luisa',
        artisticName: 'Katherine II de la via expresa',
        photo1: '/images/impronakuy/equipos/Las Culiprincess/Katherine II de la via expresa - 1.png',
        photo2: '/images/impronakuy/equipos/Las Culiprincess/Katherine II de la via expresa - 2.png',
      },
      {
        id: 'jennifer',
        realName: 'Rebe',
        artisticName: 'Jennifer I de Huancaro',
        photo1: '/images/impronakuy/equipos/Las Culiprincess/Jennifer I de Huancaro - 1.png',
        photo2: '/images/impronakuy/equipos/Las Culiprincess/Jennifer I de Huancaro - 2.png',
      },
      {
        id: 'chantal',
        realName: 'Estrellita',
        artisticName: 'Chantal III de Coripata',
        photo1: '/images/impronakuy/equipos/Las Culiprincess/Chantal III de Coripata - 1.png',
        photo2: '/images/impronakuy/equipos/Las Culiprincess/Chantal III de Coripata - 2.png',
      },
    ],
  },
  {
    id: 'tetris',
    name: 'Tetris',
    color: '#4ade80',
    colorDark: '#15803d',
    cssVar: '--ik-tetris',
    teamPhoto: '/images/impronakuy/equipos/Tetris/Tetris.png',
    members: [
      {
        id: 'eggman',
        realName: 'Marcos',
        artisticName: 'Dr. Eggman',
        photo1: '/images/impronakuy/equipos/Tetris/Dr. Eggman - 1.png',
        photo2: '/images/impronakuy/equipos/Tetris/Dr. Eggman - 2.png',
      },
      {
        id: 'bombita',
        realName: 'Karlita',
        artisticName: 'Bombita Dinamita',
        photo1: '/images/impronakuy/equipos/Tetris/Bombita Dinamita - 1.png',
        photo2: '/images/impronakuy/equipos/Tetris/Bombita Dinamita - 2.png',
      },
      {
        id: 'noqashi',
        realName: 'Monchi',
        artisticName: 'Noqa-shi',
        photo1: '/images/impronakuy/equipos/Tetris/Noqa-shi - 1.png',
        photo2: '/images/impronakuy/equipos/Tetris/Noqa-shi - 2.png',
      },
    ],
  },
  {
    id: 'cercano-oeste',
    name: 'Cercano Oeste',
    color: '#fb923c',
    colorDark: '#c2410c',
    cssVar: '--ik-cercano',
    teamPhoto: '/images/impronakuy/equipos/Cercano Oeste/Cercano Oeste.png',
    members: [
      {
        id: 'sucio-moe',
        realName: 'Octa',
        artisticName: 'Sucio Moe',
        photo1: '/images/impronakuy/equipos/Cercano Oeste/Sucio Moe - 1.png',
        photo2: '/images/impronakuy/equipos/Cercano Oeste/Sucio Moe - 2.png',
      },
      {
        id: 'amy',
        realName: 'Tatie',
        artisticName: 'Amy White Face',
        photo1: '/images/impronakuy/equipos/Cercano Oeste/Amy White Face - 1.png',
        photo2: '/images/impronakuy/equipos/Cercano Oeste/Amy White Face - 2.png',
      },
      {
        id: 'sheriff',
        realName: 'Gaby',
        artisticName: 'Sheriff Calamity Rita Revolver',
        photo1: '/images/impronakuy/equipos/Cercano Oeste/Sheriff Calamity - 1.png',
        photo2: '/images/impronakuy/equipos/Cercano Oeste/Sheriff Calamity - 2.png',
      },
    ],
  },
  {
    id: 'mal-organizado',
    name: 'El Mal Organizado',
    color: '#f87171',
    colorDark: '#b91c1c',
    cssVar: '--ik-mal',
    teamPhoto: '/images/impronakuy/equipos/El mal Organizado/El Mal Organizado.png',
    members: [
      {
        id: 'emperatriz',
        realName: 'Fa',
        artisticName: 'Emperatriz Desbarajada',
        photo1: '/images/impronakuy/equipos/El mal Organizado/Emperatriz Desbarajada - 1.png',
        photo2: '/images/impronakuy/equipos/El mal Organizado/Emperatriz Desbarajada - 2.png',
      },
      {
        id: 'hadencio',
        realName: 'Andre',
        artisticName: 'Hadencio el torpencio',
        photo1: '/images/impronakuy/equipos/El mal Organizado/Hadencio el torpencio - 1.png',
        photo2: '/images/impronakuy/equipos/El mal Organizado/Hadencio el torpencio - 2.png',
      },
      {
        id: 'cruelifica',
        realName: 'Nieves',
        artisticName: 'Cruelifica',
        photo1: '/images/impronakuy/equipos/El mal Organizado/Cruelifica - 1.png',
        photo2: '/images/impronakuy/equipos/El mal Organizado/Cruelifica - 2.png',
      },
    ],
  },
  {
    id: 'fachonistas',
    name: 'Los Fachonistas',
    color: '#fbbf24',
    colorDark: '#b45309',
    cssVar: '--ik-fachonistas',
    teamPhoto: '/images/impronakuy/equipos/Los Fachonistas/Los Fachonistas.png',
    members: [
      {
        id: 'raffita',
        realName: 'Vica',
        artisticName: 'Raffita Izquierdo de Hierro e Inversiones',
        photo1: '/images/impronakuy/equipos/Los Fachonistas/Raffita Izquierdo de Hierro e Inversiones - 1.png',
        photo2: '/images/impronakuy/equipos/Los Fachonistas/Raffita Izquierdo de Hierro e Inversiones - 2.png',
      },
      {
        id: 'calletana',
        realName: 'Shaki',
        artisticName: 'Calletana de las Casas',
        photo1: '/images/impronakuy/equipos/Los Fachonistas/Calletana de las Casas - 1.png',
        photo2: '/images/impronakuy/equipos/Los Fachonistas/Calletana de las Casas - 2.png',
      },
      {
        id: 'facundo',
        realName: 'Carlos',
        artisticName: 'Facundo Salvador de las Lomas',
        photo1: '/images/impronakuy/equipos/Los Fachonistas/Facundo Salvador de las Lomas - 1.png',
        photo2: '/images/impronakuy/equipos/Los Fachonistas/Facundo Salvador de las Lomas - 2.png',
      },
    ],
  },
]

export const getIKTeamById = (id: string): IKTeam | undefined =>
  IK_TEAMS.find((t) => t.id === id)
```

**Done cuando**: `import { IK_TEAMS } from '@/data/impronakuy-teams'` funciona sin errores TS.

---

### TASK-006: Crear `src/data/impronakuy-schemas.ts`
Zod schemas para validar responses de la API de votación:

```typescript
import { z } from 'zod'

export const IKRoundSchema = z.object({
  id: z.string(),
  roundNumber: z.number().int().positive(),
  status: z.enum(['open', 'closed']),
  votesA: z.number().int().min(0),
  votesB: z.number().int().min(0),
})

export const IKActiveMatchSchema = z.object({
  id: z.string(),
  teamA: z.object({ id: z.string(), name: z.string(), color: z.string() }),
  teamB: z.object({ id: z.string(), name: z.string(), color: z.string() }),
  currentRound: IKRoundSchema.nullable(),
  roundsWon: z.object({ teamA: z.number(), teamB: z.number() }),
  status: z.enum(['pending', 'active', 'finished']),
}).nullable()

export type IKActiveMatch = z.infer<typeof IKActiveMatchSchema>
export type IKRound = z.infer<typeof IKRoundSchema>
```

**Done cuando**: Los tipos se infieren correctamente.

---

## FASE 2 — Layout base

### TASK-007: Crear `src/components/impronakuy/ImpronakuyLayout.astro`
Este componente es el `<html>` completo de la página. No usa el Layout.astro del sitio principal.

```astro
---
interface Props {
  title?: string
}
const { title = 'Impronakuy 2026 — Espacio Impro' } = Astro.props
---
<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>{title}</title>
  <meta name="description" content="Torneo de catch de improvisación - Espacio Impro 2026" />
  <!-- Preload de fuentes críticas -->
  <link rel="preload" href="/fonts/Lovelo-Black.woff2" as="font" type="font/woff2" crossorigin />
  <link rel="preload" href="/fonts/Manrope-Bold.woff2" as="font" type="font/woff2" crossorigin />
</head>
<body class="impronakuy-page">
  <slot />
</body>
</html>
```

Con `<style is:global>` que define:
- `@font-face` para Lovelo y Manrope (referenciando `/fonts/`)
- Variables CSS en `body.impronakuy-page`
- Reset y estilos base galácticos
- Animaciones globales: `@keyframes twinkle`, `@keyframes float`, `@keyframes pulse-neon`
- Scrollbar personalizada
- `.ik-text-glow` utility class

**Done cuando**: Importar el layout en una página Astro de prueba muestra fondo negro.

---

### TASK-008: Crear `src/components/impronakuy/Navbar.astro`
Navbar estático. No necesita React.

Elementos:
- Logo "IMPRONAKUY" en Lovelo-Black + "2026" con color accent
- Link "← Volver a Espacio Impro" que lleva a `/`
- Badge opcional "EN VIVO" (se muestra con una prop `isLive: boolean`)
- `position: sticky`, `backdrop-filter: blur(12px)`, fondo semi-transparente oscuro

```astro
---
interface Props {
  isLive?: boolean
}
const { isLive = false } = Astro.props
---
<nav class="ik-navbar">
  <a href="/" class="ik-back-link">← Espacio Impro</a>
  <span class="ik-logo">IMPRONAKUY <span class="ik-year">2026</span></span>
  {isLive && <span class="ik-live-badge">EN VIVO</span>}
</nav>
```

**Done cuando**: El navbar se renderiza correctamente y el link de regreso funciona.

---

## FASE 3 — Componentes React

### TASK-009: Crear `src/components/impronakuy/MemberCard.tsx`
Componente React para integrante con foto rotatoria.

Props: `{ member: IKMember, teamColor: string }`

Comportamiento:
- Dos `<img>` superpuestas con CSS `position: absolute`
- Foto 2 con `opacity: 0` por defecto
- En desktop: hover alterna las fotos (`opacity` transition 0.5s)
- En mobile: `useEffect` con `setInterval` cada 4s alterna automáticamente
- `filter: drop-shadow(0 0 16px {teamColor})` para el glow neon
- Nombre artístico en Manrope Bold
- Nombre real en small/muted

Detección mobile:
```typescript
const [isMobile, setIsMobile] = useState(false)
useEffect(() => {
  setIsMobile(window.matchMedia('(hover: none)').matches)
}, [])
```

Usar CSS Module: `MemberCard.module.css`

**Done cuando**: Las fotos se alternan en hover (desktop) y cada 4s (mobile) con glow neon del color del equipo.

---

### TASK-010: Crear `src/components/impronakuy/HeroBanner.tsx`
Componente React para el banner principal.

Props: `{ teams: IKTeam[], activeMatchTeams?: { teamA: IKTeam, teamB: IKTeam } | null }`

**Modo normal** (activeMatchTeams = null):
- Array de slides: cada slide es un par [equipoA, equipoB] de los 5 equipos
  ```typescript
  const slides = [
    [teams[0], teams[1]],
    [teams[1], teams[2]],
    [teams[2], teams[3]],
    [teams[3], teams[4]],
    [teams[4], teams[0]],
  ]
  ```
- Rotación automática cada 5s con CSS transition (fade)
- Layout: foto izquierda | VS | foto derecha
- Título "IMPRONAKUY 2026" en Lovelo-Black arriba
- Estrellas de fondo: array de 80 spans con posición/tamaño/delay aleatorio generado una vez en `useMemo`

**Modo votación** (activeMatchTeams != null):
- Muestra fijo los 2 equipos del match
- VS con animación CSS pulsante/eléctrica
- Fotos más grandes y prominentes
- El carrusel se detiene

CSS Module: `HeroBanner.module.css`

**Si Framer Motion disponible**: usar `AnimatePresence` con `mode="wait"` para crossfade.
**Si NO disponible**: CSS `transition: opacity 0.6s` con clases `.active`/`.leaving`.

**Done cuando**: El carrusel rota 5 veces correctamente y se detiene cuando se pasa activeMatchTeams.

---

### TASK-011: Crear `src/components/impronakuy/VotingPanel.tsx`
Componente React para el panel de votación en tiempo real.

Props: ninguna — este componente maneja todo su estado internamente con los hooks.

**Estructura interna**:
```typescript
// Estado
const [match, setMatch] = useState<IKActiveMatch | null>(null)
const [hasVoted, setHasVoted] = useState(false)
const [votedTeamId, setVotedTeamId] = useState<string | null>(null)
const [isVoting, setIsVoting] = useState(false)

// Polling
useEffect(() => {
  const poll = async () => {
    const res = await fetch(`${import.meta.env.PUBLIC_API_URL}/api/active-match`)
    const data = IKActiveMatchSchema.parse(await res.json())
    setMatch(data)
  }
  poll()
  const interval = setInterval(poll, Number(import.meta.env.PUBLIC_POLLING_INTERVAL ?? 5000))
  return () => clearInterval(interval)
}, [])

// WebSocket (solo cuando hay match activo)
useEffect(() => {
  if (!match?.id) return
  const ws = new WebSocket(`${import.meta.env.PUBLIC_WS_URL}/ws/match/${match.id}`)
  ws.onmessage = (e) => {
    const msg = JSON.parse(e.data)
    // actualizar votos, rondas, etc.
  }
  return () => ws.close()
}, [match?.id])
```

**Renders según estado**:
- `match === null`: retorna `null` (invisible, no ocupa espacio)
- ronda abierta + no votó: dos botones gigantes de voto con colores de equipo
- ronda abierta + ya votó: mensaje "Votaste por [equipo] ✓" + barras de progreso
- ronda cerrada: "Ronda [N] finalizada — Ganó [equipo]" + esperando siguiente ronda
- match finished: "¡[equipo] ganó el enfrentamiento!" con animación

CSS Module: `VotingPanel.module.css`

**Done cuando**: El panel no muestra nada cuando el backend está apagado, y muestra el estado correcto con datos mock.

---

## FASE 4 — Componentes Astro estáticos

### TASK-012: Crear `src/components/impronakuy/TeamCard.astro`
Props: `{ team: IKTeam }`

Layout:
- Card con borde de color del equipo (`border-color: {team.color}`, `box-shadow: 0 0 20px {team.color}30`)
- Header: foto del equipo (PNG sin fondo) + nombre del equipo en Lovelo
- Grid de 3 columnas para los MemberCard
- Los MemberCard se montan con `client:visible` para lazy hydration

```astro
---
import { IKTeam } from '../../data/impronakuy-teams'
import MemberCard from './MemberCard.tsx'
interface Props { team: IKTeam }
const { team } = Astro.props
---
<section class="ik-team-card" style={`--team-color: ${team.color}; --team-color-dark: ${team.colorDark}`}>
  <div class="ik-team-header">
    <img src={team.teamPhoto} alt={team.name} class="ik-team-photo" loading="lazy" />
    <h2 class="ik-team-name">{team.name}</h2>
  </div>
  <div class="ik-members-grid">
    {team.members.map(member => (
      <MemberCard
        client:visible
        member={member}
        teamColor={team.color}
      />
    ))}
  </div>
</section>
```

**Done cuando**: Un TeamCard se renderiza con sus 3 integrantes y el borde neon del color del equipo.

---

### TASK-013: Crear `src/components/impronakuy/TeamSection.astro`
```astro
---
import { IK_TEAMS } from '../../data/impronakuy-teams'
import TeamCard from './TeamCard.astro'
---
<section id="equipos" class="ik-teams-section">
  <h2 class="ik-section-title">LOS EQUIPOS</h2>
  {IK_TEAMS.map(team => <TeamCard team={team} />)}
</section>
```

**Done cuando**: Los 5 equipos se renderizan en la sección.

---

### TASK-014: Crear `src/components/impronakuy/GroupPhoto.astro`
```astro
<section id="foto-grupal" class="ik-group-section">
  <h2 class="ik-section-title">TODOS LOS EQUIPOS</h2>
  <div class="ik-group-wrapper">
    <img
      src="/images/impronakuy/Todos Juntos.png"
      alt="Todos los equipos de Impronakuy 2026"
      class="ik-group-photo"
      loading="lazy"
    />
  </div>
</section>
```

Con el fondo siendo un CSS gradient multi-color con los 5 colores de equipos mezclados suavemente.

**Done cuando**: La foto grupal se muestra con el fondo multicolor.

---

## FASE 5 — Página principal

### TASK-015: Crear `src/pages/impronakuy-2026/index.astro`
La página completa que ensambla todos los componentes:

```astro
---
import ImpronakuyLayout from '../../components/impronakuy/ImpronakuyLayout.astro'
import Navbar from '../../components/impronakuy/Navbar.astro'
import HeroBanner from '../../components/impronakuy/HeroBanner.tsx'
import VotingPanel from '../../components/impronakuy/VotingPanel.tsx'
import TeamSection from '../../components/impronakuy/TeamSection.astro'
import GroupPhoto from '../../components/impronakuy/GroupPhoto.astro'
import { IK_TEAMS } from '../../data/impronakuy-teams'
---
<ImpronakuyLayout>
  <Navbar />
  <main>
    <HeroBanner client:load teams={IK_TEAMS} />
    <VotingPanel client:load />
    <TeamSection />
    <GroupPhoto />
  </main>
</ImpronakuyLayout>
```

**Done cuando**: `http://localhost:4321/impronakuy-2026` carga la página completa sin errores.

---

### TASK-016: Crear `.env` con variables PUBLIC_
```env
# Agregar al .env existente (o crear .env.local)
PUBLIC_API_URL=http://localhost:8000
PUBLIC_WS_URL=ws://localhost:8000
PUBLIC_POLLING_INTERVAL=5000
```

Verificar que el `.env` existente no tenga conflictos.

**Done cuando**: `import.meta.env.PUBLIC_API_URL` está disponible en los componentes cliente.

---

## FASE 6 — CSS Modules detallados

### TASK-017: CSS para `ImpronakuyLayout.astro`
El `<style is:global>` de este componente debe incluir:

```css
/* Keyframes globales para impronakuy */
@keyframes ik-twinkle {
  0%, 100% { opacity: 0.2; transform: scale(0.8); }
  50%       { opacity: 1;   transform: scale(1.2); }
}
@keyframes ik-float {
  0%, 100% { transform: translateY(0); }
  50%       { transform: translateY(-12px); }
}
@keyframes ik-pulse-neon {
  0%, 100% { opacity: 0.7; }
  50%       { opacity: 1; }
}
@keyframes ik-electric {
  0%   { box-shadow: 0 0 5px #fff, 0 0 10px #fff; }
  50%  { box-shadow: 0 0 20px #fff, 0 0 40px var(--ik-accent, #818cf8); }
  100% { box-shadow: 0 0 5px #fff, 0 0 10px #fff; }
}

/* Utility classes */
.ik-text-glow-white  { text-shadow: 0 0 10px #ffffff80, 0 0 30px #ffffff40; }
.ik-text-glow-accent { text-shadow: 0 0 20px var(--ik-accent, #818cf8); }
```

**Done cuando**: Las animaciones funcionan cuando se aplican sus clases.

---

### TASK-018: CSS para `HeroBanner.module.css`
Estilos del banner hero:
- `.hero`: `min-height: 100vh`, `position: relative`, `overflow: hidden`, fondo `var(--ik-bg-deep)`
- `.stars-container`: `position: absolute; inset: 0; pointer-events: none`
- `.star`: `position: absolute; border-radius: 50%; background: white; animation: ik-twinkle var(--delay) ease-in-out infinite`
- `.title`: Lovelo-Black, tamaño grande, `text-shadow` blanco
- `.vs-text`: Lovelo-Black, color blanco, `animation: ik-electric 2s infinite`
- `.team-photo`: `filter: drop-shadow(0 0 20px var(--team-color))`, `animation: ik-float 4s ease-in-out infinite`
- `.slide`: transición CSS para el crossfade entre equipos

**Done cuando**: Las estrellas parpadean y las fotos flotan.

---

### TASK-019: CSS para `MemberCard.module.css`
- `.card`: position relative, cursor default
- `.photo-wrapper`: `position: relative; aspect-ratio: 3/4`
- `.photo`: `width: 100%; height: 100%; object-fit: contain; filter: drop-shadow(0 0 15px var(--team-color))`
- `.photo-alt`: `position: absolute; inset: 0; opacity: 0; transition: opacity 0.5s ease`
- `.card:hover .photo-alt` (desktop): `opacity: 1`
- `.name-artistic`: Manrope Bold, color `var(--team-color)`
- `.name-real`: Inter Regular, color `var(--ik-text-muted)`, font-size small

**Done cuando**: La foto se intercambia en hover con el glow neon.

---

### TASK-020: CSS para `TeamCard.module.css` y `VotingPanel.module.css`

**TeamCard**:
- `.card`: background `var(--ik-bg-card)`, border `1px solid var(--team-color)40`, border-radius 16px
- `box-shadow: 0 0 30px var(--team-color)20, inset 0 0 60px var(--team-color)05`
- `.team-photo`: max-height 200px, `filter: drop-shadow(0 0 20px var(--team-color))`
- `.team-name`: Lovelo-LineBold, color `var(--team-color)`
- `.members-grid`: CSS grid, 3 columnas en desktop, 1 en mobile

**VotingPanel**:
- `.panel`: background `var(--ik-bg-dark)`, padding generoso, border con `animation: ik-electric`
- `.round-label`: Lovelo-Black grande, color blanco
- `.vote-btn`: botón grande (min-height 80px), background del color del equipo, `box-shadow` neon
- `.vote-btn:hover`: escala 1.05, shadow más intenso
- `.vote-btn:disabled`: opacity 0.5, no pointer
- `.progress-bar`: alto 12px, border-radius, background del color del equipo
- `.score-display`: Lovelo-Black, los dos números con sus colores

**Done cuando**: Los componentes tienen la estética galáctica esperada.

---

## FASE 7 — QA y pulido

### TASK-021: Verificar que el sitio principal no se rompe
```bash
npm run build
```
Verificar que:
- El build completa sin errores
- `http://localhost:4321/` (home) sigue funcionando igual
- `http://localhost:4321/nosotros` sigue funcionando
- `http://localhost:4321/portafolio` sigue funcionando
- Solo `/impronakuy-2026` es nuevo

**Done cuando**: Build exitoso, cero regresiones.

---

### TASK-022: Verificar modo sin backend
Con `PUBLIC_API_URL` apuntando a un servidor que no existe:
- `VotingPanel` debe retornar `null` silenciosamente (try/catch en el fetch)
- No debe haber errores en consola que rompan la UX
- El resto de la página se ve perfectamente

**Done cuando**: La página funciona completamente sin backend activo.

---

### TASK-023: Responsive check
Breakpoints a verificar:
- `375px`: foto de equipo centrada, MemberCards en 1 columna, VotingPanel botones apilados
- `768px`: MemberCards en 2 columnas
- `1280px`: layout full desktop

**Done cuando**: Sin overflow horizontal en ningún breakpoint.

---

### TASK-024: Agregar link de referencia en el sitio principal (OPCIONAL)
En el componente o página de portafolio del sitio principal, agregar un link a `/impronakuy-2026` en la sección de ImproNakuy.

Verificar si `src/data/shows.ts` tiene entrada para ImproNakuy y si se puede agregar un `externalLink`.

**Done cuando**: Hay un camino desde el sitio principal hasta `/impronakuy-2026`.
