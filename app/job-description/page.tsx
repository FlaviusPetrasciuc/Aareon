'use client';

import React, { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { FieldLabel } from '@/components/basics/FieldLabel';
import { SegmentedControl } from '@/components/basics/SegmentedControl';
import Navbar from '@/components/globals/Navbar';
import { useCopilotAction, useCopilotReadable, useCopilotChat } from '@copilotkit/react-core';
import { TextMessage, Role } from '@copilotkit/runtime-client-gql';

const STEPS = ['Basics', 'Job description', 'Overview', 'Forward to recruiter'];
const CURRENT_STEP = 2;

interface FormState {
  summary: string;
  responsibilities: string;
  requirements: string;
  benefits: string;
}

const textareaClass =
  'w-full rounded-xl border border-[#d6d3d1] bg-white px-4 py-3 text-[15px] ' +
  'text-[#172033] outline-none transition resize-vertical ' +
  'placeholder:text-gray-400 focus:border-[#172033]';

const STRINGS = {
  en: {
    eyebrow: 'Job description · 2/4',
    title: 'Create new job posting',
    subtitle: 'Four steps — about 3 minutes',
    aiBannerHint: 'Uses previous successful Aareon postings as a base.',
    summary: 'Summary',
    responsibilities: 'Responsibilities',
    requirements: 'Requirements',
    benefits: 'What we offer',
    cancel: 'Cancel',
    saveDraft: 'Save draft',
    back: '← Back',
    next: 'Next →',
  },
  nl: {
    eyebrow: 'Functieomschrijving · 2/4',
    title: 'Nieuwe vacature aanmaken',
    subtitle: 'Vier stappen — ongeveer 3 minuten',
    aiBannerHint: 'Gebruikt eerdere succesvolle Aareon-vacatures als basis.',
    summary: 'Samenvatting',
    responsibilities: 'Verantwoordelijkheden',
    requirements: 'Vereisten',
    benefits: 'Wat we bieden',
    cancel: 'Annuleren',
    saveDraft: 'Concept opslaan',
    back: '← Terug',
    next: 'Volgende →',
  },
} as const;

export default function JobDescriptionPage() {
  const router = useRouter();
  const [form, setForm] = useState<FormState>({
    summary: '',
    responsibilities: '',
    requirements: '',
    benefits: '',
  });
  const [isDrafting, setIsDrafting] = useState(false);
  const [basicsData, setBasicsData] = useState<Record<string, unknown> | null>(null);

  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    const saved = localStorage.getItem('jobPostingFormData');
    if (saved) {
      try { setBasicsData(JSON.parse(saved)); } catch { /* ignore */ }
    }
  }, []);

  useCopilotReadable({
    description: "Job posting basics filled by the hiring manager: title, department, location, work mode, employment type, salary range, education requirements, must-haves, nice-to-haves, and additional details",
    value: basicsData ?? {},
  });

  useCopilotAction({
    name: "fillJobDescription",
    description: "Fill the job description form fields with AI-generated content based on the job basics",
    parameters: [
      { name: "summary", type: "string", description: "2-3 sentence overview of the role and its impact at Aareon", required: true },
      { name: "responsibilities", type: "string", description: "5-7 key responsibilities, each prefixed with '• ' on its own line", required: true },
      { name: "requirements", type: "string", description: "5-6 required qualifications drawing from mustHaves and education, each prefixed with '• '", required: true },
      { name: "benefits", type: "string", description: "4-5 benefits Aareon offers including salary range, each prefixed with '• '", required: true },
    ],
    handler: async ({ summary, responsibilities, requirements, benefits }) => {
      setForm({ summary, responsibilities, requirements, benefits });
      setIsDrafting(false);
      localStorage.setItem('jobDescriptionFormData', JSON.stringify({ summary, responsibilities, requirements, benefits }));
      return "Job description filled successfully";
    },
  });

  const { appendMessage, runChatCompletion } = useCopilotChat();

  const handleDraftWithAI = async () => {
    if (!basicsData || isDrafting) return;
    setIsDrafting(true);

    const jobTitle = (basicsData as any).jobTitle || 'this role';
    const salaryMin = (basicsData as any).salaryMin ?? '';
    const salaryMax = (basicsData as any).salaryMax ?? '';
    const currency = (basicsData as any).currency ?? 'EUR';
    const salaryRange = salaryMin && salaryMax ? `${currency} ${salaryMin}–${salaryMax} per month` : '';

    try {
      appendMessage(new TextMessage({
        id: crypto.randomUUID(),
        role: Role.User,
        content: `You are an expert HR copywriter for Aareon, a European PropTech and SaaS company. Using the job basics in your context, generate a professional job description for the ${jobTitle} position.\n\nCall the fillJobDescription action with:\n- summary: 2-3 sentences describing the role and its business impact\n- responsibilities: 5-7 bullet points of key duties (prefix each line with "• ")\n- requirements: 5-6 bullet points of qualifications (incorporate mustHaves and education level; prefix each with "• ")\n- benefits: 4-5 bullet points of what Aareon offers${salaryRange ? `, including salary range ${salaryRange}` : ''} (prefix each with "• ")\n\nWrite in a direct, professional tone. Do not respond with text — call the fillJobDescription action immediately.`,
      }));
      await runChatCompletion();
    } catch {
      setIsDrafting(false);
    }
  };

  const handleChange = (field: keyof FormState, value: string) => {
    const updated = { ...form, [field]: value };
    setForm(updated);
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => {
    }, 300);
  };

  const [lang, setLang] = useState<'en' | 'nl'>('en');

  const handleLangChange = (value: string) => {
    const v = value as 'en' | 'nl';
    setLang(v);
    localStorage.setItem('aareon.lang', v);
  };


  const isNextEnabled = form.summary.trim() !== '' || form.responsibilities.trim() !== '';

  const handleNext = () => {
    router.push('/overview');
  };

  const handleBack = () => {
    router.push('/basics');
  }; 


  const S = STRINGS[lang];

  return (
    <>
    <Navbar />
    <main className="min-h-screen" style={{ backgroundColor: 'var(--color-sand)', color: 'var(--color-body)' }}>
      <div className="mx-auto max-w-7xl px-8 py-8">

        {/* Header */}
        <div className="mb-10 flex items-start justify-between">
          <div>
            <p className="mb-1 text-sm" style={{ color: 'var(--color-body)' }}>
              {S.eyebrow}
            </p>
            <h1 className="text-5xl font-serif tracking-tight" style={{ color: 'var(--color-headline)' }}>
              {S.title}
            </h1>
            <p className="mt-3 text-lg" style={{ color: 'var(--color-body)' }}>
              {S.subtitle}
            </p>
          </div>
          <div className="mt-1">
            <SegmentedControl
              value={lang}
              onChange={handleLangChange}
              options={[
                { label: 'EN', value: 'en' },
                { label: 'NL', value: 'nl' },
              ]}
            />
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
            {/* Draft with AI banner */}
            <div className="flex items-center gap-4 rounded-xl p-4" style={{ backgroundColor: '#FFD8CA' }}>
              <div
                className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg text-xl"
                style={{ backgroundColor: '#FF7F62', color: 'white' }}
              >
                ✨
              </div>
              <div className="flex-1">
                <p className="text-sm font-semibold" style={{ color: 'var(--color-headline)' }}>
                  ✨ Draft with AI
                </p>
                <p className="text-xs" style={{ color: 'var(--color-body)' }}>
                  {S.aiBannerHint}
                </p>
              </div>
              <button
                type="button"
                onClick={handleDraftWithAI}
                disabled={isDrafting || !basicsData}
                className="rounded-lg px-3 py-1.5 text-sm font-medium text-white disabled:opacity-50 disabled:cursor-not-allowed"
                style={{ backgroundColor: '#FF7F62' }}
              >
                {isDrafting ? 'Drafting…' : '✨ Draft with AI'}
              </button>
            </div>

            {/* Summary */}
            <div>
              <FieldLabel label={S.summary} />
              <textarea
                rows={3}
                className={textareaClass}
                value={form.summary}
                onChange={e => handleChange('summary', e.target.value)}
              />
            </div>

            {/* Responsibilities */}
            <div>
              <FieldLabel label={S.responsibilities} />
              <textarea
                rows={5}
                className={textareaClass}
                value={form.responsibilities}
                onChange={e => handleChange('responsibilities', e.target.value)}
              />
            </div>

            {/* Requirements + What we offer — two columns */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <FieldLabel label={S.requirements} />
                <textarea
                  rows={5}
                  className={textareaClass}
                  value={form.requirements}
                  onChange={e => handleChange('requirements', e.target.value)}
                />
              </div>
              <div>
                <FieldLabel label={S.benefits} />
                <textarea
                  rows={5}
                  className={textareaClass}
                  value={form.benefits}
                  onChange={e => handleChange('benefits', e.target.value)}
                />
              </div>
            </div>
          </div>

          {/* Footer */}
          <div
            className="flex items-center border-t px-8 py-6"
            style={{ borderColor: 'var(--color-stone)', backgroundColor: 'var(--color-sand)' }}
          >
            <button type="button" className="text-sm font-medium" style={{ color: 'var(--color-body)' }}>
              {S.cancel}
            </button>
            <div className="flex flex-1 items-center justify-end gap-3">
              <button
                type="button"
                onClick={handleBack}
                className="rounded-xl border bg-white px-5 py-3 font-medium transition hover:bg-gray-50"
                style={{ borderColor: 'var(--color-stone)', color: 'var(--color-headline)' }}
              >
                {S.back}
              </button>
              <button
                type="button"
                onClick={handleNext}
                // disabled={!isNextEnabled}
                className={`rounded-xl px-5 py-3 font-medium text-white transition ${isNextEnabled ? 'hover:opacity-90' : 'opacity-50 cursor-not-allowed'}`}
                style={{ backgroundColor: 'var(--color-blue)' }}
              >
                {S.next}
              </button>
            </div>
          </div>
        </div>

      </div>
    </main>
    </>
  );
}