'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';

const steps = [
    'Basics',
    'Job description',
    'Overview',
    'Forward to recruiter',
];

export default function Overview() {
    const [currentStep, setCurrentStep] = useState(3);
    const [jobDescription, setJobDescription] = useState('');
    const router = useRouter();

    const handleNext = () => {
        router.push('/ai-recruiter');
    };

    const handleBack = () => {
        router.push('/forward-to-recruiter');
    };

    return (
        <main className="min-h-screen bg-[#f7f6f3] text-[#1f2937]">
            <div className="mx-auto max-w-7xl px-8 py-8">
                {/* Header */}
                <div className="mb-10 flex items-start justify-between">
                    <div>
                        <p className="mb-3 text-sm text-gray-500">Overview · 3/4</p>

                        <h1 className="text-5xl font-serif tracking-tight text-[#172033]">
                            Create new job posting
                        </h1>

                        <p className="mt-3 text-lg text-gray-500">
                            Four steps — about 3 minutes
                        </p>
                    </div>
                </div>

                {/* Stepper */}
                <div className="mb-10 flex items-center">
                    {steps.map((step, index) => {
                        const stepNumber = index + 1;
                        const active = currentStep === stepNumber;

                        return (
                            <React.Fragment key={step + index}>
                                <div className="flex items-center gap-3">
                                    <div
                                        className={`
                      flex h-10 w-10 items-center justify-center rounded-full border text-sm font-medium
                      ${active
                                                ? 'border-[#14213d] bg-[#14213d] text-white'
                                                : 'border-[#d6d3d1] bg-white text-gray-500'
                                            }
                    `}
                                    >
                                        {stepNumber}
                                    </div>

                                    <span
                                        className={`text-[15px] ${active ? 'text-[#172033]' : 'text-gray-500'
                                            }`}
                                    >
                                        {step}
                                    </span>
                                </div>

                                {index < steps.length - 1 && (
                                    <div className="mx-5 h-px flex-1 bg-[#ddd8d2]" />
                                )}
                            </React.Fragment>
                        );
                    })}
                </div>

                {/* Form */}
                <div className="space-y-8 p-8">
                    <div>
                        <h2 className="text-2xl font-serif text-[#172033] mb-2">Frontend Developer</h2>
                        <p className="text-gray-500 text-sm">Review the details of your job posting before moving on.</p>
                    </div>

                    {/* Job Details Grid */}
                    <div className="grid grid-cols-2 gap-6">
                        <div>
                            <h3 className="text-xs font-semibold uppercase tracking-wider text-gray-400 mb-2">Location</h3>
                            <p className="text-[#172033]">Emmen, Netherlands</p>
                        </div>
                        <div>
                            <h3 className="text-xs font-semibold uppercase tracking-wider text-gray-400 mb-2">Department</h3>
                            <p className="text-[#172033]">IT</p>
                        </div>
                        <div>
                            <h3 className="text-xs font-semibold uppercase tracking-wider text-gray-400 mb-2">Work Mode</h3>
                            <p className="text-[#172033]">Hybrid (2-3 days per week in office)</p>
                        </div>
                        <div>
                            <h3 className="text-xs font-semibold uppercase tracking-wider text-gray-400 mb-2">Employment Type</h3>
                            <p className="text-[#172033]">Full-time</p>
                        </div>
                        <div>
                            <h3 className="text-xs font-semibold uppercase tracking-wider text-gray-400 mb-2">Salary Range</h3>
                            <p className="text-[#172033]">€4,000 - €6,000 per month</p>
                        </div>
                        <div>
                            <h3 className="text-xs font-semibold uppercase tracking-wider text-gray-400 mb-2">Company Phone</h3>
                            <p className="text-[#172033]">✓ Provided</p>
                        </div>
                        <div>
                            <h3 className="text-xs font-semibold uppercase tracking-wider text-gray-400 mb-2">Bonus Structure</h3>
                            <p className="text-[#172033]">Standard bonus structure based on performance</p>
                        </div>
                        <div>
                            <h3 className="text-xs font-semibold uppercase tracking-wider text-gray-400 mb-2">Education</h3>
                            <p className="text-[#172033]">Minimum HBO degree in Computer Science or related field</p>
                        </div>
                    </div>

                    {/* Must-Haves Section */}
                    <div>
                        <h3 className="text-sm font-semibold text-[#172033] mb-3">Must-Haves</h3>
                        <ul className="list-disc list-inside space-y-2 text-gray-700">
                            <li>Experience with HTML, CSS, and JavaScript</li>
                            <li>Strong proficiency with frameworks such as React and Vue.js</li>
                            <li>Understanding of responsive design principles</li>
                            <li>Experience with version control systems (Git)</li>
                        </ul>
                    </div>

                    {/* Nice-to-Haves Section */}
                    <div>
                        <h3 className="text-sm font-semibold text-[#172033] mb-3">Nice-to-Haves</h3>
                        <ul className="list-disc list-inside space-y-2 text-gray-700">
                            <li>Fluency in Dutch and English (both written and spoken)</li>
                            <li>Strong communication skills</li>
                            <li>Experience with TypeScript, Tailwind CSS, or Next.js</li>
                            <li>Knowledge of UI/UX design principles</li>
                        </ul>
                    </div>

                    {/* What We Offer */}
                    <div>
                        <h3 className="text-sm font-semibold text-[#172033] mb-3">What We Offer</h3>
                        <ul className="list-disc list-inside space-y-2 text-gray-700">
                            <li>Competitive salary (€4,000 - €6,000 monthly)</li>
                            <li>Company phone provided</li>
                            <li>Hybrid working model with flexible hours</li>
                            <li>Professional development opportunities</li>
                            <li>25 vacation days + holiday pay</li>
                            <li>Pension plan</li>
                            <li>Travel allowance</li>
                        </ul>
                    </div>
                </div>

                {/* Footer */}
                <div className="flex items-center justify-end border-t border-[#e7e5e4] bg-[#f7f6f3] px-8 py-6">
                    <div className="flex items-center gap-3">
                        <button className="rounded-xl border border-[#d6d3d1] bg-white px-5 py-3 font-medium text-[#172033] transition hover:bg-gray-50">
                            Save draft
                        </button>
                        <button onClick={handleBack} className="rounded-xl border border-[#d6d3d1] bg-white px-5 py-3 font-medium text-[#172033] transition hover:bg-gray-50">
                            ← Back
                        </button>
                        <button
                            onClick={handleNext}
                            className="rounded-xl bg-[#6b6fcf] px-5 py-3 font-medium text-white transition hover:opacity-90">
                            Next →
                        </button>
                    </div>
                </div>
            </div>
        </main>
    );
}