'use client';

import React from 'react';
import { ForwardToRecruiter } from '@/components/ForwardToRecruiter';
import { getSession } from '@/lib/session';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { IntakeSession } from '@/types/intake';

const steps = [
  'Basics',
  'Job description',
  'Overview',
  'Forward to recruiter',
];

export default function ForwardToRecruiterPage() {
  const router = useRouter();
  const [session, setSession] = useState<IntakeSession | null>(null);

  useEffect(() => {
    const saved = getSession();
    if (!saved) {
      router.push('/');
      return;
    }
    setSession(saved);
  }, [router]);

  if (!session) return null;

  return (
    <main className="min-h-screen bg-[#f7f6f3] text-[#1f2937]">
      <div className="mx-auto max-w-7xl px-8 py-8">

        {/* Header */}
        <div className="mb-10 flex items-start justify-between">
          <div>
            <p className="mb-3 text-sm text-gray-500">Forward to recruiter · 4/4</p>
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
            const active = stepNumber === 4;
            const done = stepNumber < 4;

            return (
              <React.Fragment key={step}>
                <div className="flex items-center gap-3">
                  <div className={`
                    flex h-10 w-10 items-center justify-center rounded-full border text-sm font-medium
                    ${active
                      ? 'border-[#14213d] bg-[#14213d] text-white'
                      : done
                        ? 'border-[#16a34a] bg-[#16a34a] text-white'
                        : 'border-[#d6d3d1] bg-white text-gray-500'
                    }
                  `}>
                    {done ? (
                      <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                      </svg>
                    ) : stepNumber}
                  </div>
                  <span className={`text-[15px] ${active ? 'text-[#172033] font-medium' : done ? 'text-[#172033]' : 'text-gray-500'}`}>
                    {step}
                  </span>
                </div>

                {index < steps.length - 1 && (
                  <div className={`mx-5 h-px flex-1 ${done ? 'bg-[#14213d]' : 'bg-[#ddd8d2]'}`} />
                )}
              </React.Fragment>
            );
          })}
        </div>

        {/* Step 4 content */}
        <div className="overflow-hidden rounded-2xl border border-[#e7e5e4] bg-[#f7f6f3]">
          <div className="p-8">
            <ForwardToRecruiter
              session={session}
              onBack={() => router.push('/ai-recruiter')}
              onSubmitted={() => router.push('/')}
            />
          </div>
        </div>

      </div>
    </main>
  );
}
