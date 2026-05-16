"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function EmailPage() {
  const router = useRouter();
  const [managerEmail, setManagerEmail] = useState("");

  const normalizedEmail = managerEmail.trim().toLowerCase();

  // For testing: allow @gmail.com too.
  // Later remove the gmail line for production.
  const isAllowedEmail =
    normalizedEmail.endsWith("@aareon.nl") ||
    normalizedEmail.endsWith("@gmail.com");

  const handleContinue = () => {
    if (!isAllowedEmail) {
      alert("Please enter a valid @aareon.nl email address.");
      return;
    }

    localStorage.setItem("managerEmail", normalizedEmail);
    router.push("/intake");
  };

  return (
    <main className="flex h-screen w-full items-center justify-center bg-aareon-sand">
      <div className="w-[420px] bg-white border-2 border-aareon-headline p-8 shadow-[12px_12px_0px_0px_rgba(8,19,38,0.1)]">
        <div className="mb-6 flex items-center gap-4">
          <div className="flex h-12 w-12 items-center justify-center bg-aareon-headline text-white font-black text-2xl italic border-b-4 border-r-4 border-aareon-bright">
            A
          </div>

          <div>
            <h1 className="font-title text-2xl italic text-aareon-headline">
              Recruiter Intake
            </h1>

            <p className="font-mono text-[9px] uppercase tracking-[0.3em] text-aareon-bright font-bold">
              Aareon AI
            </p>
          </div>
        </div>

        <h2 className="mb-2 font-title text-3xl text-aareon-headline">
          Welcome
        </h2>

        <p className="mb-6 text-sm text-aareon-body/70">
          Please enter your email to continue to the AI recruiter intake.
        </p>

        <label className="block font-mono text-[10px] font-bold uppercase tracking-[0.2em] text-aareon-headline mb-2">
          Manager Email
        </label>

        <input
          type="email"
          value={managerEmail}
          onChange={(e) => setManagerEmail(e.target.value)}
          placeholder="name@aareon.nl"
          className="w-full border-2 border-aareon-headline px-3 py-3 text-sm outline-none"
        />

        {managerEmail && !isAllowedEmail && (
          <p className="mt-2 text-xs font-bold text-red-600">
            Email must end with @aareon.nl
          </p>
        )}

        {isAllowedEmail && (
          <p className="mt-2 text-xs font-bold text-green-700">
            Valid email ✓
          </p>
        )}

        <button
          onClick={handleContinue}
          disabled={!isAllowedEmail}
          className="mt-6 w-full bg-aareon-blue px-6 py-3 font-bold text-white disabled:opacity-50"
        >
          Continue to AI Intake
        </button>
      </div>
    </main>
  );
}