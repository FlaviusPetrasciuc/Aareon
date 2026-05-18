"use client";

export function FieldLabel({
    label,
    required,
}: {
    label: string;
    required?: boolean;
}) {
    return (
        <label className="mb-3 block text-[15px] font-medium text-[#374151]">
            {label}
            {required && <span className="ml-1 text-[#ef4444]">*</span>}
        </label>
    );
}