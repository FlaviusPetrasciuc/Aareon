"use client";

import { useState } from "react";
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
  const [isSubmitting, setIsSubmitting] = useState(false);

  useCopilotReadable({
    description:
      "The current hiring manager intake session state, including answers so far.",
    value: session,
  });

  const submitIntake = async () => {
    if (!session) return;

    setIsSubmitting(true);

    try {
      const res = await fetch("/api/submit-intake", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          managerEmail: session.managerEmail,
          jobTitle: session.jobTitle,
          answers: session.answers,
        }),
      });

      if (!res.ok) {
        alert("Something went wrong while submitting.");
        return;
      }

      alert("Submitted successfully. Confirmation emails were sent.");
    } catch (error) {
      console.error(error);
      alert("Failed to submit intake.");
    } finally {
      setIsSubmitting(false);
    }
  };

  useCopilotAction({
    name: "presentOptions",
    description:
      "Present a multiple-choice question with selectable option cards to the hiring manager.",
    parameters: [
      {
        name: "questionId",
        type: "string",
        description:
          "A short unique identifier for this question, e.g. 'q1_team_size'.",
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
          'A JSON array string of option objects. Each object must have: "id", "title", "description".',
        required: true,
      },
    ],
    handler: () => {},
    render: (props) => {
      const question = props.args.question ?? "";
      const questionId = props.args.questionId ?? "question";
      const optionsJson = props.args.optionsJson ?? "[]";

      let options: OptionItem[] = [];

      try {
        options = JSON.parse(optionsJson);
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

  if (!session) {
    return (
      <div className="flex h-full items-center justify-center p-12 text-center">
        <div className="max-w-md space-y-6">
          <div className="mx-auto flex h-16 w-16 items-center justify-center bg-aareon-blue text-white font-black text-3xl italic">
            A
          </div>

          <h1 className="font-title text-4xl text-aareon-headline leading-tight">
            Ready to find your next star?
          </h1>

          <p className="text-lg text-aareon-body/70">
            Tell the Recruiter Agent the job title below to begin your structured
            intake interview.
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

  const progress = Math.min((session.answers.length / 8) * 100, 100);

  return (
    <div className="h-full overflow-y-auto px-8 pb-28 pt-12">
      <div className="mx-auto max-w-3xl space-y-10">
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
                <p className="text-xs text-aareon-body/60 font-mono">
                  {ans.question}
                </p>

                <p className="font-title text-lg text-aareon-headline">
                  {ans.answer}
                </p>
              </div>
            ))}
          </div>
        )}

        <div id="copilot-render-area" />

        {session.answers.length >= 8 && (
          <div className="border border-aareon-blue bg-aareon-blue/10 p-6 text-center space-y-4">
            <p className="font-title text-xl text-aareon-headline">
              All questions answered ✓
            </p>

            <p className="text-sm text-aareon-body/70">
              Click submit to send the confirmation email and PDF to the manager
              and recruiter.
            </p>

            <button
              onClick={submitIntake}
              disabled={isSubmitting}
              className="bg-aareon-blue text-white px-6 py-3 font-bold disabled:opacity-50"
            >
              {isSubmitting ? "Submitting..." : "Submit intake"}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
