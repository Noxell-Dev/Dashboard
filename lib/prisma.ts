import { PrismaClient } from "../generated/prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";

const globalForPrisma = globalThis as unknown as {
  prisma?: PrismaClient;
};

function createPrismaClient(): PrismaClient {
  const connectionString = process.env.DATABASE_URL;
  if (!connectionString) {
    throw new Error(
      "Falta DATABASE_URL. En el dashboard de Supabase pulsa «Connect» " +
        "(arriba del todo), elige «Transaction pooler», copia la cadena y " +
        "pégala en un archivo .env en la raíz del proyecto.",
    );
  }
  // Pool propio limitado a 1 conexión por instancia: recomendación oficial
  // de Supabase para serverless (Vercel). Cada instancia comparte el cliente,
  // y Supavisor multiplexa por debajo, así no se agota el pool.
  // `?pgbouncer=true` en la URL es el parámetro que Supabase recomienda para
  // el pooler en modo transacción. El adaptador no usa prepared statements
  // con nombre por defecto, así que funciona en modo transacción sin más.
  const adapter = new PrismaPg({ connectionString, max: 1 });
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
