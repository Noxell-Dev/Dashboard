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
        <div className="overflow-x-auto rounded-2xl border border-zinc-800">
          <table className="w-full min-w-[640px] text-left text-sm">
            <thead>
              <tr className="border-b border-zinc-800 bg-zinc-900/60 text-xs uppercase tracking-wide text-zinc-500">
                <th className="px-4 py-3 font-medium">Cliente</th>
                <th className="px-4 py-3 font-medium">Email</th>
                <th className="px-4 py-3 font-medium">Teléfono</th>
                <th className="px-4 py-3 font-medium">Proyectos</th>
                <th className="px-4 py-3 text-right font-medium">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-800/70">
              {clients.map((client) => (
                <tr key={client.id} className="transition hover:bg-zinc-900/40">
                  <td className="px-4 py-3">
                    <p className="font-medium text-zinc-100">{client.name}</p>
                    {client.company && (
                      <p className="text-xs text-zinc-500">{client.company}</p>
                    )}
                  </td>
                  <td className="px-4 py-3 text-zinc-400">
                    {client.email ?? "—"}
                  </td>
                  <td className="px-4 py-3 text-zinc-400">
                    {client.phone ?? "—"}
                  </td>
                  <td className="px-4 py-3">
                    <span className="rounded-full bg-indigo-500/15 px-2.5 py-0.5 text-xs font-medium text-indigo-300 ring-1 ring-indigo-500/30">
                      {client._count.projects}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-right">
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
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
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
