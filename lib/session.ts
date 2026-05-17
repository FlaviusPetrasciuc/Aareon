import { v4 as uuidv4 } from "uuid";
import type { IntakeSession, Answer } from "@/types/intake";

export const SESSION_KEY = "aareon_intake_session";

export function createSession(jobTitle: string, managerEmail: string): IntakeSession {
  return {
    id: uuidv4(),
    jobTitle,
    managerEmail,
    answers: [],
    createdAt: Date.now(),
    updatedAt: Date.now(),
  };
}

export function saveSession(session: IntakeSession): void {
  if (typeof window !== "undefined") {
    localStorage.setItem(SESSION_KEY, JSON.stringify(session));
  }
}

export function getSession(): IntakeSession | null {
  if (typeof window === "undefined") return null;
  const raw = localStorage.getItem(SESSION_KEY);
  if (!raw) return null;
  try {
    return JSON.parse(raw) as IntakeSession;
  } catch (e) {
    console.error("Failed to parse session", e);
    return null;
  }
}

export function appendAnswer(session: IntakeSession, answer: Answer): IntakeSession {
  const updated: IntakeSession = {
    ...session,
    answers: [...session.answers, answer],
    updatedAt: Date.now(),
  };
  saveSession(updated);
  return updated;
}

export function updateJD(session: IntakeSession, jd: string): IntakeSession {
  const updated: IntakeSession = {
    ...session,
    jd,
    updatedAt: Date.now(),
  };
  saveSession(updated);
  return updated;
}

export function updateHiringKit(session: IntakeSession, hiringKit: string): IntakeSession {
  const updated: IntakeSession = {
    ...session,
    hiringKit,
    updatedAt: Date.now(),
  };
  saveSession(updated);
  return updated;
}
