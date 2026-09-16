import { PrismaClient } from "../generated/prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";

const globalForPrisma = globalThis as unknown as {
  prisma?: PrismaClient;
};

function createPrismaClient(): PrismaClient {
  const connectionString = process.env.DATABASE_URL;
  if (!connectionString) {
    throw new Error(
      "Falta DATABASE_URL. Cópiala desde tu proyecto de Supabase " +
        "(usa la cadena con pool de conexiones, puerto 6543) " +
        "a un archivo .env en la raíz del proyecto.",
    );
  }
  // Supabase recomienda la URL con pool (Supavisor, ?pgbouncer=true)
  // para entornos serverless como Vercel.
  const adapter = new PrismaPg({ connectionString });
  return new PrismaClient({ adapter });
}

function getPrisma(): PrismaClient {
  globalForPrisma.prisma ??= createPrismaClient();
  return globalForPrisma.prisma;
}

// Proxy perezoso: la conexión solo se crea al primer uso, no al importar
// el módulo. Así `next build` no falla si todavía no existe el .env.
export const prisma = new Proxy({} as PrismaClient, {
  get: (_target, prop) => Reflect.get(getPrisma(), prop),
});
