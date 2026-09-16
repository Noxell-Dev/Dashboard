import { prisma } from "@/lib/prisma";
import { ClientManager } from "@/components/clientes/ClientManager";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Clientes · noxell.dev",
};

export default async function ClientesPage() {
  const clients = await prisma.client.findMany({
    orderBy: { name: "asc" },
    include: { _count: { select: { projects: true } } },
  });

  return <ClientManager clients={clients} />;
}
