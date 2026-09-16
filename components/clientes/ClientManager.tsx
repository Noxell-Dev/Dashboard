"use client";

import { useActionState, useEffect, useState, useTransition } from "react";
import { deleteClient, saveClient, type ActionResult } from "@/lib/actions";
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
  inputClasses,
} from "@/components/ui";
import type { Client } from "@/generated/prisma/client";

export type ClientWithProjects = Client & { _count: { projects: number } };

const INITIAL_STATE: ActionResult = { ok: false };

function ClientForm({
  client,
  onSaved,
  onCancel,
}: {
  client?: ClientWithProjects | null;
  onSaved: () => void;
  onCancel: () => void;
}) {
  const [state, formAction, pending] = useActionState(saveClient, INITIAL_STATE);

  useEffect(() => {
    if (state.ok) onSaved();
  }, [state.ok, onSaved]);

  return (
    <form action={formAction} className="space-y-4">
      {client && <input type="hidden" name="id" value={client.id} />}
      <FormError error={state.error} />
      <div className="grid gap-4 sm:grid-cols-2">
        <Field label="Nombre *" htmlFor="name">
          <input
            id="name"
            name="name"
            required
            defaultValue={client?.name ?? ""}
            placeholder="Nombre del contacto"
            className={inputClasses}
          />
        </Field>
        <Field label="Empresa" htmlFor="company">
          <input
            id="company"
            name="company"
            defaultValue={client?.company ?? ""}
            placeholder="Empresa u organización"
            className={inputClasses}
          />
        </Field>
        <Field label="Email" htmlFor="email">
          <input
            id="email"
            name="email"
            type="email"
            defaultValue={client?.email ?? ""}
            placeholder="hola@empresa.es"
            className={inputClasses}
          />
        </Field>
        <Field label="Teléfono" htmlFor="phone">
          <input
            id="phone"
            name="phone"
            type="tel"
            defaultValue={client?.phone ?? ""}
            placeholder="+34 600 000 000"
            className={inputClasses}
          />
        </Field>
      </div>
      <Field label="Notas" htmlFor="notes">
        <textarea
          id="notes"
          name="notes"
          rows={3}
          defaultValue={client?.notes ?? ""}
          placeholder="Notas sobre el cliente…"
          className={inputClasses}
        />
      </Field>
      <div className="flex justify-end gap-2 pt-2">
        <CancelButton onClick={onCancel} />
        <SubmitButton pending={pending}>
          {client ? "Guardar cambios" : "Crear cliente"}
        </SubmitButton>
      </div>
    </form>
  );
}

export function ClientManager({ clients }: { clients: ClientWithProjects[] }) {
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState<ClientWithProjects | null>(null);
  const [confirmDelete, setConfirmDelete] = useState<ClientWithProjects | null>(
    null,
  );
  const [isDeleting, startDelete] = useTransition();

  const openNew = () => {
    setEditing(null);
    setModalOpen(true);
  };

  const openEdit = (client: ClientWithProjects) => {
    setEditing(client);
    setModalOpen(true);
  };

  const handleDelete = (id: number) => {
    startDelete(async () => {
      await deleteClient(id);
      setConfirmDelete(null);
    });
  };

  return (
    <div>
      <PageHeader
        title="Clientes"
        description="Gestiona los clientes del estudio y sus datos de contacto."
        action={<PrimaryButton onClick={openNew}>+ Nuevo cliente</PrimaryButton>}
      />

      {clients.length === 0 ? (
        <EmptyState
          title="Todavía no hay clientes"
          description="Crea tu primer cliente para empezar a organizar el trabajo del estudio."
        />
      ) : (
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {clients.map((client) => (
            <article
              key={client.id}
              className="flex flex-col rounded-2xl border border-zinc-800 bg-zinc-900/60 p-5"
            >
              <div className="mb-2 flex items-start justify-between gap-2">
                <div className="min-w-0">
                  <h3 className="truncate font-semibold text-zinc-50">
                    {client.name}
                  </h3>
                  {client.company && (
                    <p className="mt-0.5 text-xs text-zinc-500">
                      {client.company}
                    </p>
                  )}
                </div>
                <span
                  className="shrink-0 rounded-full bg-red-500/15 px-2.5 py-0.5 text-xs font-medium text-red-300 ring-1 ring-red-500/30"
                  title="Proyectos vinculados"
                >
                  {client._count.projects}{" "}
                  {client._count.projects === 1 ? "proyecto" : "proyectos"}
                </span>
              </div>
              <div className="flex-1 space-y-1 text-sm text-zinc-400">
                {client.email && (
                  <p className="truncate">
                    <a
                      href={`mailto:${client.email}`}
                      className="hover:text-red-300 hover:underline"
                    >
                      {client.email}
                    </a>
                  </p>
                )}
                {client.phone && (
                  <p>
                    <a
                      href={`tel:${client.phone}`}
                      className="hover:text-red-300 hover:underline"
                    >
                      {client.phone}
                    </a>
                  </p>
                )}
                {client.notes && (
                  <p className="line-clamp-2 pt-1 text-xs text-zinc-500">
                    {client.notes}
                  </p>
                )}
                {!client.email && !client.phone && !client.notes && (
                  <p className="text-xs text-zinc-600">Sin datos de contacto</p>
                )}
              </div>
              <div className="mt-4 flex justify-end border-t border-zinc-800/70 pt-3">
                <IconButton
                  onClick={() => openEdit(client)}
                  label={`Editar ${client.name}`}
                >
                  Editar
                </IconButton>
                <IconButton
                  onClick={() => setConfirmDelete(client)}
                  label={`Eliminar ${client.name}`}
                  danger
                >
                  Eliminar
                </IconButton>
              </div>
            </article>
          ))}
        </div>
      )}

      <Modal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        title={editing ? "Editar cliente" : "Nuevo cliente"}
      >
        <ClientForm
          key={editing?.id ?? "new"}
          client={editing}
          onSaved={() => setModalOpen(false)}
          onCancel={() => setModalOpen(false)}
        />
      </Modal>

      <Modal
        open={confirmDelete !== null}
        onClose={() => setConfirmDelete(null)}
        title="Eliminar cliente"
      >
        <p className="text-sm text-zinc-400">
          ¿Seguro que quieres eliminar a{" "}
          <span className="font-medium text-zinc-100">
            {confirmDelete?.name}
          </span>
          ? Sus proyectos quedarán sin cliente asignado. Esta acción no se
          puede deshacer.
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
