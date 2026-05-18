'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { JobDescriptionStep } from '@/components/create-new-posting/JobDescriptionStep';
import { Input } from '@/components/create-new-posting/Input';
import { FieldLabel } from '@/components/create-new-posting/FieldLabel';
import { Select } from '@/components/create-new-posting/Select';
import { SegmentedControl } from '@/components/create-new-posting/SegmentedControl';

interface FormData {
    jobTitle: string;
    department: string;
    location: string;
    workMode: 'on-site' | 'hybrid' | 'remote';
    employmentType: 'permanent' | 'contract' | 'internship';
    salaryMin: string;
    salaryMax: string;
    companyCar: boolean;
    companyPhone: boolean;
    currency: string;
    education: string,
    template: string;
}

const steps = [
    'Basics',
    'Job description',
    'Overview',
    'Forward to recruiter',
];

export default function CreateJobPostingPage() {
    const [currentStep, setCurrentStep] = useState(3);
    const [jobDescription, setJobDescription] = useState('');
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
        education: '',
        template: '',
    });

    const handleNext = () => {
        if (currentStep < steps.length) {
            setCurrentStep(prev => prev + 1);
        } else {
            router.push('/ai-recruiter');
        }
    };

    const handleBack = () => {
        setCurrentStep(prev => prev - 1);
    };

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value, type } = e.target;
        
        if (type === 'checkbox') {
            const checked = (e.target as HTMLInputElement).checked;
            setFormData(prev => ({ ...prev, [name]: checked }));
        } else {
            setFormData(prev => ({ ...prev, [name]: value }));
        }
    };

    return (
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
                    {steps.map((step, index) => {
                        const stepNumber = index + 1;
                        const active = currentStep === stepNumber;

                        return (
                            <React.Fragment key={step + index}>
                                <div className="flex items-center gap-3">
                                    <div
                                        className={`
                      flex h-10 w-10 items-center justify-center rounded-full border text-sm font-medium
                      ${active
                                                ? 'border-[#14213d] bg-[#14213d] text-white'
                                                : 'border-[#d6d3d1] bg-white text-gray-500'
                                            }
                    `}
                                    >
                                        {stepNumber}
                                    </div>

                                    <span
                                        className={`text-[15px] ${active ? 'text-[#172033]' : 'text-gray-500'
                                            }`}
                                    >
                                        {step}
                                    </span>
                                </div>

                                {index < steps.length - 1 && (
                                    <div className="mx-5 h-px flex-1 bg-[#ddd8d2]" />
                                )}
                            </React.Fragment>
                        );
                    })}
                </div>

                {/* Form */}
                <div className="overflow-hidden rounded-2xl border border-[#e7e5e4] bg-[#f7f6f3]">
                    <div className="space-y-8 p-8">
                        {currentStep === 2 && (
                            <JobDescriptionStep
                                value={jobDescription}
                                onChange={setJobDescription}
                            />
                        )}
                        {currentStep === 3 && (
                            <div>
                                <h2 className="text-2xl font-serif text-[#172033] mb-2">Overview</h2>
                                <p className="text-gray-500 text-sm">Review the details of your job posting before moving on.</p>
                            </div>
                        )}
                        {currentStep === 1 && (<>
                            {/* Job title */}
                            <FieldLabel label="Job title" required />

                            <Input
                                name="jobTitle"
                                value={formData.jobTitle}
                                onChange={handleInputChange}
                                placeholder="e.g. Senior Frontend Engineer"
                            />

                            {/* Row */}
                            <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                                {/* Department */}
                                <div>
                                    <FieldLabel label="Department" required />

                                    <Select
                                        name="department"
                                        value={formData.department}
                                        onChange={handleInputChange}
                                        options={[
                                            { label: '—', value: '' },
                                            { label: 'Engineering', value: 'engineering' },
                                            { label: 'Design', value: 'design' },
                                            { label: 'Marketing', value: 'marketing' },
                                        ]}
                                    />
                                </div>

                                {/* Location */}
                                <div>
                                    <FieldLabel label="Location" required />

                                    <Input
                                        name="location"
                                        value={formData.location}
                                        onChange={handleInputChange}
                                        placeholder="City, country"
                                    />
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
                                                employmentType:
                                                    value as FormData['employmentType'],
                                            }))
                                        }
                                        options={[
                                            { label: 'Permanent', value: 'permanent' },
                                            { label: 'Contract', value: 'contract' },
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
                                            <div className="h-12 w-full appearance-none rounded-xl border border-[#d6d3d1] bg-white px-4 text-sm outline-none transition focus:border-[#172033] flex items-center justify-center">
                                                {formData.currency}
                                            </div>
                                        </div>

                                        <Input
                                            name="salaryMin"
                                            value={formData.salaryMin}
                                            onChange={handleInputChange}
                                            placeholder="min"
                                        />

                                        <span className="text-gray-400">—</span>

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
                                                className="w-6 h-6 rounded-xl border-[#d6d3d1] text-[#6b6fcf] focus:ring-[#6b6fcf] focus:ring-offset-0"
                                            />
                                            <span className="text-sm text-gray-700">Lease car</span>
                                        </label>

                                        <label className="flex items-center gap-2 cursor-pointer">
                                            <input
                                                type="checkbox"
                                                name="companyPhone"
                                                checked={formData.companyPhone}
                                                onChange={handleInputChange}
                                                className="w-6 h-6 rounded border-[#d6d3d1] text-[#6b6fcf] focus:ring-[#6b6fcf] focus:ring-offset-0"
                                            />
                                            <span className="text-sm text-gray-700">Company phone</span>
                                        </label>
                                    </div>
                                </div>
                            </div>

                            {/* Education level */}
                            <div>
                                <FieldLabel label="Minimum Required Education Level" required />

                                <Select
                                    name="template"
                                    value={formData.education}
                                    onChange={handleInputChange}
                                    options={[
                                        { label: '—', value: '' },
                                        { label: 'HBO', value: 'hbo' },
                                        { label: 'WO', value: 'wo' },
                                        { label: 'MBO', value: 'mbo' },
                                    ]}
                                />
                            </div>

                            {/* Template */}
                            <div>
                                <FieldLabel label="Start from template (optional)" />

                                <Select
                                    name="template"
                                    value={formData.template}
                                    onChange={handleInputChange}
                                    options={[
                                        { label: '—', value: '' },
                                        { label: 'Frontend Engineer', value: 'frontend' },
                                        { label: 'Backend Engineer', value: 'backend' },
                                    ]}
                                />
                            </div>
                        </>)}
                    </div>

                    {/* Footer */}
                    <div className="flex items-center justify-end border-t border-[#e7e5e4] bg-[#f7f6f3] px-8 py-6">
                        <div className="flex items-center gap-3">
                            <button className="rounded-xl border border-[#d6d3d1] bg-white px-5 py-3 font-medium text-[#172033] transition hover:bg-gray-50">
                                Save draft
                            </button>
                            {currentStep > 3 && (
                                <button onClick={handleBack} className="rounded-xl border border-[#d6d3d1] bg-white px-5 py-3 font-medium text-[#172033] transition hover:bg-gray-50">
                                    ← Back
                                </button>
                            )}
                            <button
                                onClick={handleNext}
                                className="rounded-xl bg-[#6b6fcf] px-5 py-3 font-medium text-white transition hover:opacity-90">
                                Next →
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </main>
    );
}