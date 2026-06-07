"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

const request = {
  id: "1",
  manager: "Olena Popova",
  email: "olena.popova@aareon.nl",
  recruiter: "Recruitment Team",
  recruiterEmail: "recruitment@aareon.nl",
  document: "Frontend Developer Job Posting",
  department: "IT",
  submitted: "06 Jun 2026",
  location: "Emmen, Netherlands",
  workMode: "Hybrid",
  employmentType: "Full-time",
  salary: "€4,000 - €6,000 per month",
  summary:
    "We are seeking a talented Frontend Developer to join our growing IT team in Emmen. The developer will build responsive web applications and support digital solutions for the real-estate industry.",
  responsibilities:
    "The candidate will work with designers and backend developers, create reusable React components, improve performance, and maintain frontend code quality.",
  requirements:
    "The candidate should have experience with HTML, CSS, JavaScript, React and TypeScript. Knowledge of responsive design and accessibility is preferred.",
  offer:
    "Aareon offers a hybrid working environment, professional development opportunities, a supportive team culture and the chance to work on meaningful digital solutions.",
};

export default function ReviewRequestPage() {
  const router = useRouter();

  const [showRejectBox, setShowRejectBox] = useState(false);
  const [modalType, setModalType] = useState<"approved" | "rejected" | null>(
    null
  );
  const [feedback, setFeedback] = useState("");
const [submitting, setSubmitting] = useState(false);
const [error, setError] = useState("");

const handleDecision = (decision: "approved" | "rejected") => async () => {
  setSubmitting(true);
  setError("");
  try {
    const res = await fetch("/api/director/decide", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        submissionId: request.id,
        managerEmail: request.email,
        jobTitle: request.document,
        decision,
        feedback: decision === "rejected" ? feedback : undefined,
      }),
    });

    if (!res.ok) throw new Error("Failed to submit decision");

    // Update status in localStorage
    const submissions = JSON.parse(
      localStorage.getItem("directorSubmissions") || "[]"
    );
    const updated = submissions.map((s: any) =>
      s.id === request.id
        ? { ...s, status: decision === "approved" ? "Reviewed" : "Rejected", approval: decision === "approved" ? "Approved" : "Rejected" }
        : s
    );
    localStorage.setItem("directorSubmissions", JSON.stringify(updated));

    setModalType(decision);
  } catch (err) {
    setError("Something went wrong. Please try again.");
  } finally {
    setSubmitting(false);
  }
};

  return (
    <div className="min-h-screen bg-[var(--color-sand)] text-[var(--color-body)]">
      <div className="mx-auto max-w-5xl px-6 py-8">
        <button
          onClick={() => router.push("/director-dashboard")}
          className="mb-6 text-sm font-semibold text-[var(--color-blue)]"
        >
          ← Back to dashboard
        </button>

        <header className="mb-8 rounded-[32px] bg-[var(--color-blue)] px-8 py-10 text-white">
          <p className="mb-2 text-sm font-semibold uppercase tracking-[0.25em] text-white/70">
            Director review
          </p>

          <h1 className="font-serif text-4xl text-white md:text-5xl">
            {request.document}
          </h1>

          <p className="mt-3 text-base leading-7 text-white/75">
            Submitted by {request.manager} on {request.submitted}
          </p>
        </header>

        <section className="mb-8 grid gap-4 md:grid-cols-2">
          <InfoCard label="Department" value={request.department} />
          <InfoCard label="Location" value={request.location} />
          <InfoCard label="Work mode" value={request.workMode} />
          <InfoCard label="Employment type" value={request.employmentType} />
          <InfoCard label="Salary range" value={request.salary} />
          <InfoCard label="Manager email" value={request.email} />
          <InfoCard label="Recruiter" value={request.recruiter} />
          <InfoCard label="Recruiter email" value={request.recruiterEmail} />
        </section>

        <section className="rounded-[28px] bg-white p-8 shadow-sm">
          <DocumentSection title="Summary" text={request.summary} />
          <DocumentSection
            title="Responsibilities"
            text={request.responsibilities}
          />
          <DocumentSection title="Requirements" text={request.requirements} />
          <DocumentSection title="What we offer" text={request.offer} />

          {showRejectBox && (
            <div className="mt-8 rounded-[24px] bg-[var(--color-sand)] p-6">
              <label className="mb-3 block font-semibold text-[var(--color-headline)]">
                Reason for rejection, optional
              </label>

            <textarea
              placeholder="Write feedback for the manager..."
              value={feedback}
              onChange={(e) => setFeedback(e.target.value)}
              className="min-h-32 w-full rounded-[18px] border border-[var(--color-stone)] bg-white p-4 outline-none focus:border-[var(--color-bright)]"
            />

          <button
            onClick={handleDecision("rejected")}
            disabled={submitting}
            className="mt-4 rounded-full bg-[var(--color-coral)] px-6 py-3 font-semibold text-[var(--color-headline)] transition hover:opacity-90 disabled:opacity-50"
          >
            {submitting ? "Submitting..." : "Submit rejection"}
          </button>
            </div>
          )}

          <div className="mt-8 flex flex-col gap-3 border-t border-[var(--color-stone)] pt-6 sm:flex-row sm:justify-end">
            <button
              onClick={() => setShowRejectBox(true)}
              className="rounded-full border border-[var(--color-coral)] px-6 py-3 font-semibold text-[var(--color-coral)] transition hover:bg-[var(--color-coral)] hover:text-[var(--color-headline)]"
            >
              Reject
            </button>

          <button
            onClick={handleDecision("approved")}
            disabled={submitting}
            className="rounded-full bg-[var(--color-blue)] px-6 py-3 font-semibold text-white transition hover:bg-[var(--color-bright)] disabled:opacity-50"
          >
            {submitting ? "Submitting..." : "Approve"}
          </button>
          </div>
        </section>
      </div>

      {modalType && (
        <DecisionModal
          type={modalType}
          onBack={() => router.push("/director-dashboard")}
        />
      )}
    </div>
  );
}

function DecisionModal({
  type,
  onBack,
}: {
  type: "approved" | "rejected";
  onBack: () => void;
}) {
  const isApproved = type === "approved";

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-6">
      <div className="w-full max-w-lg rounded-[32px] bg-white p-8 shadow-2xl animate-[modalIn_0.25s_ease-out]">
        <div
          className={`mb-5 flex h-14 w-14 items-center justify-center rounded-full text-2xl font-bold ${
            isApproved
              ? "bg-[#B9E99C] text-[var(--color-headline)]"
              : "bg-[#FFD8CA] text-[var(--color-headline)]"
          }`}
        >
          {isApproved ? "✓" : "!"}
        </div>

        <h2 className="text-2xl font-semibold text-[var(--color-headline)]">
          Request {isApproved ? "approved" : "rejected"}
        </h2>

        <p className="mt-4 leading-7 text-[var(--color-body)]">
          The manager will be notified that the request has been{" "}
          {isApproved ? "approved" : "rejected"}.
        </p>

        <p className="mt-2 leading-7 text-[var(--color-body)]">
          The recruiter will also be notified about this decision.
        </p>

        {!isApproved && (
          <p className="mt-2 leading-7 text-[var(--color-body)]">
            If rejection feedback was written, it will be included in the
            notification.
          </p>
        )}

        <button
          onClick={onBack}
          className="mt-8 w-full rounded-full bg-[var(--color-blue)] px-6 py-3 font-semibold text-white transition hover:bg-[var(--color-bright)]"
        >
          Go back to dashboard
        </button>
      </div>
    </div>
  );
}

function InfoCard({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-[22px] bg-white p-5 shadow-sm">
      <p className="text-xs font-semibold uppercase tracking-[0.18em]">
        {label}
      </p>
      <p className="mt-2 text-lg font-semibold text-[var(--color-headline)]">
        {value}
      </p>
    </div>
  );
}

function DocumentSection({ title, text }: { title: string; text: string }) {
  return (
    <div className="border-b border-[var(--color-stone)] py-6 last:border-b-0">
      <h2 className="mb-3 text-xl font-semibold text-[var(--color-headline)]">
        {title}
      </h2>
      <p className="leading-7">{text}</p>
    </div>
  );
}