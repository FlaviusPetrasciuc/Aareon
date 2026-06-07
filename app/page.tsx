"use client";

import { useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { AAREON_EMAIL_DOMAINS, isAllowedAareonEmail, normalizeEmail } from "@/lib/aareonAccess";
import LoadingSpinner from "@/components/globals/LoadingSpinner";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [touched, setTouched] = useState(false);
  const [loading, setLoading] = useState(false);
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const isValid = isAllowedAareonEmail(email) && password.length >= 8 && password === confirmPassword;
  const showError = touched && !isValid;
  const allowedDomains = AAREON_EMAIL_DOMAINS.map((domain) => `@${domain}`).join(" or ");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setTouched(true);

    if (!isValid) {
      alert(`Please enter a valid ${allowedDomains} email address.`);

      return;
    }
    setLoading(true);

    const normalizedEmail = normalizeEmail(email);
    localStorage.setItem("managerEmail", normalizedEmail);
    localStorage.removeItem("aareonApprovalStatus");
    document.cookie = `aareon_session=${normalizedEmail}; path=/; max-age=86400`;
    document.cookie = "aareon_approval=; path=/; max-age=0";

    await new Promise((r) => setTimeout(r, 900));
    router.push("/approval");
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
            Enter your Aareon corporate email to start the approval validation.
          </p>

          <LoadingSpinner isVisible={loading} />

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
                placeholder="you@gmail.com"
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
                  Please enter a valid {allowedDomains} email address.
                </p>
              )}
            </div>

  {/* Password */}
  <div className="mb-5">
    <label
      htmlFor="password"
      className="block font-mono text-[10px] font-medium tracking-[0.15em] uppercase text-aareon-body mb-2"
    >
      Password
    </label>
    <input
      id="password"
      type="password"
      placeholder="••••••••"
      value={password}
      onChange={(e) => setPassword(e.target.value)}
      className="w-full px-4 py-3 font-body text-sm font-light text-aareon-headline bg-white rounded-lg outline-none transition-all border-[1.5px] border-aareon-stone focus:border-aareon-bright focus:shadow-[0_0_0_3px_rgba(8,109,251,0.12)]"
    />
  </div>

  {/* Confirm Password */}
  <div className="mb-5">
    <label
      htmlFor="confirm-password"
      className="block font-mono text-[10px] font-medium tracking-[0.15em] uppercase text-aareon-body mb-2"
    >
      Confirm password
    </label>
    <input
      id="confirm-password"
      type="password"
      placeholder="••••••••"
      value={confirmPassword}
      onChange={(e) => setConfirmPassword(e.target.value)}
      className={[
        "w-full px-4 py-3 font-body text-sm font-light text-aareon-headline bg-white rounded-lg outline-none transition-all border-[1.5px]",
        confirmPassword && password !== confirmPassword
          ? "border-aareon-coral shadow-[0_0_0_3px_rgba(255,127,98,0.12)]"
          : "border-aareon-stone focus:border-aareon-bright focus:shadow-[0_0_0_3px_rgba(8,109,251,0.12)]",
      ].join(" ")}
    />
    {confirmPassword && password !== confirmPassword && (
      <p className="font-body text-xs text-aareon-coral mt-1.5">
        Passwords do not match.
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
