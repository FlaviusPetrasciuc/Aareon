'use client';

import React, { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { FieldLabel } from '@/components/basics/FieldLabel';
import Navbar from '@/components/globals/Navbar';
import Stepper from '@/components/globals/Stepper';
import PageHeader from '@/components/globals/PageHeader';

const STEPS = ['Basis', 'Functieomschrijving', 'Overzicht', 'Doorsturen naar recruiter'];
const CURRENT_STEP = 2;

interface FormState {
  summary: string;
  responsibilities: string;
  requirements: string;
  benefits: string;
}

interface FieldError {
  field: string;
  message: string;
}

const SECTION_KEYS = [
  'summary',
  'responsibilities',
  'requirements',
  'benefits'
] as const;

const MARKERS = [
  '[SUMMARY]',
  '[RESPONSIBILITIES]',
  '[REQUIREMENTS]',
  '[BENEFITS]'
];

const STEP_ROUTES = [
  '/basics',
  '/job-description',
  '/overview',
  '/forward-to-recruiter',
];

const CHARACTER_LIMITS = {
  summary: 2000,
  responsibilities: 3000,
  requirements: 2500,
  benefits: 2500
} as const;

const DEFAULT_TEXTAREA_LIMIT = 5000;

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

function buildJobDescriptionText(form: FormState) {
  return [
    form.summary, '',
    'Responsibilities:', form.responsibilities, '',
    'Requirements:', form.requirements, '',
    'What we offer:', form.benefits,
  ].filter((p) => p !== undefined && p !== null && String(p).trim() !== '').join('\n');
}

const textareaClass =
  'w-full rounded-xl border border-[#d6d3d1] bg-white px-4 py-3 text-[15px] ' +
  'text-[#172033] outline-none transition resize-vertical ' +
  'placeholder:text-gray-400 focus:border-[#172033]';

type DraftStyle = 'standard' | 'extensive' | 'short' | 'informal';

const STYLE_OPTIONS: { style: DraftStyle; label: string }[] = [
  { style: 'standard', label: 'Standaard' },
  { style: 'short', label: 'Kort' },
  { style: 'extensive', label: 'Uitgebreid' },
  { style: 'informal', label: 'Informeel' },
];

export default function JobDescriptionPage() {
  const router = useRouter();

  const [form, setForm] = useState<FormState>({ summary: '', responsibilities: '', requirements: '', benefits: '' });
  const [isDrafting, setIsDrafting] = useState(false);
  const [basicsData, setBasicsData] = useState<Record<string, unknown> | null>(null);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [selectedStyle, setSelectedStyle] = useState<{ style: DraftStyle; label: string }>(STYLE_OPTIONS[0]);
  const [errors, setErrors] = useState<FieldError[]>([]);

  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // CHANGE: Added helper function to get character info
  const getCharacterInfo = (fieldName: keyof FormState): { count: number; limit: number } => {
    const value = form[fieldName] as string;
    const limit = CHARACTER_LIMITS[fieldName] || DEFAULT_TEXTAREA_LIMIT;
    return { count: value?.length || 0, limit };
  };

  // CHANGE: Added helper function to get field errors
  const getFieldError = (fieldName: string): string | undefined => {
    return errors.find(error => error.field === fieldName)?.message;
  };

  const validateCharacterLimits = (data: FormState): FieldError[] => {
    const validationErrors: FieldError[] = [];

    Object.keys(CHARACTER_LIMITS).forEach((key) => {
      const fieldName = key as keyof FormState;
      const value = data[fieldName] as string;
      const limit = CHARACTER_LIMITS[fieldName as keyof typeof CHARACTER_LIMITS];

      if (value && value.length > limit) {
        const fieldLabels: Record<string, string> = {
          summary: 'Samenvatting',
          responsibilities: 'Verantwoordelijkheden',
          requirements: 'Vereisten',
          benefits: 'Wat wij bieden'
        };

        validationErrors.push({
          field: fieldName,
          message: `${fieldLabels[fieldName] || fieldName} mag niet meer dan ${limit} tekens bevatten (huidig: ${value.length})`
        });
      }
    });

    return validationErrors;
  };

  // CHANGE: Added validation function
  const validateInput = (): boolean => {
    const newErrors: FieldError[] = [];

    // Check if required fields are filled
    if (!form.summary.trim()) {
      newErrors.push({ field: 'summary', message: 'Samenvatting is verplicht' });
    }

    if (!form.responsibilities.trim()) {
      newErrors.push({ field: 'responsibilities', message: 'Verantwoordelijkheden zijn verplicht' });
    }

    if (!form.requirements.trim()) {
      newErrors.push({ field: 'requirements', message: 'Vereisten zijn verplicht' })
    }

    if (!form.benefits.trim()) {
      newErrors.push({ field: 'benefits', message: 'Dit gedeelte is verplicht' })
    }

    // Check character limits
    const limitErrors = validateCharacterLimits(form);
    newErrors.push(...limitErrors);

    setErrors(newErrors);
    return newErrors.length === 0;
  };

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
      try {
        setBasicsData(JSON.parse(savedBasics));
      } catch (error) {
        console.log(error);
      }
    }

    const savedJD = localStorage.getItem('jobDescriptionFormData');

    if (savedJD) {
      try {
        const parsed = JSON.parse(savedJD) as FormState;
        setForm(parsed);

        localStorage.setItem('jobDescriptionText', buildJobDescriptionText(parsed));
      } catch (error) {
        console.log(error);
      }
    }
  }, []);

  const saveJobDescription = (data: FormState) => {
    localStorage.setItem('jobDescriptionFormData', JSON.stringify(data));
    localStorage.setItem('jobDescriptionText', buildJobDescriptionText(data));
  };

  const handleDraftWithAI = async (style: DraftStyle = 'standard', label = 'Standard') => {
    if (!basicsData || isDrafting) return;

    setDropdownOpen(false);
    setSelectedStyle({ style, label });
    setIsDrafting(true);

    const emptyForm = { summary: '', responsibilities: '', requirements: '', benefits: '' };
    setForm(emptyForm);
    saveJobDescription(emptyForm);

    try {
      const res = await fetch('/api/draft-jd', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...basicsData, style }),
      });
      if (!res.ok || !res.body) { setIsDrafting(false); return; }

      const reader = res.body.getReader();
      const decoder = new TextDecoder();
      let full = '';

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        full += decoder.decode(value, { stream: true });
        const streamed = parseSections(full);
        setForm(streamed);
        saveJobDescription(streamed);
      }

      const final = parseSections(full);
      setForm(final);
      saveJobDescription(final);
    } catch (error) {
      console.error("Error generating job description", error);
    } finally {
      setIsDrafting(false);
    }
  };

  // CHANGE: Modified handleChange to enforce character limits
  const handleChange = (field: keyof FormState, value: string) => {
    // Clear error for this field
    setErrors(prev => prev.filter(error => error.field !== field));

    // Check character limit
    const limit = CHARACTER_LIMITS[field] || DEFAULT_TEXTAREA_LIMIT;
    if (value.length > limit) {
      // Don't update if over limit
      return;
    }

    const updated = { ...form, [field]: value };
    setForm(updated);
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => saveJobDescription(updated), 300);
  };

  const isNextEnabled = (form.summary.trim() !== '' || form.responsibilities.trim() !== '') && errors.length === 0;

  // CHANGE: Modified handleNext to validate before navigation
  const handleNext = () => {
    const isValid = validateInput();
    if (!isValid) {
      // Scroll to first error
      const firstErrorField = document.querySelector('[data-error-field]');
      if (firstErrorField) {
        firstErrorField.scrollIntoView({
          behavior: 'smooth',
          block: 'center',
        });
      }
      return;
    }
    saveJobDescription(form);
    router.push('/overview'); // CHANGE: Updated route
  };

  const handleBack = () => { saveJobDescription(form); router.push('/basics'); };

  return (
    <>
      <Navbar />

      <main className="min-h-screen" style={{ backgroundColor: 'var(--color-sand)', color: 'var(--color-body)' }}>
        <div className="mx-auto max-w-7xl px-8 py-8">
          {/* Header */}
          <PageHeader
            stepLabel="Functieomschrijving"
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

          {/* Form card */}
          <div className="overflow-hidden rounded-2xl border" style={{ borderColor: 'var(--color-stone)', backgroundColor: 'var(--color-sand)' }}>
            <div className="space-y-6 p-8">

              {/* AI banner */}
              <div className="flex items-center gap-4 rounded-xl p-4" style={{ backgroundColor: '#FFD8CA' }}>
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg text-xl" style={{ backgroundColor: '#FF7F62', color: 'white' }}>
                  ✨
                </div>
                <div className="flex-1">
                  <p className="text-sm font-semibold" style={{ color: 'var(--color-headline)' }}>Opstellen met AI</p>
                  <p className="text-xs" style={{ color: 'var(--color-body)' }}>Gebaseerd op eerdere succesvolle Aareon-vacatures.</p>
                </div>
                <div className="relative" ref={dropdownRef}>
                  <button
                    type="button"
                    onClick={() => setDropdownOpen(o => !o)}
                    disabled={isDrafting || !basicsData}
                    className="flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-sm font-medium text-white disabled:opacity-50 disabled:cursor-not-allowed"
                    style={{ backgroundColor: '#FF7F62' }}
                  >
                    {isDrafting ? 'Opstellen…' : `✨ Genereren met AI · ${selectedStyle.label}`}
                    <svg width="12" height="12" viewBox="0 0 12 12" fill="currentColor"><path d="M6 8L1 3h10z" /></svg>
                  </button>

                  {dropdownOpen && (
                    <div className="absolute right-0 top-full z-10 mt-1 w-52 overflow-hidden rounded-lg border bg-white shadow-lg" style={{ borderColor: 'var(--color-stone)' }}>
                      {STYLE_OPTIONS.map(({ style, label }) => (
                        <button
                          key={style}
                          type="button"
                          onClick={() => handleDraftWithAI(style, label)}
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

              {/* Fields */}
              <div>
                <FieldLabel label="Samenvatting" />
                <textarea
                  rows={3}
                  className={textareaClass}
                  value={form.summary}
                  onChange={(e) => handleChange('summary', e.target.value)}
                  maxLength={CHARACTER_LIMITS.summary}
                  style={{
                    borderColor: getFieldError('summary') ? '#FF7F62' : undefined // CHANGE: Error styling
                  }}
                />
                {getFieldError('summary') && (
                  <p className="mt-1 text-sm" style={{ color: 'var(--color-coral)' }}>
                    {getFieldError('summary')}
                  </p>
                )}
                <div className="mt-1 text-right text-xs" style={{ color: 'var(--color-body)' }}>
                  {getCharacterInfo('summary').count}/{getCharacterInfo('summary').limit}
                </div>
              </div>

              <div>
                <FieldLabel label="Verantwoordelijkheden" />
                <textarea
                  rows={5}
                  className={textareaClass}
                  value={form.responsibilities}
                  onChange={(e) => handleChange('responsibilities', e.target.value)}
                  maxLength={CHARACTER_LIMITS.responsibilities}
                  style={{
                    borderColor: getFieldError('responsibilities') ? '#FF7F62' : undefined // CHANGE: Error styling
                  }}
                />
                {getFieldError('responsibilities') && (
                  <p className="mt-1 text-sm" style={{ color: 'var(--color-coral)' }}>
                    {getFieldError('responsibilities')}
                  </p>
                )}
                <div className="mt-1 text-right text-xs" style={{ color: 'var(--color-body)' }}>
                  {getCharacterInfo('responsibilities').count}/{getCharacterInfo('responsibilities').limit}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <FieldLabel label="Vereisten" />
                  <textarea
                    rows={5}
                    className={textareaClass}
                    value={form.requirements}
                    onChange={(e) => handleChange('requirements', e.target.value)}
                    style={{
                      borderColor: getFieldError('requirements') ? '#FF7F62' : undefined // CHANGE: Error styling
                    }}
                  />
                  {getFieldError('requirements') && (
                    <p className="mt-1 text-sm" style={{ color: 'var(--color-coral)' }}>
                      {getFieldError('requirements')}
                    </p>
                  )}
                  <div className="mt-1 text-right text-xs" style={{ color: 'var(--color-body)' }}>
                    {getCharacterInfo('requirements').count}/{getCharacterInfo('requirements').limit}
                  </div>
                </div>

                <div>
                  <FieldLabel label="Wat wij bieden" />
                  <textarea
                    rows={5}
                    className={textareaClass}
                    value={form.benefits}
                    onChange={(e) => handleChange('benefits', e.target.value)}
                    style={{
                      borderColor: getFieldError('benefits') ? '#FF7F62' : undefined // CHANGE: Error styling
                    }}
                  />
                  {getFieldError('benefits') && (
                    <p className="mt-1 text-sm" style={{ color: 'var(--color-coral)' }}>
                      {getFieldError('benefits')}
                    </p>
                  )}
                  <div className="mt-1 text-right text-xs" style={{ color: 'var(--color-body)' }}>
                    {getCharacterInfo('benefits').count}/{getCharacterInfo('benefits').limit}
                  </div>
                </div>
              </div>
            </div>

            {/* Footer */}
            <div className="flex items-center border-t px-8 py-6" style={{ borderColor: 'var(--color-stone)', backgroundColor: 'var(--color-sand)' }}>
              <div className="flex flex-1 items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={handleBack}
                  className="rounded-xl border bg-white px-5 py-3 font-medium transition hover:bg-gray-50"
                  style={{ borderColor: 'var(--color-stone)', color: 'var(--color-headline)' }}
                >
                  ← Terug
                </button>
                <button
                  type="button"
                  onClick={handleNext}
                  disabled={!isNextEnabled}
                  className={`rounded-xl px-5 py-3 font-medium text-white transition ${isNextEnabled ? 'hover:opacity-90' : 'cursor-not-allowed opacity-50'}`}
                  style={{ backgroundColor: 'var(--color-blue)' }}
                >
                  Volgende →
                </button>
              </div>
            </div>
          </div>

        </div>
      </main>
    </>
  );
}
