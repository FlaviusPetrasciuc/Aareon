"use client";

import React, { useEffect, useState } from "react";
import { ForwardToRecruiter } from "@/components/forward-to-recruiter/ForwardToRecruiter";
import { getSession } from "@/lib/session";
import { useRouter } from "next/navigation";
import { IntakeSession } from "@/types/intake";
import Navbar from "@/components/globals/Navbar";

const STEPS = [
  "Basis",
  "Functieomschrijving",
  "Overzicht",
  "Doorsturen naar recruiter",
];

const CURRENT_STEP = 4;

export default function ForwardToRecruiterPage() {
  const router = useRouter();

  const [session, setSession] = useState<IntakeSession | null>(null);
  const [jobDescription, setJobDescription] = useState("");

  useEffect(() => {
    const saved = getSession();

    if (!saved) {
      router.push("/");
      return;
    }

    setSession(saved);

    const savedJobDescription =
      localStorage.getItem("jobDescriptionText") || "";

    setJobDescription(savedJobDescription);
  }, [router]);

  if (!session) return null;

  return (
    <>
      <Navbar />

      <main className="min-h-screen bg-[#f7f6f3] text-[#1f2937]">
        <div className="mx-auto max-w-7xl px-8 py-8">
          <div className="mb-10 flex items-start justify-between">
            <div>
              <p className="mb-3 text-sm text-gray-500">
                Doorsturen naar recruiter · 4/4
              </p>

              <h1 className="text-5xl font-serif tracking-tight text-[#172033]">
                Nieuwe vacature aanmaken
              </h1>

              <p className="mt-3 text-lg text-gray-500">
                Vier stappen — ongeveer 3 minuten
              </p>
            </div>
          </div>

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
                        backgroundColor: isDone
                          ? "#50B214"
                          : isCurrent
                          ? "var(--color-blue)"
                          : "white",
                        borderColor: isDone
                          ? "#50B214"
                          : isCurrent
                          ? "var(--color-blue)"
                          : "var(--color-stone)",
                        color:
                          isDone || isCurrent
                            ? "white"
                            : "var(--color-body)",
                      }}
                    >
                      {isDone ? "✓" : stepNumber}
                    </div>

                    <span
                      className="text-[15px]"
                      style={{
                        color: isCurrent
                          ? "var(--color-headline)"
                          : "var(--color-body)",
                      }}
                    >
                      {step}
                    </span>
                  </div>

                  {index < STEPS.length - 1 && (
                    <div
                      className="mx-5 h-px flex-1"
                      style={{ backgroundColor: "var(--color-stone)" }}
                    />
                  )}
                </React.Fragment>
              );
            })}
          </div>

          <div className="overflow-hidden rounded-2xl border border-[#e7e5e4] bg-[#f7f6f3]">
            <div className="p-8">
              <ForwardToRecruiter
                session={session}
                jobDescription={jobDescription}
                onBack={() => router.push("/overview")}
                onSubmitted={() => router.push("/")}
              />
            </div>
          </div>
        </div>
      </main>
    </>
  );
}