"use client";

import { useActionState, useEffect, useMemo, useState, useTransition } from "react";
import { deleteSkill, saveSkill, type ActionResult } from "@/lib/actions";
import {
  CancelButton,
  EmptyState,
  Field,
  FormError,
  IconButton,
  Modal,
  PageHeader,
  PrimaryButton,
  SubmitButton,
  TagList,
  inputClasses,
} from "@/components/ui";
import type { AiSkill } from "@/generated/prisma/client";

const INITIAL_STATE: ActionResult = { ok: false };
const ALL_CATEGORIES = "Todas";

const SUGGESTED_CATEGORIES = [
  "Desarrollo",
  "Diseño",
  "Contenido",
  "Datos",
  "Automatización",
  "General",
];

function SkillForm({
  skill,
  onSaved,
  onCancel,
}: {
  skill?: AiSkill | null;
  onSaved: () => void;
  onCancel: () => void;
}) {
  const [state, formAction, pending] = useActionState(saveSkill, INITIAL_STATE);

  useEffect(() => {
    if (state.ok) onSaved();
  }, [state.ok, onSaved]);

  return (
    <form action={formAction} className="space-y-4">
      {skill && <input type="hidden" name="id" value={skill.id} />}
      <FormError error={state.error} />
      <Field label="Nombre *" htmlFor="name">
        <input
          id="name"
          name="name"
          required
          defaultValue={skill?.name ?? ""}
          placeholder="Nombre de la skill"
          className={inputClasses}
        />
      </Field>
      <Field label="Descripción" htmlFor="description">
        <textarea
          id="description"
          name="description"
          rows={3}
          defaultValue={skill?.description ?? ""}
          placeholder="Qué hace y cuándo usarla…"
          className={inputClasses}
        />
      </Field>
      <div className="grid gap-4 sm:grid-cols-2">
        <Field label="Categoría" htmlFor="category">
          <input
            id="category"
            name="category"
            list="skill-categories"
            defaultValue={skill?.category ?? ""}
            placeholder="Desarrollo"
            className={inputClasses}
          />
          <datalist id="skill-categories">
            {SUGGESTED_CATEGORIES.map((c) => (
              <option key={c} value={c} />
            ))}
          </datalist>
        </Field>
        <Field
          label="Etiquetas"
          htmlFor="tags"
          hint="Separadas por comas: claude, agentes"
        >
          <input
            id="tags"
            name="tags"
            defaultValue={skill?.tags ?? ""}
            placeholder="claude, agentes"
            className={inputClasses}
          />
        </Field>
      </div>
      <Field label="URL" htmlFor="url" hint="Enlace a la skill, docs o repo">
        <input
          id="url"
          name="url"
          type="url"
          defaultValue={skill?.url ?? ""}
          placeholder="https://…"
          className={inputClasses}
        />
      </Field>
      <Field
        label="Comando de instalación"
        htmlFor="installCommand"
        hint="Se copia con un clic desde la tarjeta"
      >
        <input
          id="installCommand"
          name="installCommand"
          defaultValue={skill?.installCommand ?? ""}
          placeholder="npx skills add https://github.com/anthropics/skills --skill frontend-design"
          className={`${inputClasses} font-mono`}
        />
      </Field>
      <div className="flex justify-end gap-2 pt-2">
        <CancelButton onClick={onCancel} />
        <SubmitButton pending={pending}>
          {skill ? "Guardar cambios" : "Crear skill"}
        </SubmitButton>
      </div>
    </form>
  );
}

function SkillCard({
  skill,
  onEdit,
  onDelete,
}: {
  skill: AiSkill;
  onEdit: () => void;
  onDelete: () => void;
}) {
  const [copied, setCopied] = useState(false);

  const copy = async () => {
    if (!skill.installCommand) return;
    try {
      await navigator.clipboard.writeText(skill.installCommand);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // El portapapeles no está disponible; no hacemos nada.
    }
  };

  return (
    <article className="flex flex-col rounded-2xl border border-zinc-800 bg-zinc-900/60 p-5">
      <div className="mb-2 flex items-start justify-between gap-2">
        <span className="rounded-full bg-violet-500/15 px-2.5 py-0.5 text-xs font-medium text-violet-300 ring-1 ring-violet-500/30">
          {skill.category}
        </span>
        <div className="flex shrink-0">
          <IconButton onClick={onEdit} label={`Editar ${skill.name}`}>
            Editar
          </IconButton>
          <IconButton onClick={onDelete} label={`Eliminar ${skill.name}`} danger>
            Eliminar
          </IconButton>
        </div>
      </div>
      <h3 className="font-semibold text-zinc-50">{skill.name}</h3>
      {skill.description && (
        <p className="mt-1 line-clamp-2 text-sm text-zinc-400">
          {skill.description}
        </p>
      )}
      {skill.url && (
        <p className="mt-2 text-xs">
          <a
            href={skill.url}
            target="_blank"
            rel="noreferrer"
            className="break-all text-red-300 underline-offset-2 hover:underline"
          >
            {skill.url.replace(/^https?:\/\//, "")} ↗
          </a>
        </p>
      )}
      {skill.installCommand && (
        <pre className="mt-3 max-h-32 flex-1 overflow-y-auto whitespace-pre-wrap break-all rounded-xl bg-zinc-950/80 p-3 font-mono text-xs leading-relaxed text-zinc-300 ring-1 ring-zinc-800">
          {skill.installCommand}
        </pre>
      )}
      <div className="mt-3 flex items-center justify-between gap-2">
        <TagList tags={skill.tags} />
        {skill.installCommand && (
          <button
            type="button"
            onClick={copy}
            className={`shrink-0 rounded-lg px-3 py-1.5 text-xs font-medium transition ${
              copied
                ? "bg-emerald-600 text-white"
                : "bg-zinc-800 text-zinc-200 ring-1 ring-zinc-700 hover:bg-zinc-700"
            }`}
          >
            {copied ? "¡Copiado!" : "Copiar comando"}
          </button>
        )}
      </div>
    </article>
  );
}

function InstallAllButton({
  skills,
  scope,
}: {
  skills: AiSkill[];
  scope: string;
}) {
  const [copied, setCopied] = useState(false);

  const withCommand = skills.filter((s) => s.installCommand?.trim());
  if (withCommand.length === 0) return null;

  const copyAll = async () => {
    const combined = withCommand
      .map((s) => s.installCommand!.trim())
      .join(" && ");
    try {
      await navigator.clipboard.writeText(combined);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // El portapapeles no está disponible; no hacemos nada.
    }
  };

  return (
    <button
      type="button"
      onClick={copyAll}
      title="Genera un único comando que instala todas estas skills"
      className={`shrink-0 rounded-lg px-3 py-1.5 text-xs font-medium ring-1 transition sm:self-center ${
        copied
          ? "bg-emerald-600 text-white ring-emerald-500"
          : "bg-red-600/15 text-red-300 ring-red-500/30 hover:bg-red-600/25"
      }`}
    >
      {copied
        ? "¡Comando copiado!"
        : `⧉ Instalar ${scope} (${withCommand.length})`}
    </button>
  );
}

export function SkillManager({ skills }: { skills: AiSkill[] }) {
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState<AiSkill | null>(null);
  const [confirmDelete, setConfirmDelete] = useState<AiSkill | null>(null);
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState(ALL_CATEGORIES);
  const [isDeleting, startDelete] = useTransition();

  const categories = useMemo(() => {
    const set = new Set(skills.map((s) => s.category).filter(Boolean));
    return [ALL_CATEGORIES, ...Array.from(set).sort((a, b) => a.localeCompare(b, "es"))];
  }, [skills]);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return skills.filter((s) => {
      const matchesCategory = category === ALL_CATEGORIES || s.category === category;
      if (!matchesCategory) return false;
      if (!q) return true;
      const haystack = `${s.name} ${s.description ?? ""} ${s.installCommand ?? ""} ${s.tags}`.toLowerCase();
      return haystack.includes(q);
    });
  }, [skills, query, category]);

  const openNew = () => {
    setEditing(null);
    setModalOpen(true);
  };

  const openEdit = (skill: AiSkill) => {
    setEditing(skill);
    setModalOpen(true);
  };

  const handleDelete = (id: number) => {
    startDelete(async () => {
      await deleteSkill(id);
      setConfirmDelete(null);
    });
  };

  return (
    <div>
      <PageHeader
        title="Skills IA"
        description="Catálogo de skills de IA que usa el estudio."
        action={<PrimaryButton onClick={openNew}>+ Nueva skill</PrimaryButton>}
      />

      <div className="mb-5 flex flex-col gap-3 sm:flex-row">
        <input
          type="search"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Buscar por nombre, descripción o etiqueta…"
          className={`${inputClasses} sm:max-w-sm`}
          aria-label="Buscar skills"
        />
        <select
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          className={`${inputClasses} sm:w-56`}
          aria-label="Filtrar por categoría"
        >
          {categories.map((c) => (
            <option key={c} value={c}>
              {c}
            </option>
          ))}
        </select>
        <InstallAllButton
          skills={filtered}
          scope={category === ALL_CATEGORIES ? "todas" : `«${category}»`}
        />
      </div>

      {filtered.length === 0 ? (
        <EmptyState
          title="No hay skills"
          description={
            skills.length === 0
              ? "Guarda tu primera skill de IA para tenerla siempre a mano."
              : "Ninguna skill coincide con la búsqueda."
          }
        />
      ) : (
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {filtered.map((skill) => (
            <SkillCard
              key={skill.id}
              skill={skill}
              onEdit={() => openEdit(skill)}
              onDelete={() => setConfirmDelete(skill)}
            />
          ))}
        </div>
      )}

      <Modal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        title={editing ? "Editar skill" : "Nueva skill"}
        wide
      >
        <SkillForm
          key={editing?.id ?? "new"}
          skill={editing}
          onSaved={() => setModalOpen(false)}
          onCancel={() => setModalOpen(false)}
        />
      </Modal>

      <Modal
        open={confirmDelete !== null}
        onClose={() => setConfirmDelete(null)}
        title="Eliminar skill"
      >
        <p className="text-sm text-zinc-400">
          ¿Seguro que quieres eliminar{" "}
          <span className="font-medium text-zinc-100">
            «{confirmDelete?.name}»
          </span>
          ? Esta acción no se puede deshacer.
        </p>
        <div className="mt-6 flex justify-end gap-2">
          <CancelButton onClick={() => setConfirmDelete(null)} />
          <button
            type="button"
            disabled={isDeleting}
            onClick={() => confirmDelete && handleDelete(confirmDelete.id)}
            className="rounded-lg bg-red-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-red-500 disabled:opacity-60"
          >
            {isDeleting ? "Eliminando…" : "Eliminar"}
          </button>
        </div>
      </Modal>
    </div>
  );
}
