// components/globals/Stepper.tsx

import React from 'react';

interface StepperProps {
  steps: string[]; /** current step number (1-indexed) */
  currentStep: number; 
  className?: string; /** className for additional styling */
}

export default function Stepper({ 
  steps, 
  currentStep, 
  className = '',
}: StepperProps) {
  return (
    <div className={`mb-10 flex items-center ${className}`}>
      {steps.map((step, index) => {
        const stepNumber = index + 1;
        const isDone = stepNumber < currentStep;
        const isCurrent = stepNumber === currentStep;

        return (
          <React.Fragment key={step}>
            <div 
              className={`flex items-center gap-3`}
            >
              <div
                className="flex h-10 w-10 items-center justify-center rounded-full border text-sm font-medium transition"
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
            {index < steps.length - 1 && (
              <div className="mx-5 h-px flex-1" style={{ backgroundColor: 'var(--color-stone)' }} />
            )}
          </React.Fragment>
        );
      })}
    </div>
  );
}