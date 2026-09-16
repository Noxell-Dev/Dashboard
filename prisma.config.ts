import "dotenv/config";
import { defineConfig } from "prisma/config";

export default defineConfig({
  schema: "prisma/schema.prisma",
  migrations: {
    path: "prisma/migrations",
  },
  datasource: {
    // Las migraciones usan el pooler en modo sesión (puerto 5432):
    // es IPv4 en todos los planes (la conexión directa db.<ref> es
    // IPv6-only en el plan gratuito) y admite DDL y prepared statements.
    // Se consigue en el dashboard con el botón «Connect» → «Session pooler».
    // Si no se define, se usa DATABASE_URL.
    url: process.env.DIRECT_URL ?? process.env.DATABASE_URL,
  },
});
