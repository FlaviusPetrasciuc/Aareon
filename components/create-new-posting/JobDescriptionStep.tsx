'use client';

import { useState } from 'react';

interface Props {
  value: string;
  onChange: (val: string) => void;
}

export function JobDescriptionStep({ value, onChange }: Props) {
  const [activeFormats, setActiveFormats] = useState<string[]>([]);

  const toggleFormat = (fmt: string) => {
    setActiveFormats((f) =>
      f.includes(fmt) ? f.filter((x) => x !== fmt) : [...f, fmt]
    );
  };

  return (
    <div className="space-y-5">

      {/* AI wizard placeholder — someone else will implement this */}
      <div className="bg-[#eef1ff] border border-[#c5cef5] rounded-lg p-4 flex gap-3 items-start">
        <div className="w-8 h-8 bg-[#051163] rounded-lg flex items-center justify-center flex-shrink-0">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2">
            <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" />
          </svg>
        </div>
        <div>
          <p className="text-sm font-semibold text-[#051163]">Generate with AI intake wizard</p>
          <p className="text-xs text-stone-500 mt-0.5 leading-relaxed">
            Answer a few structured questions about the role and we'll draft a complete job
            description — responsibilities, requirements, and a hiring kit — in seconds.
          </p>
          <button
            disabled
            className="mt-2 px-3 py-1.5 bg-[#051163] text-white text-xs font-medium rounded-md opacity-50 cursor-not-allowed"
          >
            Launch intake wizard
          </button>
        </div>
      </div>

      {/* Job description editor */}
      <div>
        <label className="block text-xs font-semibold text-stone-500 uppercase tracking-wide mb-1.5">
          Job description <span className="text-red-400">*</span>
        </label>

        {/* Toolbar */}
        <div className="flex items-center gap-1 px-2 py-1.5 bg-white border border-[#d6d3d1] border-b-0 rounded-t-xl">
          {[
            { label: 'B', fmt: 'bold', style: 'font-bold' },
            { label: 'I', fmt: 'italic', style: 'italic' },
            { label: 'U', fmt: 'underline', style: 'underline' },
          ].map(({ label, fmt, style }) => (
            <button
              key={fmt}
              onClick={() => toggleFormat(fmt)}
              className={`px-2 py-1 rounded text-xs font-medium transition-colors ${style}
                ${activeFormats.includes(fmt)
                  ? 'bg-stone-100 text-[#172033]'
                  : 'text-stone-400 hover:bg-stone-50 hover:text-stone-600'
                }`}
            >
              {label}
            </button>
          ))}

          <div className="w-px h-4 bg-[#d6d3d1] mx-1" />

          <button title="Bullet list" className="p-1.5 rounded text-stone-400 hover:bg-stone-50 hover:text-stone-600 transition-colors">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <line x1="9" y1="6" x2="20" y2="6"/><line x1="9" y1="12" x2="20" y2="12"/>
              <line x1="9" y1="18" x2="20" y2="18"/><circle cx="4" cy="6" r="1" fill="currentColor"/>
              <circle cx="4" cy="12" r="1" fill="currentColor"/><circle cx="4" cy="18" r="1" fill="currentColor"/>
            </svg>
          </button>

          <button title="Numbered list" className="p-1.5 rounded text-stone-400 hover:bg-stone-50 hover:text-stone-600 transition-colors">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <line x1="10" y1="6" x2="21" y2="6"/><line x1="10" y1="12" x2="21" y2="12"/>
              <line x1="10" y1="18" x2="21" y2="18"/>
              <path d="M4 6h1v4M4 10h2M4 15h1.5a.5.5 0 010 1H4a.5.5 0 000 1h2"/>
            </svg>
          </button>

          <div className="w-px h-4 bg-[#d6d3d1] mx-1" />

          <button title="Heading" className="px-2 py-1 rounded text-xs font-semibold text-stone-400 hover:bg-stone-50 hover:text-stone-600 transition-colors">
            H
          </button>
        </div>

        {/* Textarea */}
        <textarea
          value={value}
          onChange={(e) => onChange(e.target.value)}
          rows={10}
          placeholder="Paste or write the job description here, or use the AI wizard above to generate one automatically…"
          className="w-full px-3 py-2.5 bg-white border border-[#d6d3d1] rounded-b-xl text-sm text-[#172033] placeholder-stone-300 focus:outline-none focus:border-[#6b6fcf] focus:ring-2 focus:ring-[#6b6fcf]/10 resize-none leading-relaxed"
        />

        {/* Footer hint + char count */}
        <div className="flex items-center justify-between mt-1.5">
          <p className="text-xs text-stone-400">
            Tip: include responsibilities, requirements, and what makes this role unique.
          </p>
          <p className="text-xs text-stone-400 flex-shrink-0 ml-4">
            {value.length.toLocaleString()} characters
          </p>
        </div>
      </div>
    </div>
  );
}