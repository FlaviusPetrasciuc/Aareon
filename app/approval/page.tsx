"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { isAllowedAareonEmail } from "@/lib/aareonAccess";
import LoadingSpinner from "@/components/globals/loadingSpinner";

const approvalTemplateUrl = "/documents/Approval%20Directors%20from%20for%20managers.pdf";

type ApprovalChoice = "yes" | "no" | null;

export default function ApprovalValidationPage() {
  const router = useRouter();
  const [managerEmail, setManagerEmail] = useState("");
  const [choice, setChoice] = useState<ApprovalChoice>(null);
  const [showApprovalModal, setShowApprovalModal] = useState(false);

  useEffect(() => {
    const savedEmail = localStorage.getItem("managerEmail") || "";

    if (!isAllowedAareonEmail(savedEmail)) {
      router.replace("/");
      return;
    }

    setManagerEmail(savedEmail);
  }, [router]);

  function selectApprovalStatus(nextChoice: Exclude<ApprovalChoice, null>) {
    setChoice(nextChoice);
    localStorage.setItem("aareonApprovalStatus", nextChoice);

    if (nextChoice === "yes") {
      setShowApprovalModal(false);
      document.cookie = "aareon_approval=granted; path=/; max-age=86400";

      return;
    }

    setShowApprovalModal(true);
    document.cookie = "aareon_approval=; path=/; max-age=0";
  }

  function continueToIntake() {
    if (choice !== "yes") return;

    router.push("/basics");
  }

  return (
    <main className="min-h-screen bg-aareon-sand text-aareon-body">
      <header className="border-b border-aareon-stone bg-white/80 backdrop-blur">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-5 py-4 sm:px-8">
          <Link href="/" className="flex items-center gap-3 rounded-md focus:outline-none focus:ring-2 focus:ring-aareon-bright focus:ring-offset-2">
            <Image src="/aareon-logo.png" alt="Aareon" width={126} height={30} priority />
          </Link>

          <div className="hidden items-center gap-3 text-xs font-medium text-aareon-body/70 sm:flex">
            <span className="h-2 w-2 rounded-full bg-aareon-bright" aria-hidden="true" />
            <span>{managerEmail || "Validating session"}</span>
          </div>
        </div>
      </header>

      <section className="mx-auto max-w-5xl px-5 py-8 sm:px-8 lg:py-14">
        <div className="min-w-0">
          <div className="mx-auto mb-8 flex max-w-3xl flex-wrap items-center justify-center gap-3 text-center text-xs font-semibold uppercase tracking-[0.18em] text-aareon-body/60 sm:justify-start sm:text-left">
            <span className="text-aareon-bright">Email verified</span>
            <span aria-hidden="true">/</span>
            <span className="text-aareon-headline">Approval validation</span>
            <span aria-hidden="true">/</span>
            <span>AI intake</span>
          </div>

          <div className="mx-auto max-w-3xl text-center sm:text-left">
            <p className="mb-4 font-mono text-[11px] font-semibold uppercase tracking-[0.28em] text-aareon-bright">
              Approval checkpoint
            </p>
            <h1 className="font-title text-[clamp(38px,6vw,68px)] italic leading-[1.02] text-aareon-headline">
              Confirm management approval before creating a new vacancy.
            </h1>
            <p className="mx-auto mt-5 max-w-2xl text-base leading-7 text-aareon-body sm:mx-0">
              Aareon requires director or management approval before a manager can request a new job posting and start a hiring process. Confirm your status below to continue.
            </p>
          </div>

          <fieldset className="mx-auto mt-10 max-w-4xl">
            <legend className="mb-4 text-center text-sm font-semibold text-aareon-headline sm:text-left">
              Do you already have the required approval?
            </legend>

            <div className="grid gap-4 md:grid-cols-2">
              <label
                className={[
                  "group cursor-pointer rounded-lg border bg-white p-5 shadow-sm transition-all duration-300 ease-out",
                  "focus-within:ring-2 focus-within:ring-aareon-bright focus-within:ring-offset-2",
                  choice === "yes"
                    ? "translate-y-[-2px] border-aareon-bright shadow-[0_14px_36px_rgba(8,109,251,0.14)]"
                    : "border-aareon-stone hover:-translate-y-0.5 hover:border-aareon-bright/60 hover:shadow-[0_10px_24px_rgba(8,19,38,0.06)]",
                ].join(" ")}
              >
                <input
                  type="radio"
                  name="approval"
                  value="yes"
                  checked={choice === "yes"}
                  onChange={() => selectApprovalStatus("yes")}
                  className="sr-only"
                />
                <span className="flex items-start justify-between gap-5">
                  <span>
                    <span className="block text-lg font-semibold text-aareon-headline">Yes, approval is in place</span>
                    <span className="mt-2 block text-sm leading-6 text-aareon-body/75">
                      Continue to the AI intake and answer the required hiring and vacancy questions.
                    </span>
                  </span>
                  <span
                    className={[
                      "mt-0.5 h-6 w-6 shrink-0 rounded-full border transition-all duration-300",
                      choice === "yes"
                        ? "border-aareon-bright bg-aareon-bright shadow-[0_0_0_5px_rgba(8,109,251,0.12)]"
                        : "border-aareon-stone bg-white group-hover:border-aareon-bright",
                    ].join(" ")}
                    aria-hidden="true"
                  >
                    <span className="sr-only">Selected</span>
                  </span>
                </span>
              </label>

              <label
                onClick={() => {
                  if (choice === "no") setShowApprovalModal(true);
                }}
                className={[
                  "group cursor-pointer rounded-lg border bg-white p-5 shadow-sm transition-all duration-300 ease-out",
                  "focus-within:ring-2 focus-within:ring-aareon-bright focus-within:ring-offset-2",
                  choice === "no"
                    ? "translate-y-[-2px] border-aareon-bright shadow-[0_14px_36px_rgba(8,109,251,0.14)]"
                    : "border-aareon-stone hover:-translate-y-0.5 hover:border-aareon-bright/60 hover:shadow-[0_10px_24px_rgba(8,19,38,0.06)]",
                ].join(" ")}
              >
                <input
                  type="radio"
                  name="approval"
                  value="no"
                  checked={choice === "no"}
                  onChange={() => selectApprovalStatus("no")}
                  className="sr-only"
                />
                <span className="flex items-start justify-between gap-5">
                  <span>
                    <span className="block text-lg font-semibold text-aareon-headline">No, I Need Approval First</span>
                    <span className="mt-2 block text-sm leading-6 text-aareon-body/75">
                      Access to the AI job posting workflow stays locked until approval is obtained.
                    </span>
                  </span>
                  <span
                    className={[
                      "mt-0.5 h-6 w-6 shrink-0 rounded-full border transition-all duration-300",
                      choice === "no"
                        ? "border-aareon-bright bg-aareon-bright shadow-[0_0_0_5px_rgba(8,109,251,0.12)]"
                        : "border-aareon-stone bg-white group-hover:border-aareon-bright",
                    ].join(" ")}
                    aria-hidden="true"
                  >
                    <span className="sr-only">Selected</span>
                  </span>
                </span>
              </label>
            </div>
          </fieldset>

          <div className="mx-auto mt-8 flex max-w-4xl flex-col gap-3 sm:flex-row sm:justify-center">
            <button
              type="button"
              onClick={continueToIntake}
              disabled={choice !== "yes"}
              className="inline-flex min-h-12 items-center justify-center rounded-lg bg-aareon-blue px-6 py-3 text-sm font-semibold text-white shadow-sm transition-all duration-300 hover:-translate-y-0.5 hover:bg-[#0a1d8a] hover:shadow-[0_12px_24px_rgba(5,17,99,0.18)] focus:outline-none focus:ring-2 focus:ring-aareon-bright focus:ring-offset-2 disabled:translate-y-0 disabled:cursor-not-allowed disabled:bg-aareon-body/30 disabled:shadow-none"
            >
              Continue to AI Intake
            </button>
            
            <a
              href={approvalTemplateUrl}
              target="_blank"
              rel="noreferrer"
              className="inline-flex min-h-12 items-center justify-center rounded-lg border border-aareon-stone bg-white px-6 py-3 text-sm font-semibold text-aareon-headline shadow-sm transition-all duration-300 hover:-translate-y-0.5 hover:border-aareon-bright hover:text-aareon-bright hover:shadow-[0_10px_24px_rgba(8,19,38,0.06)] focus:outline-none focus:ring-2 focus:ring-aareon-bright focus:ring-offset-2"
            >
              Preview Approval Document
            </a>
          </div>
        </div>
      </section>

      {showApprovalModal && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-aareon-headline/45 px-5 py-8 backdrop-blur-sm animate-[fadeIn_180ms_ease-out]"
          role="dialog"
          aria-modal="true"
          aria-labelledby="approval-required-title"
        >
          <div className="w-full max-w-lg rounded-lg border border-aareon-stone bg-white p-6 text-center shadow-[0_24px_80px_rgba(8,19,38,0.22)] animate-[modalIn_220ms_ease-out] sm:p-8">
            <div className="mx-auto mb-5 h-1 w-16 rounded-full bg-aareon-bright" aria-hidden="true" />
            <h2 id="approval-required-title" className="text-2xl font-semibold text-aareon-headline">
              Approval is required before continuing.
            </h2>
            <p className="mt-4 text-sm leading-6 text-aareon-body/78">
              Please complete the official approval template and obtain the required director or management decision. The AI job posting workflow will become available once you return and confirm that approval has been granted.
            </p>
            <button
              type="button"
              onClick={() => setShowApprovalModal(false)}
              className="mt-7 inline-flex min-h-11 items-center justify-center rounded-lg bg-aareon-blue px-6 py-3 text-sm font-semibold text-white transition-all duration-300 hover:-translate-y-0.5 hover:bg-[#0a1d8a] hover:shadow-[0_12px_24px_rgba(5,17,99,0.18)] focus:outline-none focus:ring-2 focus:ring-aareon-bright focus:ring-offset-2"
            >
              OK
            </button>
          </div>
        </div>
      )}
    </main>
  );
}
