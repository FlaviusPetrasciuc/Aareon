"use client";

import ReactMarkdown from "react-markdown";
import { IntakeSession } from "@/types/intake";
import { exportJDAsMarkdown, exportJDAsText } from "@/lib/export";
import { motion } from "framer-motion";

interface JDPreviewPanelProps {
  session: IntakeSession | null;
}

export function JDPreviewPanel({ session }: JDPreviewPanelProps) {
  if (!session || (!session.jd && !session.hiringKit)) {
    return (
      <div className="flex h-full items-center justify-center bg-aareon-stone/10 p-12 text-center border-l-2 border-aareon-headline">
        <div className="max-w-xs space-y-6 opacity-30">
          <div className="mx-auto h-20 w-16 border-2 border-dashed border-aareon-headline flex items-center justify-center">
            <span className="font-mono text-xl">JD</span>
          </div>
          <p className="font-mono text-xs uppercase tracking-widest leading-loose">
            Waiting for intake data... <br />
            Progress: 0%
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-full flex-col bg-white border-l-2 border-aareon-headline shadow-[-10px_0px_30px_0px_rgba(0,0,0,0.05)]">
      {/* Header Bar */}
      <div className="flex items-center justify-between border-b-2 border-aareon-headline bg-aareon-headline p-6 text-white">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <div className="h-2 w-2 bg-aareon-bright animate-pulse" />
            <span className="font-mono text-[10px] uppercase tracking-[0.3em] text-white/60">
              Live Draft / v1.0
            </span>
          </div>
          <h2 className="font-title text-2xl italic tracking-tight">{session.jobTitle}</h2>
        </div>
        
        <div className="flex gap-1">
          <button
            onClick={() => exportJDAsMarkdown(session.jobTitle, session.jd || "")}
            className="border border-white/20 bg-white/10 px-3 py-1.5 font-mono text-[10px] uppercase tracking-widest hover:bg-white hover:text-aareon-headline transition-all"
          >
            .MD
          </button>
          <button
            onClick={() => exportJDAsText(session.jobTitle, session.jd || "")}
            className="border border-aareon-bright bg-aareon-bright px-3 py-1.5 font-mono text-[10px] uppercase tracking-widest hover:bg-white hover:text-aareon-bright transition-all"
          >
            .TXT
          </button>
        </div>
      </div>

      {/* Content Area */}
      <div className="flex-1 overflow-y-auto p-10 bg-[#fdfdfd] selection:bg-aareon-bright selection:text-white">
        <article className="prose prose-slate max-w-none 
          prose-headings:font-title prose-headings:italic prose-headings:tracking-tight prose-headings:text-aareon-headline
          prose-p:font-medium prose-p:text-aareon-body/80
          prose-li:font-medium prose-li:text-aareon-body/80
          prose-strong:text-aareon-headline prose-strong:font-bold
          prose-hr:border-aareon-stone prose-hr:border-t-2">
          
          {session.jd && (
            <motion.section 
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="relative mb-16"
            >
              <div className="absolute -left-10 top-0 w-1 h-full bg-aareon-bright/20" />
              <ReactMarkdown>{session.jd}</ReactMarkdown>
            </motion.section>
          )}

          {session.hiringKit && (
            <motion.section 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="mt-12 border-t-4 border-double border-aareon-headline pt-12"
            >
              <div className="mb-8 inline-block bg-aareon-coral px-4 py-1">
                <h3 className="font-mono text-[10px] uppercase tracking-[0.4em] text-white !m-0">
                  Hiring Kit / Technical Assessment
                </h3>
              </div>
              <ReactMarkdown>{session.hiringKit}</ReactMarkdown>
            </motion.section>
          )}
        </article>
      </div>

      {/* Footer Info */}
      <div className="border-t border-aareon-stone bg-aareon-sand/30 px-6 py-3 flex justify-between items-center">
        <span className="font-mono text-[9px] uppercase tracking-widest text-aareon-body/40">
          Generated via Aareon AI-Intake
        </span>
        <span className="font-mono text-[9px] uppercase tracking-widest text-aareon-body/40">
          {session.answers.length} Data points captured
        </span>
      </div>
    </div>
  );
}
