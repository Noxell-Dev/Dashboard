"use client";

import Image from "next/image";
import { useActionState } from "react";
import { login, type LoginResult } from "@/lib/auth-actions";
import { FormError, SubmitButton, inputClasses } from "@/components/ui";

const INITIAL: LoginResult = { ok: false };

export default function LoginPage() {
  const [state, formAction, pending] = useActionState(login, INITIAL);

  return (
    <div className="flex min-h-[70vh] items-center justify-center px-4">
      <div className="w-full max-w-sm rounded-2xl border border-zinc-800 bg-zinc-900/60 p-6">
        <div className="mb-6 flex items-center gap-3">
          <Image
            src="/logorojo.png"
            alt="Logo de Noxell Dev"
            width={40}
            height={40}
          />
          <div>
            <p className="font-bold tracking-tight text-zinc-50">
              noxell<span className="text-indigo-400">.dev</span>
            </p>
            <p className="text-xs text-zinc-500">Panel del estudio</p>
          </div>
        </div>
        <h1 className="mb-4 text-lg font-semibold text-zinc-100">Entrar</h1>
        <form action={formAction} className="space-y-4">
          <FormError error={state.error} />
          <div>
            <label
              htmlFor="password"
              className="mb-1.5 block text-sm font-medium text-zinc-300"
            >
              Contraseña
            </label>
            <input
              id="password"
              name="password"
              type="password"
              required
              autoFocus
              autoComplete="current-password"
              placeholder="Tu contraseña del panel"
              className={inputClasses}
            />
          </div>
          <SubmitButton pending={pending} pendingText="Entrando…">
            Entrar
          </SubmitButton>
        </form>
      </div>
    </div>
  );
}
