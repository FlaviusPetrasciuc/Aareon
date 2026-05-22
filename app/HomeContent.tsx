"use client";

import { useState, useRef, useEffect } from "react";
import { useFrontendTool, useCopilotReadable } from "@copilotkit/react-core";
import { CopilotChat } from "@copilotkit/react-ui";
import { WizardPanel } from "@/components/WizardPanel";
import { JDPreviewPanel } from "@/components/JDPreviewPanel";
import { IntakeSession, QuestionState } from "@/types/intake";
import {
  getSession,
  createSession,
  appendAnswer,
  updateJD,
  updateHiringKit,
} from "@/lib/session";

export function HomeContent() {
  const [session, setSession] = useState<IntakeSession | null>(null);
  const [currentQuestion, setCurrentQuestion] = useState<QuestionState | null>(null);
  const questionResolveRef = useRef<((answer: string) => void) | null>(null);

  useEffect(() => {
    const saved = getSession();
    if (saved) setSession(saved);
  }, []);

  useCopilotReadable({
    description: "Current hiring manager intake session including all answers so far.",
    value: session,
  });

  // ── Agent tools ─────────────────────────────────────────────────────────────

  useFrontendTool({
    name: "startIntake",
    description:
      "Start a new recruiter intake session for a specific job title. Call as soon as the hiring manager provides the role.",
    parameters: [
      {
        name: "jobTitle",
        type: "string",
        description: "The exact job title, e.g. 'Senior Backend Engineer'.",
        required: true,
      },
    ],
    handler: async ({ jobTitle }: { jobTitle: string }) => {
      setSession(createSession(jobTitle));
    },
  });

  useFrontendTool({
    name: "updateJD",
    description:
      "Update the live Job Description draft. Call after every answered question to progressively build the JD in markdown.",
    parameters: [
      {
        name: "content",
        type: "string",
        description: "Full markdown JD so far. Use headings, bullets, bold text.",
        required: true,
      },
    ],
    handler: async ({ content }: { content: string }) => {
      setSession((prev) => (prev ? updateJD(prev, content) : null));
    },
  });

  useFrontendTool({
    name: "generateHiringKit",
    description:
      "Generate the complete Hiring Kit once all 8 questions are answered.",
    parameters: [
      {
        name: "content",
        type: "string",
        description:
          "Full markdown Hiring Kit: interview questions with scoring rubrics, culture checks, 30-60-90 day onboarding outline.",
        required: true,
      },
    ],
    handler: async ({ content }: { content: string }) => {
      setSession((prev) => (prev ? updateHiringKit(prev, content) : null));
    },
  });

  useFrontendTool({
    name: "presentOptions",
    description:
      "Present a multiple-choice question to the hiring manager. Returns the selected answer.",
    parameters: [
      {
        name: "questionId",
        type: "string",
        description: "Short unique identifier, e.g. 'q1_team_size'.",
        required: true,
      },
      {
        name: "question",
        type: "string",
        description: "The full text of the question.",
        required: true,
      },
      {
        name: "optionsJson",
        type: "string",
        description:
          'JSON array of 4 options: [{"id":"a","title":"Small","description":"1-5 people"}]',
        required: true,
      },
    ],
    handler: async ({
      questionId,
      question,
      optionsJson,
    }: {
      questionId: string;
      question: string;
      optionsJson: string;
    }) => {
      const options = JSON.parse(optionsJson);
      setCurrentQuestion({ questionId, question, options });

      const selectedAnswer = await new Promise<string>((resolve) => {
        questionResolveRef.current = resolve;
      });

      setCurrentQuestion(null);
      return { selectedAnswer };
    },
  });

  // ── Answer handler ──────────────────────────────────────────────────────────

  const handleAnswer = (questionId: string, question: string, answer: string) => {
    if (!session) return;
    setSession(appendAnswer(session, { questionId, question, answer }));
    questionResolveRef.current?.(answer);
    questionResolveRef.current = null;
  };

  // ── Render ──────────────────────────────────────────────────────────────────

  return (
    <main className="relative flex h-screen w-full overflow-hidden bg-aareon-sand">
      <div
        className="absolute inset-0 z-0 opacity-[0.03] pointer-events-none"
        style={{
          backgroundImage: "radial-gradient(#081326 1px, transparent 1px)",
          backgroundSize: "32px 32px",
        }}
      />

      <div className="relative z-10 flex-1 overflow-hidden">
        <WizardPanel
          session={session}
          currentQuestion={currentQuestion}
          onAnswer={handleAnswer}
        />
      </div>

      <div className="relative z-10 w-[460px] shrink-0 overflow-hidden">
        <JDPreviewPanel session={session} />
      </div>

      <div className="fixed bottom-8 right-[490px] z-50">
        <div className="flex h-[620px] w-[400px] flex-col overflow-hidden border-2 border-aareon-headline bg-white/90 backdrop-blur-xl shadow-[12px_12px_0px_0px_rgba(8,19,38,0.1)]">
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
2. Ask exactly 8 intake questions, ONE at a time, by calling presentOptions for each. Do NOT ask questions in plain text — always use presentOptions.
3. After EVERY answer returned by presentOptions, call updateJD with a progressively richer markdown JD incorporating all answers so far.
4. After question 8 is answered, call generateHiringKit with the full hiring kit.

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
- Always call presentOptions with exactly 4 choices per question. Pass options as a JSON string.
- Keep your chat messages brief — one sentence max before calling presentOptions.
- The user's selection is returned to you as { selectedAnswer }. Use it to build the JD.
- After all 8 answers: call generateHiringKit with a complete hiring kit.`}
              labels={{
                title: "Hiring Intake",
                initial:
                  "Hi! I'm your Aareon Recruiter Agent. What role are we hiring for today?",
              }}
            />
          </div>
        </div>
      </div>

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
