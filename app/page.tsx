"use client";

import { useState, useEffect } from "react";
import { useCopilotAction, useCopilotChat } from "@copilotkit/react-core";
import { MessageRole, TextMessage } from "@copilotkit/runtime-client-gql";
import { CopilotChat } from "@copilotkit/react-ui";
import { WizardPanel } from "@/components/WizardPanel";
import { JDPreviewPanel } from "@/components/JDPreviewPanel";
import { IntakeSession } from "@/types/intake";
import {
  getSession,
  createSession,
  appendAnswer,
  updateJD,
  updateHiringKit,
} from "@/lib/session";

export default function Home() {
  const [session, setSession] = useState<IntakeSession | null>(null);
  const { appendMessage } = useCopilotChat();

  // Load session from localStorage on mount
  useEffect(() => {
    const saved = getSession();
    if (saved) setSession(saved);
  }, []);

  // ── Copilot Actions ─────────────────────────────────────────────────────────

  useCopilotAction({
    name: "startIntake",
    description:
      "Start a new recruiter intake interview session for a specific job title. Call this as soon as the hiring manager provides the role they are hiring for.",
    parameters: [
      {
        name: "jobTitle",
        type: "string",
        description: "The exact job title being hired for, e.g. 'Senior Backend Engineer'.",
        required: true,
      },
    ],
    handler: ({ jobTitle }) => {
      const newSession = createSession(jobTitle);
      setSession(newSession);
    },
  });

  useCopilotAction({
    name: "updateJD",
    description:
      "Update the live Job Description draft in the preview panel. Call this after every answered question to progressively build the JD in markdown format.",
    parameters: [
      {
        name: "content",
        type: "string",
        description:
          "The full markdown content of the Job Description so far. Use headings, bullets, and bold text.",
        required: true,
      },
    ],
    handler: ({ content }) => {
      setSession((prev) => {
        if (!prev) return null;
        return updateJD(prev, content);
      });
    },
  });

  useCopilotAction({
    name: "generateHiringKit",
    description:
      "Generate and display the complete Hiring Kit (interview scorecard, culture-fit questions, onboarding checklist) once all 8 intake questions are answered.",
    parameters: [
      {
        name: "content",
        type: "string",
        description:
          "The full markdown content of the Hiring Kit. Include interview questions with scoring rubrics, culture checks, and a 30-60-90 day onboarding outline.",
        required: true,
      },
    ],
    handler: ({ content }) => {
      setSession((prev) => {
        if (!prev) return null;
        return updateHiringKit(prev, content);
      });
    },
  });

  // ── Answer handler ──────────────────────────────────────────────────────────
  const handleAnswer = (questionId: string, question: string, answer: string) => {
    if (!session) return;
    const updated = appendAnswer(session, { questionId, question, answer });
    setSession(updated);

    // Send the answer to the Copilot Agent so it can proceed to the next question
    appendMessage(
      new TextMessage({
        role: MessageRole.User,
        content: `I select: ${answer}`,
      })
    );
  };

  // ── Render ──────────────────────────────────────────────────────────────────
  return (
    <main className="relative flex h-screen w-full overflow-hidden bg-aareon-sand">
      {/* Background Grid Pattern */}
      <div className="absolute inset-0 z-0 opacity-[0.03] pointer-events-none" 
        style={{ backgroundImage: 'radial-gradient(#081326 1px, transparent 1px)', backgroundSize: '32px 32px' }} />

      {/* Left: Intake Wizard */}
      <div className="relative z-10 flex-1 overflow-hidden">
        <WizardPanel session={session} onAnswer={handleAnswer} />
      </div>

      {/* Right: JD Preview */}
      <div className="relative z-10 w-[460px] shrink-0 overflow-hidden">
        <JDPreviewPanel session={session} />
      </div>

      {/* Floating Chat Interface */}
      <div className="fixed bottom-8 right-[490px] z-50">
        <div className="flex h-[620px] w-[400px] flex-col overflow-hidden border-2 border-aareon-headline bg-white/90 backdrop-blur-xl shadow-[12px_12px_0px_0px_rgba(8,19,38,0.1)]">
          {/* Chat header */}
          <div className="flex h-12 shrink-0 items-center justify-between border-b-2 border-aareon-headline bg-aareon-headline px-4">
            <div className="flex items-center gap-3">
              <div className="h-2 w-2 rounded-full bg-aareon-bright animate-pulse" />
              <span className="font-mono text-[10px] font-bold uppercase tracking-[0.3em] text-white">
                Aareon AI / Recruiter
              </span>
            </div>
            <div className="font-mono text-[9px] text-white/40 uppercase tracking-widest">
              ID: AG-9000
            </div>
          </div>

          <div className="min-h-0 flex-1 relative overflow-hidden">
            <CopilotChat
              className="absolute inset-0 h-full w-full"
              instructions={`You are the Aareon Recruiter Intake Agent — a professional, concise AI assistant that helps hiring managers create perfect Job Descriptions.

WORKFLOW:
1. When the manager mentions a job title, call startIntake({ jobTitle }) immediately.
2. Ask exactly 8 intake questions, ONE at a time, using presentOptions for each.
3. After EVERY answer, call updateJD with a progressively richer markdown JD that incorporates all answers so far.
4. After question 8 is answered, call generateHiringKit with a full hiring kit.

THE 8 QUESTIONS (ask in order):
Q1: Team size — How large is the immediate team this person will join?
Q2: Seniority — What experience level are you looking for?
Q3: Work model — Office, hybrid, or fully remote?
Q4: Core skills — What are the 3 must-have technical skills?
Q5: Soft skills — Which interpersonal trait matters most?
Q6: Reporting line — Who does this role report to?
Q7: Success metric — How will you measure success at 90 days?
Q8: Comp range — What is the salary range for this role?

RULES:
- Always use presentOptions with 4 clear choices per question. Pass options as a JSON string.
- Keep your chat messages brief — one sentence max before/after presenting options.
- After all 8 answers: generate a complete JD AND hiring kit.`}
              labels={{
                title: "Hiring Intake",
                initial:
                  "Hi! I'm your Aareon Recruiter Agent. What role are we hiring for today?",
              }}
            />
          </div>
        </div>
      </div>

      {/* Corporate Identity Overlay */}
      <div className="fixed left-8 top-8 z-20">
        <div className="flex items-center gap-4">
          <div className="flex h-12 w-12 items-center justify-center bg-aareon-headline text-white font-black text-2xl italic border-b-4 border-r-4 border-aareon-bright">
            A
          </div>
          <div className="space-y-0">
            <h1 className="font-title text-2xl italic text-aareon-headline tracking-tighter leading-none">
              Recruiter Intake
            </h1>
            <p className="font-mono text-[9px] uppercase tracking-[0.5em] text-aareon-bright font-bold">
              Powered by Aareon AI
            </p>
          </div>
        </div>
      </div>
    </main>
  );
}
