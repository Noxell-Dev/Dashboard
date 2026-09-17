"use client";

import { useActionState, useEffect, useMemo, useState, useTransition } from "react";
import { deletePresetMessage, savePresetMessage, type ActionResult } from "@/lib/actions";
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
import type { PresetMessage } from "@/generated/prisma/client";

const INITIAL_STATE: ActionResult = { ok: false };
const ALL_CATEGORIES = "Todas";

const SUGGESTED_CATEGORIES = [
  "Clientes",
  "Presupuestos",
  "Soporte",
  "Redes sociales",
  "General",
];

function MessageForm({
  message,
  onSaved,
  onCancel,
}: {
  message?: PresetMessage | null;
  onSaved: () => void;
  onCancel: () => void;
}) {
  const [state, formAction, pending] = useActionState(savePresetMessage, INITIAL_STATE);

  useEffect(() => {
    if (state.ok) onSaved();
  }, [state.ok, onSaved]);

  return (
    <form action={formAction} className="space-y-4">
      {message && <input type="hidden" name="id" value={message.id} />}
      <FormError error={state.error} />
      <Field label="Título *" htmlFor="title">
        <input
          id="title"
          name="title"
          required
          defaultValue={message?.title ?? ""}
          placeholder="Ej.: Respuesta a solicitud de presupuesto"
          className={inputClasses}
        />
      </Field>
      <Field label="Mensaje *" htmlFor="content">
        <textarea
          id="content"
          name="content"
          required
          rows={8}
          defaultValue={message?.content ?? ""}
          placeholder="Escribe el mensaje tal cual lo enviarías…"
          className={inputClasses}
        />
      </Field>
      <div className="grid gap-4 sm:grid-cols-2">
        <Field label="Categoría" htmlFor="category">
          <input
            id="category"
            name="category"
            list="message-categories"
            defaultValue={message?.category ?? ""}
            placeholder="Clientes"
            className={inputClasses}
          />
          <datalist id="message-categories">
            {SUGGESTED_CATEGORIES.map((c) => (
              <option key={c} value={c} />
            ))}
          </datalist>
        </Field>
        <Field
          label="Etiquetas"
          htmlFor="tags"
          hint="Separadas por comas: email, whatsapp"
        >
          <input
            id="tags"
            name="tags"
            defaultValue={message?.tags ?? ""}
            placeholder="email, whatsapp"
            className={inputClasses}
          />
        </Field>
      </div>
      <div className="flex justify-end gap-2 pt-2">
        <CancelButton onClick={onCancel} />
        <SubmitButton pending={pending}>
          {message ? "Guardar cambios" : "Crear mensaje"}
        </SubmitButton>
      </div>
    </form>
  );
}

function MessageCard({
  message,
  onEdit,
  onDelete,
}: {
  message: PresetMessage;
  onEdit: () => void;
  onDelete: () => void;
}) {
  const [copied, setCopied] = useState(false);

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(message.content);
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
          {message.category}
        </span>
        <div className="flex shrink-0">
          <IconButton onClick={onEdit} label={`Editar ${message.title}`}>
            Editar
          </IconButton>
          <IconButton onClick={onDelete} label={`Eliminar ${message.title}`} danger>
            Eliminar
          </IconButton>
        </div>
      </div>
      <h3 className="font-semibold text-zinc-50">{message.title}</h3>
      <pre className="mt-3 max-h-48 flex-1 overflow-y-auto whitespace-pre-wrap rounded-xl bg-zinc-950/80 p-3 font-mono text-xs leading-relaxed text-zinc-300 ring-1 ring-zinc-800">
        {message.content}
      </pre>
      <div className="mt-3 flex items-center justify-between gap-2">
        <TagList tags={message.tags} />
        <button
          type="button"
          onClick={copy}
          className={`shrink-0 rounded-lg px-3 py-1.5 text-xs font-medium transition ${
            copied
              ? "bg-emerald-600 text-white"
              : "bg-zinc-800 text-zinc-200 ring-1 ring-zinc-700 hover:bg-zinc-700"
          }`}
        >
          {copied ? "¡Copiado!" : "Copiar"}
        </button>
      </div>
    </article>
  );
}

export function MessageManager({ messages }: { messages: PresetMessage[] }) {
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState<PresetMessage | null>(null);
  const [confirmDelete, setConfirmDelete] = useState<PresetMessage | null>(null);
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState(ALL_CATEGORIES);
  const [isDeleting, startDelete] = useTransition();

  const categories = useMemo(() => {
    const set = new Set(messages.map((m) => m.category).filter(Boolean));
    return [ALL_CATEGORIES, ...Array.from(set).sort((a, b) => a.localeCompare(b, "es"))];
  }, [messages]);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return messages.filter((m) => {
      const matchesCategory = category === ALL_CATEGORIES || m.category === category;
      if (!matchesCategory) return false;
      if (!q) return true;
      const haystack = `${m.title} ${m.content} ${m.tags}`.toLowerCase();
      return haystack.includes(q);
    });
  }, [messages, query, category]);

  const openNew = () => {
    setEditing(null);
    setModalOpen(true);
  };

  const openEdit = (message: PresetMessage) => {
    setEditing(message);
    setModalOpen(true);
  };

  const handleDelete = (id: number) => {
    startDelete(async () => {
      await deletePresetMessage(id);
      setConfirmDelete(null);
    });
  };

  return (
    <div>
      <PageHeader
        title="Mensajes"
        description="Mensajes predeterminados del estudio, listos para copiar y enviar."
        action={<PrimaryButton onClick={openNew}>+ Nuevo mensaje</PrimaryButton>}
      />

      <div className="mb-5 flex flex-col gap-3 sm:flex-row">
        <input
          type="search"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Buscar por título, contenido o etiqueta…"
          className={`${inputClasses} sm:max-w-sm`}
          aria-label="Buscar mensajes"
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
      </div>

      {filtered.length === 0 ? (
        <EmptyState
          title="No hay mensajes"
          description={
            messages.length === 0
              ? "Guarda tu primer mensaje predeterminado para reutilizarlo cuando quieras."
              : "Ningún mensaje coincide con la búsqueda."
          }
        />
      ) : (
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {filtered.map((message) => (
            <MessageCard
              key={message.id}
              message={message}
              onEdit={() => openEdit(message)}
              onDelete={() => setConfirmDelete(message)}
            />
          ))}
        </div>
      )}

      <Modal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        title={editing ? "Editar mensaje" : "Nuevo mensaje"}
        wide
      >
        <MessageForm
          key={editing?.id ?? "new"}
          message={editing}
          onSaved={() => setModalOpen(false)}
          onCancel={() => setModalOpen(false)}
        />
      </Modal>

      <Modal
        open={confirmDelete !== null}
        onClose={() => setConfirmDelete(null)}
        title="Eliminar mensaje"
      >
        <p className="text-sm text-zinc-400">
          ¿Seguro que quieres eliminar{" "}
          <span className="font-medium text-zinc-100">
            «{confirmDelete?.title}»
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
