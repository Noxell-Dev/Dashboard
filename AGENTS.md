<!-- BEGIN:nextjs-agent-rules -->

# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->

# AGENTS.md — noxell.dev · Dashboard

Panel interno del estudio noxell.dev: Next.js 16 (App Router), React 19,
TypeScript, Tailwind CSS v4, Prisma 7 + PostgreSQL (Supabase).

## Convenciones

- Las mutaciones van con **Server Actions** en `lib/actions.ts`; no crear
  rutas API salvo que sea imprescindible.
- Las páginas son Server Components con `export const dynamic =
  "force-dynamic"`; la interactividad vive en `components/*/`.
- Cada sección (clientes, proyectos, prompts, skills) tiene su página en
  `app/<seccion>/`, su `loading.tsx` con esqueletos y su manager en
  `components/<seccion>/` con este patrón: `PageHeader`, búsqueda, filtros,
  tarjetas en grid, modal de crear/editar, modal de confirmar borrado.
- El color de acento es el **rojo** de la identidad de Noxell Dev; los
  estados semánticos usan sky (info), emerald (éxito) y amber (aviso).
- El logo es `public/logorojo.png` (el mismo que en noxell.dev); los
  favicons están en `app/` (`icon.svg`, `icon.png`, `apple-icon.png`,
  `favicon.ico`). Si cambias el logo, actualiza ambos repos de noxell.dev
  (Website y Dashboard) para mantener la identidad común.
- La base de datos se gestiona a mano: los SQL de `prisma/migrations/` se
  ejecutan una vez en el SQL Editor de Supabase; no hay `migrate deploy`
  en el build (el pooler de Supabase no lo soporta).
- Proteger rutas nuevas no hace falta: `proxy.ts` ya protege todo salvo
  `/login` y los assets públicos listados en su `matcher`.
- `npm run build` y `npm run lint` en verde antes de dar por terminado un
  cambio.
