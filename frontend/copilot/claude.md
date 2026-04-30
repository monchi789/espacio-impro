# Impronakuy 2026 — Landing en Espacio Impro

## Repositorio

```
/home/monchi789/Projects/espacio-impro/frontend/
```

Este es el sitio web existente de Espacio Impro (Astro + React, en producción).
Tu trabajo es **agregar** la sección `/impronakuy-2026` sin tocar nada de lo existente.

## Leer primero — en este orden

1. `AGENT.md` — quién eres, el stack, las reglas que nunca rompes
2. `PLAN.md` — arquitectura, por qué las decisiones, qué se construye
3. `DECISIONS.md` — decisiones técnicas tomadas (no las cuestiones)
4. `TASKS.md` — 24 tareas atómicas ordenadas con código base y criterio Done

## Regla de oro

**No tocar nada de lo existente.** Solo agregar:
- `src/pages/impronakuy-2026/index.astro`
- `src/components/impronakuy/` (carpeta nueva)
- `src/data/impronakuy-teams.ts`
- `src/data/impronakuy-schemas.ts`
- `public/images/impronakuy/` (el usuario copia las fotos manualmente)
- Variables `PUBLIC_*` en `.env`

## Comandos

```bash
cd /home/monchi789/Projects/espacio-impro/frontend

npm run dev      # http://localhost:4321
npm run build    # verificar que no se rompió nada
```

## Empezar desde

TASK-001 si es la primera sesión.
Si el proyecto ya tiene progreso, revisar hasta qué TASK se llegó y continuar desde la siguiente.

## Verificación de éxito final

```
http://localhost:4321/             → sitio principal intacto ✓
http://localhost:4321/impronakuy-2026 → nueva página galáctica ✓
npm run build                       → sin errores ✓
```
