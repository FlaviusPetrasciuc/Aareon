'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

import { Input } from '@/components/basics/Input';
import { FieldLabel } from '@/components/basics/FieldLabel';
import { Select } from '@/components/basics/Select';
import { SegmentedControl } from '@/components/basics/SegmentedControl';
import { Textarea } from '@/components/basics/Textarea';
import Navbar from '@/components/globals/Navbar';

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
    'Basics',
    'Job description',
    'Overview',
    'Forward to recruiter',
];
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
            newErrors.push({ field: 'jobTitle', message: 'Job title is required' });
        }

        if (!formData.department) {
            newErrors.push({ field: 'department', message: 'Department is required' });
        }

        if (!formData.location.trim()) {
            newErrors.push({ field: 'location', message: 'Location is required' });
        }

        if (!formData.education) {
            newErrors.push({ field: 'education', message: 'Education level is required' });
        }

        if (!formData.mustHaves) {
            newErrors.push({ field: 'employeeRequirements', message: "Employee requirements are required" });
        }

        setErrors(newErrors);
        return newErrors.length === 0;
    };

    const handleNext = async () => {
        const isValid = validateInput();

        if (!isValid) {
            const firstErrorField = document.querySelector('[data-error-field]');

            if (firstErrorField) {
                firstErrorField.scrollIntoView({ behavior: 'smooth', block: 'center' });
            }

            return;
        }

        saveToLocalStorage(formData);

        console.log('Form data saved and navigating:', formData);
        router.push('/job-description');
    };

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
        const { name, value, type } = e.target;

        setErrors(prev => prev.filter(error => error.field !== name));

        let newValue: any = value;

        if (type === 'checkbox') {
            newValue = (e.target as HTMLInputElement).checked;
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
                <div className="mb-10 flex items-start justify-between">
                    <div>
                        <p className="mb-3 text-sm" style={{ color: 'var(--color-body)' }}>
                            Basics · 1/4
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

                {/* Form */}
                <div className="overflow-hidden rounded-2xl border" style={{ borderColor: 'var(--color-stone)', backgroundColor: 'var(--color-sand)' }}>
                    <div className="space-y-8 p-8">
                        {/* Job title */}
                        <div data-error-field={getFieldError('jobTitle') ? 'jobTitle' : undefined}>
                            <FieldLabel label="Job title" required />
                            <Input
                                name="jobTitle"
                                value={formData.jobTitle}
                                onChange={handleInputChange}
                                placeholder="e.g. Senior Frontend Engineer"
                                style={{
                                    borderColor: getFieldError('jobTitle') ? '#FF7F62' : undefined
                                }}
                            />
                            {getFieldError('jobTitle') && (
                                <p className="mt-1 text-sm" style={{ color: 'var(--color-coral)' }}>
                                    {getFieldError('jobTitle')}
                                </p>
                            )}
                        </div>

                        {/* Row */}
                        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                            {/* Department */}
                            <div data-error-field={getFieldError('department') ? 'department' : undefined}>
                                <FieldLabel label="Department" required />
                                <Select
                                    name="department"
                                    value={formData.department}
                                    onChange={handleInputChange}
                                    options={[
                                        { label: '—', value: '' },
                                        { label: 'Sales', value: 'sales' },
                                        { label: 'Management', value: 'management' },
                                        { label: 'Development', value: 'development' },
                                        { label: 'Consultancy', value: 'consultancy' },
                                        { label: 'Support', value: 'support' },
                                        { label: 'Administration', value: 'administration' },
                                        { label: 'Finance', value: 'finance' },
                                        { label: 'Facility Management', value: 'facility_management' },
                                        { label: 'HRM', value: 'hrm' },
                                        { label: 'IT (systeembeheer)', value: 'it' },
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
                                <FieldLabel label="Location" required />
                                <Select
                                    name="location"
                                    value={formData.location}
                                    onChange={handleInputChange}
                                    options={[
                                        { label: "—", value: '' },
                                        { label: "Emmen", value: 'emmen' },
                                        { label: "Groningen", value: 'groningen' },
                                        { label: "Amersfoort", value: 'amersfoort' },
                                        { label: "Enschede", value: 'enschede' },
                                        { label: "Oosterhout", value: 'oosterhout' },
                                        { label: "Amsterdam", value: 'utrecht' },
                                        { label: "Roermond", value: 'roermond' },
                                        { label: "Breda", value: 'breda' },
                                        { label: "Sneek", value: 'sneek' },
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
                                <FieldLabel label="Work Mode" />
                                <SegmentedControl
                                    value={formData.workMode}
                                    onChange={(value) =>
                                        setFormData((prev) => ({
                                            ...prev,
                                            workMode: value as FormData['workMode'],
                                        }))
                                    }
                                    options={[
                                        { label: 'On-site', value: 'on-site' },
                                        { label: 'Hybrid', value: 'hybrid' },
                                        { label: 'Remote', value: 'remote' },
                                    ]}
                                />
                            </div>

                            {/* Employment type */}
                            <div>
                                <FieldLabel label="Employment type" />
                                <SegmentedControl
                                    value={formData.employmentType}
                                    onChange={(value) =>
                                        setFormData((prev) => ({
                                            ...prev,
                                            employmentType: value as FormData['employmentType'],
                                        }))
                                    }
                                    options={[
                                        { label: 'Permanent', value: 'permanent' },
                                        { label: 'Internship', value: 'internship' },
                                    ]}
                                />
                            </div>
                        </div>

                        {/* Row */}
                        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                            {/* Salary */}
                            <div>
                                <FieldLabel label="Salary range (monthly)" />
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
                                    />

                                    <span style={{ color: 'var(--color-body)' }}>—</span>

                                    <Input
                                        name="salaryMax"
                                        value={formData.salaryMax}
                                        onChange={handleInputChange}
                                        placeholder="max"
                                    />
                                </div>
                            </div>

                            {/* Work Equipment */}
                            <div>
                                <FieldLabel label="Work Equipment (optional)" />
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
                                        <span className="text-sm" style={{ color: 'var(--color-body)' }}>Lease car</span>
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
                                        <span className="text-sm" style={{ color: 'var(--color-body)' }}>Company phone</span>
                                    </label>
                                </div>
                            </div>
                        </div>

                        {/* Bonus Structure */}
                        <FieldLabel label='Bonus Structure' />
                        <Input
                            name='bonusStructure'
                            value={formData.bonusStructure}
                            onChange={handleInputChange}
                            placeholder='e.g. 70/30 Rekening (Sales Department), Standard Bonus (Other Departments)'
                        />

                        {/* Education level */}
                        <div data-error-field={getFieldError('education') ? 'education' : undefined}>
                            <FieldLabel label="Minimum Required Education Level" required />
                            <Select
                                name="education"
                                value={formData.education}
                                onChange={handleInputChange}
                                options={[
                                    { label: '—', value: '' },
                                    { label: 'HBO', value: 'hbo' },
                                    { label: 'WO', value: 'wo' },
                                    { label: 'MBO', value: 'mbo' },
                                    { label: 'Not relevant', value: 'not_relevant' },
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
                            <FieldLabel label="Employee Requirements" />
                            <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
                                <div data-error-field={getFieldError('mustHaves') ? 'mustHaves' : undefined}>
                                    <FieldLabel label="Must have" required />
                                    <Textarea
                                        name="mustHaves"
                                        value={formData.mustHaves}
                                        onChange={handleInputChange}
                                        placeholder="e.g. Experience in Sales, soft skills, fluent in Dutch and English etc."
                                        style={{
                                            borderColor: getFieldError('mustHaves') ? '#FF7F62' : undefined
                                        }}
                                    />
                                    {getFieldError('mustHave') && (
                                        <p className="mt-1 text-sm" style={{ color: 'var(--color-coral)' }}>
                                            {getFieldError('mustHave')}
                                        </p>
                                    )}
                                </div>

                                <div>
                                    <FieldLabel label="Nice-to have" />
                                    <Textarea
                                        name="niceToHaves"
                                        value={formData.niceToHaves}
                                        onChange={handleInputChange}
                                        placeholder="e.g. Knowledge in economics, experience with C++ etc."
                                    />
                                </div>

                                <div>
                                    <FieldLabel label="Shouldn't have" />
                                    <Textarea
                                        name="shouldntHaves"
                                        value={formData.shouldntHaves}
                                        onChange={handleInputChange}
                                        placeholder="e.g. Difficulty working in a team, unwillingness to offer help etc."
                                    />
                                </div>
                            </div>
                        </div>

                        <div>
                            <FieldLabel label="Additional Details" />
                            <Input
                                name="jobTitle"
                                value={formData.additionalDetails}
                                onChange={handleInputChange}
                                placeholder="e.g. Mention the working culture, what a day in the life of someone in this position looks like etc."
                            />
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
                                        Please fill in all required fields
                                    </span>
                                </div>
                            )}
                            <div className="flex items-center gap-3 ml-auto">
                                <button
                                    onClick={handleNext}
                                    className="rounded-xl px-5 py-3 font-medium text-white transition hover:opacity-90"
                                    style={{ backgroundColor: 'var(--color-bright)' }}>
                                    Next →
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