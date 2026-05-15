"use client";

import { useState, useEffect, useCallback } from "react";
import WizardPanel from "./WizardPanel";
import JDPreviewPanel from "./JDPreviewPanel";
import { createSession, getSession, saveSession } from "@/lib/session";
import { toMarkdown, toPlainText } from "@/lib/export";
import type { IntakeSession } from "@/types/intake";

const TOTAL_QUESTIONS = 8;

function downloadFile(filename: string, content: string, mime: string) {
  const blob = new Blob([content], { type: mime });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
}

export default function IntakePage() {
  const [session, setSession] = useState<IntakeSession | null>(null);
  const [jobTitle, setJobTitle] = useState("");
  const [jdContent, setJdContent] = useState("");
  const [hiringKit, setHiringKit] = useState("");
  const [started, setStarted] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const saved = getSession();
    if (saved) {
      setSession(saved);
      setJobTitle(saved.jobTitle);
      setJdContent(saved.jd ?? "");
      setHiringKit(saved.hiringKit ?? "");
      setStarted(true);
    }
  }, []);

  const handleStart = useCallback(() => {
    if (!jobTitle.trim()) {
      setError("Please enter a job title to begin.");
      return;
    }
    setError(null);
    const s = createSession(jobTitle.trim());
    saveSession(s);
    setSession(s);
    setStarted(true);
  }, [jobTitle]);

  const handleExportMarkdown = useCallback(() => {
    if (!session) return;
    downloadFile(
      `${session.jobTitle.replace(/\s+/g, "-")}-JD.md`,
      toMarkdown(session),
      "text/markdown"
    );
  }, [session]);

  const handleExportPlainText = useCallback(() => {
    if (!session) return;
    downloadFile(
      `${session.jobTitle.replace(/\s+/g, "-")}-JD.txt`,
      toPlainText(session),
      "text/plain"
    );
  }, [session]);

  const progress = session
    ? Math.min((session.answers.length / TOTAL_QUESTIONS) * 100, 100)
    : 0;

  if (!started || !session) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-aareon-sand px-4">
        <h1 className="text-3xl font-title text-aareon-headline mb-2">Aareon</h1>
        <p className="text-aareon-body mb-8">Enter a job title to start the intake interview.</p>
        <div className="flex flex-col gap-2 w-full max-w-sm">
          <input
            type="text"
            value={jobTitle}
            onChange={(e) => setJobTitle(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") handleStart();
            }}
            placeholder="e.g. Senior Frontend Engineer"
            className="px-4 py-3 rounded-lg border border-aareon-stone focus:outline-none focus:border-aareon-bright text-sm"
            autoFocus
          />
          {error && <p className="text-red-500 text-xs">{error}</p>}
          <button
            type="button"
            onClick={handleStart}
            className="bg-aareon-bright text-white py-3 rounded-lg text-sm font-medium hover:opacity-90 transition-opacity"
          >
            Start Intake Interview →
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-screen">
      <nav className="bg-aareon-blue text-white px-6 py-3 flex items-center justify-between flex-shrink-0">
        <span className="font-bold tracking-widest text-sm">AAREON</span>
        <span className="text-xs opacity-60">Recruiter Intake</span>
      </nav>

      <div className="h-1 bg-aareon-stone flex-shrink-0">
        <div
          className="h-full bg-aareon-bright transition-all duration-500"
          style={{ width: `${progress}%` }}
        />
      </div>

      <div className="flex flex-1 overflow-hidden">
        <div className="flex-1 border-r border-aareon-stone overflow-hidden">
          <WizardPanel
            session={session}
            onSessionUpdate={setSession}
            onJDUpdate={setJdContent}
            onHiringKitUpdate={setHiringKit}
            progress={progress}
          />
        </div>
        <div className="flex-1 overflow-hidden">
          <JDPreviewPanel
            jdContent={jdContent}
            hiringKit={hiringKit}
            answeredCount={session.answers.length}
            totalQuestions={TOTAL_QUESTIONS}
            onExportMarkdown={handleExportMarkdown}
            onExportPlainText={handleExportPlainText}
          />
        </div>
      </div>
    </div>
  );
}
