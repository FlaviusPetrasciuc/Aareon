'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Navbar from '@/components/globals/Navbar';

const STEPS = ['Basis', 'Functieomschrijving', 'Overzicht', 'Doorsturen naar recruiter'];
const CURRENT_STEP = 3;

interface BasicsData {
  jobTitle?: string;
  department?: string;
  location?: string;
  workMode?: string;
  employmentType?: string;
  salaryMin?: string;
  salaryMax?: string;
  currency?: string;
  education?: string;
  companyCar?: boolean;
  companyPhone?: boolean;
  mustHaves?: string;
  niceToHaves?: string;
  shouldntHaves?: string;
}

interface JobDescriptionData {
  summary?: string;
  responsibilities?: string;
  requirements?: string;
  benefits?: string;
}

const S = {
  eyebrow: 'Overzicht · 3/4',
  title: 'Nieuwe vacature aanmaken',
  subtitle: 'Vier stappen — ongeveer 3 minuten',
  reviewText: 'Controleer de details van uw vacature voordat u verdergaat.',
  location: 'Locatie',
  department: 'Afdeling',
  workMode: 'Werkwijze',
  employmentType: 'Dienstverband',
  salaryRange: 'Salarisbereik',
  education: 'Opleiding',
  equipment: 'Werkuitrusting',
  aboutRole: 'Over de functie',
  responsibilities: 'Verantwoordelijkheden',
  requirements: 'Vereisten',
  mustHaves: 'Vereist',
  niceToHaves: 'Pré',
  shouldntHaves: 'Niet wenselijk',
  whatWeOffer: 'Wat wij bieden',
  back: '← Terug',
  next: 'Volgende →',
};

export default function Overview() {
  const router = useRouter();
  const [basics, setBasics] = useState<BasicsData>({});
  const [jd, setJd] = useState<JobDescriptionData>({});

  useEffect(() => {
    try {
      const b = localStorage.getItem('jobPostingFormData');
      if (b) setBasics(JSON.parse(b));
    } catch { /* ignore */ }

    try {
      const j = localStorage.getItem('jobDescriptionFormData');
      if (j) setJd(JSON.parse(j));
    } catch { /* ignore */ }
  }, []);

  const handleNext = () => router.push('/forward-to-recruiter');
  const handleBack = () => router.push('/job-description');

  const salary =
    basics.salaryMin && basics.salaryMax
      ? `${basics.currency ?? '€'}${basics.salaryMin} - ${basics.currency ?? '€'}${basics.salaryMax} per maand`
      : '—';

  const equipment = [
    basics.companyCar && 'Leaseauto',
    basics.companyPhone && 'Zakelijke telefoon',
  ].filter(Boolean).join(', ') || '—';

  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-[#f7f6f3] text-[#1f2937]">
        <div className="mx-auto max-w-7xl px-8 py-8">

          {/* Header */}
          <div className="mb-10">
            <p className="mb-3 text-sm text-gray-500">{S.eyebrow}</p>
            <h1 className="text-5xl font-serif tracking-tight text-[#172033]">{S.title}</h1>
            <p className="mt-3 text-lg text-gray-500">{S.subtitle}</p>
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

          {/* Content */}
          <div className="space-y-8 p-8">
            <div>
              <h2 className="text-2xl font-serif text-[#172033] mb-2">
                {basics.jobTitle || 'Naamloze functie'}
              </h2>
              <p className="text-gray-500 text-sm">{S.reviewText}</p>
            </div>

            {/* Job Details Grid */}
            <div className="grid grid-cols-2 gap-6 pb-4 border-b border-[#e7e5e4]">
              <div>
                <h3 className="text-xs font-semibold uppercase tracking-wider text-gray-400 mb-2">{S.location}</h3>
                <p className="text-[#172033] capitalize">{basics.location || '—'}</p>
              </div>
              <div>
                <h3 className="text-xs font-semibold uppercase tracking-wider text-gray-400 mb-2">{S.department}</h3>
                <p className="text-[#172033] capitalize">{basics.department || '—'}</p>
              </div>
              <div>
                <h3 className="text-xs font-semibold uppercase tracking-wider text-gray-400 mb-2">{S.workMode}</h3>
                <p className="text-[#172033] capitalize">{basics.workMode || '—'}</p>
              </div>
              <div>
                <h3 className="text-xs font-semibold uppercase tracking-wider text-gray-400 mb-2">{S.employmentType}</h3>
                <p className="text-[#172033] capitalize">{basics.employmentType || '—'}</p>
              </div>
              <div>
                <h3 className="text-xs font-semibold uppercase tracking-wider text-gray-400 mb-2">{S.salaryRange}</h3>
                <p className="text-[#172033]">{salary}</p>
              </div>
              <div>
                <h3 className="text-xs font-semibold uppercase tracking-wider text-gray-400 mb-2">{S.education}</h3>
                <p className="text-[#172033] uppercase">{basics.education || '—'}</p>
              </div>
              <div>
                <h3 className="text-xs font-semibold uppercase tracking-wider text-gray-400 mb-2">{S.equipment}</h3>
                <p className="text-[#172033]">{equipment}</p>
              </div>
            </div>

            {jd.summary && (
              <div>
                <h3 className="text-lg font-semibold text-[#172033] mb-3">{S.aboutRole}</h3>
                <p className="text-gray-700 leading-relaxed whitespace-pre-line">{jd.summary}</p>
              </div>
            )}

            {jd.responsibilities && (
              <div>
                <h3 className="text-lg font-semibold text-[#172033] mb-3">{S.responsibilities}</h3>
                <p className="text-gray-700 leading-relaxed whitespace-pre-line">{jd.responsibilities}</p>
              </div>
            )}

            {(jd.requirements || basics.mustHaves) && (
              <div>
                <h3 className="text-lg font-semibold text-[#172033] mb-3">{S.requirements}</h3>
                {basics.mustHaves && (
                  <>
                    <p className="text-gray-700 font-medium mb-2">{S.mustHaves}:</p>
                    <p className="text-gray-700 leading-relaxed whitespace-pre-line mb-3">{basics.mustHaves}</p>
                  </>
                )}
                {basics.niceToHaves && (
                  <>
                    <p className="text-gray-700 font-medium mb-2">{S.niceToHaves}:</p>
                    <p className="text-gray-700 leading-relaxed whitespace-pre-line mb-3">{basics.niceToHaves}</p>
                  </>
                )}
                {basics.shouldntHaves && (
                  <>
                    <p className="text-gray-700 font-medium mb-2">{S.shouldntHaves}:</p>
                    <p className="text-gray-700 leading-relaxed whitespace-pre-line">{basics.shouldntHaves}</p>
                  </>
                )}
              </div>
            )}

            {jd.benefits && (
              <div>
                <h3 className="text-lg font-semibold text-[#172033] mb-3">{S.whatWeOffer}</h3>
                <p className="text-gray-700 leading-relaxed whitespace-pre-line">{jd.benefits}</p>
              </div>
            )}
          </div>

          {/* Footer */}
          <div className="flex items-center justify-end border-t border-[#e7e5e4] bg-[#f7f6f3] px-8 py-6">
            <div className="flex items-center gap-3">
              <button
                onClick={handleBack}
                className="rounded-xl border border-[#d6d3d1] bg-white px-5 py-3 font-medium text-[#172033] transition hover:bg-gray-50"
              >
                {S.back}
              </button>
              <button
                onClick={handleNext}
                className="rounded-xl bg-[#6b6fcf] px-5 py-3 font-medium text-white transition hover:opacity-90"
              >
                {S.next}
              </button>
            </div>
          </div>

        </div>
      </main>
    </>
  );
}