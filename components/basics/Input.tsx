"use client";

export function Input(
    props: React.InputHTMLAttributes<HTMLInputElement>
) {
    return (
        <input
            {...props}
            className="
        h-12 w-full rounded-xl border border-[#d6d3d1]
        bg-white px-4 text-[15px] outline-none transition
        placeholder:text-gray-400
        focus:border-[#172033]
      "
        />
    );
}