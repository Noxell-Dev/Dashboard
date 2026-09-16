"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { logout } from "@/lib/auth-actions";

const LINKS = [
  { href: "/", label: "Panel", icon: "▦" },
  { href: "/clientes", label: "Clientes", icon: "◉" },
  { href: "/proyectos", label: "Proyectos", icon: "▣" },
  { href: "/prompts", label: "Prompts", icon: "✎" },
];

function Logo() {
  return (
    <Link href="/" className="flex items-center gap-2.5 px-2">
      <Image
        src="/logorojo.png"
        alt="Logo de Noxell Dev"
        width={32}
        height={32}
      />
      <span>
        <span className="block text-xl font-bold tracking-tight text-zinc-50">
          noxell<span className="text-indigo-400">.dev</span>
        </span>
        <span className="block text-xs text-zinc-500">Panel del estudio</span>
      </span>
    </Link>
  );
}

function NavLinks({ onNavigate }: { onNavigate?: () => void }) {
  const pathname = usePathname();
  return (
    <nav className="flex flex-wrap gap-1 md:flex-col md:flex-nowrap">
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

function LogoutButton() {
  return (
    <form action={logout}>
      <button
        type="submit"
        className="flex w-full items-center gap-3 rounded-xl px-4 py-2.5 text-sm font-medium text-zinc-500 transition hover:bg-zinc-800/60 hover:text-zinc-100"
      >
        <span aria-hidden="true" className="text-base">
          ⏻
        </span>
        Salir
      </button>
    </form>
  );
}

export function Sidebar() {
  return (
    <>
      {/* Escritorio */}
      <aside className="fixed inset-y-0 left-0 hidden w-64 flex-col border-r border-zinc-800/80 bg-zinc-950 px-4 py-6 md:flex">
        <div className="mb-8">
          <Logo />
        </div>
        <NavLinks />
        <div className="mt-auto">
          <LogoutButton />
        </div>
      </aside>

      {/* Móvil: cabecera + navegación */}
      <header className="sticky top-0 z-40 border-b border-zinc-800/80 bg-zinc-950/95 px-4 py-3 backdrop-blur md:hidden">
        <div className="mb-2 flex items-center justify-between">
          <Logo />
          <LogoutButton />
        </div>
        <NavLinks />
      </header>
    </>
  );
}
