"use client";

import { useMemo, useState } from "react";
import { IntakeSession } from "@/types/intake";

const RECRUITER_EMAIL = "bram.feij@aareon.com";

interface ForwardToRecruiterProps {
  session: IntakeSession;
  jobDescription: string;
  onBack?: () => void;
  onSubmitted?: () => void;
}

export function ForwardToRecruiter({
  session,
  jobDescription,
  onBack,
}: ForwardToRecruiterProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isDone, setIsDone] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const managerEmail = session.managerEmail ?? "manager@aareon.nl";
  const slug = session.jobTitle.replace(/\s+/g, "-").toLowerCase();

  const hasApprovalPdf = useMemo(() => {
    if (typeof window === "undefined") return false;

    return Boolean(
      localStorage.getItem("approvalPdf") ||
        localStorage.getItem("aareonApprovalPdf")
    );
  }, []);

  const attachmentCount = hasApprovalPdf ? 2 : 1;

  const handleSubmit = async () => {
    setIsSubmitting(true);
    setError(null);

    try {
      const savedJobDescription =
        jobDescription || localStorage.getItem("jobDescriptionText") || "";

      const savedApprovalPdf =
        localStorage.getItem("approvalPdf") ||
        localStorage.getItem("aareonApprovalPdf");

      const approvalPdf = savedApprovalPdf
        ? JSON.parse(savedApprovalPdf)
        : undefined;

      const res = await fetch("/api/submit-intake", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          managerEmail: session.managerEmail,
          jobTitle: session.jobTitle,
          answers: session.answers,
          jobDescription: savedJobDescription,
          approvalPdf,
        }),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error ?? "Something went wrong");
      }

      setIsDone(true);
    } catch (err: any) {
      setError(err.message ?? "Failed to submit");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isDone) {
    return (
      <div className="flex flex-col items-center justify-center gap-8 py-24 text-center">
        <div className="flex h-16 w-16 items-center justify-center rounded-full bg-[#16a34a]">
          <svg
            className="h-8 w-8 text-white"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2.5}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M5 13l4 4L19 7"
            />
          </svg>
        </div>

        <div className="space-y-2">
          <h3 className="font-title text-3xl text-[#172033]">
            Successfully sent
          </h3>

          <p className="max-w-sm text-[15px] text-gray-500">
            Both emails have been sent. The recruiter will be in touch shortly.
          </p>
        </div>

        <div className="w-full max-w-sm divide-y divide-[#d6d3d1] rounded-xl border border-[#d6d3d1] bg-[#f3f2ef]">
          <div className="flex items-center justify-between px-5 py-3">
            <span className="text-sm text-gray-500">Manager</span>
            <span className="text-sm font-medium text-[#172033]">
              {managerEmail}
            </span>
          </div>

          <div className="flex items-center justify-between px-5 py-3">
            <span className="text-sm text-gray-500">Recruiter</span>
            <span className="text-sm font-medium text-[#172033]">
              {RECRUITER_EMAIL}
            </span>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div className="flex items-start gap-4 rounded-xl border border-[#bbf7d0] bg-[#f0fdf4] p-5">
        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[#16a34a]">
          <svg
            className="h-5 w-5 text-white"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2.5}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M5 13l4 4L19 7"
            />
          </svg>
        </div>

        <div>
          <p className="text-[15px] font-semibold text-[#15803d]">
            Ready to forward
          </p>

          <p className="mt-0.5 text-sm text-[#16a34a]/80">
            Submitting will send both emails automatically to the hiring manager
            and the recruiter.
          </p>
        </div>
      </div>

      <div className="space-y-5">
        <p className="text-[13px] font-semibold uppercase tracking-widest text-gray-400">
          Emails sent on submit
        </p>

        <div className="overflow-hidden rounded-xl border border-[#d6d3d1] bg-white">
          <div className="flex items-center justify-between border-b border-[#d6d3d1] bg-[#f3f2ef] px-5 py-3">
            <div className="flex items-center gap-3">
              <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[#172033] text-sm font-bold text-white">
                {managerEmail[0].toUpperCase()}
              </div>

              <div>
                <p className="text-[13px] font-semibold text-[#172033]">
                  Confirmation to hiring manager
                </p>

                <p className="text-[12px] text-gray-400">
                  To:{" "}
                  <span className="font-medium text-[#172033]">
                    {managerEmail}
                  </span>
                </p>
              </div>
            </div>

            <span className="rounded-full border border-[#bbf7d0] bg-[#f0fdf4] px-3 py-1 text-[11px] font-semibold text-[#15803d]">
              {attachmentCount} attachment{attachmentCount === 1 ? "" : "s"}
            </span>
          </div>

          <div className="space-y-4 px-5 py-4">
            <div className="space-y-1 rounded-xl border border-[#d6d3d1] bg-[#f3f2ef] px-4 py-3">
              <p className="text-[13px] font-semibold text-[#172033]">
                Your requisition has been submitted: {session.jobTitle}
              </p>

              <p className="text-[13px] leading-relaxed text-gray-500">
                Your job requisition has been successfully submitted to Bram
                Feij. The intake PDF includes the questions, answers, and
                AI-generated job description.
              </p>
            </div>

            <AttachmentPill
              name={`intake-${slug}.pdf`}
              description="Questions, answers, and AI-generated job description"
            />

            {hasApprovalPdf && (
              <AttachmentPill
                name="approval.pdf"
                description="Approval document attached earlier"
              />
            )}
          </div>
        </div>

        <div className="overflow-hidden rounded-xl border border-[#d6d3d1] bg-white">
          <div className="flex items-center justify-between border-b border-[#d6d3d1] bg-[#f3f2ef] px-5 py-3">
            <div className="flex items-center gap-3">
              <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[#ef4444] text-sm font-bold text-white">
                B
              </div>

              <div>
                <p className="text-[13px] font-semibold text-[#172033]">
                  Action packet to recruiter
                </p>

                <p className="text-[12px] text-gray-400">
                  To:{" "}
                  <span className="font-medium text-[#172033]">
                    {RECRUITER_EMAIL}
                  </span>
                  <span className="ml-2 text-gray-300">— fixed recipient</span>
                </p>
              </div>
            </div>

            <span className="rounded-full border border-[#fecaca] bg-[#fef2f2] px-3 py-1 text-[11px] font-semibold text-[#ef4444]">
              {attachmentCount} attachment{attachmentCount === 1 ? "" : "s"}
            </span>
          </div>

          <div className="space-y-4 px-5 py-4">
            <div className="space-y-1 rounded-xl border border-[#d6d3d1] bg-[#f3f2ef] px-4 py-3">
              <p className="text-[13px] font-semibold text-[#172033]">
                New requisition ready for review — {session.jobTitle}
              </p>

              <p className="text-[13px] leading-relaxed text-gray-500">
                {managerEmail} has submitted a new job requisition for your
                review. Everything you need is attached so you can get started
                directly from your inbox.
              </p>
            </div>

            {session.answers.length > 0 && (
              <div className="overflow-hidden rounded-xl border border-[#d6d3d1]">
                <div className="border-b border-[#d6d3d1] bg-[#f3f2ef] px-4 py-2">
                  <p className="text-[11px] font-semibold uppercase tracking-widest text-gray-400">
                    Intake answers included
                  </p>
                </div>

                <div className="divide-y divide-[#f3f2ef]">
                  {session.answers.map((a, i) => (
                    <div key={i} className="flex gap-4 px-4 py-2.5">
                      <span className="w-4 shrink-0 text-[12px] text-gray-400">
                        {i + 1}.
                      </span>

                      <span className="flex-1 text-[12px] text-gray-500">
                        {a.question}
                      </span>

                      <span className="text-right text-[12px] font-semibold text-[#172033]">
                        {a.answer}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            <div className="space-y-2">
              <AttachmentPill
                name={`intake-${slug}.pdf`}
                description="Questions, answers, and AI-generated job description"
              />

              {hasApprovalPdf && (
                <AttachmentPill
                  name="approval.pdf"
                  description="Approval document attached earlier"
                />
              )}
            </div>
          </div>
        </div>
      </div>

      {error && (
        <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3">
          <p className="text-sm font-medium text-red-600">{error}</p>
        </div>
      )}

      <div className="flex items-center justify-between pt-2 pb-8">
        {onBack && (
          <button
            type="button"
            onClick={onBack}
            className="h-12 rounded-xl border border-[#d6d3d1] bg-white px-6 text-[15px] font-medium text-[#172033] transition hover:bg-[#f3f2ef]"
          >
            Back
          </button>
        )}

        <div className="ml-auto">
          <button
            type="button"
            onClick={handleSubmit}
            disabled={isSubmitting}
            className="h-12 rounded-xl bg-[#172033] px-8 text-[15px] font-semibold text-white transition hover:bg-[#0f1623] disabled:cursor-not-allowed disabled:opacity-50"
          >
            {isSubmitting ? "Sending..." : "Forward to recruiter"}
          </button>
        </div>
      </div>
    </div>
  );
}

function AttachmentPill({
  name,
  description,
}: {
  name: string;
  description: string;
}) {
  return (
    <div className="flex items-center gap-3 rounded-xl border border-[#d6d3d1] bg-white px-4 py-3">
      <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border border-[#d6d3d1] bg-[#f3f2ef]">
        <svg
          className="h-4 w-4 text-gray-400"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth={1.5}
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m2.25 0H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z"
          />
        </svg>
      </div>

      <div>
        <p className="text-[13px] font-semibold text-[#172033]">{name}</p>
        <p className="text-[12px] text-gray-400">{description}</p>
      </div>
    </div>
  );
}