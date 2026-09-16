import { PrismaClient } from "../generated/prisma/client";
import { PrismaLibSql } from "@prisma/adapter-libsql";

const globalForPrisma = globalThis as unknown as {
  prisma?: PrismaClient;
};

function resolveDatabaseUrl(): string {
  const raw = process.env.DATABASE_URL ?? "file:./dev.db";
  // libsql resuelve las rutas relativas desde el directorio de trabajo;
  // usar ruta absoluta evita sorpresas en Windows.
  if (raw.startsWith("file:")) {
    const relative = raw.slice("file:".length);
    const absolute = relative.startsWith("/")
      ? relative
      : `${process.cwd()}/${relative}`.replace(/\\/g, "/");
    return `file:${absolute}`;
  }
  return raw;
}

function createPrismaClient(): PrismaClient {
  const adapter = new PrismaLibSql({ url: resolveDatabaseUrl() });
  return new PrismaClient({ adapter });
}

export const prisma = globalForPrisma.prisma ?? createPrismaClient();

if (process.env.NODE_ENV !== "production") {
  globalForPrisma.prisma = prisma;
}
