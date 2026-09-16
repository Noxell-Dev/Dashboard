import { prisma } from "@/lib/prisma";
import { ProjectManager } from "@/components/proyectos/ProjectManager";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Proyectos · noxell.dev",
};

export default async function ProyectosPage() {
  const [projects, clients] = await Promise.all([
    prisma.project.findMany({
      orderBy: { updatedAt: "desc" },
      include: { client: true },
    }),
    prisma.client.findMany({ orderBy: { name: "asc" } }),
  ]);

  return <ProjectManager projects={projects} clients={clients} />;
}
