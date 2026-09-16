import type { ProjectStatus } from "../generated/prisma/client";

/** Convierte un FormDataEntryValue en string recortado o null si está vacío. */
export function optionalString(
  value: FormDataEntryValue | null,
): string | null {
  if (value === null || value === undefined) return null;
  const s = String(value).trim();
  return s === "" ? null : s;
}

/** Convierte un valor de <input type="date"> en Date o null. */
export function optionalDate(value: FormDataEntryValue | null): Date | null {
  const s = optionalString(value);
  if (!s) return null;
  const d = new Date(`${s}T00:00:00`);
  return Number.isNaN(d.getTime()) ? null : d;
}

/** Normaliza etiquetas separadas por comas: "a, b,,c" -> "a, b, c". */
export function normalizeTags(value: FormDataEntryValue | null): string {
  if (value === null || value === undefined) return "";
  return String(value)
    .split(",")
    .map((t) => t.trim())
    .filter((t) => t.length > 0)
    .join(", ");
}

/** "a, b, c" -> ["a", "b", "c"] */
export function tagsToList(tags: string | null | undefined): string[] {
  if (!tags) return [];
  return tags
    .split(",")
    .map((t) => t.trim())
    .filter((t) => t.length > 0);
}

/** Formatea una fecha en español: 15 ene 2026 */
export function formatDate(date: Date | string | null | undefined): string {
  if (!date) return "—";
  const d = typeof date === "string" ? new Date(date) : date;
  return new Intl.DateTimeFormat("es-ES", {
    day: "numeric",
    month: "short",
    year: "numeric",
  }).format(d);
}

/** Formatea una fecha para <input type="date">: 2026-01-15 */
export function toInputDate(date: Date | string | null | undefined): string {
  if (!date) return "";
  const d = typeof date === "string" ? new Date(date) : date;
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
}

export const PROJECT_STATUSES: ProjectStatus[] = [
  "EN_CURSO",
  "COMPLETADO",
  "PAUSADO",
];

export function statusLabel(status: ProjectStatus): string {
  switch (status) {
    case "EN_CURSO":
      return "En curso";
    case "COMPLETADO":
      return "Completado";
    case "PAUSADO":
      return "Pausado";
  }
}

export function statusBadgeClasses(status: ProjectStatus): string {
  switch (status) {
    case "EN_CURSO":
      return "bg-sky-500/15 text-sky-300 ring-sky-500/30";
    case "COMPLETADO":
      return "bg-emerald-500/15 text-emerald-300 ring-emerald-500/30";
    case "PAUSADO":
      return "bg-amber-500/15 text-amber-300 ring-amber-500/30";
  }
}
