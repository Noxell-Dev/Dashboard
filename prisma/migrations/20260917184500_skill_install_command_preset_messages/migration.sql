-- El comando de instalación sustituye al campo de contenido libre en las skills
ALTER TABLE "AiSkill" RENAME COLUMN "content" TO "install_command";

-- Nueva sección: mensajes predeterminados del estudio
CREATE TABLE "PresetMessage" (
    "id" SERIAL NOT NULL,
    "title" TEXT NOT NULL,
    "content" TEXT NOT NULL,
    "category" TEXT NOT NULL DEFAULT 'General',
    "tags" TEXT NOT NULL DEFAULT '',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "PresetMessage_pkey" PRIMARY KEY ("id")
);
