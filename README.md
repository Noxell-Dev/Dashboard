# noxell.dev · Panel del estudio

Panel interno del estudio **noxell.dev** para gestionar clientes, proyectos
realizados, una biblioteca de prompts reutilizables y un catálogo de
skills de IA. Estética en rojo, el color de la identidad de Noxell Dev.

## Tecnologías

- **Next.js 16** (App Router) + **React 19** + **TypeScript**
- **Tailwind CSS v4**
- **Prisma ORM 7** con **PostgreSQL** en **Supabase**
- Mutaciones con **Server Actions** (sin rutas API separadas)

## Requisitos

- Node.js 20 o superior
- npm
- Un proyecto en [Supabase](https://supabase.com) (capa gratuita vale)

No se necesita Python ni herramientas de compilación: todas las
dependencias son JavaScript puro o traen binarios precompilados.

## Puesta en marcha

```bash
# 1. Instalar dependencias (el postinstall genera el cliente de Prisma)
npm install

# 2. Configurar el entorno: copia .env.example a .env y rellena las
#    dos variables:
#    - DATABASE_URL: en el dashboard de Supabase pulsa el botón "Connect"
#      (arriba del todo) y elige "Transaction pooler".
#    - DASHBOARD_PASSWORD: la contraseña para entrar al panel.
cp .env.example .env

# 3. Crear las tablas (UNA SOLA VEZ): en el SQL Editor del dashboard de
#    Supabase pega y ejecuta, en orden, el contenido de:
#    - prisma/migrations/20260916195700_init/migration.sql
#    - prisma/migrations/20260916223000_add_ai_skill/migration.sql
#    (si ya ejecutaste la primera, basta con la segunda).

# 4. Arrancar el servidor de desarrollo
npm run dev
```

Abre [http://localhost:3000](http://localhost:3000) en el navegador y entra
con la contraseña de `DASHBOARD_PASSWORD`.

> El archivo `.env` no se sube al repositorio.

## Despliegue en Vercel

1. Sube el repositorio a GitHub (ya está listo).
2. En [Vercel](https://vercel.com) → **Add New… → Project** → importa
   `noxell-dashboard`.
3. En **Environment Variables** añade las dos variables:
   - `DATABASE_URL` → botón "Connect" → "Transaction pooler" del dashboard
     de Supabase
   - `DASHBOARD_PASSWORD` → la contraseña para entrar al panel
4. Despliega. El proyecto incluye el script `vercel-build`, que en cada
   despliegue genera el cliente de Prisma y compila (`prisma generate &&
   next build`). Las tablas ya tienen que existir (paso 3 de la puesta
   en marcha); no se ejecutan migraciones automáticas porque el motor de
   migraciones de Prisma no funciona bien a través del pooler de Supabase.

## Scripts

| Comando              | Descripción                              |
| -------------------- | ---------------------------------------- |
| `npm run dev`        | Servidor de desarrollo                    |
| `npm run build`      | Compilación de producción                 |
| `npm run start`      | Servidor de producción                    |
| `npm run lint`       | Linter                                    |
| `npx prisma studio`  | Interfaz visual para explorar la base de datos |

## Acceso

El panel está protegido con contraseña (`DASHBOARD_PASSWORD` en el
entorno). El proxy (`proxy.ts`) redirige a `/login` toda visita sin
sesión válida; la sesión es una cookie firmada con HMAC válida 30 días.

## Estructura

```
app/
  page.tsx            → Panel principal (estadísticas y actividad reciente)
  login/page.tsx      → Acceso con contraseña
  clientes/page.tsx   → Gestión de clientes (CRUD)
  proyectos/page.tsx  → Gestión de proyectos (CRUD)
  prompts/page.tsx    → Biblioteca de prompts (búsqueda, filtros, copiar)
  skills/page.tsx     → Catálogo de skills de IA (búsqueda, filtros, copiar)
  icon.svg            → Favicon vectorial (nudo rojo de noxell.dev)
  icon.png            → Favicon (nudo rojo de noxell.dev)
  apple-icon.png      → Icono Apple 180×180
  favicon.ico         → Favicon clásico
proxy.ts              → Protege todas las rutas salvo /login
components/
  AppShell.tsx        → Estructura con navegación (oculta en /login)
  Sidebar.tsx         → Navegación lateral / superior + salir
  ui.tsx              → Primitivas de UI (modal, tarjetas, formularios…)
  clientes/           → Tarjetas y formularios de clientes
  proyectos/          → Tarjetas y formularios de proyectos
  prompts/            → Biblioteca con búsqueda y filtros
  skills/             → Catálogo de skills con búsqueda y filtros
lib/
  prisma.ts           → Cliente de Prisma (singleton)
  actions.ts          → Server Actions (crear/editar/eliminar)
  auth.ts             → Sesión firmada con HMAC (sin dependencias)
  auth-actions.ts     → Acciones de login/logout
  utils.ts            → Utilidades (fechas, etiquetas, estados)
prisma/
  schema.prisma       → Modelos: Client, Project, Prompt
public/
  logorojo.png        → Logo de Noxell Dev (como en noxell.dev)
```

## Modelo de datos

- **Client**: nombre, empresa, email, teléfono y notas. Tiene muchos proyectos.
- **Project**: título, descripción, cliente vinculado, estado
  (`En curso` / `Completado` / `Pausado`), fechas de inicio y fin, URL y
  etiquetas.
- **Prompt**: título, contenido, categoría y etiquetas.
- **AiSkill**: nombre, descripción, categoría, etiquetas, URL y contenido.
