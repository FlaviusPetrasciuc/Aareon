"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Navbar from "@/components/globals/Navbar";
import React from "react";

const STEPS = ["Basics", "Job description", "Overview", "Forward to recruiter"];
const CURRENT_STEP = 4;
const RECRUITER_EMAIL = "bram.feij@aareon.com";

interface BasicsData {
  jobTitle: string;
  department: string;
  location: string;
  workMode: string;
  employmentType: string;
  salaryMin: string;
  salaryMax: string;
  currency: string;
  education: string;
  companyCar: boolean;
  companyPhone: boolean;
}

interface JDData {
  summary: string;
  responsibilities: string;
  requirements: string;
  benefits: string;
}

export default function ForwardToRecruiterPage() {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isDone, setIsDone] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [managerEmail, setManagerEmail] = useState("manager@aareon.nl");
  const [basics, setBasics] = useState<BasicsData | null>(null);
  const [jd, setJD] = useState<JDData | null>(null);

  useEffect(() => {
    const email = localStorage.getItem("managerEmail");
    if (email) setManagerEmail(email);

    const savedBasics = localStorage.getItem("jobPostingFormData");
    if (savedBasics) {
      try { setBasics(JSON.parse(savedBasics)); } catch { /* ignore */ }
    }

    const savedJD = localStorage.getItem("jobDescriptionFormData");
    if (savedJD) {
      try { setJD(JSON.parse(savedJD)); } catch { /* ignore */ }
    }
  }, []);

  const jobTitle = basics?.jobTitle || "—";
  const slug = jobTitle.replace(/\s+/g, "-").toLowerCase();

  const handleSubmit = async () => {
    setIsSubmitting(true);
    setError(null);

    try {
      const answers = [
        { questionId: "jobTitle", question: "Job title", answer: basics?.jobTitle || "—" },
        { questionId: "department", question: "Department", answer: basics?.department || "—" },
        { questionId: "location", question: "Location", answer: basics?.location || "—" },
        { questionId: "workMode", question: "Work mode", answer: basics?.workMode || "—" },
        { questionId: "employmentType", question: "Employment type", answer: basics?.employmentType || "—" },
        { questionId: "salary", question: "Salary range (monthly)", answer: basics?.salaryMin && basics?.salaryMax ? `${basics.currency} ${basics.salaryMin} – ${basics.salaryMax}` : "—" },
        { questionId: "education", question: "Education level", answer: basics?.education || "—" },
        { questionId: "equipment", question: "Work equipment", answer: [basics?.companyCar ? "Lease car" : null, basics?.companyPhone ? "Company phone" : null].filter(Boolean).join(", ") || "None" },
      ];

      const jdText = jd ? [
        jd.summary ? `SUMMARY\n${jd.summary}` : "",
        jd.responsibilities ? `RESPONSIBILITIES\n${jd.responsibilities}` : "",
        jd.requirements ? `REQUIREMENTS\n${jd.requirements}` : "",
        jd.benefits ? `WHAT WE OFFER\n${jd.benefits}` : "",
      ].filter(Boolean).join("\n\n") : "";

      const res = await fetch("/api/submit-intake", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          managerEmail,
          jobTitle,
          answers,
          jd: jdText,
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

  // ── Success state ────────────────────────────────────────────────────────
  if (isDone) {
    return (
      <>
        <Navbar />
        <main className="min-h-screen" style={{ backgroundColor: "var(--color-sand)" }}>
          <div className="mx-auto max-w-7xl px-8 py-8 flex flex-col items-center justify-center min-h-[60vh] text-center gap-6">
            <div className="flex h-16 w-16 items-center justify-center rounded-full bg-[#16a34a]">
              <svg className="h-8 w-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <div className="space-y-2">
              <h3 className="font-serif text-3xl" style={{ color: "var(--color-headline)" }}>
                Successfully sent
              </h3>
              <p className="text-[15px]" style={{ color: "var(--color-body)" }}>
                Both emails have been sent. The recruiter will be in touch shortly.
              </p>
            </div>
            <div className="w-full max-w-sm rounded-xl border divide-y" style={{ borderColor: "var(--color-stone)" }}>
              <div className="flex items-center justify-between px-5 py-3">
                <span className="text-sm" style={{ color: "var(--color-body)" }}>Manager</span>
                <span className="text-sm font-medium" style={{ color: "var(--color-headline)" }}>{managerEmail}</span>
              </div>
              <div className="flex items-center justify-between px-5 py-3">
                <span className="text-sm" style={{ color: "var(--color-body)" }}>Recruiter</span>
                <span className="text-sm font-medium" style={{ color: "var(--color-headline)" }}>{RECRUITER_EMAIL}</span>
              </div>
            </div>
          </div>
        </main>
      </>
    );
  }

  return (
    <>
      <Navbar />
      <main className="min-h-screen" style={{ backgroundColor: "var(--color-sand)", color: "var(--color-body)" }}>
        <div className="mx-auto max-w-7xl px-8 py-8">

          {/* Header */}
          <div className="mb-10">
            <p className="mb-3 text-sm" style={{ color: "var(--color-body)" }}>
              Forward to recruiter · 4/4
            </p>
            <h1 className="text-5xl font-serif tracking-tight" style={{ color: "var(--color-headline)" }}>
              Create new job posting
            </h1>
            <p className="mt-3 text-lg" style={{ color: "var(--color-body)" }}>
              Four steps — about 3 minutes
            </p>
          </div>

          {/* Stepper */}
          <div className="mb-10 flex items-center">
            {STEPS.map((step, index) => {
              const stepNumber = index + 1;
              const isDone = stepNumber < CURRENT_STEP;
              const isCurrent = stepNumber === CURRENT_STEP;
              return (
                <React.Fragment key={step}>
                  <div className="flex items-center gap-3">
                    <div
                      className="flex h-10 w-10 items-center justify-center rounded-full border text-sm font-medium"
                      style={{
                        backgroundColor: isDone ? "#50B214" : isCurrent ? "var(--color-blue)" : "white",
                        borderColor: isDone ? "#50B214" : isCurrent ? "var(--color-blue)" : "var(--color-stone)",
                        color: isDone || isCurrent ? "white" : "var(--color-body)",
                      }}
                    >
                      {isDone ? "✓" : stepNumber}
                    </div>
                    <span className="text-[15px]" style={{ color: isCurrent ? "var(--color-headline)" : "var(--color-body)" }}>
                      {step}
                    </span>
                  </div>
                  {index < STEPS.length - 1 && (
                    <div className="mx-5 h-px flex-1" style={{ backgroundColor: "var(--color-stone)" }} />
                  )}
                </React.Fragment>
              );
            })}
          </div>

          {/* Content */}
          <div className="space-y-5">

            {/* Ready banner */}
            <div className="flex items-start gap-4 rounded-xl border px-5 py-4" style={{ borderColor: "#bbf7d0", backgroundColor: "#f0fdf4" }}>
              <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[#16a34a]">
                <svg className="h-5 w-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <div>
                <p className="text-[15px] font-semibold text-[#15803d]">Ready to forward</p>
                <p className="mt-0.5 text-sm text-[#16a34a]/80">
                  Your job posting for <strong>{jobTitle}</strong> is ready to be sent to the recruiter.
                </p>
              </div>
            </div>

            {/* Email cards */}
            <div className="space-y-4">
              <p className="text-[13px] font-semibold uppercase tracking-widest" style={{ color: "var(--color-body)", opacity: 0.5 }}>
                Emails sent on submit
              </p>

              {/* Email 1 — Manager */}
              <div className="rounded-xl border overflow-hidden bg-white" style={{ borderColor: "var(--color-stone)" }}>
                <div className="flex items-center justify-between border-b px-5 py-3" style={{ borderColor: "var(--color-stone)", backgroundColor: "var(--color-sand)" }}>
                  <div className="flex items-center gap-3">
                    <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-sm font-bold text-white" style={{ backgroundColor: "var(--color-blue)" }}>
                      {managerEmail[0].toUpperCase()}
                    </div>
                    <div>
                      <p className="text-[13px] font-semibold" style={{ color: "var(--color-headline)" }}>
                        Confirmation to hiring manager
                      </p>
                      <p className="text-[12px]" style={{ color: "var(--color-body)", opacity: 0.6 }}>
                        To: <span className="font-medium" style={{ color: "var(--color-bright)", opacity: 1 }}>{managerEmail}</span>
                      </p>
                    </div>
                  </div>
                  <span className="rounded-full border px-3 py-1 text-[11px] font-semibold text-[#15803d]" style={{ borderColor: "#bbf7d0", backgroundColor: "#f0fdf4" }}>
                    1 attachment
                  </span>
                </div>
                <div className="px-5 py-4 space-y-3">
                  <div className="rounded-xl border px-4 py-3 space-y-1" style={{ borderColor: "var(--color-stone)", backgroundColor: "var(--color-sand)" }}>
                    <p className="text-[13px] font-semibold" style={{ color: "var(--color-headline)" }}>
                      Your requisition has been submitted: {jobTitle}
                    </p>
                    <p className="text-[13px]" style={{ color: "var(--color-body)" }}>
                      Your job posting has been successfully submitted to Bram Feij. Attached is your personal copy of the full vacancy text for your own records.
                    </p>
                  </div>
                  <AttachmentPill name={`${slug}-vacancy.pdf`} description="Full job posting with AI-generated vacancy text" />
                </div>
              </div>

              {/* Email 2 — Recruiter */}
              <div className="rounded-xl border overflow-hidden bg-white" style={{ borderColor: "var(--color-stone)" }}>
                <div className="flex items-center justify-between border-b px-5 py-3" style={{ borderColor: "var(--color-stone)", backgroundColor: "var(--color-sand)" }}>
                  <div className="flex items-center gap-3">
                    <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-sm font-bold text-white" style={{ backgroundColor: "var(--color-coral)" }}>
                      B
                    </div>
                    <div>
                      <p className="text-[13px] font-semibold" style={{ color: "var(--color-headline)" }}>
                        Action packet to recruiter
                      </p>
                      <p className="text-[12px]" style={{ color: "var(--color-body)", opacity: 0.6 }}>
                        To: <span className="font-medium" style={{ color: "var(--color-bright)", opacity: 1 }}>{RECRUITER_EMAIL}</span>
                        <span style={{ opacity: 0.4 }}> — fixed recipient</span>
                      </p>
                    </div>
                  </div>
                  <span className="rounded-full border px-3 py-1 text-[11px] font-semibold" style={{ borderColor: "#fecaca", backgroundColor: "#fef2f2", color: "#ef4444" }}>
                    2 attachments
                  </span>
                </div>
                <div className="px-5 py-4 space-y-3">
                  <div className="rounded-xl border px-4 py-3 space-y-1" style={{ borderColor: "var(--color-stone)", backgroundColor: "var(--color-sand)" }}>
                    <p className="text-[13px] font-semibold" style={{ color: "var(--color-headline)" }}>
                      New requisition ready for review — {jobTitle}
                    </p>
                    <p className="text-[13px]" style={{ color: "var(--color-body)" }}>
                      {managerEmail} has submitted a new job posting for your review. Everything you need is attached so you can get started directly from your inbox.
                    </p>
                  </div>

                  {/* Job details summary */}
                  {basics && (
                    <div className="rounded-xl border overflow-hidden" style={{ borderColor: "var(--color-stone)" }}>
                      <div className="border-b px-4 py-2" style={{ borderColor: "var(--color-stone)", backgroundColor: "var(--color-sand)" }}>
                        <p className="text-[11px] font-semibold uppercase tracking-widest" style={{ color: "var(--color-body)", opacity: 0.5 }}>
                          Job details
                        </p>
                      </div>
                      <div className="divide-y" style={{ borderColor: "var(--color-sand)" }}>
                        {[
                          ["Job title", basics.jobTitle],
                          ["Department", basics.department],
                          ["Location", basics.location],
                          ["Work mode", basics.workMode],
                          ["Employment type", basics.employmentType],
                          ["Salary", basics.salaryMin && basics.salaryMax ? `${basics.currency} ${basics.salaryMin} – ${basics.salaryMax}` : "—"],
                          ["Education", basics.education],
                        ].map(([label, value]) => (
                          <div key={label} className="flex items-center justify-between px-4 py-2">
                            <span className="text-[12px]" style={{ color: "var(--color-body)", opacity: 0.6 }}>{label}</span>
                            <span className="text-[12px] font-semibold" style={{ color: "var(--color-headline)" }}>{value || "—"}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  <AttachmentPill name={`${slug}-vacancy.pdf`} description="Brand-aligned vacancy text" />
                  <AttachmentPill name={`${slug}-screening-guide.pdf`} description="Must / Should / Could / Don't screening guide" />
                </div>
              </div>
            </div>

            {/* Error */}
            {error && (
              <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3">
                <p className="text-sm font-medium text-red-600">{error}</p>
              </div>
            )}

            {/* Footer */}
            <div className="flex items-center justify-between border-t pt-6 pb-8" style={{ borderColor: "var(--color-stone)" }}>
              <button
                type="button"
                onClick={() => router.push("/overview")}
                className="h-12 rounded-xl border bg-white px-6 text-[15px] font-medium transition hover:bg-gray-50"
                style={{ borderColor: "var(--color-stone)", color: "var(--color-headline)" }}
              >
                Back
              </button>
              <button
                type="button"
                onClick={handleSubmit}
                disabled={isSubmitting}
                className="h-12 rounded-xl px-8 text-[15px] font-semibold text-white transition hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed"
                style={{ backgroundColor: "var(--color-blue)" }}
              >
                {isSubmitting ? "Sending..." : "Forward to recruiter →"}
              </button>
            </div>

          </div>
        </div>
      </main>
    </>
  );
}

function AttachmentPill({ name, description }: { name: string; description: string }) {
  return (
    <div className="flex items-center gap-3 rounded-xl border bg-white px-4 py-3" style={{ borderColor: "var(--color-stone)" }}>
      <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border" style={{ borderColor: "var(--color-stone)", backgroundColor: "var(--color-sand)" }}>
        <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5} style={{ color: "var(--color-body)", opacity: 0.5 }}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m2.25 0H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" />
        </svg>
      </div>
      <div>
        <p className="text-[13px] font-semibold" style={{ color: "var(--color-headline)" }}>{name}</p>
        <p className="text-[12px]" style={{ color: "var(--color-body)", opacity: 0.5 }}>{description}</p>
      </div>
    </div>
  );
}
