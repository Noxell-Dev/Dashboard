"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "./prisma";
import { normalizeTags, optionalDate, optionalString } from "./utils";
import type { ProjectStatus } from "../generated/prisma/client";

export type ActionResult = { ok: boolean; error?: string };

const REVALIDATE = ["/", "/clientes", "/proyectos", "/prompts"] as const;

function revalidateAll() {
  for (const path of REVALIDATE) revalidatePath(path);
}

export async function saveClient(
  _prev: ActionResult,
  formData: FormData,
): Promise<ActionResult> {
  const id = optionalString(formData.get("id"));
  const data = {
    name: optionalString(formData.get("name")) ?? "",
    company: optionalString(formData.get("company")),
    email: optionalString(formData.get("email")),
    phone: optionalString(formData.get("phone")),
    notes: optionalString(formData.get("notes")),
  };

  if (!data.name) {
    return { ok: false, error: "El nombre del cliente es obligatorio." };
  }

  try {
    if (id) {
      await prisma.client.update({ where: { id: Number(id) }, data });
    } else {
      await prisma.client.create({ data });
    }
    revalidateAll();
    return { ok: true };
  } catch {
    return { ok: false, error: "No se pudo guardar el cliente." };
  }
}

export async function deleteClient(id: number): Promise<ActionResult> {
  try {
    await prisma.client.delete({ where: { id } });
    revalidateAll();
    return { ok: true };
  } catch {
    return { ok: false, error: "No se pudo eliminar el cliente." };
  }
}

const VALID_STATUSES: ProjectStatus[] = ["EN_CURSO", "COMPLETADO", "PAUSADO"];

export async function saveProject(
  _prev: ActionResult,
  formData: FormData,
): Promise<ActionResult> {
  const id = optionalString(formData.get("id"));
  const rawStatus = optionalString(formData.get("status"));
  const rawClientId = optionalString(formData.get("clientId"));

  const status: ProjectStatus =
    rawStatus && (VALID_STATUSES as string[]).includes(rawStatus)
      ? (rawStatus as ProjectStatus)
      : "EN_CURSO";

  const data = {
    title: optionalString(formData.get("title")) ?? "",
    description: optionalString(formData.get("description")),
    status,
    startDate: optionalDate(formData.get("startDate")),
    endDate: optionalDate(formData.get("endDate")),
    url: optionalString(formData.get("url")),
    tags: normalizeTags(formData.get("tags")),
    clientId: rawClientId ? Number(rawClientId) : null,
  };

  if (!data.title) {
    return { ok: false, error: "El título del proyecto es obligatorio." };
  }

  try {
    if (id) {
      await prisma.project.update({ where: { id: Number(id) }, data });
    } else {
      await prisma.project.create({ data });
    }
    revalidateAll();
    return { ok: true };
  } catch {
    return { ok: false, error: "No se pudo guardar el proyecto." };
  }
}

export async function deleteProject(id: number): Promise<ActionResult> {
  try {
    await prisma.project.delete({ where: { id } });
    revalidateAll();
    return { ok: true };
  } catch {
    return { ok: false, error: "No se pudo eliminar el proyecto." };
  }
}

export async function savePrompt(
  _prev: ActionResult,
  formData: FormData,
): Promise<ActionResult> {
  const id = optionalString(formData.get("id"));
  const data = {
    title: optionalString(formData.get("title")) ?? "",
    content: optionalString(formData.get("content")) ?? "",
    category: optionalString(formData.get("category")) ?? "General",
    tags: normalizeTags(formData.get("tags")),
  };

  if (!data.title) {
    return { ok: false, error: "El título del prompt es obligatorio." };
  }
  if (!data.content) {
    return { ok: false, error: "El contenido del prompt es obligatorio." };
  }

  try {
    if (id) {
      await prisma.prompt.update({ where: { id: Number(id) }, data });
    } else {
      await prisma.prompt.create({ data });
    }
    revalidateAll();
    return { ok: true };
  } catch {
    return { ok: false, error: "No se pudo guardar el prompt." };
  }
}

export async function deletePrompt(id: number): Promise<ActionResult> {
  try {
    await prisma.prompt.delete({ where: { id } });
    revalidateAll();
    return { ok: true };
  } catch {
    return { ok: false, error: "No se pudo eliminar el prompt." };
  }
}
