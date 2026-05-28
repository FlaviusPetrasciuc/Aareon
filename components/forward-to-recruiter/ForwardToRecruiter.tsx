"use client";

import { useState } from "react";
import { IntakeSession } from "@/types/intake";

const RECRUITER_EMAIL = "bram.feij@aareon.com";

interface ForwardToRecruiterProps {
  session: IntakeSession;
  onBack?: () => void;
  onSubmitted?: () => void;
}

export function ForwardToRecruiter({
  session,
  onBack,
  onSubmitted,
}: ForwardToRecruiterProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isDone, setIsDone] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const managerEmail = session.managerEmail ?? "manager@aareon.nl";
  const slug = session.jobTitle.replace(/\s+/g, "-").toLowerCase();

  const handleSubmit = async () => {
    setIsSubmitting(true);
    setError(null);

    try {
      const res = await fetch("/api/submit-intake", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          managerEmail: session.managerEmail,
          jobTitle: session.jobTitle,
          answers: session.answers,
          jd: session.jd,
          hiringKit: session.hiringKit,
        }),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error ?? "Something went wrong");
      }

      setIsDone(true);
      onSubmitted?.();
    } catch (err: any) {
      setError(err.message ?? "Failed to submit");
    } finally {
      setIsSubmitting(false);
    }
  };

  // ── Success state ───────────────────────────────────────────────────────────
  if (isDone) {
    return (
      <div className="flex flex-col items-center justify-center gap-8 py-24 text-center">
        <div className="flex h-16 w-16 items-center justify-center rounded-full bg-[#16a34a]">
          <svg className="h-8 w-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
          </svg>
        </div>
        <div className="space-y-2">
          <h3 className="font-title text-3xl text-[#172033]">
            Successfully sent
          </h3>
          <p className="text-[15px] text-gray-500 max-w-sm">
            Both emails have been sent. The recruiter will be in touch shortly.
          </p>
        </div>
        <div className="w-full max-w-sm rounded-xl border border-[#d6d3d1] bg-[#f3f2ef] divide-y divide-[#d6d3d1]">
          <div className="flex items-center justify-between px-5 py-3">
            <span className="text-sm text-gray-500">Manager</span>
            <span className="text-sm font-medium text-[#172033]">{managerEmail}</span>
          </div>
          <div className="flex items-center justify-between px-5 py-3">
            <span className="text-sm text-gray-500">Recruiter</span>
            <span className="text-sm font-medium text-[#172033]">{RECRUITER_EMAIL}</span>
          </div>
        </div>
      </div>
    );
  }

  // ── Main step 4 ─────────────────────────────────────────────────────────────
  return (
    <div className="space-y-8">

      {/* ── Ready to publish banner ── */}
      <div className="flex items-start gap-4 rounded-xl border border-[#bbf7d0] bg-[#f0fdf4] p-5">
        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[#16a34a]">
          <svg className="h-5 w-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
          </svg>
        </div>
        <div>
          <p className="text-[15px] font-semibold text-[#15803d]">
            Ready to forward
          </p>
          <p className="mt-0.5 text-sm text-[#16a34a]/80">
            All {session.answers.length} questions answered. Submitting will send both emails automatically.
          </p>
        </div>
      </div>

      {/* ── Email cards ── */}
      <div className="space-y-5">
        <p className="text-[13px] font-semibold uppercase tracking-widest text-gray-400">
          Emails sent on submit
        </p>

        {/* Email 1 — Manager confirmation */}
        <div className="rounded-xl border border-[#d6d3d1] bg-white overflow-hidden">
          {/* Card header */}
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
                  To: <span className="text-[#172033] font-medium">{managerEmail}</span>
                </p>
              </div>
            </div>
            <span className="rounded-full border border-[#bbf7d0] bg-[#f0fdf4] px-3 py-1 text-[11px] font-semibold text-[#15803d]">
              1 attachment
            </span>
          </div>

          {/* Card body */}
          <div className="px-5 py-4 space-y-4">
            {/* Message preview */}
            <div className="rounded-xl border border-[#d6d3d1] bg-[#f3f2ef] px-4 py-3 space-y-1">
              <p className="text-[13px] font-semibold text-[#172033]">
                Your requisition has been submitted: {session.jobTitle}
              </p>
              <p className="text-[13px] text-gray-500 leading-relaxed">
                Your job requisition has been successfully submitted to Bram Feij.
                Attached is your personal copy of the full vacancy text for your own records.
              </p>
            </div>

            {/* Attachment */}
            <AttachmentPill name={`${slug}-vacancy.pdf`} description="Full AI-generated vacancy text" />
          </div>
        </div>

        {/* Email 2 — Recruiter action packet */}
        <div className="rounded-xl border border-[#d6d3d1] bg-white overflow-hidden">
          {/* Card header */}
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
                  To: <span className="text-[#172033] font-medium">{RECRUITER_EMAIL}</span>
                  <span className="ml-2 text-gray-300">— fixed recipient</span>
                </p>
              </div>
            </div>
            <span className="rounded-full border border-[#fecaca] bg-[#fef2f2] px-3 py-1 text-[11px] font-semibold text-[#ef4444]">
              2 attachments
            </span>
          </div>

          {/* Card body */}
          <div className="px-5 py-4 space-y-4">
            {/* Message preview */}
            <div className="rounded-xl border border-[#d6d3d1] bg-[#f3f2ef] px-4 py-3 space-y-1">
              <p className="text-[13px] font-semibold text-[#172033]">
                New requisition ready for review — {session.jobTitle}
              </p>
              <p className="text-[13px] text-gray-500 leading-relaxed">
                {managerEmail} has submitted a new job requisition for your review.
                Everything you need is attached so you can get started directly from your inbox.
              </p>
            </div>

            {/* Answers summary */}
            {session.answers.length > 0 && (
              <div className="rounded-xl border border-[#d6d3d1] overflow-hidden">
                <div className="border-b border-[#d6d3d1] bg-[#f3f2ef] px-4 py-2">
                  <p className="text-[11px] font-semibold uppercase tracking-widest text-gray-400">
                    Intake answers included
                  </p>
                </div>
                <div className="divide-y divide-[#f3f2ef]">
                  {session.answers.map((a, i) => (
                    <div key={i} className="flex gap-4 px-4 py-2.5">
                      <span className="shrink-0 text-[12px] text-gray-400 w-4">{i + 1}.</span>
                      <span className="text-[12px] text-gray-500 flex-1">{a.question}</span>
                      <span className="text-[12px] font-semibold text-[#172033] text-right">{a.answer}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Attachments */}
            <div className="space-y-2">
              <AttachmentPill name={`${slug}-vacancy.pdf`} description="Brand-aligned vacancy text (7-step format)" />
              <AttachmentPill name={`${slug}-screening-guide.pdf`} description="Must / Should / Could / Don't screening guide" />
            </div>
          </div>
        </div>
      </div>

      {/* ── Error ── */}
      {error && (
        <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3">
          <p className="text-sm font-medium text-red-600">{error}</p>
        </div>
      )}

      {/* ── Footer buttons ── */}
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
            className="h-12 rounded-xl bg-[#172033] px-8 text-[15px] font-semibold text-white transition hover:bg-[#0f1623] disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isSubmitting ? "Sending..." : "Forward to recruiter"}
          </button>
        </div>
      </div>

    </div>
  );
}

// ── Attachment pill ─────────────────────────────────────────────────────────
function AttachmentPill({ name, description }: { name: string; description: string }) {
  return (
    <div className="flex items-center gap-3 rounded-xl border border-[#d6d3d1] bg-white px-4 py-3">
      <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border border-[#d6d3d1] bg-[#f3f2ef]">
        <svg className="h-4 w-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m2.25 0H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" />
        </svg>
      </div>
      <div>
        <p className="text-[13px] font-semibold text-[#172033]">{name}</p>
        <p className="text-[12px] text-gray-400">{description}</p>
      </div>
    </div>
  );
}
