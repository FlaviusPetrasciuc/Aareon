import type { IntakeSession } from "@/types/intake";

export function toMarkdown(session: IntakeSession): string {
  const jd = session.jd ?? "JD not yet generated.";
  const kit = session.hiringKit ?? "";

  return [
    `# ${session.jobTitle} — Job Description`,
    "",
    jd,
    "",
    kit ? `# Hiring Kit\n\n${kit}` : "",
  ]
    .join("\n")
    .trim();
}

export function toPlainText(session: IntakeSession): string {
  const md = toMarkdown(session);
  return md
    .replace(/#{1,6}\s*/g, "")
    .replace(/\*\*(.*?)\*\*/g, "$1")
    .replace(/\*(.*?)\*/g, "$1")
    .replace(/`(.*?)`/g, "$1")
    .replace(/\n{3,}/g, "\n\n")
    .trim();
}
