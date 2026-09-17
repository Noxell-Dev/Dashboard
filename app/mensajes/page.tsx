import { prisma } from "@/lib/prisma";
import { MessageManager } from "@/components/mensajes/MessageManager";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Mensajes · noxell.dev",
};

export default async function MensajesPage() {
  const messages = await prisma.presetMessage.findMany({
    orderBy: { updatedAt: "desc" },
  });

  return <MessageManager messages={messages} />;
}
