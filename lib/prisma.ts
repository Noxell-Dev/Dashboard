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
  // Una conexión por instancia (recomendación de Supabase para serverless):
  // Supavisor multiplexa por debajo. Sin prepared statements con nombre,
  // funciona en el pooler en modo transacción.
  const adapter = new PrismaPg({ connectionString, max: 1 });
  return new PrismaClient({ adapter });
}

function getPrisma(): PrismaClient {
  globalForPrisma.prisma ??= createPrismaClient();
  return globalForPrisma.prisma;
}

// Proxy perezoso: la conexión se crea al primer uso, no al importar.
// Así `next build` no falla si aún no hay DATABASE_URL.
export const prisma = new Proxy({} as PrismaClient, {
  get: (_target, prop) => Reflect.get(getPrisma(), prop),
});
