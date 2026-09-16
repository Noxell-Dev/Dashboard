import { prisma } from "@/lib/prisma";
import { PromptManager } from "@/components/prompts/PromptManager";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Prompts · noxell.dev",
};

export default async function PromptsPage() {
  const prompts = await prisma.prompt.findMany({
    orderBy: { updatedAt: "desc" },
  });

  return <PromptManager prompts={prompts} />;
}
