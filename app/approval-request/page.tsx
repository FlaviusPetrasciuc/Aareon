"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { isAllowedAareonEmail } from "@/lib/aareonAccess";

type Priority = "Laag" | "Middel" | "Hoog" | "";

type ApprovalFormData = {
  hiringManager: string;
  team: string;
  functie: string;
  datum: string;
  waaromNodig: string;
  risicoBijNietInvullen: string;
  prioriteit: Priority;
  internMogelijk: "Ja" | "Nee" | "";
  interneToelichting: string;
  overwogenOpties: string;
  kostenIndicatie: string;
  binnenBudget: "Ja" | "Nee" | "";
  financieleToelichting: string;
  verwachteImpact: string;
  bijdrageAanDoelen: string;
  startdatum: string;
  domeinverantwoordelijkeBesluit: "Go" | "No-go" | "";
  domeinverantwoordelijkeOpmerking: string;
  cfoBesluit: "Go" | "No-go" | "";
  cfoOpmerking: string;
};

type FieldName = keyof ApprovalFormData;

const initialFormData: ApprovalFormData = {
  hiringManager: "",
  team: "",
  functie: "",
  datum: "",
  waaromNodig: "",
  risicoBijNietInvullen: "",
  prioriteit: "",
  internMogelijk: "",
  interneToelichting: "",
  overwogenOpties: "",
  kostenIndicatie: "",
  binnenBudget: "",
  financieleToelichting: "",
  verwachteImpact: "",
  bijdrageAanDoelen: "",
  startdatum: "",
  domeinverantwoordelijkeBesluit: "",
  domeinverantwoordelijkeOpmerking: "",
  cfoBesluit: "",
  cfoOpmerking: "",
};

const requiredFields: FieldName[] = [
  "hiringManager",
  "team",
  "functie",
  "datum",
  "waaromNodig",
  "risicoBijNietInvullen",
  "prioriteit",
  "internMogelijk",
  "interneToelichting",
  "overwogenOpties",
  "kostenIndicatie",
  "binnenBudget",
  "financieleToelichting",
  "verwachteImpact",
  "bijdrageAanDoelen",
  "startdatum",
];

function FieldError({ message }: { message?: string }) {
  if (!message) return null;

  return (
    <p className="mt-1 text-xs font-semibold text-aareon-coral">
      {message}
    </p>
  );
}

function Section({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <section className="border-t border-aareon-stone pt-7 first:border-t-0 first:pt-0">
      <h2 className="mb-5 font-title text-2xl italic text-aareon-headline">
        {title}
      </h2>

      <div className="grid gap-5 md:grid-cols-2">
        {children}
      </div>
    </section>
  );
}

export default function ApprovalRequestPage() {
  const router = useRouter();

  const [managerEmail, setManagerEmail] = useState("");
  const [formData, setFormData] = useState(initialFormData);
  const [errors, setErrors] = useState<Partial<Record<FieldName, string>>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showConfirmation, setShowConfirmation] = useState(false);

  useEffect(() => {
    const savedEmail = localStorage.getItem("managerEmail") || "";

    if (!isAllowedAareonEmail(savedEmail)) {
      router.replace("/");
      return;
    }

    setManagerEmail(savedEmail);
  }, [router]);

  const today = useMemo(() => new Date().toISOString().slice(0, 10), []);

  function setValue(field: FieldName, value: string) {
    setFormData((current) => ({
      ...current,
      [field]: value,
    }));

    setErrors((current) => {
      const next = { ...current };
      delete next[field];
      return next;
    });
  }

  function validate() {
    const nextErrors: Partial<Record<FieldName, string>> = {};

    requiredFields.forEach((field) => {
      if (!String(formData[field] || "").trim()) {
        nextErrors[field] = "This field is required.";
      }
    });

    setErrors(nextErrors);

    return Object.keys(nextErrors).length === 0;
  }

  async function submitForm(e: React.FormEvent) {
    e.preventDefault();

    if (!validate()) return;

    setIsSubmitting(true);

    try {
      const res = await fetch("/api/submit-approval-request", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          managerEmail,
          ...formData,
        }),
      });

      if (!res.ok) {
        alert("The request could not be submitted.");
        return;
      }

      setShowConfirmation(true);
    } catch (error) {
      console.error(error);
      alert("The request could not be submitted.");
    } finally {
      setIsSubmitting(false);
    }
  }

  const inputClass =
    "h-12 w-full rounded-lg border border-aareon-stone bg-white px-4 text-sm text-aareon-headline outline-none transition focus:border-aareon-bright focus:shadow-[0_0_0_3px_rgba(8,109,251,0.12)]";

  const textareaClass =
    "min-h-28 w-full rounded-lg border border-aareon-stone bg-white px-4 py-3 text-sm text-aareon-headline outline-none transition focus:border-aareon-bright focus:shadow-[0_0_0_3px_rgba(8,109,251,0.12)]";

  const labelClass =
    "mb-2 block text-xs font-bold uppercase tracking-[0.16em] text-aareon-body/70";

  return (
    <main className="min-h-screen bg-aareon-sand text-aareon-body">
      <header className="border-b border-aareon-stone bg-white/80 backdrop-blur">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-5 py-4 sm:px-8">
          <Link
            href="/"
            className="flex items-center gap-3 rounded-md focus:outline-none focus:ring-2 focus:ring-aareon-bright focus:ring-offset-2"
          >
            <Image
              src="/aareon-logo.png"
              alt="Aareon"
              width={126}
              height={30}
              priority
            />
          </Link>

          <span className="hidden text-xs font-medium text-aareon-body/70 sm:block">
            {managerEmail}
          </span>
        </div>
      </header>

      <form
        onSubmit={submitForm}
        className="mx-auto max-w-5xl px-5 py-8 sm:px-8 lg:py-12"
      >
        <div className="mb-8">
          <p className="mb-3 font-mono text-[11px] font-semibold uppercase tracking-[0.28em] text-aareon-bright">
            Approval request
          </p>

          <h1 className="font-title text-[clamp(38px,6vw,64px)] italic leading-[1.02] text-aareon-headline">
            Aanvraag Vacature
          </h1>
        </div>

        <div className="space-y-8 rounded-lg border border-aareon-stone bg-white p-6 shadow-sm sm:p-8">
          <Section title="Basis">
            <div>
              <label className={labelClass} htmlFor="hiringManager">
                Hiring manager
              </label>

              <input
                id="hiringManager"
                className={inputClass}
                value={formData.hiringManager}
                onChange={(e) => setValue("hiringManager", e.target.value)}
              />

              <FieldError message={errors.hiringManager} />
            </div>

            <div>
              <label className={labelClass} htmlFor="team">
                Team
              </label>

              <input
                id="team"
                className={inputClass}
                value={formData.team}
                onChange={(e) => setValue("team", e.target.value)}
              />

              <FieldError message={errors.team} />
            </div>

            <div>
              <label className={labelClass} htmlFor="functie">
                Functie
              </label>

              <input
                id="functie"
                className={inputClass}
                value={formData.functie}
                onChange={(e) => setValue("functie", e.target.value)}
              />

              <FieldError message={errors.functie} />
            </div>

            <div>
              <label className={labelClass} htmlFor="datum">
                Datum
              </label>

              <input
                id="datum"
                type="date"
                max={today}
                className={inputClass}
                value={formData.datum}
                onChange={(e) => setValue("datum", e.target.value)}
              />

              <FieldError message={errors.datum} />
            </div>
          </Section>

          <Section title="Onderbouwing">
            <div className="md:col-span-2">
              <label className={labelClass} htmlFor="waaromNodig">
                Waarom nodig?
              </label>

              <textarea
                id="waaromNodig"
                className={textareaClass}
                value={formData.waaromNodig}
                onChange={(e) => setValue("waaromNodig", e.target.value)}
              />

              <FieldError message={errors.waaromNodig} />
            </div>

            <div className="md:col-span-2">
              <label className={labelClass} htmlFor="risicoBijNietInvullen">
                Risico bij niet invullen
              </label>

              <textarea
                id="risicoBijNietInvullen"
                className={textareaClass}
                value={formData.risicoBijNietInvullen}
                onChange={(e) => setValue("risicoBijNietInvullen", e.target.value)}
              />

              <FieldError message={errors.risicoBijNietInvullen} />
            </div>

            <div>
              <label className={labelClass}>
                Prioriteit
              </label>

              <div className="grid grid-cols-3 gap-2">
                {["Laag", "Middel", "Hoog"].map((option) => (
                  <button
                    key={option}
                    type="button"
                    onClick={() =>
                      setValue("prioriteit", option as "Laag" | "Middel" | "Hoog")
                    }
                    className={`h-12 rounded-lg border text-sm font-semibold transition ${
                      formData.prioriteit === option
                        ? "border-aareon-bright bg-aareon-bright text-white"
                        : "border-aareon-stone bg-white text-aareon-headline"
                    }`}
                  >
                    {option}
                  </button>
                ))}
              </div>

              <FieldError message={errors.prioriteit} />
            </div>
          </Section>

          <Section title="Interne invulling">
            <div>
              <label className={labelClass}>
                Intern mogelijk?
              </label>

              <div className="grid grid-cols-2 gap-2">
                {["Ja", "Nee"].map((option) => (
                  <button
                    key={option}
                    type="button"
                    onClick={() => setValue("internMogelijk", option)}
                    className={`h-12 rounded-lg border text-sm font-semibold transition ${
                      formData.internMogelijk === option
                        ? "border-aareon-bright bg-aareon-bright text-white"
                        : "border-aareon-stone bg-white text-aareon-headline"
                    }`}
                  >
                    {option}
                  </button>
                ))}
              </div>

              <FieldError message={errors.internMogelijk} />
            </div>

            <div>
              <label className={labelClass} htmlFor="interneToelichting">
                Toelichting
              </label>

              <textarea
                id="interneToelichting"
                className={textareaClass}
                value={formData.interneToelichting}
                onChange={(e) => setValue("interneToelichting", e.target.value)}
              />

              <FieldError message={errors.interneToelichting} />
            </div>

            <div className="md:col-span-2">
              <label className={labelClass} htmlFor="overwogenOpties">
                Overwogen opties
              </label>

              <textarea
                id="overwogenOpties"
                className={textareaClass}
                value={formData.overwogenOpties}
                onChange={(e) => setValue("overwogenOpties", e.target.value)}
              />

              <FieldError message={errors.overwogenOpties} />
            </div>
          </Section>

          <Section title="Financiële impact">
            <div>
              <label className={labelClass} htmlFor="kostenIndicatie">
                Kosten indicatie
              </label>

              <input
                id="kostenIndicatie"
                className={inputClass}
                value={formData.kostenIndicatie}
                onChange={(e) => setValue("kostenIndicatie", e.target.value)}
              />

              <FieldError message={errors.kostenIndicatie} />
            </div>

            <div>
              <label className={labelClass}>
                Binnen budget?
              </label>

              <div className="grid grid-cols-2 gap-2">
                {["Ja", "Nee"].map((option) => (
                  <button
                    key={option}
                    type="button"
                    onClick={() => setValue("binnenBudget", option)}
                    className={`h-12 rounded-lg border text-sm font-semibold transition ${
                      formData.binnenBudget === option
                        ? "border-aareon-bright bg-aareon-bright text-white"
                        : "border-aareon-stone bg-white text-aareon-headline"
                    }`}
                  >
                    {option}
                  </button>
                ))}
              </div>

              <FieldError message={errors.binnenBudget} />
            </div>

            <div className="md:col-span-2">
              <label className={labelClass} htmlFor="financieleToelichting">
                Toelichting
              </label>

              <textarea
                id="financieleToelichting"
                className={textareaClass}
                value={formData.financieleToelichting}
                onChange={(e) => setValue("financieleToelichting", e.target.value)}
              />

              <FieldError message={errors.financieleToelichting} />
            </div>
          </Section>

          <Section title="Impact">
            <div>
              <label className={labelClass} htmlFor="verwachteImpact">
                Verwachte impact (6-12m)
              </label>

              <textarea
                id="verwachteImpact"
                className={textareaClass}
                value={formData.verwachteImpact}
                onChange={(e) => setValue("verwachteImpact", e.target.value)}
              />

              <FieldError message={errors.verwachteImpact} />
            </div>

            <div>
              <label className={labelClass} htmlFor="bijdrageAanDoelen">
                Bijdrage aan doelen
              </label>

              <textarea
                id="bijdrageAanDoelen"
                className={textareaClass}
                value={formData.bijdrageAanDoelen}
                onChange={(e) => setValue("bijdrageAanDoelen", e.target.value)}
              />

              <FieldError message={errors.bijdrageAanDoelen} />
            </div>
          </Section>

          <Section title="Besluit">
            <div>
              <label className={labelClass} htmlFor="startdatum">
                Startdatum
              </label>

              <input
                id="startdatum"
                type="date"
                className={inputClass}
                value={formData.startdatum}
                onChange={(e) => setValue("startdatum", e.target.value)}
              />

              <FieldError message={errors.startdatum} />
            </div>

            <div>
              <label className={labelClass}>
                Domeinverantwoordelijke
              </label>

              <div className="grid grid-cols-2 gap-2">
                {["Go", "No-go"].map((option) => (
                  <button
                    key={option}
                    type="button"
                    onClick={() =>
                      setValue("domeinverantwoordelijkeBesluit", option)
                    }
                    className={`h-12 rounded-lg border text-sm font-semibold transition ${
                      formData.domeinverantwoordelijkeBesluit === option
                        ? "border-aareon-bright bg-aareon-bright text-white"
                        : "border-aareon-stone bg-white text-aareon-headline"
                    }`}
                  >
                    {option}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label
                className={labelClass}
                htmlFor="domeinverantwoordelijkeOpmerking"
              >
                Opmerking
              </label>

              <textarea
                id="domeinverantwoordelijkeOpmerking"
                className={textareaClass}
                value={formData.domeinverantwoordelijkeOpmerking}
                onChange={(e) =>
                  setValue("domeinverantwoordelijkeOpmerking", e.target.value)
                }
              />
            </div>

            <div>
              <label className={labelClass}>
                CFO
              </label>

              <div className="grid grid-cols-2 gap-2">
                {["Go", "No-go"].map((option) => (
                  <button
                    key={option}
                    type="button"
                    onClick={() => setValue("cfoBesluit", option)}
                    className={`h-12 rounded-lg border text-sm font-semibold transition ${
                      formData.cfoBesluit === option
                        ? "border-aareon-bright bg-aareon-bright text-white"
                        : "border-aareon-stone bg-white text-aareon-headline"
                    }`}
                  >
                    {option}
                  </button>
                ))}
              </div>
            </div>

            <div className="md:col-span-2">
              <label className={labelClass} htmlFor="cfoOpmerking">
                Opmerking
              </label>

              <textarea
                id="cfoOpmerking"
                className={textareaClass}
                value={formData.cfoOpmerking}
                onChange={(e) => setValue("cfoOpmerking", e.target.value)}
              />
            </div>
          </Section>
        </div>

        <div className="mt-8 flex justify-end">
          <button
            type="submit"
            disabled={isSubmitting}
            className="inline-flex min-h-12 items-center justify-center rounded-lg bg-aareon-blue px-7 py-3 text-sm font-semibold text-white shadow-sm transition-all duration-300 hover:-translate-y-0.5 hover:bg-[#0a1d8a] hover:shadow-[0_12px_24px_rgba(5,17,99,0.18)] focus:outline-none focus:ring-2 focus:ring-aareon-bright focus:ring-offset-2 disabled:translate-y-0 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {isSubmitting ? "Submitting..." : "Aanvraag verzenden"}
          </button>
        </div>
      </form>

      {showConfirmation && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-aareon-headline/45 px-5 py-8 backdrop-blur-sm"
          role="dialog"
          aria-modal="true"
          aria-labelledby="confirmation-title"
        >
          <div className="w-full max-w-xl rounded-lg border border-aareon-stone bg-white p-6 text-center shadow-[0_24px_80px_rgba(8,19,38,0.22)] sm:p-8">
            <div
              className="mx-auto mb-5 h-1 w-16 rounded-full bg-aareon-bright"
              aria-hidden="true"
            />

            <h2
              id="confirmation-title"
              className="text-2xl font-semibold text-aareon-headline"
            >
              Request submitted
            </h2>

            <p className="mt-4 text-sm leading-6 text-aareon-body/78">
              Your request has been submitted. You will receive a confirmation by
              email. The recruiter has also received the request and will review
              it. The recruiter will then forward the request to the directors
              for approval. You will receive further instructions from the
              recruiter soon.
            </p>

            <button
              type="button"
              onClick={() => router.push("/")}
              className="mt-7 inline-flex min-h-11 items-center justify-center rounded-lg bg-aareon-blue px-6 py-3 text-sm font-semibold text-white transition-all duration-300 hover:-translate-y-0.5 hover:bg-[#0a1d8a] hover:shadow-[0_12px_24px_rgba(5,17,99,0.18)] focus:outline-none focus:ring-2 focus:ring-aareon-bright focus:ring-offset-2"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </main>
  );
}