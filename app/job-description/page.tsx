'use client';

import React from 'react';
import { useRouter } from 'next/navigation';

const STEPS = ['Basics', 'Job description', 'Pipeline & team', 'Publish'];
const CURRENT_STEP = 2;

export default function JobDescriptionPage() {
  const router = useRouter();

  return (
    <main className="min-h-screen" style={{ backgroundColor: 'var(--color-sand)', color: 'var(--color-body)' }}>
      <div className="mx-auto max-w-7xl px-8 py-8">

        {/* Header */}
        <div className="mb-10 flex items-start justify-between">
          <div>
            <p className="mb-1 text-sm" style={{ color: 'var(--color-body)' }}>
              Job description · 2/4
            </p>
            <h1 className="text-5xl font-serif tracking-tight" style={{ color: 'var(--color-headline)' }}>
              Create new job posting
            </h1>
            <p className="mt-3 text-lg" style={{ color: 'var(--color-body)' }}>
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

        {/* Form card */}
        <div
          className="overflow-hidden rounded-2xl border"
          style={{ borderColor: 'var(--color-stone)', backgroundColor: 'var(--color-sand)' }}
        >
          <div className="space-y-6 p-8">
            {/* fields go here in later tasks */}
          </div>

          {/* Footer */}
          <div
            className="flex items-center border-t px-8 py-6"
            style={{ borderColor: 'var(--color-stone)', backgroundColor: 'var(--color-sand)' }}
          >
            <button type="button" className="text-sm font-medium" style={{ color: 'var(--color-body)' }}>
              Cancel
            </button>
            <div className="flex flex-1 items-center justify-end gap-3">
              <button
                type="button"
                className="rounded-xl border bg-white px-5 py-3 font-medium transition hover:bg-gray-50"
                style={{ borderColor: 'var(--color-stone)', color: 'var(--color-headline)' }}
              >
                Save draft
              </button>
              <button
                type="button"
                onClick={() => router.push('/basics')}
                className="rounded-xl border bg-white px-5 py-3 font-medium transition hover:bg-gray-50"
                style={{ borderColor: 'var(--color-stone)', color: 'var(--color-headline)' }}
              >
                ← Back
              </button>
              <button
                type="button"
                className="rounded-xl px-5 py-3 font-medium text-white"
                style={{ backgroundColor: 'var(--color-blue)' }}
              >
                Next →
              </button>
            </div>
          </div>
        </div>

      </div>
    </main>
  );
}
