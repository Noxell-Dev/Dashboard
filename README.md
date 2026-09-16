# noxell.dev · Panel del estudio

Panel interno del estudio **noxell.dev** para gestionar clientes, proyectos
realizados y una biblioteca de prompts reutilizables.

## Tecnologías

- **Next.js 16** (App Router) + **React 19** + **TypeScript**
- **Tailwind CSS v4**
- **Prisma ORM 7** con **SQLite** (base de datos en un archivo local, sin
  configuración adicional)
- Mutaciones con **Server Actions** (sin rutas API separadas)

## Requisitos

- Node.js 20 o superior
- npm

## Puesta en marcha

```bash
# 1. Instalar dependencias
npm install

# 2. Crear la base de datos y aplicar las migraciones
npx prisma migrate dev

# 3. Generar el cliente de Prisma (si no se generó con la migración)
npx prisma generate

# 4. Cargar los datos de ejemplo (4 clientes, 6 proyectos, 8 prompts)
npm run db:seed

# 5. Arrancar el servidor de desarrollo
npm run dev
```

Abre [http://localhost:3000](http://localhost:3000) en el navegador.

> La base de datos es el archivo `dev.db` en la raíz del proyecto
> (`DATABASE_URL="file:./dev.db"` en `.env`). No se sube al repositorio.

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
