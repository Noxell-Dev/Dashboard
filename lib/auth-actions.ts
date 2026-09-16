"use server";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { SESSION_COOKIE, checkPassword, createSession } from "./auth";

export type LoginResult = { ok: boolean; error?: string };

export async function login(
  _prev: LoginResult,
  formData: FormData,
): Promise<LoginResult> {
  if (!process.env.DASHBOARD_PASSWORD) {
    return { ok: false, error: "Falta DASHBOARD_PASSWORD en el entorno." };
  }
  if (!checkPassword(String(formData.get("password") ?? ""))) {
    return { ok: false, error: "Contraseña incorrecta." };
  }
  (await cookies()).set(SESSION_COOKIE, await createSession(), {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 30 * 86_400,
  });
  redirect("/");
}

export async function logout(): Promise<void> {
  (await cookies()).delete(SESSION_COOKIE);
  redirect("/login");
}
