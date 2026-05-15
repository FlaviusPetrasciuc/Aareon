"use client";

interface JDPreviewPanelProps {
  jdContent: string;
  hiringKit: string;
  answeredCount: number;
  totalQuestions: number;
  onExportMarkdown: () => void;
  onExportPlainText: () => void;
}

export default function JDPreviewPanel({
  jdContent,
  hiringKit,
  answeredCount,
  totalQuestions,
  onExportMarkdown,
  onExportPlainText,
}: JDPreviewPanelProps) {
  const hasJD = jdContent.length > 0;

  return (
    <div className="flex flex-col h-full bg-[#fafaf9] p-5 overflow-y-auto">
      <p className="text-xs font-bold text-aareon-blue uppercase tracking-widest mb-4">
        Live JD Preview
      </p>

      {hasJD ? (
        <div className="text-sm text-aareon-body leading-relaxed whitespace-pre-wrap flex-1">
          {jdContent}
          {hiringKit && (
            <>
              <hr className="my-4 border-aareon-stone" />
              <div className="whitespace-pre-wrap">{hiringKit}</div>
            </>
          )}
        </div>
      ) : (
        <div className="flex-1">
          <p className="text-sm text-aareon-bright mb-1">
            Generating… ({answeredCount}/{totalQuestions} questions answered)
          </p>
          <div className="space-y-2 mt-4">
            {Array.from({ length: 4 }).map((_, i) => (
              <div
                key={i}
                className="h-3 rounded bg-aareon-stone animate-pulse"
                style={{ width: `${75 - i * 10}%` }}
              />
            ))}
          </div>
        </div>
      )}

      <div className="flex gap-2 mt-6 pt-4 border-t border-aareon-stone">
        <button
          type="button"
          onClick={onExportMarkdown}
          disabled={!hasJD}
          className="px-3 py-2 text-xs rounded border border-aareon-stone text-aareon-body disabled:opacity-40 disabled:cursor-not-allowed hover:border-aareon-bright transition-colors"
        >
          Export Markdown
        </button>
        <button
          type="button"
          onClick={onExportPlainText}
          disabled={!hasJD}
          className="px-3 py-2 text-xs rounded border border-aareon-stone text-aareon-body disabled:opacity-40 disabled:cursor-not-allowed hover:border-aareon-bright transition-colors"
        >
          Export Plain Text
        </button>
      </div>
    </div>
  );
}
