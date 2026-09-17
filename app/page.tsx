import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { formatDate, statusBadgeClasses, statusLabel } from "@/lib/utils";
import { SectionCard, StatCard, TagList } from "@/components/ui";

export const dynamic = "force-dynamic";

export default async function Home() {
  const [
    clientCount,
    projectCount,
    promptCount,
    skillCount,
    messageCount,
    recentProjects,
    recentPrompts,
    recentSkills,
    recentMessages,
  ] = await Promise.all([
    prisma.client.count(),
    prisma.project.count(),
    prisma.prompt.count(),
    prisma.aiSkill.count(),
    prisma.presetMessage.count(),
    prisma.project.findMany({
      take: 5,
      orderBy: { updatedAt: "desc" },
      include: { client: true },
    }),
    prisma.prompt.findMany({
      take: 5,
      orderBy: { updatedAt: "desc" },
      select: { id: true, title: true, category: true, updatedAt: true },
    }),
    prisma.aiSkill.findMany({
      take: 5,
      orderBy: { updatedAt: "desc" },
      select: { id: true, name: true, category: true, updatedAt: true },
    }),
    prisma.presetMessage.findMany({
      take: 5,
      orderBy: { updatedAt: "desc" },
      select: { id: true, title: true, category: true, updatedAt: true },
    }),
  ]);

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-zinc-50">Panel</h1>
        <p className="mt-1 text-sm text-zinc-400">
          Resumen de la actividad del estudio noxell.dev.
        </p>
      </div>

      <div className="mb-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
        <StatCard
          title="Clientes"
          value={clientCount}
          subtitle="Contactos guardados"
        />
        <StatCard
          title="Proyectos"
          value={projectCount}
          subtitle="Trabajos realizados"
        />
        <StatCard
          title="Prompts"
          value={promptCount}
          subtitle="En la biblioteca"
        />
        <StatCard
          title="Skills IA"
          value={skillCount}
          subtitle="En el catálogo"
        />
        <StatCard
          title="Mensajes"
          value={messageCount}
          subtitle="Predeterminados"
        />
      </div>

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        <SectionCard
          title="Proyectos recientes"
          action={
            <Link
              href="/proyectos"
              className="text-sm font-medium text-red-300 hover:underline"
            >
              Ver todos →
            </Link>
          }
        >
          {recentProjects.length === 0 ? (
            <p className="text-sm text-zinc-500">
              Todavía no hay proyectos.{" "}
              <Link href="/proyectos" className="text-red-300 hover:underline">
                Crea el primero
              </Link>
              .
            </p>
          ) : (
            <ul className="space-y-3">
              {recentProjects.map((p) => (
                <li
                  key={p.id}
                  className="flex items-start justify-between gap-3 rounded-xl border border-zinc-800/70 bg-zinc-950/40 p-3"
                >
                  <div className="min-w-0">
                    <p className="truncate text-sm font-medium text-zinc-100">
                      {p.title}
                    </p>
                    <p className="mt-0.5 text-xs text-zinc-500">
                      {p.client?.name ?? "Sin cliente"} · Actualizado el{" "}
                      {formatDate(p.updatedAt)}
                    </p>
                    <div className="mt-2">
                      <TagList tags={p.tags} />
                    </div>
                  </div>
                  <span
                    className={`shrink-0 rounded-full px-2.5 py-0.5 text-xs font-medium ring-1 ${statusBadgeClasses(p.status)}`}
                  >
                    {statusLabel(p.status)}
                  </span>
                </li>
              ))}
            </ul>
          )}
        </SectionCard>

        <SectionCard
          title="Prompts recientes"
          action={
            <Link
              href="/prompts"
              className="text-sm font-medium text-red-300 hover:underline"
            >
              Ver todos →
            </Link>
          }
        >
          {recentPrompts.length === 0 ? (
            <p className="text-sm text-zinc-500">
              Todavía no hay prompts.{" "}
              <Link href="/prompts" className="text-red-300 hover:underline">
                Guarda el primero
              </Link>
              .
            </p>
          ) : (
            <ul className="space-y-3">
              {recentPrompts.map((p) => (
                <li
                  key={p.id}
                  className="flex items-center justify-between gap-3 rounded-xl border border-zinc-800/70 bg-zinc-950/40 p-3"
                >
                  <div className="min-w-0">
                    <p className="truncate text-sm font-medium text-zinc-100">
                      {p.title}
                    </p>
                    <p className="mt-0.5 text-xs text-zinc-500">
                      {p.category} · Actualizado el {formatDate(p.updatedAt)}
                    </p>
                  </div>
                  <Link
                    href="/prompts"
                    className="shrink-0 text-xs font-medium text-red-300 hover:underline"
                  >
                    Abrir →
                  </Link>
                </li>
              ))}
            </ul>
          )}
        </SectionCard>
        <SectionCard
          title="Skills recientes"
          action={
            <Link
              href="/skills"
              className="text-sm font-medium text-red-300 hover:underline"
            >
              Ver todas →
            </Link>
          }
        >
          {recentSkills.length === 0 ? (
            <p className="text-sm text-zinc-500">
              Todavía no hay skills.{" "}
              <Link href="/skills" className="text-red-300 hover:underline">
                Guarda la primera
              </Link>
              .
            </p>
          ) : (
            <ul className="space-y-3">
              {recentSkills.map((s) => (
                <li
                  key={s.id}
                  className="flex items-center justify-between gap-3 rounded-xl border border-zinc-800/70 bg-zinc-950/40 p-3"
                >
                  <div className="min-w-0">
                    <p className="truncate text-sm font-medium text-zinc-100">
                      {s.name}
                    </p>
                    <p className="mt-0.5 text-xs text-zinc-500">
                      {s.category} · Actualizada el {formatDate(s.updatedAt)}
                    </p>
                  </div>
                  <Link
                    href="/skills"
                    className="shrink-0 text-xs font-medium text-red-300 hover:underline"
                  >
                    Abrir →
                  </Link>
                </li>
              ))}
            </ul>
          )}
        </SectionCard>
        <SectionCard
          title="Mensajes recientes"
          action={
            <Link
              href="/mensajes"
              className="text-sm font-medium text-red-300 hover:underline"
            >
              Ver todos →
            </Link>
          }
        >
          {recentMessages.length === 0 ? (
            <p className="text-sm text-zinc-500">
              Todavía no hay mensajes.{" "}
              <Link href="/mensajes" className="text-red-300 hover:underline">
                Guarda el primero
              </Link>
              .
            </p>
          ) : (
            <ul className="space-y-3">
              {recentMessages.map((m) => (
                <li
                  key={m.id}
                  className="flex items-center justify-between gap-3 rounded-xl border border-zinc-800/70 bg-zinc-950/40 p-3"
                >
                  <div className="min-w-0">
                    <p className="truncate text-sm font-medium text-zinc-100">
                      {m.title}
                    </p>
                    <p className="mt-0.5 text-xs text-zinc-500">
                      {m.category} · Actualizado el {formatDate(m.updatedAt)}
                    </p>
                  </div>
                  <Link
                    href="/mensajes"
                    className="shrink-0 text-xs font-medium text-red-300 hover:underline"
                  >
                    Abrir →
                  </Link>
                </li>
              ))}
            </ul>
          )}
        </SectionCard>
      </div>
    </div>
  );
}
