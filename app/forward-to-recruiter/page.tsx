'use client';

import { useState } from 'react';

export default function ForwardToRecruiterPage() {
    const [managerEmail, setManagerEmail] = useState('');
    const [recruiterEmail, setRecruiterEmail] = useState('');
    const [submitted, setSubmitted] = useState(false);

    const handleSubmit = async () => {
        if (!managerEmail || !recruiterEmail) return;
        setSubmitted(true);
    };

    if (submitted) {
        return (
            <main className="min-h-screen bg-[#f7f6f3] flex items-center justify-center">
                <div className="text-center space-y-4">
                    <div className="w-16 h-16 rounded-full bg-[#3B6D11] flex items-center justify-center mx-auto">
                        <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3">
                            <path d="M20 6L9 17l-5-5" />
                        </svg>
                    </div>
                    <h2 className="text-2xl font-serif text-[#172033]">Forwarded successfully</h2>
                    <p className="text-gray-500 text-sm">The job posting has been sent to both recipients.</p>
                    <button
                        onClick={() => setSubmitted(false)}
                        className="text-sm text-[#6b6fcf] underline"
                    >
                        Send another
                    </button>
                </div>
            </main>
        );
    }

    return (
        <main className="min-h-screen bg-[#f7f6f3] text-[#1f2937]">
            <div className="mx-auto max-w-7xl px-8 py-8">

                {/* Header */}
                <div className="mb-10">
                    <p className="mb-3 text-sm text-gray-500">Forward to recruiter · 4/4</p>
                    <h1 className="text-5xl font-serif tracking-tight text-[#172033]">
                        Create new job posting
                    </h1>
                    <p className="mt-3 text-lg text-gray-500">Four steps — about 3 minutes</p>
                </div>

                {/* Stepper */}
                <div className="mb-10 flex items-center">
                    {['Basics', 'Job description', 'Overview', 'Forward to recruiter'].map((step, index) => (
                        <div key={step} className="flex items-center flex-1 last:flex-none">
                            <div className="flex items-center gap-3">
                                <div className={`flex h-10 w-10 items-center justify-center rounded-full border text-sm font-medium
                                    ${index === 3
                                        ? 'border-[#14213d] bg-[#14213d] text-white'
                                        : 'border-[#3B6D11] bg-[#3B6D11] text-white'
                                    }`}>
                                    {index === 3 ? '4' : '✓'}
                                </div>
                                <span className={`text-[15px] ${index === 3 ? 'text-[#172033]' : 'text-[#3B6D11]'}`}>
                                    {step}
                                </span>
                            </div>
                            {index < 3 && <div className="mx-5 h-px flex-1 bg-[#3B6D11]" />}
                        </div>
                    ))}
                </div>

                {/* Form */}
                <div className="overflow-hidden rounded-2xl border border-[#e7e5e4] bg-[#f7f6f3]">
                    <div className="space-y-6 p-8">

                        <p className="text-sm text-gray-500">
                            The completed job posting will be forwarded to the following recipients.
                        </p>

                        {/* Summary */}
                        <div className="bg-white rounded-xl border border-[#e7e5e4] p-5 space-y-3">
                            <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide">Summary</p>
                            <div className="flex justify-between text-sm">
                                <span className="text-gray-400">Step</span>
                                <span className="font-medium text-[#172033]">4 of 4 — Forward to recruiter</span>
                            </div>
                            <div className="flex justify-between text-sm">
                                <span className="text-gray-400">Status</span>
                                <span className="font-medium text-[#3B6D11]">Ready to send ✓</span>
                            </div>
                        </div>

                        {/* Manager email */}
                        <div>
                            <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">
                                Manager email <span className="text-red-400">*</span>
                            </label>
                            <input
                                type="email"
                                value={managerEmail}
                                onChange={(e) => setManagerEmail(e.target.value)}
                                placeholder="e.g. p.janssen@aareon.nl"
                                className="w-full px-3 py-3 bg-white border border-[#d6d3d1] rounded-xl text-sm text-[#172033] placeholder-gray-300 focus:outline-none focus:border-[#6b6fcf] focus:ring-2 focus:ring-[#6b6fcf]/10"
                            />
                        </div>

                        {/* Recruiter email */}
                        <div>
                            <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">
                                Recruiter email <span className="text-red-400">*</span>
                            </label>
                            <input
                                type="email"
                                value={recruiterEmail}
                                onChange={(e) => setRecruiterEmail(e.target.value)}
                                placeholder="e.g. l.visser@aareon.nl"
                                className="w-full px-3 py-3 bg-white border border-[#d6d3d1] rounded-xl text-sm text-[#172033] placeholder-gray-300 focus:outline-none focus:border-[#6b6fcf] focus:ring-2 focus:ring-[#6b6fcf]/10"
                            />
                        </div>

                    </div>

                    {/* Footer */}
                    <div className="flex items-center justify-between border-t border-[#e7e5e4] bg-[#f7f6f3] px-8 py-6">
                        <button
                            onClick={() => window.history.back()}
                            className="rounded-xl border border-[#d6d3d1] bg-white px-5 py-3 font-medium text-[#172033] transition hover:bg-gray-50"
                        >
                            ← Back
                        </button>
                        <div className="flex items-center gap-3">
                            <button className="rounded-xl border border-[#d6d3d1] bg-white px-5 py-3 font-medium text-[#172033] transition hover:bg-gray-50">
                                Save draft
                            </button>
                            <button
                                onClick={handleSubmit}
                                disabled={!managerEmail || !recruiterEmail}
                                className="rounded-xl bg-[#6b6fcf] px-5 py-3 font-medium text-white transition hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                Forward to recruiter →
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </main>
    );
}