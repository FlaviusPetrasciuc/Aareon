'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

import { Input } from '@/components/basics/Input';
import { FieldLabel } from '@/components/basics/FieldLabel';
import { Select } from '@/components/basics/Select';
import { SegmentedControl } from '@/components/basics/SegmentedControl';
import { Textarea } from '@/components/basics/Textarea';
import Navbar from '@/components/globals/Navbar';
import Stepper from '@/components/globals/Stepper';
import PageHeader from '@/components/globals/PageHeader';
import { createSession, saveSession } from "@/lib/session";
interface FormData {
    jobTitle: string;
    department: string;
    location: string;
    workMode: 'on-site' | 'hybrid' | 'remote';
    employmentType: 'permanent' | 'internship';
    salaryMin: string;
    salaryMax: string;
    companyCar: boolean;
    companyPhone: boolean;
    currency: string;
    bonusStructure: string;
    education: string;
    mustHaves: string;
    niceToHaves: string;
    shouldntHaves: string;
    additionalDetails: string;
}

interface FieldError {
    field: string;
    message: string;
}

const STEPS = [
    'Basisinformatie',
    'Functieomschrijving',
    'Overzicht',
    'Doorsturen naar recruiter',
];

const CHARACTER_LIMITS = {
    jobTitle: 200,
    salaryMin: 7,
    salaryMax: 7,
    bonusStructure: 200,
    mustHaves: 500,
    niceToHaves: 500,
    shouldntHaves: 500,
    additionalDetails: 500,
} as const;

const DEFAULT_TEXTAREA_LIMIT = 1000;
const DEFAULT_INPUT_LIMIT = 255;

const CURRENT_STEP = 1;

const STORAGE_KEY = 'jobPostingFormData';

export default function CreateJobPostingPage() {
    const [errors, setErrors] = useState<FieldError[]>([]);
    const router = useRouter();

    const [formData, setFormData] = useState<FormData>({
        jobTitle: '',
        department: '',
        location: '',
        workMode: 'hybrid',
        employmentType: 'permanent',
        salaryMin: '',
        salaryMax: '',
        companyCar: false,
        companyPhone: false,
        currency: 'EUR',
        bonusStructure: '',
        education: '',
        mustHaves: '',
        niceToHaves: '',
        shouldntHaves: '',
        additionalDetails: '',
    });

    // Load saved data from localStorage
    useEffect(() => {
        const savedData = localStorage.getItem(STORAGE_KEY);

        if (savedData) {
            try {
                const parsedData = JSON.parse(savedData);
                setFormData(prev => ({ ...prev, ...parsedData }));
                console.log('Loaded saved form data:', parsedData);
            } catch (error) {
                console.error('Error loading saved form data:', error);
            }
        }
    }, []);

    // Save form data to localStorage
    const saveToLocalStorage = (data: FormData) => {
        try {
            localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
            console.log('Form data saved to localStorage');
        } catch (error) {
            console.error('Error saving to localStorage:', error);
        }
    };

    // Validation
    const validateInput = (): boolean => {
        const newErrors: FieldError[] = [];

        if (!formData.jobTitle.trim()) {
            newErrors.push({ field: 'jobTitle', message: 'Functietitel is verplicht' });
        }

        if (!formData.department) {
            newErrors.push({ field: 'department', message: 'Afdeling is verplicht' });
        }

        if (!formData.location.trim()) {
            newErrors.push({ field: 'location', message: 'Locatie is verplicht' });
        }

        if (!formData.education) {
            newErrors.push({ field: 'education', message: 'Opleidingsniveau is verplicht' });
        }

        if (!formData.mustHaves) {
            newErrors.push({ field: 'employeeRequirements', message: 'Functie-eisen zijn verplicht' });
        }

        const limitErrors = validateCharacterLimits(formData);
        newErrors.push(...limitErrors);

        setErrors(newErrors);
        return newErrors.length === 0;
    };

    const validateCharacterLimits = (data: FormData): FieldError[] => {
        const errors: FieldError[] = [];

        Object.keys(CHARACTER_LIMITS).forEach((key) => {
            const fieldName = key as keyof FormData;
            const value = data[fieldName] as string;
            const limit = CHARACTER_LIMITS[fieldName as keyof typeof CHARACTER_LIMITS];

            if (value && value.length > limit) {
                const fieldLabels: Record<string, string> = {
                    jobTitle: 'Functietitel',
                    salaryMin: 'Minimum salaris',
                    salaryMax: 'Maximum salaris',
                    bonusStructure: 'Bonusstructuur',
                    mustHaves: 'Verplichte eisen',
                    niceToHaves: 'Pre-eisen',
                    shouldntHaves: 'Bezwaar-eisen',
                    additionalDetails: 'Aanvullende informatie'
                };

                errors.push({
                    field: fieldName,
                    message: `${fieldLabels[fieldName] || fieldName} mag niet meer dan ${limit} tekens bevatten (huidig: ${value.length})`
                });
            }
        });

        return errors;
    };

    const getCharacterInfo = (fieldName: keyof FormData): { count: number; limit: number } => {
        const value = formData[fieldName] as string;
        const limit = CHARACTER_LIMITS[fieldName as keyof typeof CHARACTER_LIMITS] ||
            (fieldName === 'mustHaves' || fieldName === 'niceToHaves' ||
                fieldName === 'shouldntHaves' || fieldName === 'additionalDetails'
                ? DEFAULT_TEXTAREA_LIMIT : DEFAULT_INPUT_LIMIT);

        return { count: value?.length || 0, limit };
    };

    const handleNext = async () => {
        const isValid = validateInput();

        if (!isValid) {
            const firstErrorField = document.querySelector('[data-error-field]');

            if (firstErrorField) {
                firstErrorField.scrollIntoView({
                    behavior: 'smooth',
                    block: 'center',
                });
            }

            return;
        }

        saveToLocalStorage(formData);

        const managerEmail =
            localStorage.getItem("managerEmail") ||
            "manager@aareon.nl";

        const session = createSession(
            formData.jobTitle,
            managerEmail
        );

        saveSession(session);

        console.log("Session created:", session);

        router.push("/job-description");
    };

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
        const { name, value, type } = e.target;

        setErrors(prev => prev.filter(error => error.field !== name));

        let newValue: any = value;

        if (type === 'checkbox') {
            newValue = (e.target as HTMLInputElement).checked;
        } else {
            const limit = CHARACTER_LIMITS[name as keyof typeof CHARACTER_LIMITS] ||
                (e.target.tagName === 'TEXTAREA' ? DEFAULT_TEXTAREA_LIMIT : DEFAULT_INPUT_LIMIT);

            if (value.length > limit) {
                return;
            }
        }

        setFormData(prev => {
            const updatedData = { ...prev, [name]: newValue };

            return updatedData;
        });
    };

    const getFieldError = (fieldName: string): string | undefined => {
        return errors.find(error => error.field === fieldName)?.message;
    };

    return (
        <>
            <Navbar />
            <main className="min-h-screen" style={{ backgroundColor: 'var(--color-sand)', color: 'var(--color-body)' }}>
                <div className="mx-auto max-w-7xl px-8 py-8">
                    {/* Header */}
                    <PageHeader 
                        stepLabel="Basisinformatie"
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

                    {/* Form */}
                    <div className="overflow-hidden rounded-2xl border" style={{ borderColor: 'var(--color-stone)', backgroundColor: 'var(--color-sand)' }}>
                        <div className="space-y-8 p-8">
                            {/* Job title */}
                            <div data-error-field={getFieldError('jobTitle') ? 'jobTitle' : undefined}>
                                <FieldLabel label="Functietitel" required />
                                <Input
                                    name="jobTitle"
                                    value={formData.jobTitle}
                                    onChange={handleInputChange}
                                    placeholder="e.g. Senior Frontend Engineer"
                                    maxLength={CHARACTER_LIMITS.jobTitle}
                                    style={{
                                        borderColor: getFieldError('jobTitle') ? '#FF7F62' : undefined
                                    }}
                                />
                                {getFieldError('jobTitle') && (
                                    <p className="mt-1 text-sm" style={{ color: 'var(--color-coral)' }}>
                                        {getFieldError('jobTitle')}
                                    </p>
                                )}
                                <div className="mt-1 text-right text-xs" style={{ color: 'var(--color-body)' }}>
                                    {getCharacterInfo('jobTitle').count}/{getCharacterInfo('jobTitle').limit}
                                </div>
                            </div>

                            {/* Row */}
                            <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                                {/* Department */}
                                <div data-error-field={getFieldError('department') ? 'department' : undefined}>
                                    <FieldLabel label="Afdeling" required />
                                    <Select
                                        name="department"
                                        value={formData.department}
                                        onChange={handleInputChange}
                                        options={[
                                            { label: '—', value: '' },
                                            { label: 'Administratie', value: 'administration' },
                                            { label: 'Consultancy', value: 'consultancy' },
                                            { label: 'Ontwikkeling', value: 'development' },
                                            { label: 'Facilitair Management', value: 'facility_management' },
                                            { label: 'Financiën', value: 'finance' },
                                            { label: 'HRM', value: 'hrm' },
                                            { label: 'IT (systeembeheer)', value: 'it' },
                                            { label: 'Management', value: 'management' },
                                            { label: 'Sales', value: 'sales' },
                                            { label: 'Support', value: 'support' }
                                        ]}
                                        style={{
                                            borderColor: getFieldError('department') ? '#FF7F62' : undefined
                                        }}
                                    />
                                    {getFieldError('department') && (
                                        <p className="mt-1 text-sm" style={{ color: 'var(--color-coral)' }}>
                                            {getFieldError('department')}
                                        </p>
                                    )}
                                </div>

                                {/* Location */}
                                <div data-error-field={getFieldError('location') ? 'location' : undefined}>
                                    <FieldLabel label="Locatie" required />
                                    <Select
                                        name="location"
                                        value={formData.location}
                                        onChange={handleInputChange}
                                        options={[
                                            { label: "—", value: '' },
                                            { label: "Amersfoort", value: 'amersfoort' },
                                            { label: "Amsterdam", value: 'amsterdam' },
                                            { label: "Breda (Blue Mountain)", value: 'breda-blue-mountain' },
                                            { label: "Emmen", value: 'emmen' },
                                            { label: "Enschede (Facilitor)", value: 'enschede-facilitor' },
                                            { label: "Groningen (Embrace)", value: 'groningen-embrace' },
                                            { label: "Groningen (Blue Mountain)", value: 'groningen-blue-mountain' },
                                            { label: "Oosterhout (Twinq)", value: 'oosterhout-twinq' },
                                            { label: "Roermond", value: 'roermond' },
                                            { label: "Sneek (Embrace)", value: 'sneek-embrace' },
                                            { label: "Sneek (Viadata)", value: 'sneek-viadata' },
                                        ]}
                                    />
                                    {getFieldError('location') && (
                                        <p className="mt-1 text-sm" style={{ color: 'var(--color-coral)' }}>
                                            {getFieldError('location')}
                                        </p>
                                    )}
                                </div>
                            </div>

                            {/* Row */}
                            <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                                {/* Work mode */}
                                <div>
                                    <FieldLabel label="Werk Mode" />
                                    <SegmentedControl
                                        value={formData.workMode}
                                        onChange={(value) =>
                                            setFormData((prev) => ({
                                                ...prev,
                                                workMode: value as FormData['workMode'],
                                            }))
                                        }
                                        options={[
                                            { label: 'Op locatie', value: 'on-site' },
                                            { label: 'Hybride', value: 'hybrid' },
                                            { label: 'Thuiswerken', value: 'remote' },
                                        ]}
                                    />
                                </div>

                                {/* Employment type */}
                                <div>
                                    <FieldLabel label="Dienstverband" />
                                    <SegmentedControl
                                        value={formData.employmentType}
                                        onChange={(value) =>
                                            setFormData((prev) => ({
                                                ...prev,
                                                employmentType: value as FormData['employmentType'],
                                            }))
                                        }
                                        options={[
                                            { label: 'Vast', value: 'permanent' },
                                            { label: 'Stage', value: 'internship' },
                                        ]}
                                    />
                                </div>
                            </div>

                            {/* Row */}
                            <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                                {/* Salary */}
                                <div>
                                    <FieldLabel label="Salarisindicatie (per maand)" />
                                    <div className="flex items-center gap-3">
                                        <div className="relative w-28">
                                            <div className="h-12 w-full appearance-none rounded-xl border bg-white px-4 text-sm outline-none transition flex items-center justify-center"
                                                style={{ borderColor: 'var(--color-stone)' }}>
                                                {formData.currency}
                                            </div>
                                        </div>

                                        <Input
                                            name="salaryMin"
                                            value={formData.salaryMin}
                                            onChange={handleInputChange}
                                            placeholder="min"
                                            maxLength={CHARACTER_LIMITS.salaryMin}
                                        />

                                        <span style={{ color: 'var(--color-body)' }}>—</span>

                                        <Input
                                            name="salaryMax"
                                            value={formData.salaryMax}
                                            onChange={handleInputChange}
                                            placeholder="max"
                                            maxLength={CHARACTER_LIMITS.salaryMax}
                                        />
                                    </div>
                                </div>

                                {/* Work Equipment */}
                                <div>
                                    <FieldLabel label="Werkuitrusting (optioneel)" />
                                    <div className="flex items-center gap-10 mt-6">
                                        <label className="flex items-center gap-2 cursor-pointer">
                                            <input
                                                type="checkbox"
                                                name="companyCar"
                                                checked={formData.companyCar}
                                                onChange={handleInputChange}
                                                className="w-6 h-6 rounded-xl focus:ring-offset-0"
                                                style={{
                                                    borderColor: 'var(--color-stone)',
                                                    color: 'var(--color-bright)'
                                                }}
                                            />
                                            <span className="text-sm" style={{ color: 'var(--color-body)' }}>Leaseauto</span>
                                        </label>

                                        <label className="flex items-center gap-2 cursor-pointer">
                                            <input
                                                type="checkbox"
                                                name="companyPhone"
                                                checked={formData.companyPhone}
                                                onChange={handleInputChange}
                                                className="w-6 h-6 rounded focus:ring-offset-0"
                                                style={{
                                                    borderColor: 'var(--color-stone)',
                                                    color: 'var(--color-bright)'
                                                }}
                                            />
                                            <span className="text-sm" style={{ color: 'var(--color-body)' }}>Bedrijfstelefoon</span>
                                        </label>
                                    </div>
                                </div>
                            </div>

                            {/* Bonus Structure */}
                            <FieldLabel label='Bonusstructuur' />
                            <Input
                                name='bonusStructure'
                                value={formData.bonusStructure}
                                onChange={handleInputChange}
                                placeholder='bijv. 70/30 regeling (sales afdeling), standaard Bonus (andere afdelingen)'
                                maxLength={CHARACTER_LIMITS.bonusStructure}
                            />
                            <div className="mt-1 text-right text-xs" style={{ color: 'var(--color-body)' }}>
                                {getCharacterInfo('bonusStructure').count}/{getCharacterInfo('bonusStructure').limit}
                            </div>

                            {/* Education level */}
                            <div data-error-field={getFieldError('education') ? 'education' : undefined}>
                                <FieldLabel label="Minimaal vereist opleidingsniveau" required />
                                <Select
                                    name="education"
                                    value={formData.education}
                                    onChange={handleInputChange}
                                    options={[
                                        { label: '—', value: '' },
                                        { label: 'HBO', value: 'hbo' },
                                        { label: 'MBO', value: 'mbo' },
                                        { label: 'WO', value: 'wo' },
                                        { label: 'Niet relevant', value: 'not_relevant' },
                                    ]}
                                    style={{
                                        borderColor: getFieldError('education') ? '#FF7F62' : undefined
                                    }}
                                />
                                {getFieldError('education') && (
                                    <p className="mt-1 text-sm" style={{ color: 'var(--color-coral)' }}>
                                        {getFieldError('education')}
                                    </p>
                                )}
                            </div>

                            {/* Employee Requirements */}
                            <div className="space-y-2">
                                <FieldLabel label="Werknemerseisen" />
                                <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
                                    <div data-error-field={getFieldError('mustHaves') ? 'mustHaves' : undefined}>
                                        <FieldLabel label="Verplicht" required />
                                        <Textarea
                                            name="mustHaves"
                                            value={formData.mustHaves}
                                            onChange={handleInputChange}
                                            placeholder="Bijv. Ervaring in sales, soft skills, vloeiend Nederlands en Engels, etc."
                                            maxLength={CHARACTER_LIMITS.mustHaves}
                                            style={{
                                                borderColor: getFieldError('mustHaves') ? '#FF7F62' : undefined
                                            }}
                                        />
                                        {getFieldError('mustHave') && (
                                            <p className="mt-1 text-sm" style={{ color: 'var(--color-coral)' }}>
                                                {getFieldError('mustHave')}
                                            </p>
                                        )}
                                        <div className="mt-1 text-right text-xs" style={{ color: 'var(--color-body)' }}>
                                            {getCharacterInfo('mustHaves').count}/{getCharacterInfo('mustHaves').limit}
                                        </div>
                                    </div>

                                    <div>
                                        <FieldLabel label="Pre" />
                                        <Textarea
                                            name="niceToHaves"
                                            value={formData.niceToHaves}
                                            onChange={handleInputChange}
                                            placeholder="Bijv. Kennis van economie, ervaring met C++, etc."
                                            maxLength={CHARACTER_LIMITS.niceToHaves}
                                        />
                                        <div className="mt-1 text-right text-xs" style={{ color: 'var(--color-body)' }}>
                                            {getCharacterInfo('niceToHaves').count}/{getCharacterInfo('niceToHaves').limit}
                                        </div>
                                    </div>

                                    <div>
                                        <FieldLabel label="Bezwaar" />
                                        <Textarea
                                            name="shouldntHaves"
                                            value={formData.shouldntHaves}
                                            onChange={handleInputChange}
                                            placeholder="Bijv. Moeite met samenwerken, onwil om hulp te bieden, etc."
                                            maxLength={CHARACTER_LIMITS.shouldntHaves}
                                        />
                                        <div className="mt-1 text-right text-xs" style={{ color: 'var(--color-body)' }}>
                                            {getCharacterInfo('shouldntHaves').count}/{getCharacterInfo('shouldntHaves').limit}
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div>
                                <FieldLabel label="	Aanvullende informatie" />
                                <Input
                                    name="additionalDetails"
                                    value={formData.additionalDetails}
                                    onChange={handleInputChange}
                                    placeholder="Bijv. Vermeld de werkcultuur, hoe een dag in het leven van iemand in deze functie eruitziet, etc."
                                    maxLength={CHARACTER_LIMITS.additionalDetails}
                                />
                                <div className="mt-1 text-right text-xs" style={{ color: 'var(--color-body)' }}>
                                    {getCharacterInfo('additionalDetails').count}/{getCharacterInfo('additionalDetails').limit}
                                </div>
                            </div>

                            {/* Footer */}
                            <div className="flex items-center justify-between border-t px-8 py-6"
                                style={{ borderColor: 'var(--color-stone)', backgroundColor: 'var(--color-sand)' }}>
                                {errors.length > 0 && (
                                    <div className="flex items-center gap-2">
                                        <svg width="20" height="20" viewBox="0 0 20 20" fill="none" style={{ color: 'var(--color-coral)' }}>
                                            <circle cx="10" cy="10" r="9" stroke="currentColor" strokeWidth="1.5" />
                                            <path d="M10 6V10M10 14H10.01" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                                        </svg>
                                        <span className="text-sm" style={{ color: 'var(--color-coral)' }}>
                                            Vul alle verplichte velden in
                                        </span>
                                    </div>
                                )}
                                <div className="flex items-center gap-3 ml-auto">
                                    <button
                                        onClick={handleNext}
                                        className="rounded-xl px-5 py-3 font-medium text-white transition hover:opacity-90"
                                        style={{ backgroundColor: 'var(--color-blue)' }}>
                                        Volgende →
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </main>
        </>
    );
}