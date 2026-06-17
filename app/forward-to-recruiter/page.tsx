"use client";

import React, { useEffect, useState } from "react";
import { ForwardToRecruiter } from "@/components/forward-to-recruiter/ForwardToRecruiter";
import { getSession } from "@/lib/session";
import { useRouter } from "next/navigation";
import { IntakeSession } from "@/types/intake";
import Navbar from "@/components/globals/Navbar";
import Stepper from "@/components/globals/Stepper";
import PageHeader from "@/components/globals/PageHeader";

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
          {/* Header */}
          <PageHeader
            stepLabel="Doorstuuren naar recruiter"
            currentStep={CURRENT_STEP}
            totalSteps={STEPS.length}
            title="Nieuwe vacature aanmaken"
            subtitle="Vier stappen — ongeveer 5 minuten"
          />

          <Stepper
            steps={STEPS}
            currentStep={CURRENT_STEP}
          />

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