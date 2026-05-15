import { toMarkdown, toPlainText } from "@/lib/export";
import type { IntakeSession } from "@/types/intake";

const session: IntakeSession = {
  id: "abc123",
  jobTitle: "Staff Engineer",
  answers: [
    { questionId: "q1", question: "Seniority level?", answer: "Senior (5+ yrs)" },
    { questionId: "q2", question: "Team size?", answer: "6–10 engineers" },
  ],
  jd: "## Staff Engineer\n\nWe are hiring a staff engineer...",
  hiringKit: "## Hiring Kit\n\n- Interview stages: phone screen, system design, values",
  createdAt: 1715000000000,
  updatedAt: 1715000000000,
};

test("toMarkdown includes JD and Hiring Kit with headers", () => {
  const md = toMarkdown(session);
  expect(md).toContain("# Staff Engineer — Job Description");
  expect(md).toContain("## Staff Engineer");
  expect(md).toContain("# Hiring Kit");
  expect(md).toContain("Interview stages");
});

test("toMarkdown returns fallback when jd is missing", () => {
  const s = { ...session, jd: undefined, hiringKit: undefined };
  const md = toMarkdown(s);
  expect(md).toContain("JD not yet generated");
});

test("toPlainText strips markdown syntax", () => {
  const text = toPlainText(session);
  expect(text).not.toContain("##");
  expect(text).toContain("Staff Engineer");
  expect(text).toContain("Interview stages");
});

test("toPlainText returns fallback when jd is missing", () => {
  const s = { ...session, jd: undefined };
  const text = toPlainText(s);
  expect(text).toContain("JD not yet generated");
});
