"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { signIn } from "@/app/actions/auth";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [touched, setTouched] = useState(false);
  const [loading, setLoading] = useState(false);
  const [apiError, setApiError] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setTouched(true);
    setApiError(null);

    if (!email || !password) return;
    setLoading(true);

    const formData = new FormData();
    formData.set("email", email.trim().toLowerCase());
    formData.set("password", password);

    const result = await signIn(formData);

    // If signIn succeeds it redirects server-side, so we only get here on error
    if (result?.error) {
      setApiError(result.error);
      setLoading(false);
    }
  }

  return (
    <div className="flex min-h-screen w-full">

      {/* ── Left brand panel ── */}
      <div className="relative hidden md:flex flex-col justify-between overflow-hidden w-[45%] shrink-0 bg-aareon-blue px-12 py-12">
        <div className="absolute -top-20 -left-20 w-80 h-80 rounded-full bg-aareon-bright/15 pointer-events-none" />
        <div className="absolute -bottom-24 -right-14 w-96 h-96 rounded-full bg-aareon-bright/10 pointer-events-none" />

        <div className="relative z-10">
          <Image
            src="/aareon-logo.png"
            alt="Aareon"
            width={120}
            height={28}
            className="brightness-0 invert"
          />
        </div>

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
            Inloggen bij<br />uw werkruimte
          </h2>
          <p className="text-sm text-aareon-body font-light mb-9 leading-relaxed font-body">
            Voer uw Aareon-zakelijk e-mailadres in om de goedkeuringsvalidatie te starten.
          </p>

          <form onSubmit={handleSubmit} noValidate>
            <div className="mb-5">
              <label
                htmlFor="email"
                className="block font-mono text-[10px] font-medium tracking-[0.15em] uppercase text-aareon-body mb-2"
              >
                Zakelijk e-mailadres
              </label>
              <input
                id="email"
                type="email"
                autoFocus
                autoComplete="email"
                placeholder="voorbeeld@aareon.nl"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                onBlur={() => setTouched(true)}
                className="w-full px-4 py-3 font-body text-sm font-light text-aareon-headline bg-white rounded-lg outline-none transition-all border-[1.5px] border-aareon-stone focus:border-aareon-bright focus:shadow-[0_0_0_3px_rgba(8,109,251,0.12)]"
              />
            </div>

            <div className="mb-5">
              <label
                htmlFor="password"
                className="block font-mono text-[10px] font-medium tracking-[0.15em] uppercase text-aareon-body mb-2"
              >
                Wachtwoord
              </label>
              <input
                id="password"
                type="password"
                autoComplete="current-password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                onBlur={() => setTouched(true)}
                className="w-full px-4 py-3 font-body text-sm font-light text-aareon-headline bg-white rounded-lg outline-none transition-all border-[1.5px] border-aareon-stone focus:border-aareon-bright focus:shadow-[0_0_0_3px_rgba(8,109,251,0.12)]"
              />
            </div>

            {apiError && (
              <div className="mb-4 rounded-lg border border-aareon-coral/30 bg-aareon-coral/10 px-4 py-3">
                <p className="font-body text-xs text-aareon-coral">{apiError}</p>
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full flex items-center justify-center gap-2 px-6 py-3.5 bg-aareon-blue hover:bg-[#0a1d8a] disabled:opacity-60 disabled:cursor-not-allowed text-white font-body text-[13px] font-medium tracking-wide rounded-lg transition-colors mt-1"
            >
              {loading ? (
                <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                <>Doorgaan <span>→</span></>
              )}
            </button>
          </form>

          <div className="mt-4 text-center">
            <span className="font-body text-[13px] text-aareon-body/70">
              Heeft u nog geen account?{" "}
              <Link href="/register" className="font-medium text-aareon-blue hover:text-aareon-bright transition-colors">
                Account aanmaken
              </Link>
            </span>
          </div>

        </div>
      </div>
    </div>
  );
}
