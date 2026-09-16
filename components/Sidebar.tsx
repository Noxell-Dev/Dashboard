"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const LINKS = [
  { href: "/", label: "Panel", icon: "▦" },
  { href: "/clientes", label: "Clientes", icon: "◉" },
  { href: "/proyectos", label: "Proyectos", icon: "▣" },
  { href: "/prompts", label: "Prompts", icon: "✎" },
];

function NavLinks({ onNavigate }: { onNavigate?: () => void }) {
  const pathname = usePathname();
  return (
    <nav className="flex gap-1 md:flex-col">
      {LINKS.map((link) => {
        const active =
          link.href === "/"
            ? pathname === "/"
            : pathname.startsWith(link.href);
        return (
          <Link
            key={link.href}
            href={link.href}
            onClick={onNavigate}
            className={`flex items-center gap-3 rounded-xl px-4 py-2.5 text-sm font-medium transition ${
              active
                ? "bg-indigo-600/15 text-indigo-300 ring-1 ring-indigo-500/30"
                : "text-zinc-400 hover:bg-zinc-800/60 hover:text-zinc-100"
            }`}
          >
            <span aria-hidden="true" className="text-base">
              {link.icon}
            </span>
            {link.label}
          </Link>
        );
      })}
    </nav>
  );
}

export function Sidebar() {
  return (
    <>
      {/* Escritorio */}
      <aside className="fixed inset-y-0 left-0 hidden w-64 flex-col border-r border-zinc-800/80 bg-zinc-950 px-4 py-6 md:flex">
        <Link href="/" className="mb-8 px-2">
          <p className="text-xl font-bold tracking-tight text-zinc-50">
            noxell<span className="text-indigo-400">.dev</span>
          </p>
          <p className="mt-0.5 text-xs text-zinc-500">Panel del estudio</p>
        </Link>
        <NavLinks />
        <div className="mt-auto px-2 text-xs text-zinc-600">
          Hecho con Next.js + Prisma
        </div>
      </aside>

      {/* Móvil: cabecera + navegación horizontal */}
      <header className="sticky top-0 z-40 border-b border-zinc-800/80 bg-zinc-950/95 px-4 py-3 backdrop-blur md:hidden">
        <Link href="/" className="mb-2 block">
          <p className="text-lg font-bold tracking-tight text-zinc-50">
            noxell<span className="text-indigo-400">.dev</span>
          </p>
        </Link>
        <NavLinks />
      </header>
    </>
  );
}
