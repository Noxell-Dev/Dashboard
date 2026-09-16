"use client";

import { usePathname } from "next/navigation";
import type { ReactNode } from "react";
import { Sidebar } from "./Sidebar";

// En /login no hay navegación: solo la tarjeta de acceso.
export function AppShell({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  if (pathname === "/login") {
    return (
      <main className="mx-auto w-full max-w-6xl px-4 py-6">{children}</main>
    );
  }
  return (
    <>
      <Sidebar />
      <div className="md:pl-64">
        <main className="mx-auto w-full max-w-6xl px-4 py-6 md:px-8 md:py-8">
          {children}
        </main>
      </div>
    </>
  );
}
