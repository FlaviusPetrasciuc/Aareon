"use client";

import { useState, useId } from "react";
import { useCopilotAction, useCopilotReadable, useCopilotAdditionalInstructions } from "@copilotkit/react-core";
import OptionCard from "./OptionCard";
import type { IntakeSession, Answer, WizardQuestion } from "@/types/intake";
import { appendAnswer, updateJD, updateHiringKit } from "@/lib/session";

const SYSTEM_PROMPT = `
You are Aareon, an AI that conducts recruiter intake interviews to gather requirements for a job description.

Rules:
- Ask exactly one question per turn using the "generateQuestion" action.
- Each question must include 3–5 concise answer options and a "hint" string as a placeholder for the custom text field.
- Infer good options from the job title and previous answers.
- After 5–8 questions (use judgment based on completeness), call "generateJD" with the full job description.
- After generateJD completes, call "generateHiringKit" with a hiring kit summary.
- JD format: role summary paragraph, responsibilities (bullet list), requirements (bullet list), nice-to-haves (bullet list).
- Hiring Kit format: culture fit signals (3 bullet points), suggested interview stages (3–4 stages), compensation band placeholder.
- Do not ask unnecessary questions once you have enough information.
`.trim();

interface WizardPanelProps {
  session: IntakeSession;
  onSessionUpdate: (session: IntakeSession) => void;
  onJDUpdate: (jd: string) => void;
  onHiringKitUpdate: (kit: string) => void;
  progress: number;
}

export default function WizardPanel({
  session,
  onSessionUpdate,
  onJDUpdate,
  onHiringKitUpdate,
}: WizardPanelProps) {
  const [customText, setCustomText] = useState("");
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const customInputId = useId();

  useCopilotAdditionalInstructions({
    instructions: SYSTEM_PROMPT,
  });

  useCopilotReadable({
    description: "Current intake session including job title and all answers so far",
    value: { jobTitle: session.jobTitle, answers: session.answers },
  });

  useCopilotAction({
    name: "generateQuestion",
    description: "Ask the recruiter one intake question with selectable options",
    parameters: [
      { name: "question", type: "string", description: "The question text" },
      { name: "options", type: "string[]", description: "3–5 answer options" },
      { name: "hint", type: "string", description: "Placeholder text for the custom text field" },
    ],
    render: (renderProps) => {
      const { status } = renderProps;
      const args = renderProps.args as Partial<WizardQuestion>;
      if (status === "inProgress" || !args.question) return <></>;
      const { question, options = [], hint = "Type your own answer..." } = args as WizardQuestion;

      const handleSubmit = (answer: string) => {
        if (!answer.trim()) return;
        const a: Answer = {
          questionId: `q${session.answers.length + 1}`,
          question,
          answer,
        };
        const updated = appendAnswer(session, a);
        onSessionUpdate(updated);
        setSelectedOption(null);
        setCustomText("");
      };

      return (
        <div className="flex flex-col gap-3">
          <div className="bg-aareon-bright text-white rounded-xl rounded-bl-sm px-4 py-3 text-sm leading-relaxed max-w-[85%]">
            {question}
          </div>

          <div className="flex flex-col gap-2">
            {options.map((opt) => (
              <OptionCard
                key={opt}
                text={opt}
                selected={selectedOption === opt}
                onSelect={() => {
                  setSelectedOption(opt);
                  handleSubmit(opt);
                }}
              />
            ))}
          </div>

          <div className="border-t border-dashed border-aareon-stone pt-3">
            <label htmlFor={customInputId} className="block text-[10px] uppercase tracking-widest text-gray-400 mb-1">
              Or describe it your way
            </label>
            <div className="flex gap-2">
              <input
                id={customInputId}
                type="text"
                value={customText}
                onChange={(e) => setCustomText(e.target.value)}
                placeholder={hint}
                onKeyDown={(e) => { if (e.key === "Enter") handleSubmit(customText); }}
                className="flex-1 text-sm px-3 py-2 rounded-lg border border-aareon-stone focus:outline-none focus:border-aareon-bright"
              />
              <button
                type="button"
                onClick={() => handleSubmit(customText)}
                className="bg-aareon-bright text-white px-3 py-2 rounded-lg text-sm hover:opacity-90"
              >
                &rarr;
              </button>
            </div>
          </div>
        </div>
      );
    },
  });

  useCopilotAction({
    name: "generateJD",
    description: "Generate and stream the full job description",
    parameters: [
      { name: "jobDescription", type: "string", description: "The complete job description in Markdown" },
    ],
    handler: async ({ jobDescription }: { jobDescription: string }) => {
      const updated = updateJD(session, jobDescription);
      onSessionUpdate(updated);
      onJDUpdate(jobDescription);
    },
    render: "Generating job description…",
  });

  useCopilotAction({
    name: "generateHiringKit",
    description: "Generate the hiring kit summary",
    parameters: [
      { name: "hiringKit", type: "string", description: "The hiring kit in Markdown" },
    ],
    handler: async ({ hiringKit }: { hiringKit: string }) => {
      const updated = updateHiringKit(session, hiringKit);
      onSessionUpdate(updated);
      onHiringKitUpdate(hiringKit);
    },
    render: "Generating hiring kit…",
  });

  return (
    <div className="flex flex-col h-full p-5 overflow-y-auto">
      <div className="flex items-center justify-between mb-4">
        <p className="text-xs font-bold text-aareon-blue uppercase tracking-widest">
          Intake Interview
        </p>
        <p className="text-xs text-gray-400">{session.jobTitle}</p>
      </div>

      {session.answers.length > 0 && (
        <div className="mt-auto pt-4 border-t border-aareon-stone">
          <p className="text-[10px] text-gray-400">
            {session.answers.map((a) => `✓ ${a.answer}`).join(" · ")}
          </p>
        </div>
      )}
    </div>
  );
}
