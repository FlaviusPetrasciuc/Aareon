"use client";

import { useState } from "react";
import { IntakeSession } from "@/types/intake";

interface PublishPanelProps {
  session: IntakeSession;
  onSubmitted?: () => void;
}

const RECRUITER_EMAIL = "bran.feij@aareon.com";

export function PublishPanel({ session, onSubmitted }: PublishPanelProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isDone, setIsDone] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const slug = session.jobTitle.replace(/\s+/g, "-").toLowerCase();
  const managerEmail = session.managerEmail ?? "manager@aareon.nl";

  const handlePublish = async () => {
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

  // ── Success state ────────────────────────────────────────────────────────────
  if (isDone) {
    return (
      <div className="flex flex-col items-center justify-center gap-6 py-16 px-8 text-center">
        <div className="flex h-16 w-16 items-center justify-center border-2 border-aareon-blue bg-aareon-blue">
          <span className="font-mono text-xl font-bold text-white">OK</span>
        </div>
        <div className="space-y-2">
          <h3 className="font-title text-2xl italic text-aareon-headline">
            Submitted successfully
          </h3>
          <p className="text-sm text-aareon-body/70 max-w-sm">
            Confirmation emails have been sent to you and to the recruiter.
          </p>
        </div>
        <div className="w-full border border-aareon-stone bg-aareon-sand/40 p-4 text-left space-y-1">
          <EmailConfirmRow label="Manager" email={managerEmail} />
          <EmailConfirmRow label="Recruiter" email={RECRUITER_EMAIL} />
        </div>
      </div>
    );
  }

  // ── Main publish step ────────────────────────────────────────────────────────
  return (
    <div className="flex flex-col gap-6 py-6">

      {/* Header */}
      <div className="space-y-1">
        <span className="text-xs font-bold uppercase tracking-widest text-aareon-bright font-mono">
          Step 4 of 4
        </span>
        <h2 className="font-title text-2xl text-aareon-headline leading-tight">
          Ready to publish
        </h2>
        <p className="text-sm text-aareon-body/70">
          Review what will be sent before you submit.
        </p>
      </div>

      {/* Ready banner */}
      <div className="flex items-start gap-4 border-2 border-aareon-blue bg-aareon-blue/5 p-4">
        <div className="flex h-8 w-8 shrink-0 items-center justify-center bg-aareon-blue">
          <span className="font-mono text-xs font-bold text-white">OK</span>
        </div>
        <div>
          <p className="font-mono text-xs font-bold uppercase tracking-widest text-aareon-blue">
            All {session.answers.length} questions answered
          </p>
          <p className="mt-0.5 text-sm text-aareon-body/70">
            The role is ready. Submitting will send both emails automatically.
          </p>
        </div>
      </div>

      {/* Email delivery section */}
      <div className="border-2 border-aareon-headline">

        {/* Section header */}
        <div className="flex items-center gap-3 border-b-2 border-aareon-headline bg-aareon-headline px-4 py-3">
          <div className="h-2 w-2 bg-aareon-bright animate-pulse" />
          <span className="font-mono text-[10px] font-bold uppercase tracking-[0.3em] text-white">
            Automated delivery on submit
          </span>
          <span className="ml-auto font-mono text-[9px] uppercase tracking-widest text-white/40">
            2 emails
          </span>
        </div>

        {/* Email 1 — Manager */}
        <div className="border-b border-aareon-stone p-4 space-y-3">
          <div className="flex items-center justify-between">
            <span className="font-mono text-[9px] font-bold uppercase tracking-[0.2em] text-aareon-body/50">
              01 / Confirmation to hiring manager
            </span>
            <span className="border border-aareon-blue bg-aareon-blue/10 px-2 py-0.5 font-mono text-[9px] font-bold uppercase tracking-widest text-aareon-blue">
              1 attachment
            </span>
          </div>

          <div className="flex items-start gap-3">
            <div className="flex h-8 w-8 shrink-0 items-center justify-center bg-aareon-blue font-bold text-sm text-white">
              {managerEmail[0].toUpperCase()}
            </div>
            <div className="flex-1 min-w-0">
              <div className="font-mono text-[10px] text-aareon-body/50 mb-1">
                To: <span className="text-aareon-bright font-bold">{managerEmail}</span>
              </div>
              <div className="border border-aareon-stone bg-aareon-sand/50 p-3 text-sm text-aareon-body leading-relaxed">
                <p className="font-bold text-aareon-headline text-xs mb-1">
                  Your requisition has been submitted: {session.jobTitle}
                </p>
                <p className="text-xs text-aareon-body/70">
                  Your job requisition has been successfully submitted to Bram Feij.
                  Attached is your personal copy of the full vacancy text for your own records.
                </p>
              </div>
              <AttachmentPill name={`${slug}-vacancy.pdf`} description="Full AI-generated vacancy text" />
            </div>
          </div>
        </div>

        {/* Email 2 — Recruiter */}
        <div className="p-4 space-y-3">
          <div className="flex items-center justify-between">
            <span className="font-mono text-[9px] font-bold uppercase tracking-[0.2em] text-aareon-body/50">
              02 / Action packet to recruiter
            </span>
            <span className="border border-aareon-coral bg-aareon-coral/10 px-2 py-0.5 font-mono text-[9px] font-bold uppercase tracking-widest text-aareon-coral">
              2 attachments
            </span>
          </div>

          <div className="flex items-start gap-3">
            <div className="flex h-8 w-8 shrink-0 items-center justify-center bg-aareon-coral font-bold text-sm text-white">
              B
            </div>
            <div className="flex-1 min-w-0">
              <div className="font-mono text-[10px] text-aareon-body/50 mb-1">
                To: <span className="text-aareon-bright font-bold">{RECRUITER_EMAIL}</span>
                <span className="ml-2 text-aareon-body/30">— fixed recipient</span>
              </div>
              <div className="border border-aareon-stone bg-aareon-sand/50 p-3 text-sm text-aareon-body leading-relaxed">
                <p className="font-bold text-aareon-headline text-xs mb-1">
                  New requisition ready for review — {session.jobTitle}
                </p>
                <p className="text-xs text-aareon-body/70">
                  {managerEmail} has submitted a new job requisition for your review.
                  Everything you need is attached so you can get started directly from your inbox.
                </p>
              </div>
              <AttachmentPill name={`${slug}-vacancy.pdf`} description="Brand-aligned vacancy text (7-step format)" />
              <AttachmentPill name={`${slug}-screening-guide.pdf`} description="Must / Should / Could / Don't screening guide" />
            </div>
          </div>
        </div>
      </div>

      {/* Error */}
      {error && (
        <div className="border-2 border-red-500 bg-red-50 px-4 py-3">
          <p className="font-mono text-xs font-bold uppercase tracking-widest text-red-600">
            Error: {error}
          </p>
        </div>
      )}

      {/* Submit button */}
      <button
        onClick={handlePublish}
        disabled={isSubmitting}
        className="w-full border-2 border-aareon-blue bg-aareon-blue px-6 py-4 font-mono text-sm font-bold uppercase tracking-[0.2em] text-white transition-all hover:bg-aareon-headline hover:border-aareon-headline disabled:opacity-50 disabled:cursor-not-allowed shadow-[4px_4px_0px_0px_rgba(8,19,38,0.15)] hover:shadow-none hover:translate-x-[4px] hover:translate-y-[4px]"
      >
        {isSubmitting ? "Submitting..." : "Submit intake →"}
      </button>

      <p className="text-center font-mono text-[9px] uppercase tracking-widest text-aareon-body/30">
        This action will send 2 emails and cannot be undone
      </p>
    </div>
  );
}

// ── Small helpers ─────────────────────────────────────────────────────────────

function AttachmentPill({ name, description }: { name: string; description: string }) {
  return (
    <div className="mt-2 flex items-center gap-3 border border-aareon-stone bg-white px-3 py-2">
      <div className="border border-aareon-stone px-1.5 py-0.5 font-mono text-[8px] font-bold uppercase tracking-widest text-aareon-body/50">
        PDF
      </div>
      <div>
        <div className="font-mono text-[10px] font-bold text-aareon-headline">{name}</div>
        <div className="font-mono text-[9px] text-aareon-body/50">{description}</div>
      </div>
    </div>
  );
}

function EmailConfirmRow({ label, email }: { label: string; email: string }) {
  return (
    <div className="flex items-center justify-between">
      <span className="font-mono text-[10px] uppercase tracking-widest text-aareon-body/50">{label}</span>
      <span className="font-mono text-[10px] text-aareon-bright">{email}</span>
    </div>
  );
}
