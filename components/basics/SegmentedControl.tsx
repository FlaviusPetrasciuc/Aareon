"use client";

export function SegmentedControl({ options, value, onChange}: {
    options: { label: string; value: string }[];
    value: string;
    onChange: (value: string) => void;
}) {
    return (
        <div className="flex rounded-xl border border-[#d6d3d1] bg-[#f3f2ef] p-1">
            {options.map((option) => {
                const active = value === option.value;

                return (
                    <button
                        key={option.value}
                        type="button"
                        onClick={() => onChange(option.value)}
                        className={`
              flex-1 rounded-lg px-4 py-2.5 text-sm font-medium transition
              ${active
                                ? 'bg-white text-[#172033] shadow-sm'
                                : 'text-gray-500 hover:text-[#172033]'
                            }
            `}
                    >
                        {option.label}
                    </button>
                );
            })}
        </div>
    );
}