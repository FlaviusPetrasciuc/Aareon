import {
  createSession,
  getSession,
  saveSession,
  appendAnswer,
  updateJD,
  updateHiringKit,
  SESSION_KEY,
} from "@/lib/session";
import type { IntakeSession, Answer } from "@/types/intake";

const mockStorage = (() => {
  let store: Record<string, string> = {};
  return {
    getItem: (k: string) => store[k] ?? null,
    setItem: (k: string, v: string) => { store[k] = v; },
    removeItem: (k: string) => { delete store[k]; },
    clear: () => { store = {}; },
  };
})();

Object.defineProperty(global, "localStorage", { value: mockStorage });

beforeEach(() => mockStorage.clear());

test("createSession returns session with jobTitle and unique id", () => {
  const session = createSession("Staff Engineer");
  expect(session.jobTitle).toBe("Staff Engineer");
  expect(session.id).toBeTruthy();
  expect(session.answers).toEqual([]);
  expect(session.jd).toBeUndefined();
});

test("saveSession persists to localStorage", () => {
  const session = createSession("Staff Engineer");
  saveSession(session);
  const raw = localStorage.getItem(SESSION_KEY);
  expect(raw).not.toBeNull();
  const parsed = JSON.parse(raw!);
  expect(parsed.jobTitle).toBe("Staff Engineer");
});

test("getSession returns null when nothing saved", () => {
  expect(getSession()).toBeNull();
});

test("getSession returns saved session", () => {
  const session = createSession("Staff Engineer");
  saveSession(session);
  const loaded = getSession();
  expect(loaded?.id).toBe(session.id);
});

test("appendAnswer adds answer and updates updatedAt", () => {
  const session = createSession("Staff Engineer");
  const answer: Answer = { questionId: "q1", question: "Seniority?", answer: "Senior" };
  const updated = appendAnswer(session, answer);
  expect(updated.answers).toHaveLength(1);
  expect(updated.answers[0].answer).toBe("Senior");
  expect(updated.updatedAt).toBeGreaterThanOrEqual(session.updatedAt);
});

test("updateJD sets jd field and saves", () => {
  const session = createSession("Staff Engineer");
  saveSession(session);
  const updated = updateJD(session, "# Staff Engineer\n\nWe are hiring...");
  expect(updated.jd).toBe("# Staff Engineer\n\nWe are hiring...");
});

test("updateHiringKit sets hiringKit field", () => {
  const session = createSession("Staff Engineer");
  const updated = updateHiringKit(session, "## Hiring Kit\n\n- Culture fit...");
  expect(updated.hiringKit).toBe("## Hiring Kit\n\n- Culture fit...");
});
