"use client";

import { useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [touched, setTouched] = useState(false);
  const [loading, setLoading] = useState(false);

  const isValid = /^[^\s@]+@(aareon\.nl|gmail\.com)$/.test(email);
  const showError = touched && !isValid;

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setTouched(true);

    if (!isValid) {
      alert("Please enter a valid @aareon.nl or @gmail.com email address.");

      return;
    };
    setLoading(true);

    const normalizedEmail = email.trim().toLowerCase();
    localStorage.setItem("managerEmail", normalizedEmail);
    document.cookie = `aareon_session=${normalizedEmail}; path=/; max-age=86400`;

    await new Promise((r) => setTimeout(r, 900));
    router.push("/intake");
  }

  return (
    <div className="flex min-h-screen w-full">

      {/* ── Left brand panel ── */}
      <div className="relative hidden md:flex flex-col justify-between overflow-hidden w-[45%] shrink-0 bg-aareon-blue px-12 py-12">
        {/* blobs */}
        <div className="absolute -top-20 -left-20 w-80 h-80 rounded-full bg-aareon-bright/15 pointer-events-none" />
        <div className="absolute -bottom-24 -right-14 w-96 h-96 rounded-full bg-aareon-bright/10 pointer-events-none" />

        {/* Logo — white */}
        <div className="relative z-10">
          <Image
            src="/aareon-logo.png"
            alt="Aareon"
            width={120}
            height={28}
            className="brightness-0 invert"
          />
        </div>

        {/* Hero */}
        <div className="relative z-10">
          <h1 className="font-title text-[clamp(34px,4vw,50px)] font-normal leading-[1.08] text-white mb-5 italic">
            Connecting<br />
            <span className="text-aareon-coral not-italic">futures</span><br />
            together.
          </h1>
          <p className="text-sm font-light text-white/60 leading-relaxed max-w-xs font-body">
            The leading property SaaS platform connecting people, process and property across Europe.
          </p>
        </div>

        {/* Pills */}
        <div className="relative z-10 flex flex-wrap gap-2">
          {["People", "Process", "Property"].map((p) => (
            <span
              key={p}
              className="font-mono text-[9px] font-medium tracking-[0.15em] uppercase text-white/45 border border-white/15 rounded-full px-3 py-1"
            >
              {p}
            </span>
          ))}
        </div>
      </div>

      {/* ── Right form panel ── */}
      <div className="flex flex-1 items-center justify-center bg-aareon-sand px-10 py-12">
        <div className="w-full max-w-sm">

          <h2 className="font-title text-[28px] font-normal text-aareon-headline leading-tight mb-2 italic">
            Sign in to<br />your workspace
          </h2>
          <p className="text-sm text-aareon-body font-light mb-9 leading-relaxed font-body">
            Enter your company email to continue.
          </p>

          {loading && (
            <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
              <div className="bg-white rounded-xl p-8 flex flex-col items-center gap-4 shadow-xl">
                <div className="w-12 h-12 border-4 border-aareon-stone border-t-aareon-bright rounded-full animate-spin" />

                <p className="text-aareon-headline font-body text-lg">
                  Redirecting you to the next page...
                </p>

                <p className="text-aareon-body/60 text-sm">
                  Please wait, this will only take a moment
                </p>
              </div>
            </div>
          )}

          <form onSubmit={handleSubmit} noValidate>
            <div className="mb-5">
              <label
                htmlFor="email"
                className="block font-mono text-[10px] font-medium tracking-[0.15em] uppercase text-aareon-body mb-2"
              >
                Company email
              </label>
              <input
                id="email"
                type="email"
                autoFocus
                autoComplete="email"
                placeholder="you@aareon.nl"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                onBlur={() => setTouched(true)}
                className={[
                  "w-full px-4 py-3 font-body text-sm font-light text-aareon-headline bg-white rounded-lg outline-none transition-all",
                  showError
                    ? "border-[1.5px] border-aareon-coral shadow-[0_0_0_3px_rgba(255,127,98,0.12)]"
                    : "border-[1.5px] border-aareon-stone focus:border-aareon-bright focus:shadow-[0_0_0_3px_rgba(8,109,251,0.12)]",
                ].join(" ")}
              />
              {showError && (
                <p className="font-body text-xs text-aareon-coral mt-1.5">
                  Please enter a valid @aareon.nl or @gmail.com email address.
                </p>
              )}
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full flex items-center justify-center gap-2 px-6 py-3.5 bg-aareon-blue hover:bg-[#0a1d8a] disabled:opacity-60 disabled:cursor-not-allowed text-white font-body text-[13px] font-medium tracking-wide rounded-lg transition-colors mt-1"
            >
              {loading ? (
                <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                <>Continue <span>→</span></>
              )}
            </button>
          </form>

          {/* Footer */}
          <div className="mt-4 pt-2 border-t border-aareon-stone text-center">
            <span className="font-body text-[11px] text-aareon-body/60 cursor-pointer hover:text-aareon-body transition-colors">
              Privacy policy
            </span>
          </div>

        </div>
      </div>
    </div>
  );
}
