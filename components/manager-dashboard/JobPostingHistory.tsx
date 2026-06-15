"use client";

import { jobPostings } from "@/app/data/jobPostings";

export default function JobPostingHistory() {
  return (
    <main className="min-h-screen bg-[var(--color-sand)] px-6 py-8">
      <div className="mx-auto max-w-7xl">

        <section className="mb-8 rounded-[32px] bg-[var(--color-blue)] px-8 py-10 text-white">
          <p className="mb-3 text-sm font-semibold uppercase tracking-[0.25em] text-[#A4CBFF]">
            Manager Dashboard
          </p>

          <h1
            className="text-4xl font-normal leading-tight md:text-6xl"
            style={{ fontFamily: "Georgia, serif" }}
          >
            Previous Job Postings
          </h1>

          <p className="mt-4 max-w-2xl text-base leading-relaxed text-[var(--color-sand)]">
            View all previously submitted job postings and access the PDF
            documents.
          </p>
        </section>

        <section className="overflow-hidden rounded-[28px] border border-[var(--color-stone)] bg-white shadow-sm">

          <div className="grid grid-cols-3 bg-[var(--color-stone)] px-6 py-4 text-sm font-semibold text-[var(--color-headline)]">
            <span>Job Posting Title</span>
            <span>Date Created</span>
            <span className="text-right">Document</span>
          </div>

          {jobPostings.map((posting) => (
            <div
              key={posting.id}
              className="grid grid-cols-3 items-center border-b border-[var(--color-stone)] px-6 py-5 last:border-b-0 hover:bg-[var(--color-sand)]"
            >
              <div>
                <p className="font-semibold text-[var(--color-headline)]">
                  {posting.title}
                </p>
              </div>

              <div>
                <p className="text-[var(--color-body)]">
                  {posting.date}
                </p>
              </div>

              <div className="text-right">
                <a
                  href={posting.pdfUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center rounded-full bg-[var(--color-bright)] px-5 py-2 text-sm font-semibold text-white transition hover:bg-[var(--color-blue)]"
                >
                  Open PDF
                </a>
              </div>
            </div>
          ))}
        </section>
      </div>
    </main>
  );
}