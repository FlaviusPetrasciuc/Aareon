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

export default function IntakePage() {
  const [session, setSession] = useState<IntakeSession | null>(null);
  const [managerEmail, setManagerEmail] = useState("");

  const { appendMessage } = useCopilotChat();

  useEffect(() => {
  const savedEmail = localStorage.getItem("managerEmail");

  const normalizedEmail = savedEmail?.trim().toLowerCase();

  const isAllowedEmail =
    normalizedEmail?.endsWith("@aareon.nl") ||
    normalizedEmail?.endsWith("@gmail.com");

  if (!normalizedEmail || !isAllowedEmail) {
    window.location.href = "/";
    return;
  }

  setManagerEmail(normalizedEmail);

  const saved = getSession();

  if (saved) {
    setSession(saved);
  }
}, []);

  useCopilotAction({
    name: "startIntake",
    description:
      "Start a new recruiter intake interview session for a specific job title.",

    parameters: [
      {
        name: "jobTitle",
        type: "string",
        description: "The job title being hired for.",
        required: true,
      },
    ],

    handler: ({ jobTitle }) => {
    const savedEmail = localStorage.getItem("managerEmail");

    if (!savedEmail) {
        window.location.href = "/";
        return;
    }

    const newSession = createSession(jobTitle, savedEmail);
    setSession(newSession);
},
  });

  useCopilotAction({
    name: "updateJD",

    description:
      "Update the live Job Description draft in the preview panel.",

    parameters: [
      {
        name: "content",
        type: "string",
        description: "Markdown content of the Job Description.",
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
      "Generate and display the complete Hiring Kit once all questions are answered.",

    parameters: [
      {
        name: "content",
        type: "string",
        description: "Full markdown Hiring Kit.",
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

  const handleAnswer = (
    questionId: string,
    question: string,
    answer: string
  ) => {
    if (!session) return;

    const updated = appendAnswer(session, {
      questionId,
      question,
      answer,
    });

    setSession(updated);

    appendMessage(
      new TextMessage({
        role: MessageRole.User,
        content: `I select: ${answer}`,
      })
    );
  };

  return (
    <main className="relative flex h-screen w-full overflow-hidden bg-aareon-sand">

      <div
        className="absolute inset-0 z-0 opacity-[0.03] pointer-events-none"
        style={{
          backgroundImage:
            "radial-gradient(#081326 1px, transparent 1px)",
          backgroundSize: "32px 32px",
        }}
      />

      {/* Left */}
      <div className="relative z-10 flex-1 overflow-hidden">
        <WizardPanel
          session={session}
          onAnswer={handleAnswer}
        />
      </div>

      {/* Right */}
      <div className="relative z-10 w-[460px] shrink-0 overflow-hidden">
        <JDPreviewPanel session={session} />
      </div>

      {/* Chat */}
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

              instructions={`
You are the Aareon Recruiter Intake Agent.

WORKFLOW:
1. Ask for the role.
2. Call startIntake({ jobTitle }).
3. Ask exactly 8 intake questions.
4. After every answer call updateJD.
5. After question 8 call generateHiringKit.

QUESTIONS:
1. Team size
2. Seniority
3. Work model
4. Core skills
5. Soft skills
6. Reporting line
7. Success metric
8. Salary range

RULES:
- Use presentOptions.
- One question at a time.
- Keep responses concise.
`}

              labels={{
                title: "Hiring Intake",

                initial:
                  "Hi! I'm your Aareon Recruiter Agent. What role are we hiring for today?",
              }}
            />
          </div>
        </div>
      </div>

      {/* Logo */}
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