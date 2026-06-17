// components/globals/PageHeader.tsx

import React from 'react';

interface PageHeaderProps {
  stepLabel: string;
  currentStep: number;
  totalSteps: number;
  title: string;
  subtitle?: string;
  className?: string;
}

export default function PageHeader({
  stepLabel,
  currentStep,
  totalSteps,
  title,
  subtitle,
  className = '',
}: PageHeaderProps) {
  return (
    <div className={`mb-10 flex items-start justify-between ${className}`}>
      <div>
        <p className="mb-3 text-sm" style={{ color: 'var(--color-body)' }}>
          {stepLabel} · {currentStep}/{totalSteps}
        </p>

        <h1 className="text-5xl font-serif tracking-tight" style={{ color: 'var(--color-headline)' }}>
          {title}
        </h1>

        {subtitle && (
          <p className="mt-3 text-lg" style={{ color: 'var(--color-body)' }}>
            {subtitle}
          </p>
        )}
      </div>
    </div>
  );
}