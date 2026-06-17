'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Navbar from '@/components/globals/Navbar';
import Stepper from '../../components/globals/Stepper';
import PageHeader from '@/components/globals/PageHeader';

const STEPS = ['Basics', 'Job description', 'Overview', 'Forward to recruiter'];
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
  additionalDetails?: string;
}

interface JobDescriptionData {
  summary?: string;
  responsibilities?: string;
  requirements?: string;
  benefits?: string;
}

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
      ? `${basics.currency ?? '€'}${basics.salaryMin} - ${basics.currency ?? '€'}${basics.salaryMax} per month`
      : '—';

  const equipment = [
    basics.companyCar && 'Lease car',
    basics.companyPhone && 'Company phone',
  ]
    .filter(Boolean)
    .join(', ') || '—';

  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-[#f7f6f3] text-[#1f2937]">
        <div className="mx-auto max-w-7xl px-8 py-8">
          {/* Header */}
          <PageHeader
            stepLabel="Overzicht"
            currentStep={CURRENT_STEP}
            totalSteps={STEPS.length}
            title="Nieuwe vacature aanmaken"
            subtitle="Vier stappen — ongeveer 5 minuten"
          />

          {/* Stepper */}
          <Stepper
            steps={STEPS}
            currentStep={CURRENT_STEP}
          />

          {/* Content */}
          <div className="space-y-8 p-8">
            <div>
              <h2 className="text-2xl font-serif text-[#172033] mb-2">
                {basics.jobTitle || 'Untitled Position'}
              </h2>
              <p className="text-gray-500 text-sm">
                Review the details of your job posting before moving on.
              </p>
            </div>

            {/* Job Details Grid */}
            <div className="grid grid-cols-2 gap-6 pb-4 border-b border-[#e7e5e4]">
              <div>
                <h3 className="text-xs font-semibold uppercase tracking-wider text-gray-400 mb-2">Location</h3>
                <p className="text-[#172033] capitalize">{basics.location || '—'}</p>
              </div>
              <div>
                <h3 className="text-xs font-semibold uppercase tracking-wider text-gray-400 mb-2">Department</h3>
                <p className="text-[#172033] capitalize">{basics.department || '—'}</p>
              </div>
              <div>
                <h3 className="text-xs font-semibold uppercase tracking-wider text-gray-400 mb-2">Work Mode</h3>
                <p className="text-[#172033] capitalize">{basics.workMode || '—'}</p>
              </div>
              <div>
                <h3 className="text-xs font-semibold uppercase tracking-wider text-gray-400 mb-2">Employment Type</h3>
                <p className="text-[#172033] capitalize">{basics.employmentType || '—'}</p>
              </div>
              <div>
                <h3 className="text-xs font-semibold uppercase tracking-wider text-gray-400 mb-2">Salary Range</h3>
                <p className="text-[#172033]">{salary}</p>
              </div>
              <div>
                <h3 className="text-xs font-semibold uppercase tracking-wider text-gray-400 mb-2">Education</h3>
                <p className="text-[#172033] uppercase">{basics.education || '—'}</p>
              </div>
              <div>
                <h3 className="text-xs font-semibold uppercase tracking-wider text-gray-400 mb-2">Work Equipment</h3>
                <p className="text-[#172033]">{equipment}</p>
              </div>
            </div>

            {/* AI Generated Sections */}
            {jd.summary && (
              <div>
                <h3 className="text-lg font-semibold text-[#172033] mb-3">About the Role</h3>
                <p className="text-gray-700 leading-relaxed whitespace-pre-line">{jd.summary}</p>
              </div>
            )}

            {/* About the comapany - HARDCODED for now, 
            must be dynamic after we get all the custom 
            descrptions for each location  */}

            <div>
              <h3 className="text-lg font-semibold text-[#172033] mb-3">About the Company</h3>
              <p className="text-gray-700 leading-relaxed whitespace-pre-line">
                Located in the beautiful province of Drenthe, Emmen offers a great work-life balance
                with its green surroundings, excellent facilities, and strong community feel. We are
                a forward-thinking organization that values innovation, collaboration, and personal
                growth. Our culture is built on trust, transparency, and a shared passion for
                technology.
              </p>
            </div>

            {jd.responsibilities && (
              <div>
                <h3 className="text-lg font-semibold text-[#172033] mb-3">Responsibilities</h3>
                <p className="text-gray-700 leading-relaxed whitespace-pre-line">{jd.responsibilities}</p>
              </div>
            )}

            {jd.requirements && (
              <div>
                <h3 className="text-lg font-semibold text-[#172033] mb-3">Requirements</h3>
                {basics.mustHaves && (
                  <>
                    <p className="text-gray-700 font-medium mb-2">Must-Haves:</p>
                    <p className="text-gray-700 leading-relaxed whitespace-pre-line mb-3">{basics.mustHaves}</p>
                  </>
                )}
                {basics.niceToHaves && (
                  <>
                    <p className="text-gray-700 font-medium mb-2">Nice-to-Haves:</p>
                    <p className="text-gray-700 leading-relaxed whitespace-pre-line mb-3">{basics.niceToHaves}</p>
                  </>
                )}
                {basics.shouldntHaves && (
                  <>
                    <p className="text-gray-700 font-medium mb-2">Shouldn't Have:</p>
                    <p className="text-gray-700 leading-relaxed whitespace-pre-line">{basics.shouldntHaves}</p>
                  </>
                )}
              </div>
            )}

            {jd.benefits && (
              <div>
                <h3 className="text-lg font-semibold text-[#172033] mb-3">What We Offer</h3>
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
                ← Back
              </button>
              <button
                onClick={handleNext}
                className="rounded-xl bg-[#6b6fcf] px-5 py-3 font-medium text-white transition hover:opacity-90"
                style={{ backgroundColor: 'var(--color-blue)' }}
              >
                Next →
              </button>
            </div>
          </div>
        </div>
      </main>
    </>
  );
}