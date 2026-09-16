# noxell.dev · Panel del estudio

Panel interno del estudio **noxell.dev** para gestionar clientes, proyectos
realizados y una biblioteca de prompts reutilizables.

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
# 1. Instalar dependencias
npm install

# 2. Configurar la conexión a Supabase:
#    copia .env.example a .env y pega las cadenas de conexión de tu proyecto.
#    En el dashboard de Supabase pulsa el botón "Connect" (arriba del todo):
#    - Elige "Transaction pooler" -> pégala en DATABASE_URL (la usa la app)
#    - Elige "Session pooler"      -> pégala en DIRECT_URL   (la usa Prisma
#      para crear y modificar las tablas; la "Direct connection" es IPv6-only
#      en el plan gratuito y no llega desde redes IPv4 ni desde Vercel)
cp .env.example .env

# 3. Crear las tablas en Supabase
npm run db:migrate   # = prisma migrate deploy

# 4. Cargar los datos de ejemplo (4 clientes, 6 proyectos, 8 prompts)
npm run db:seed

# 5. Arrancar el servidor de desarrollo
npm run dev
```

Abre [http://localhost:3000](http://localhost:3000) en el navegador.

> El archivo `.env` no se sube al repositorio.

## Despliegue en Vercel

1. Sube el repositorio a GitHub (ya está listo).
2. En [Vercel](https://vercel.com) → **Add New… → Project** → importa
   `noxell-dashboard`.
3. En **Environment Variables** añade las dos variables de tu `.env`
   (las copias del botón "Connect" del dashboard de Supabase):
   - `DATABASE_URL` → "Transaction pooler" (puerto 6543)
   - `DIRECT_URL` → "Session pooler" (puerto 5432)
4. Despliega. El proyecto incluye el script `vercel-build`, que en cada
   despliegue ejecuta automáticamente:
   `prisma generate && prisma migrate deploy && next build`.

## Scripts

| Comando              | Descripción                              |
| -------------------- | ---------------------------------------- |
| `npm run dev`        | Servidor de desarrollo                    |
| `npm run build`      | Compilación de producción                 |
| `npm run start`      | Servidor de producción                    |
| `npm run lint`       | Linter                                    |
| `npm run db:seed`    | Carga los datos de ejemplo en la base de datos |
| `npx prisma studio`  | Interfaz visual para explorar la base de datos |

## Estructura

```
app/
  page.tsx            → Panel principal (estadísticas y actividad reciente)
  clientes/page.tsx   → Gestión de clientes (CRUD)
  proyectos/page.tsx  → Gestión de proyectos (CRUD)
  prompts/page.tsx    → Biblioteca de prompts (búsqueda, filtros, copiar)
components/
  Sidebar.tsx         → Navegación lateral
  ui.tsx              → Primitivas de UI (modal, tarjetas, formularios…)
  clientes/           → Tabla y formularios de clientes
  proyectos/          → Tarjetas y formularios de proyectos
  prompts/            → Biblioteca con búsqueda y filtros
lib/
  prisma.ts           → Cliente de Prisma (singleton)
  actions.ts          → Server Actions (crear/editar/eliminar)
  utils.ts            → Utilidades (fechas, etiquetas, estados)
prisma/
  schema.prisma       → Modelos: Client, Project, Prompt
  seed.ts             → Datos de ejemplo en español
```

## Modelo de datos

- **Client**: nombre, empresa, email, teléfono y notas. Tiene muchos proyectos.
- **Project**: título, descripción, cliente vinculado, estado
  (`En curso` / `Completado` / `Pausado`), fechas de inicio y fin, URL y
  etiquetas.
- **Prompt**: título, contenido, categoría y etiquetas.
