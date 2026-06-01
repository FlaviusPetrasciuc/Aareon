'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import Navbar from '@/components/globals/Navbar';

const STEPS = [
    'Basics',
    'Job description',
    'Overview',
    'Forward to recruiter',
];
const CURRENT_STEP = 3;

export default function Overview() {
    const [currentStep, setCurrentStep] = useState(3);
    const [jobDescription, setJobDescription] = useState('');
    const router = useRouter();

    const handleNext = () => {
        router.push('/forward-to-recruiter');
    };

    const handleBack = () => {
        router.push('/job-description');
    };

    return (
        <>
        <Navbar />
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
                                            backgroundColor: isDone ? '#50B214' : isCurrent ? 'var(--color-blue)' : 'white',
                                            borderColor: isDone ? '#50B214' : isCurrent ? 'var(--color-blue)' : 'var(--color-stone)',
                                            color: isDone || isCurrent ? 'white' : 'var(--color-body)',
                                        }}
                                    >
                                        {isDone ? '✓' : stepNumber}
                                    </div>
                                    <span
                                        className="text-[15px]"
                                        style={{ color: isCurrent ? 'var(--color-headline)' : 'var(--color-body)' }}
                                    >
                                        {step}
                                    </span>
                                </div>
                                {index < STEPS.length - 1 && (
                                    <div className="mx-5 h-px flex-1" style={{ backgroundColor: 'var(--color-stone)' }} />
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
                    <div className="grid grid-cols-2 gap-6 pb-4 border-b border-[#e7e5e4]">
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
                            <h3 className="text-xs font-semibold uppercase tracking-wider text-gray-400 mb-2">Education</h3>
                            <p className="text-[#172033]">Minimum HBO degree</p>
                        </div>
                    </div>

                    {/* About the Role */}
                    <div>
                        <h3 className="text-lg font-semibold text-[#172033] mb-3">About the Role</h3>
                        <p className="text-gray-700 leading-relaxed">
                            We are seeking a talented Frontend Developer to join our growing IT team in Emmen.
                            As a Frontend Developer, you will be responsible for building and maintaining responsive,
                            high-performance web applications that deliver exceptional user experiences. You will
                            work closely with our design and backend teams to create seamless, accessible, and
                            visually appealing interfaces.
                        </p>
                    </div>

                    {/* Requirements */}
                    <div>
                        <h3 className="text-lg font-semibold text-[#172033] mb-3">Requirements</h3>
                        <p className="text-gray-700 leading-relaxed mb-3">
                            To succeed in this role, we are looking for a candidate with a strong foundation in modern
                            frontend technologies. You should have hands-on experience building web applications and
                            a keen eye for detail when it comes to user interfaces.
                        </p>
                        <p className="text-gray-700 leading-relaxed font-medium mb-2">Must-Haves:</p>
                        <ul className="list-disc list-inside space-y-1 text-gray-700 mb-4 ml-2">
                            <li>Experience with HTML, CSS, and JavaScript</li>
                            <li>Strong proficiency with frameworks such as React and Vue.js</li>
                            <li>Understanding of responsive design principles</li>
                            <li>Experience with version control systems (Git)</li>
                        </ul>
                        <p className="text-gray-700 leading-relaxed font-medium mb-2">Nice-to-Haves:</p>
                        <ul className="list-disc list-inside space-y-1 text-gray-700 mb-2 ml-2">
                            <li>Fluency in Dutch and English (both written and spoken)</li>
                            <li>Strong communication and collaboration skills</li>
                            <li>Experience with TypeScript, Tailwind CSS, or Next.js</li>
                            <li>Knowledge of UI/UX design principles</li>
                        </ul>
                    </div>

                    {/* What We Offer */}
                    <div>
                        <h3 className="text-lg font-semibold text-[#172033] mb-3">What We Offer</h3>
                        <p className="text-gray-700 leading-relaxed mb-3">
                            We believe in taking care of our employees by providing a supportive work environment
                            and competitive benefits. When you join our team, you can expect:
                        </p>
                        <ul className="list-disc list-inside space-y-1 text-gray-700 ml-2">
                            <li>Competitive salary (€4,000 - €6,000 monthly)</li>
                            <li>Company phone provided</li>
                            <li>Hybrid working model with flexible hours</li>
                            <li>Professional development and learning opportunities</li>
                            <li>25 vacation days + holiday pay</li>
                            <li>Pension plan and travel allowance</li>
                        </ul>
                    </div>

                    {/* About the Company */}
                    <div>
                        <h3 className="text-lg font-semibold text-[#172033] mb-3">About the Company</h3>
                        <p className="text-gray-700 leading-relaxed">
                            Located in the beautiful province of Drenthe, Emmen offers a great work-life balance
                            with its green surroundings, excellent facilities, and strong community feel. We are
                            a forward-thinking organization that values innovation, collaboration, and personal
                            growth. Our culture is built on trust, transparency, and a shared passion for
                            technology.
                        </p>
                    </div>
                </div>
                {/* Footer */}
                <div className="flex items-center justify-end border-t border-[#e7e5e4] bg-[#f7f6f3] px-8 py-6">
                    <div className="flex items-center gap-3">
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
        </>
    );
}