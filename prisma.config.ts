import "dotenv/config";
import { defineConfig } from "prisma/config";

export default defineConfig({
  schema: "prisma/schema.prisma",
  migrations: {
    path: "prisma/migrations",
  },
  datasource: {
    // Una sola URL para todo (app, seed y Prisma CLI): el Transaction
    // pooler de Supabase («Connect» → «Transaction pooler» en el dashboard).
    // Las tablas se crean una vez desde el SQL Editor del dashboard con
    // prisma/migrations/20260916195700_init/migration.sql; no se usa
    // `migrate deploy` porque el motor de migraciones no funciona bien
    // a través del pooler.
    // Si falta, la app avisa con un error claro al primer uso (lib/prisma.ts).
    url: process.env.DATABASE_URL,
  },
});
