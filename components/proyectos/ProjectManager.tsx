"use client";

import { useActionState, useEffect, useMemo, useState, useTransition } from "react";
import { deleteProject, saveProject, type ActionResult } from "@/lib/actions";
import {
  PROJECT_STATUSES,
  formatDate,
  statusBadgeClasses,
  statusLabel,
  toInputDate,
} from "@/lib/utils";
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
import type {
  Client,
  Project,
  ProjectStatus,
} from "@/generated/prisma/client";

export type ProjectWithClient = Project & { client: Client | null };

const INITIAL_STATE: ActionResult = { ok: false };
const ALL = "TODOS";

function ProjectForm({
  project,
  clients,
  onSaved,
  onCancel,
}: {
  project?: ProjectWithClient | null;
  clients: Client[];
  onSaved: () => void;
  onCancel: () => void;
}) {
  const [state, formAction, pending] = useActionState(saveProject, INITIAL_STATE);

  useEffect(() => {
    if (state.ok) onSaved();
  }, [state.ok, onSaved]);

  return (
    <form action={formAction} className="space-y-4">
      {project && <input type="hidden" name="id" value={project.id} />}
      <FormError error={state.error} />
      <Field label="Título *" htmlFor="title">
        <input
          id="title"
          name="title"
          required
          defaultValue={project?.title ?? ""}
          placeholder="Nombre del proyecto"
          className={inputClasses}
        />
      </Field>
      <Field label="Descripción" htmlFor="description">
        <textarea
          id="description"
          name="description"
          rows={3}
          defaultValue={project?.description ?? ""}
          placeholder="¿En qué consistió el proyecto?"
          className={inputClasses}
        />
      </Field>
      <div className="grid gap-4 sm:grid-cols-2">
        <Field label="Cliente" htmlFor="clientId">
          <select
            id="clientId"
            name="clientId"
            defaultValue={project?.clientId ?? ""}
            className={inputClasses}
          >
            <option value="">Sin cliente</option>
            {clients.map((c) => (
              <option key={c.id} value={c.id}>
                {c.name}
                {c.company ? ` · ${c.company}` : ""}
              </option>
            ))}
          </select>
        </Field>
        <Field label="Estado" htmlFor="status">
          <select
            id="status"
            name="status"
            defaultValue={project?.status ?? "EN_CURSO"}
            className={inputClasses}
          >
            {PROJECT_STATUSES.map((s) => (
              <option key={s} value={s}>
                {statusLabel(s)}
              </option>
            ))}
          </select>
        </Field>
        <Field label="Fecha de inicio" htmlFor="startDate">
          <input
            id="startDate"
            name="startDate"
            type="date"
            defaultValue={toInputDate(project?.startDate)}
            className={inputClasses}
          />
        </Field>
        <Field label="Fecha de fin" htmlFor="endDate">
          <input
            id="endDate"
            name="endDate"
            type="date"
            defaultValue={toInputDate(project?.endDate)}
            className={inputClasses}
          />
        </Field>
      </div>
      <Field label="URL del proyecto" htmlFor="url">
        <input
          id="url"
          name="url"
          type="url"
          defaultValue={project?.url ?? ""}
          placeholder="https://…"
          className={inputClasses}
        />
      </Field>
      <Field
        label="Etiquetas"
        htmlFor="tags"
        hint="Separadas por comas: diseño web, next.js, seo"
      >
        <input
          id="tags"
          name="tags"
          defaultValue={project?.tags ?? ""}
          placeholder="diseño web, next.js, seo"
          className={inputClasses}
        />
      </Field>
      <div className="flex justify-end gap-2 pt-2">
        <CancelButton onClick={onCancel} />
        <SubmitButton pending={pending}>
          {project ? "Guardar cambios" : "Crear proyecto"}
        </SubmitButton>
      </div>
    </form>
  );
}

export function ProjectManager({
  projects,
  clients,
}: {
  projects: ProjectWithClient[];
  clients: Client[];
}) {
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState<ProjectWithClient | null>(null);
  const [confirmDelete, setConfirmDelete] = useState<ProjectWithClient | null>(
    null,
  );
  const [statusFilter, setStatusFilter] = useState<string>(ALL);
  const [isDeleting, startDelete] = useTransition();

  const filtered = useMemo(
    () =>
      statusFilter === ALL
        ? projects
        : projects.filter((p) => p.status === statusFilter),
    [projects, statusFilter],
  );

  const openNew = () => {
    setEditing(null);
    setModalOpen(true);
  };

  const openEdit = (project: ProjectWithClient) => {
    setEditing(project);
    setModalOpen(true);
  };

  const handleDelete = (id: number) => {
    startDelete(async () => {
      await deleteProject(id);
      setConfirmDelete(null);
    });
  };

  return (
    <div>
      <PageHeader
        title="Proyectos"
        description="Historial de proyectos realizados por el estudio."
        action={<PrimaryButton onClick={openNew}>+ Nuevo proyecto</PrimaryButton>}
      />

      <div className="mb-5 flex flex-wrap gap-2">
        {[ALL, ...PROJECT_STATUSES].map((s) => (
          <button
            key={s}
            type="button"
            onClick={() => setStatusFilter(s)}
            className={`rounded-full px-3.5 py-1.5 text-xs font-medium transition ${
              statusFilter === s
                ? "bg-red-600 text-white"
                : "bg-zinc-800/60 text-zinc-400 ring-1 ring-zinc-700 hover:text-zinc-100"
            }`}
          >
            {s === ALL ? "Todos" : statusLabel(s as ProjectStatus)}
          </button>
        ))}
      </div>

      {filtered.length === 0 ? (
        <EmptyState
          title="No hay proyectos"
          description={
            projects.length === 0
              ? "Crea tu primer proyecto para empezar el historial del estudio."
              : "Ningún proyecto coincide con este filtro."
          }
        />
      ) : (
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {filtered.map((project) => (
            <article
              key={project.id}
              className="flex flex-col rounded-2xl border border-zinc-800 bg-zinc-900/60 p-5"
            >
              <div className="mb-3 flex items-start justify-between gap-2">
                <span
                  className={`rounded-full px-2.5 py-0.5 text-xs font-medium ring-1 ${statusBadgeClasses(project.status)}`}
                >
                  {statusLabel(project.status)}
                </span>
                <div className="flex shrink-0">
                  <IconButton
                    onClick={() => openEdit(project)}
                    label={`Editar ${project.title}`}
                  >
                    Editar
                  </IconButton>
                  <IconButton
                    onClick={() => setConfirmDelete(project)}
                    label={`Eliminar ${project.title}`}
                    danger
                  >
                    Eliminar
                  </IconButton>
                </div>
              </div>
              <h3 className="font-semibold text-zinc-50">{project.title}</h3>
              {project.client && (
                <p className="mt-0.5 text-xs text-red-300">
                  {project.client.name}
                  {project.client.company
                    ? ` · ${project.client.company}`
                    : ""}
                </p>
              )}
              {project.description && (
                <p className="mt-2 line-clamp-3 text-sm text-zinc-400">
                  {project.description}
                </p>
              )}
              <div className="mt-3 space-y-1 text-xs text-zinc-500">
                <p>
                  {formatDate(project.startDate)} → {formatDate(project.endDate)}
                </p>
                {project.url && (
                  <p>
                    <a
                      href={project.url}
                      target="_blank"
                      rel="noreferrer"
                      className="text-red-300 underline-offset-2 hover:underline"
                    >
                      Ver proyecto ↗
                    </a>
                  </p>
                )}
              </div>
              <div className="mt-3">
                <TagList tags={project.tags} />
              </div>
            </article>
          ))}
        </div>
      )}

      <Modal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        title={editing ? "Editar proyecto" : "Nuevo proyecto"}
        wide
      >
        <ProjectForm
          key={editing?.id ?? "new"}
          project={editing}
          clients={clients}
          onSaved={() => setModalOpen(false)}
          onCancel={() => setModalOpen(false)}
        />
      </Modal>

      <Modal
        open={confirmDelete !== null}
        onClose={() => setConfirmDelete(null)}
        title="Eliminar proyecto"
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
