"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { isAllowedAareonEmail } from "@/lib/aareonAccess";
import Navbar from "@/components/globals/Navbar";

const approvalTemplateUrl =
  "/documents/Approval%20Directors%20from%20for%20managers.pdf";

type ApprovalChoice = "yes" | "no" | null;

type StoredApprovalFile = {
  fileName: string;
  contentType: string;
  base64: string;
};

export default function ApprovalValidationPage() {
  const router = useRouter();

  const [choice, setChoice] = useState<ApprovalChoice>(null);
  const [showApprovalModal, setShowApprovalModal] = useState(false);
  const [approvalFileName, setApprovalFileName] = useState("");
  const [approvalFileError, setApprovalFileError] = useState("");

  useEffect(() => {
    const savedEmail = localStorage.getItem("managerEmail") || "";

    if (!isAllowedAareonEmail(savedEmail)) {
      router.replace("/");
      return;
    }

    const savedChoice =
      (localStorage.getItem("aareonApprovalStatus") as ApprovalChoice) || null;

    if (savedChoice === "yes" || savedChoice === "no") {
      setChoice(savedChoice);
    }

    const savedApprovalPdf = localStorage.getItem("approvalPdf");

    if (savedApprovalPdf) {
      try {
        const parsed = JSON.parse(savedApprovalPdf) as StoredApprovalFile;
        setApprovalFileName(parsed.fileName || "");
      } catch {
        localStorage.removeItem("approvalPdf");
      }
    }
  }, [router]);

  function selectApprovalStatus(nextChoice: Exclude<ApprovalChoice, null>) {
    setChoice(nextChoice);
    localStorage.setItem("aareonApprovalStatus", nextChoice);

    if (nextChoice === "yes") {
      setShowApprovalModal(false);
      document.cookie = "aareon_approval=granted; path=/; max-age=86400";
      return;
    }

    localStorage.removeItem("approvalPdf");
    setApprovalFileName("");

    setShowApprovalModal(true);
    document.cookie = "aareon_approval=; path=/; max-age=0";
  }

  function continueToIntake() {
    if (choice !== "yes") return;
    router.push("/basics");
  }

  async function handleApprovalFileChange(
    e: React.ChangeEvent<HTMLInputElement>
  ) {
    const file = e.target.files?.[0];

    setApprovalFileError("");
    setApprovalFileName("");
    localStorage.removeItem("approvalPdf");

    if (!file) return;

    if (file.type !== "application/pdf") {
      e.target.value = "";
      setApprovalFileError("Please upload a PDF file only.");
      return;
    }

    try {
      const reader = new FileReader();

      reader.onload = () => {
        try {
          const result = String(reader.result);
          const base64 = result.split(",")[1];

          const storedFile: StoredApprovalFile = {
            fileName: file.name,
            contentType: file.type || "application/pdf",
            base64,
          };

          localStorage.setItem("approvalPdf", JSON.stringify(storedFile));
          setApprovalFileName(file.name);
        } catch {
          e.target.value = "";
          setApprovalFileName("");
          localStorage.removeItem("approvalPdf");
          setApprovalFileError(
            "This PDF is too large to store. Please upload a smaller PDF."
          );
        }
      };

      reader.onerror = () => {
        setApprovalFileError("Could not read the selected PDF file.");
      };

      reader.readAsDataURL(file);
    } catch {
      setApprovalFileError("Could not read the selected PDF file.");
    }
  }

  return (
    <main className="min-h-screen bg-aareon-sand text-aareon-body">
      <Navbar />

      <section className="mx-auto max-w-5xl px-5 py-8 sm:px-8 lg:py-14">
        <div className="min-w-0">
          <div className="mx-auto mb-8 flex max-w-3xl flex-wrap items-center justify-center gap-3 text-center text-xs font-semibold uppercase tracking-[0.18em] text-aareon-body/60 sm:justify-start sm:text-left">
            <span className="text-aareon-bright">Email verified</span>
            <span aria-hidden="true">/</span>
            <span className="text-aareon-headline">
              Approval validation
            </span>
            <span aria-hidden="true">/</span>
            <span>AI intake</span>
          </div>

          <div className="mx-auto max-w-3xl text-center sm:text-left">
            <p className="mb-4 font-mono text-[11px] font-semibold uppercase tracking-[0.28em] text-aareon-bright">
              Approval checkpoint
            </p>

            <h1 className="font-title text-[clamp(38px,6vw,68px)] italic leading-[1.02] text-aareon-headline">
              Confirm director approval before creating a new vacancy.
            </h1>

            <p className="mx-auto mt-5 max-w-2xl text-base leading-7 text-aareon-body sm:mx-0">
              Aareon requires director approval before a manager can request a
              new job posting and start a hiring process. Confirm your approval
              status below to continue.
            </p>
          </div>

          <fieldset className="mx-auto mt-10 max-w-4xl">
            <legend className="mb-4 text-center text-sm font-semibold text-aareon-headline sm:text-left">
              Do you already have approval from the directors?
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
                    <span className="block text-lg font-semibold text-aareon-headline">
                      Yes, approval is already available
                    </span>
                    <span className="mt-2 block text-sm leading-6 text-aareon-body/75">
                      Continue to the AI interviewer and answer the vacancy
                      intake questions.
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
                  />
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
                    <span className="block text-lg font-semibold text-aareon-headline">
                      No, I need to request approval first
                    </span>
                    <span className="mt-2 block text-sm leading-6 text-aareon-body/75">
                      Complete the approval request form first. The AI
                      interviewer will remain closed until this request is
                      submitted.
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
                  />
                </span>
              </label>
            </div>
          </fieldset>

          {choice === "yes" && (
            <div className="mx-auto mt-6 max-w-4xl rounded-lg border border-aareon-stone bg-white p-5 shadow-sm">
              <label
                htmlFor="approvalPdf"
                className="block text-sm font-semibold text-aareon-headline"
              >
                Add approval PDF
              </label>

              <p className="mt-1 text-sm leading-6 text-aareon-body/70">
                Optional. If you add the approval document, it will be sent
                together with the confirmation email.
              </p>

              <input
                id="approvalPdf"
                type="file"
                accept="application/pdf,.pdf"
                onChange={handleApprovalFileChange}
                className="mt-4 block w-full rounded-lg border border-aareon-stone bg-aareon-sand px-4 py-3 text-sm text-aareon-body file:mr-4 file:rounded-md file:border-0 file:bg-aareon-blue file:px-4 file:py-2 file:text-sm file:font-semibold file:text-white"
              />

              {approvalFileName && (
                <p className="mt-2 text-xs font-medium text-aareon-bright">
                  {approvalFileName}
                </p>
              )}

              {approvalFileError && (
                <p className="mt-2 text-xs font-semibold text-aareon-coral">
                  {approvalFileError}
                </p>
              )}
            </div>
          )}

          <div className="mx-auto mt-8 flex max-w-4xl flex-col gap-3 sm:flex-row sm:justify-center">
            <button
              type="button"
              onClick={continueToIntake}
              disabled={choice !== "yes"}
              className="inline-flex min-h-12 items-center justify-center rounded-lg bg-aareon-blue px-6 py-3 text-sm font-semibold text-white shadow-sm transition-all duration-300 hover:-translate-y-0.5 hover:bg-[#0a1d8a] hover:shadow-[0_12px_24px_rgba(5,17,99,0.18)] focus:outline-none focus:ring-2 focus:ring-aareon-bright focus:ring-offset-2 disabled:translate-y-0 disabled:cursor-not-allowed disabled:bg-aareon-body/30 disabled:shadow-none"
            >
              Continue to AI interviewer
            </button>

            <a
              href={approvalTemplateUrl}
              target="_blank"
              rel="noreferrer"
              className="inline-flex min-h-12 items-center justify-center rounded-lg border border-aareon-stone bg-white px-6 py-3 text-sm font-semibold text-aareon-headline shadow-sm transition-all duration-300 hover:-translate-y-0.5 hover:border-aareon-bright hover:text-aareon-bright hover:shadow-[0_10px_24px_rgba(8,19,38,0.06)] focus:outline-none focus:ring-2 focus:ring-aareon-bright focus:ring-offset-2"
            >
              View approval document example
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
            <div
              className="mx-auto mb-5 h-1 w-16 rounded-full bg-aareon-bright"
              aria-hidden="true"
            />

            <h2
              id="approval-required-title"
              className="text-2xl font-semibold text-aareon-headline"
            >
              Approval is required before you can continue.
            </h2>

            <p className="mt-4 text-sm leading-6 text-aareon-body/78">
              Please complete the approval request form first. The recruiter
              will receive your request and guide the next approval steps with
              the directors.
            </p>

            <button
              type="button"
              onClick={() => router.push("/approval-request")}
              className="mt-7 inline-flex min-h-11 items-center justify-center rounded-lg bg-aareon-blue px-6 py-3 text-sm font-semibold text-white transition-all duration-300 hover:-translate-y-0.5 hover:bg-[#0a1d8a] hover:shadow-[0_12px_24px_rgba(5,17,99,0.18)] focus:outline-none focus:ring-2 focus:ring-aareon-bright focus:ring-offset-2"
            >
              Continue
            </button>
          </div>
        </div>
      )}
    </main>
  );
}