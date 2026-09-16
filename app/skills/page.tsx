import { prisma } from "@/lib/prisma";
import { SkillManager } from "@/components/skills/SkillManager";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Skills IA · noxell.dev",
};

export default async function SkillsPage() {
  const skills = await prisma.aiSkill.findMany({
    orderBy: { updatedAt: "desc" },
  });

  return <SkillManager skills={skills} />;
}
