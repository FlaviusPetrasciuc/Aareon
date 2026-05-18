"use client"; 

import { ChevronDown } from 'lucide-react';

export function Select({
    options,
    ...props
}: React.SelectHTMLAttributes<HTMLSelectElement> & {
    options: { label: string; value: string }[];
}) {
    return (
        <div className="relative">
            <select
                {...props}
                className="
          h-12 w-full appearance-none rounded-xl
          border border-[#d6d3d1]
          bg-white px-4 text-[15px]
          outline-none transition
          focus:border-[#172033]
        "
            >
                {options.map((option) => (
                    <option
                        key={option.value}
                        value={option.value}
                    >
                        {option.label}
                    </option>
                ))}
            </select>

            <ChevronDown className="pointer-events-none absolute right-4 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-500" />
        </div>
    );
}