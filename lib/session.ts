import { nanoid } from "nanoid";
import type { IntakeSession, Answer } from "@/types/intake";

export const SESSION_KEY = "aareon_session";

export function createSession(jobTitle: string): IntakeSession {
  const now = Date.now();
  return { id: nanoid(), jobTitle, answers: [], createdAt: now, updatedAt: now };
}

export function saveSession(session: IntakeSession): void {
  localStorage.setItem(SESSION_KEY, JSON.stringify({ ...session, updatedAt: Date.now() }));
}

export function getSession(): IntakeSession | null {
  const raw = localStorage.getItem(SESSION_KEY);
  if (!raw) return null;
  try {
    return JSON.parse(raw) as IntakeSession;
  } catch {
    return null;
  }
}

export function appendAnswer(session: IntakeSession, answer: Answer): IntakeSession {
  const updated = { ...session, answers: [...session.answers, answer], updatedAt: Date.now() };
  saveSession(updated);
  return updated;
}

export function updateJD(session: IntakeSession, jd: string): IntakeSession {
  const updated = { ...session, jd, updatedAt: Date.now() };
  saveSession(updated);
  return updated;
}

export function updateHiringKit(session: IntakeSession, hiringKit: string): IntakeSession {
  const updated = { ...session, hiringKit, updatedAt: Date.now() };
  saveSession(updated);
  return updated;
}
