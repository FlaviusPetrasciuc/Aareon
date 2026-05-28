"use client";

import { forwardRef } from "react";

interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
    resizable?: boolean;
}

export const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(
    ({ resizable = true, rows = 3, className = '', ...props }, ref) => {
        return (
            <textarea
                ref={ref}
                rows={rows}
                {...props}
                className={`
                    w-full rounded-xl border border-[#d6d3d1]
                    bg-white px-4 py-3 text-[15px] outline-none transition
                    placeholder:text-gray-400
                    focus:border-[#172033]
                    ${resizable ? 'resize-y' : 'resize-none'}
                    ${className}
                `}
            />
        );
    }
);

Textarea.displayName = "Textarea";