"use client";

import { motion } from "framer-motion";

interface OptionCardProps {
  title: string;
  description: string;
  onClick: () => void;
  selected?: boolean;
}

export function OptionCard({ title, description, onClick, selected }: OptionCardProps) {
  return (
    <motion.button
      whileHover={{ x: 4, y: -4 }}
      whileTap={{ scale: 0.98 }}
      onClick={onClick}
      className={`group relative w-full border-2 p-6 text-left transition-all duration-200 ${
        selected
          ? "border-aareon-bright bg-aareon-bright text-white shadow-[8px_8px_0px_0px_rgba(0,10,40,0.1)]"
          : "border-aareon-headline bg-white hover:border-aareon-bright hover:shadow-[4px_4px_0px_0px_rgba(0,120,255,1)]"
      }`}
    >
      {/* Decorative corner element for unselected state */}
      {!selected && (
        <div className="absolute right-0 top-0 h-4 w-4 border-b-2 border-l-2 border-aareon-headline transition-colors group-hover:border-aareon-bright" />
      )}

      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h3 className={`font-title text-xl italic tracking-tight ${selected ? "text-white" : "text-aareon-headline"}`}>
            {title}
          </h3>
          {selected && (
            <span className="text-xs font-black uppercase tracking-widest text-white/80">Selected</span>
          )}
        </div>
        <p className={`text-sm leading-relaxed font-medium ${selected ? "text-white/90" : "text-aareon-body/70"}`}>
          {description}
        </p>
      </div>

      {/* Monospace metadata-like footer */}
      <div className={`mt-4 border-t pt-3 font-mono text-[10px] uppercase tracking-[0.2em] ${
        selected ? "border-white/20 text-white/60" : "border-aareon-stone text-aareon-body/40"
      }`}>
        Option ID: {title.toLowerCase().replace(/\s+/g, "_")} // Select to proceed
      </div>
    </motion.button>
  );
}
