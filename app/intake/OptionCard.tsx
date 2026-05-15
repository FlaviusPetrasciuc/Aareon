"use client";

interface OptionCardProps {
  text: string;
  selected: boolean;
  onSelect: () => void;
}

export default function OptionCard({ text, selected, onSelect }: OptionCardProps) {
  return (
    <button
      type="button"
      onClick={onSelect}
      className={[
        "w-full text-left px-4 py-3 rounded-lg border text-sm transition-colors",
        selected
          ? "border-aareon-bright bg-blue-50 text-aareon-bright font-medium"
          : "border-aareon-stone bg-white text-aareon-body hover:border-aareon-bright",
      ].join(" ")}
    >
      {text}
    </button>
  );
}
