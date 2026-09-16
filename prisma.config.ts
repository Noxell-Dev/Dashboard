import "dotenv/config";
import { defineConfig } from "prisma/config";

export default defineConfig({
  schema: "prisma/schema.prisma",
  migrations: {
    path: "prisma/migrations",
  },
  datasource: {
    // Por defecto usa el archivo dev.db en la raíz del proyecto.
    url: process.env.DATABASE_URL ?? "file:./dev.db",
  },
});
