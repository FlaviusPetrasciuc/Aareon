"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { signUp } from "@/app/actions/auth";

export default function RegisterPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [touched, setTouched] = useState({
    email: false,
    password: false,
    confirmPassword: false,
  });
  const [loading, setLoading] = useState(false);
  const [apiError, setApiError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const isValidPassword = password.length >= 8;
  const isPasswordMatch = password === confirmPassword;

  const errors = {
    password: touched.password && !isValidPassword
      ? "Password must be at least 8 characters."
      : null,
    confirmPassword: touched.confirmPassword && !isPasswordMatch
      ? "Passwords do not match."
      : null,
  };

  const isFormValid = email.length > 0 && isValidPassword && isPasswordMatch;

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setTouched({ email: true, password: true, confirmPassword: true });
    if (!isFormValid) return;

    setLoading(true);
    setApiError(null);

    const formData = new FormData();
    formData.set("email", email.trim().toLowerCase());
    formData.set("password", password);
    formData.set("origin", window.location.origin);

    const result = await signUp(formData);

    if (result?.error) {
      setApiError(result.error);
      setLoading(false);
      return;
    }

    setSuccess(result?.success ?? "Account created!");
    setLoading(false);
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
            <span key={p} className="font-mono text-[9px] font-medium tracking-[0.15em] uppercase text-white/45 border border-white/15 rounded-full px-3 py-1">
              {p}
            </span>
          ))}
        </div>
      </div>

      {/* ── Right form panel ── */}
      <div className="flex flex-1 items-center justify-center bg-aareon-sand px-10 py-12 overflow-y-auto">
        <div className="w-full max-w-sm py-4">

          {success ? (
            <div className="text-center py-10">
              <div className="flex h-14 w-14 items-center justify-center rounded-full bg-[#16a34a] mx-auto mb-5">
                <svg className="h-7 w-7 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <h2 className="font-title text-[26px] font-normal text-aareon-headline italic mb-2">
                Account created!
              </h2>
              <p className="text-sm text-aareon-body font-light">
                {success}
              </p>
            </div>
          ) : (
            <>
              <h2 className="font-title text-[28px] font-normal text-aareon-headline leading-tight mb-2 italic">
                Create your<br />account
              </h2>
              <p className="text-sm text-aareon-body font-light mb-8 leading-relaxed font-body">
                Sign up with your authorised Aareon email.
              </p>

              <form onSubmit={handleSubmit} noValidate className="space-y-4">

                {/* Email */}
                <div>
                  <label htmlFor="email" className="block font-mono text-[10px] font-medium tracking-[0.15em] uppercase text-aareon-body mb-2">
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
                    onBlur={() => setTouched((t) => ({ ...t, email: true }))}
                    className="w-full px-4 py-3 font-body text-sm font-light text-aareon-headline bg-white rounded-lg outline-none transition-all border-[1.5px] border-aareon-stone focus:border-aareon-bright focus:shadow-[0_0_0_3px_rgba(8,109,251,0.12)]"
                  />
                </div>

                {/* Password */}
                <div>
                  <label htmlFor="password" className="block font-mono text-[10px] font-medium tracking-[0.15em] uppercase text-aareon-body mb-2">
                    Password
                  </label>
                  <div className="relative">
                    <input
                      id="password"
                      type={showPassword ? "text" : "password"}
                      autoComplete="new-password"
                      placeholder="Min. 8 characters"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      onBlur={() => setTouched((t) => ({ ...t, password: true }))}
                      className={[
                        "w-full px-4 py-3 pr-11 font-body text-sm font-light text-aareon-headline bg-white rounded-lg outline-none transition-all",
                        errors.password
                          ? "border-[1.5px] border-aareon-coral shadow-[0_0_0_3px_rgba(255,127,98,0.12)]"
                          : "border-[1.5px] border-aareon-stone focus:border-aareon-bright focus:shadow-[0_0_0_3px_rgba(8,109,251,0.12)]",
                      ].join(" ")}
                    />
                    <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 text-aareon-body/40 hover:text-aareon-body transition-colors" tabIndex={-1}>
                      {showPassword
                        ? <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M3.98 8.223A10.477 10.477 0 001.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.45 10.45 0 0112 4.5c4.756 0 8.773 3.162 10.065 7.498a10.523 10.523 0 01-4.293 5.774M6.228 6.228L3 3m3.228 3.228l3.65 3.65m7.894 7.894L21 21m-3.228-3.228l-3.65-3.65m0 0a3 3 0 10-4.243-4.243m4.242 4.242L9.88 9.88" /></svg>
                        : <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z" /><path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
                      }
                    </button>
                  </div>
                  {errors.password && <p className="font-body text-xs text-aareon-coral mt-1.5">{errors.password}</p>}
                </div>

                {/* Confirm password */}
                <div>
                  <label htmlFor="confirmPassword" className="block font-mono text-[10px] font-medium tracking-[0.15em] uppercase text-aareon-body mb-2">
                    Confirm password
                  </label>
                  <div className="relative">
                    <input
                      id="confirmPassword"
                      type={showConfirmPassword ? "text" : "password"}
                      autoComplete="new-password"
                      placeholder="Repeat your password"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      onBlur={() => setTouched((t) => ({ ...t, confirmPassword: true }))}
                      className={[
                        "w-full px-4 py-3 pr-11 font-body text-sm font-light text-aareon-headline bg-white rounded-lg outline-none transition-all",
                        errors.confirmPassword
                          ? "border-[1.5px] border-aareon-coral shadow-[0_0_0_3px_rgba(255,127,98,0.12)]"
                          : "border-[1.5px] border-aareon-stone focus:border-aareon-bright focus:shadow-[0_0_0_3px_rgba(8,109,251,0.12)]",
                      ].join(" ")}
                    />
                    <button type="button" onClick={() => setShowConfirmPassword(!showConfirmPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 text-aareon-body/40 hover:text-aareon-body transition-colors" tabIndex={-1}>
                      {showConfirmPassword
                        ? <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M3.98 8.223A10.477 10.477 0 001.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.45 10.45 0 0112 4.5c4.756 0 8.773 3.162 10.065 7.498a10.523 10.523 0 01-4.293 5.774M6.228 6.228L3 3m3.228 3.228l3.65 3.65m7.894 7.894L21 21m-3.228-3.228l-3.65-3.65m0 0a3 3 0 10-4.243-4.243m4.242 4.242L9.88 9.88" /></svg>
                        : <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z" /><path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
                      }
                    </button>
                  </div>
                  {errors.confirmPassword && <p className="font-body text-xs text-aareon-coral mt-1.5">{errors.confirmPassword}</p>}
                </div>

                {/* API error */}
                {apiError && (
                  <div className="rounded-lg border border-aareon-coral/30 bg-aareon-coral/10 px-4 py-3">
                    <p className="font-body text-xs text-aareon-coral">{apiError}</p>
                  </div>
                )}

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full flex items-center justify-center gap-2 px-6 py-3.5 bg-aareon-blue hover:bg-[#0a1d8a] disabled:opacity-60 disabled:cursor-not-allowed text-white font-body text-[13px] font-medium tracking-wide rounded-lg transition-colors mt-2"
                >
                  {loading
                    ? <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    : <>Create account <span>→</span></>
                  }
                </button>
              </form>

              <div className="mt-6 flex items-center gap-3">
                <div className="flex-1 h-px bg-aareon-stone" />
                <span className="font-mono text-[10px] text-aareon-body/40 uppercase tracking-widest">or</span>
                <div className="flex-1 h-px bg-aareon-stone" />
              </div>

              <p className="mt-4 text-center font-body text-[13px] text-aareon-body/70">
                Already have an account?{" "}
                <Link href="/" className="font-medium text-aareon-blue hover:text-aareon-bright transition-colors">
                  Sign in
                </Link>
              </p>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
