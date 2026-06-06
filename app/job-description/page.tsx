'use client';

import React, { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { FieldLabel } from '@/components/basics/FieldLabel';
import Navbar from '@/components/globals/Navbar';

const STEPS = ['Basics', 'Job description', 'Overview', 'Forward to recruiter'];
const CURRENT_STEP = 2;

interface FormState {
  summary: string;
  responsibilities: string;
  requirements: string;
  benefits: string;
}

const SECTION_KEYS = ['summary', 'responsibilities', 'requirements', 'benefits'] as const;
const MARKERS = ['[SUMMARY]', '[RESPONSIBILITIES]', '[REQUIREMENTS]', '[BENEFITS]'];

function parseSections(text: string): FormState {
  const result: FormState = { summary: '', responsibilities: '', requirements: '', benefits: '' };
  MARKERS.forEach((m, i) => {
    const start = text.indexOf(m);
    if (start === -1) return;
    const contentStart = start + m.length;
    const nextMarker = MARKERS[i + 1];
    const end = nextMarker ? text.indexOf(nextMarker, contentStart) : text.length;
    result[SECTION_KEYS[i]] = (end === -1 ? text.slice(contentStart) : text.slice(contentStart, end)).trim();
  });
  return result;
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
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [selectedStyle, setSelectedStyle] = useState<{ style: string; label: string }>({ style: 'standard', label: 'Standard' });

  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setDropdownOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  useEffect(() => {
    const savedBasics = localStorage.getItem('jobPostingFormData');
    if (savedBasics) {
      try { setBasicsData(JSON.parse(savedBasics)); } catch { /* ignore */ }
    }

    const savedJD = localStorage.getItem('jobDescriptionFormData');
    if (savedJD) {
      try { setForm(JSON.parse(savedJD)); } catch { /* ignore */ }
    }
  }, []);

  const handleDraftWithAI = async (style: 'standard' | 'extensive' | 'short' | 'informal' = 'standard', label = 'Standard') => {
    if (!basicsData || isDrafting) return;
    setDropdownOpen(false);
    setSelectedStyle({ style, label });
    setIsDrafting(true);
    setForm({ summary: '', responsibilities: '', requirements: '', benefits: '' });

    try {
      const res = await fetch('/api/draft-jd', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...basicsData, style }),
      });

      if (!res.ok || !res.body) {
        setIsDrafting(false);
        return;
      }

      const reader = res.body.getReader();
      const decoder = new TextDecoder();
      let full = '';

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        full += decoder.decode(value, { stream: true });
        setForm(parseSections(full));
      }

      const final = parseSections(full);
      localStorage.setItem('jobDescriptionFormData', JSON.stringify(final));
    } catch {
      // user can retry
    } finally {
      setIsDrafting(false);
    }
  };

  const handleChange = (field: keyof FormState, value: string) => {
    const updated = { ...form, [field]: value };
    setForm(updated);
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => {
      localStorage.setItem('jobDescriptionFormData', JSON.stringify(updated));
    }, 300);
  };

  const lang = 'en' as const;

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
              <div className="relative" ref={dropdownRef}>
                <button
                  type="button"
                  onClick={() => setDropdownOpen(o => !o)}
                  disabled={isDrafting || !basicsData}
                  className="flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-sm font-medium text-white disabled:opacity-50 disabled:cursor-not-allowed"
                  style={{ backgroundColor: '#FF7F62' }}
                >
                  {isDrafting ? 'Drafting…' : `✨ Generate with AI · ${selectedStyle.label}`}
                  <svg width="12" height="12" viewBox="0 0 12 12" fill="currentColor"><path d="M6 8L1 3h10z"/></svg>
                </button>

                {dropdownOpen && (
                  <div className="absolute right-0 top-full z-10 mt-1 w-52 overflow-hidden rounded-lg border bg-white shadow-lg" style={{ borderColor: 'var(--color-stone)' }}>
                    {[
                      { style: 'standard', label: 'Standard' },
                      { style: 'short',    label: 'Short' },
                      { style: 'extensive', label: 'Extensive' },
                      { style: 'informal', label: 'Informal' },
                    ].map(({ style, label }) => (
                      <button
                        key={style}
                        type="button"
                        onClick={() => handleDraftWithAI(style as 'standard' | 'extensive' | 'short' | 'informal', label)}
                        className="w-full px-4 py-2.5 text-left text-sm hover:bg-[#FFD8CA] transition-colors"
                        style={{ color: 'var(--color-headline)' }}
                      >
                        {label}
                      </button>
                    ))}
                  </div>
                )}
              </div>
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
