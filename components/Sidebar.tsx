"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { logout } from "@/lib/auth-actions";

const LINKS = [
  { href: "/", label: "Panel", icon: "▦" },
  { href: "/clientes", label: "Clientes", icon: "◉" },
  { href: "/proyectos", label: "Proyectos", icon: "▣" },
  { href: "/prompts", label: "Prompts", icon: "✎" },
  { href: "/skills", label: "Skills IA", icon: "⬢" },
];

function Logo() {
  return (
    <Link href="/" className="flex items-center gap-2.5 px-2">
      <Image
        src="/logorojo.png"
        alt="Logo de Noxell Dev"
        width={44}
        height={44}
      />
      <span>
        <span className="block text-xl font-bold tracking-tight text-zinc-50">
          noxell<span className="text-red-400">.dev</span>
        </span>
        <span className="block text-xs text-zinc-500">Panel del estudio</span>
      </span>
    </Link>
  );
}

function NavLinks({ onNavigate }: { onNavigate?: () => void }) {
  const pathname = usePathname();
  return (
    <nav className="flex flex-col gap-1">
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
            aria-current={active ? "page" : undefined}
            className={`flex items-center gap-3 rounded-xl px-4 py-2.5 text-sm font-medium transition ${
              active
                ? "bg-red-600/15 text-red-300 ring-1 ring-red-500/30"
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

function MobileHeader() {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open ]);

  return (
    <header className="sticky top-0 z-40 border-b border-zinc-800/80 bg-zinc-950/95 backdrop-blur md:hidden">
      <div className="flex items-center justify-between px-4 py-3">
        <Logo />
        <button
          type="button"
          onClick={() => setOpen((v) => !v)}
          aria-expanded={open}
          aria-controls="mobile-nav"
          aria-label={open ? "Cerrar menú" : "Abrir menú"}
          className="flex h-10 w-10 items-center justify-center rounded-xl text-xl text-zinc-200 ring-1 ring-zinc-800 transition hover:bg-zinc-800/60"
        >
          <span aria-hidden="true">{open ? "✕" : "☰"}</span>
        </button>
      </div>
      {open && (
        <div
          id="mobile-nav"
          className="border-t border-zinc-800/80 px-4 py-3"
        >
          <NavLinks onNavigate={() => setOpen(false)} />
          <div className="mt-2 border-t border-zinc-800/60 pt-2">
            <LogoutButton />
          </div>
        </div>
      )}
    </header>
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

      {/* Móvil: cabecera con menú desplegable */}
      <MobileHeader />
    </>
  );
}
