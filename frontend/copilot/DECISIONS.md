# DECISIONS.md — Impronakuy 2026 en Espacio Impro

---

## DEC-001: Ruta como sub-página Astro vs proyecto separado

**Contexto**: El sitio de Espacio Impro ya existe en producción con Astro. El landing de Impronakuy 2026 debe vivir en algún lugar.

**Opciones**:
A. Proyecto Vite React separado (repo propio, deploy independiente)
B. Sub-ruta `/impronakuy-2026` dentro del mismo proyecto Astro

**Decisión**: Opción B — sub-ruta en el proyecto Astro existente.

**Razón**:
- Un solo repositorio, un solo deploy
- Las imágenes están en `public/` del mismo servidor
- Después del evento la página queda como archivo en la misma URL
- Se puede linkar desde el portafolio del sitio principal sin CORS
- Cero overhead operacional extra

---

## DEC-002: Layout propio vs reutilizar Layout.astro del sitio

**Contexto**: El sitio tiene un `Layout.astro` con Header y Footer de Espacio Impro.

**Decisión**: La página de Impronakuy tiene su **propio** `ImpronakuyLayout.astro`.

**Razón**:
- El Header del sitio principal tiene la identidad visual de Espacio Impro (logo, colores de marca, navegación del sitio)
- El landing de Impronakuy es una experiencia inmersiva galáctica — mezclar ambas identidades rompe ambas
- El layout propio define sus propias fuentes, variables CSS, y fondo oscuro en el `<html>`/`<body>`
- La única conexión con el sitio principal es un link "← Volver a Espacio Impro" en el navbar de Impronakuy

---

## DEC-003: Estrategia de hidratación — Astro client: directives

**Contexto**: Astro renderiza en servidor por defecto. Los componentes React necesitan `client:` para tener estado en el browser.

**Decisión**: Usar `client:` solo donde hay interactividad real:

| Componente | Directive | Razón |
|---|---|---|
| `HeroBanner` | `client:load` | Carrusel necesita `setInterval` desde el inicio |
| `VotingPanel` | `client:load` | Polling y WS desde que carga la página |
| `MemberCard` | `client:visible` | Lazy — no necesita estado hasta que el usuario llega |
| `Navbar` | ninguna (Astro) | Completamente estático |
| `TeamCard` | ninguna (Astro) | Layout estático, solo pasa props a MemberCard |
| `TeamSection` | ninguna (Astro) | Loop estático de TeamCards |
| `GroupPhoto` | ninguna (Astro) | Una imagen, nada de estado |

`client:visible` es importante para los MemberCards: hay 15 integrantes × 2 fotos = 30 imágenes. Hidratar todos al cargar la página bloquearía el hilo principal innecesariamente.

---

## DEC-004: Fuentes — self-hosted existentes vs Google Fonts

**Contexto**: El proyecto ya tiene fuentes self-hosted en `public/fonts/`.

**Decisión**: Reutilizar las fuentes existentes. No agregar Google Fonts.

**Mapa de fuentes**:
- `Lovelo-Black.woff2` → títulos del evento (equivale a Orbitron, mejor incluso)
- `Lovelo-LineBold.woff2` → nombres de equipos
- `Manrope-Bold.woff2` + `Manrope-SemiBold.woff2` → nombres artísticos de integrantes
- `Inter_18pt-Regular.woff2` + `Inter_18pt-Medium.woff2` → texto de cuerpo, UI

Lovelo es una fuente geométrica dramática de display — perfecta para la estética galáctica, y ya está en el servidor.

---

## DEC-005: CSS — Módulos vs Global vs Tailwind

**Contexto**: El proyecto existente usa CSS global en `global.css` sin Tailwind.

**Decisión**: **CSS Modules** (`.module.css`) para los componentes de Impronakuy + `<style>` en los archivos Astro.

**Razón**:
- CSS Modules evita que los estilos galácticos de Impronakuy contaminen el CSS del sitio principal
- Tailwind no está en el proyecto y agregarlo podría crear conflictos con el CSS existente
- `<style is:global>` en `ImpronakuyLayout.astro` para variables CSS y keyframes, scoped al selector `body.impronakuy-page`

---

## DEC-006: Variables CSS — scope en body.impronakuy-page

**Contexto**: Las variables CSS de Impronakuy (colores neon, fondos oscuros) no deben afectar el sitio principal.

**Decisión**: Todas las variables `--ik-*` se definen en `body.impronakuy-page`.

```css
body.impronakuy-page {
  --ik-bg-deep: #030712;
  /* ... */
}
```

El `<body>` de `ImpronakuyLayout.astro` tiene la clase `impronakuy-page`. Las páginas del sitio principal no tienen esa clase. Cero riesgo de contaminación.

---

## DEC-007: Estado de match activo — polling + WS en VotingPanel

**Decisión**: El `VotingPanel.tsx` maneja todo internamente (polling + WS). No hay context/store global.

**Razón**:
- La página es simple — un solo componente necesita el estado del match
- Evita complejidad de Context o Zustand para un caso de uso puntual
- Si en el futuro el `HeroBanner` también necesita saber del match activo (para mostrar los equipos correctos), se puede elevar el estado a un context en ese momento

**Trade-off aceptado**: Si se necesita que el HeroBanner reaccione al match activo en el futuro, refactorizar a un `ImpronakuyProvider` que envuelva ambos componentes.

---

## DEC-008: Antifraude votación — session_token en localStorage

**Decisión**: UUID generado en el cliente, guardado en `localStorage` bajo `impronakuy_session`.

**Razón**: Igual que en el plan original. Sin registro, sin cookies, suficiente para el contexto del evento.

**Implementación en Astro/React**: `localStorage` solo es accesible en el cliente. El `VotingPanel` con `client:load` tiene acceso correcto.

```typescript
// Solo ejecutar en el cliente
const getSessionToken = () => {
  if (typeof window === 'undefined') return ''  // SSR guard
  const key = 'impronakuy_session'
  return localStorage.getItem(key) ?? (() => {
    const token = crypto.randomUUID()
    localStorage.setItem(key, token)
    return token
  })()
}
```

---

## DEC-009: Variables de entorno — prefijo PUBLIC_

**Contexto**: Astro usa `PUBLIC_` como prefijo para variables accesibles en el cliente.

**Decisión**: Agregar las variables al `.env` del proyecto existente con prefijo `PUBLIC_`.

```env
PUBLIC_API_URL=http://localhost:8000
PUBLIC_WS_URL=ws://localhost:8000
PUBLIC_POLLING_INTERVAL=5000
```

Verificar que no haya colisión con variables existentes en el `.env` del proyecto.

---

## DEC-010: Ruta de imágenes — espacios en nombres de carpeta

**Contexto**: Las carpetas de fotos tienen espacios ("Las Culiprincess", "El mal Organizado"). Astro/Vite sirve `public/` directamente.

**Decisión**: Mantener los nombres con espacios en `public/images/impronakuy/equipos/`. No renombrar.

**Razón**: Vite sirve los archivos de `public/` sin procesamiento. Los URLs con espacios se encodean automáticamente (`%20`). Los `src` en los `<img>` funcionan con o sin encoding.

**Precaución**: En el código TypeScript, las rutas se escriben con espacios normales:
```typescript
photo1: '/images/impronakuy/equipos/Las Culiprincess/Katherine II de la via expresa - 1.png'
```
El browser hace el encoding automáticamente al hacer el request.
