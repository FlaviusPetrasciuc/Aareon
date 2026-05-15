"use client";

import { useCopilotAction, useCopilotReadable } from "@copilotkit/react-core";
import { OptionCard } from "./OptionCard";
import { IntakeSession } from "@/types/intake";
import { motion } from "framer-motion";

interface WizardPanelProps {
  session: IntakeSession | null;
  onAnswer: (questionId: string, question: string, answer: string) => void;
}

interface OptionItem {
  id: string;
  title: string;
  description: string;
}

export function WizardPanel({ session, onAnswer }: WizardPanelProps) {
  // Make session state readable to CopilotKit
  useCopilotReadable({
    description: "The current hiring manager intake session state, including answers so far.",
    value: session,
  });

  // Action for Copilot to present choices — uses a JSON string for the options
  // to avoid CopilotKit's "object[]" type validation issues.
  useCopilotAction({
    name: "presentOptions",
    description:
      "Present a multiple-choice question with selectable option cards to the hiring manager.",
    parameters: [
      {
        name: "questionId",
        type: "string",
        description: "A short unique identifier for this question, e.g. 'q1_team_size'.",
        required: true,
      },
      {
        name: "question",
        type: "string",
        description: "The full text of the question being asked.",
        required: true,
      },
      {
        name: "optionsJson",
        type: "string",
        description:
          'A JSON array string of option objects. Each object must have: "id" (string), "title" (string), "description" (string). Example: [{"id":"a","title":"Small team","description":"1-5 people"}]',
        required: true,
      },
    ],
    handler: () => {},
    render: (props) => {
      const { question, optionsJson, questionId } = props.args;

      let options: OptionItem[] = [];
      try {
        options = JSON.parse(optionsJson ?? "[]");
      } catch {
        options = [];
      }

      return (
        <div className="flex flex-col gap-6 py-6">
          <div className="space-y-1">
            <span className="text-xs font-bold uppercase tracking-widest text-aareon-bright">
              Question {(session?.answers?.length ?? 0) + 1} of 8
            </span>
            <h2 className="font-title text-2xl text-aareon-headline leading-tight">
              {question}
            </h2>
          </div>

          <div className="grid gap-3 sm:grid-cols-2">
            {options.map((opt) => (
              <OptionCard
                key={opt.id}
                title={opt.title}
                description={opt.description}
                onClick={() => onAnswer(questionId, question, opt.title)}
              />
            ))}
          </div>
        </div>
      );
    },
  });

  // ── Empty state ─────────────────────────────────────────────────────────────
  if (!session) {
    return (
      <div className="flex h-full items-center justify-center p-12 text-center">
        <div className="max-w-md space-y-6">
          {/* Aareon logo mark */}
          <div className="mx-auto flex h-16 w-16 items-center justify-center bg-aareon-blue text-white font-black text-3xl italic">
            A
          </div>
          <h1 className="font-title text-4xl text-aareon-headline leading-tight">
            Ready to find your next star?
          </h1>
          <p className="text-lg text-aareon-body/70">
            Tell the Recruiter Agent the job title below to begin your structured intake interview.
          </p>
          <div className="mt-4 border border-aareon-stone bg-aareon-stone/20 p-4 text-left text-sm text-aareon-body/60 font-mono">
            <span className="text-aareon-bright">→</span> Type:{" "}
            <em className="text-aareon-headline">
              &ldquo;Let&rsquo;s hire a [Job Title]&rdquo;
            </em>
          </div>
        </div>
      </div>
    );
  }

  // ── Active session ───────────────────────────────────────────────────────────
  const progress = Math.min((session.answers.length / 8) * 100, 100);

  return (
    <div className="h-full overflow-y-auto px-8 pb-28 pt-12">
      <div className="mx-auto max-w-3xl space-y-10">
        {/* Header */}
        <div className="space-y-1">
          <p className="text-xs font-bold uppercase tracking-widest text-aareon-bright font-mono">
            Intake — {session.jobTitle}
          </p>
          <div className="h-1 w-full overflow-hidden bg-aareon-stone">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${progress}%` }}
              transition={{ duration: 0.4, ease: "easeOut" }}
              className="h-full bg-aareon-blue"
            />
          </div>
          <p className="text-right text-xs text-aareon-body/50 font-mono">
            {session.answers.length}/8 answered
          </p>
        </div>

        {/* Answer history */}
        {session.answers.length > 0 && (
          <div className="space-y-6 opacity-50 transition-opacity duration-300 hover:opacity-100">
            <p className="text-xs font-bold uppercase tracking-widest text-aareon-body/50">
              Answers so far
            </p>
            {session.answers.map((ans, idx) => (
              <div
                key={idx}
                className="border-l-2 border-aareon-bright pl-5 space-y-0.5"
              >
                <p className="text-xs text-aareon-body/60 font-mono">{ans.question}</p>
                <p className="font-title text-lg text-aareon-headline">{ans.answer}</p>
              </div>
            ))}
          </div>
        )}

        {/* CopilotKit renders the current question card inline here */}
        <div id="copilot-render-area" />

        {session.answers.length >= 8 && (
          <div className="border border-aareon-blue bg-aareon-blue/10 p-6 text-center space-y-2">
            <p className="font-title text-xl text-aareon-headline">
              All questions answered ✓
            </p>
            <p className="text-sm text-aareon-body/70">
              The agent is generating your Job Description and Hiring Kit now.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
