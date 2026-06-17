// app/job-posting-history/page.tsx

"use client";

import { useEffect, useState } from "react";
import { getJobPostingsForManager, getSignedPdfUrl } from "@/lib/supabase/jobPostings";
import { getManagerId, isAuthenticated } from "@/app/actions/auth";
import { JobPostingWithStatus } from "@/lib/supabase/types";
import LoadingSpinner from "@/components/globals/LoadingSpinner";
import { format } from "date-fns";
import { nl } from "date-fns/locale";

export default function JobPostingHistory() {
  const [postings, setPostings] = useState<JobPostingWithStatus[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchPostings() {
      try {
        setLoading(true);
        setError(null);

        // Check if user is authenticated
        const authCheck = await isAuthenticated();
        if (!authCheck) {
          setError("Je moet ingelogd zijn om je vacatures te bekijken.");
          setLoading(false);
          return;
        }

        // Get the manager ID (profile_id)
        const managerId = await getManagerId();
        if (!managerId) {
          setError("Geen manager profiel gevonden. Neem contact op met support.");
          setLoading(false);
          return;
        }

        // Fetch job postings for this manager
        const data = await getJobPostingsForManager(managerId);
        
        // If you need signed URLs for PDFs, process them here
        const postingsWithSignedUrls = await Promise.all(
          data.map(async (posting) => {
            if (posting.job_posting_pdf_path) {
              try {
                const signedUrl = await getSignedPdfUrl(posting.job_posting_pdf_path);
                return { ...posting, job_posting_pdf_path: signedUrl || posting.job_posting_pdf_path };
              } catch {
                return posting;
              }
            }
            return posting;
          })
        );
        
        setPostings(postingsWithSignedUrls);
      } catch (err) {
        console.error("Error fetching job postings:", err);
        setError("Er is een fout opgetreden bij het laden van de vacatures. Probeer het later opnieuw.");
      } finally {
        setLoading(false);
      }
    }

    fetchPostings();
  }, []);

  // Format date to Dutch format
  const formatDate = (dateString: string) => {
    try {
      const date = new Date(dateString);
      return format(date, "dd MMM yyyy", { locale: nl });
    } catch {
      return dateString;
    }
  };

  // Get status badge color
  const getStatusBadge = (status: string | null) => {
    if (!status) return null;
    
    const statusConfig: Record<string, { color: string; label: string }> = {
      pending: { color: 'bg-yellow-100 text-yellow-800', label: 'In afwachting' },
      approved: { color: 'bg-green-100 text-green-800', label: 'Goedgekeurd' },
      rejected: { color: 'bg-red-100 text-red-800', label: 'Afgewezen' },
    };

    const config = statusConfig[status] || statusConfig.pending;
    return (
      <span className={`inline-block rounded-full px-3 py-1 text-xs font-semibold ${config.color}`}>
        {config.label}
      </span>
    );
  };

  if (loading) {
    return (
      <main className="min-h-screen bg-[var(--color-sand)] px-6 py-8">
        <div className="mx-auto max-w-7xl">
          <LoadingSpinner />
        </div>
      </main>
    );
  }

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
            Vorige Vacatures
          </h1>

          <p className="mt-4 max-w-2xl text-base leading-relaxed text-[var(--color-sand)]">
            Bekijk alle eerder ingediende vacatures en de bijbehorende documenten.
          </p>
        </section>

        {error ? (
          <div className="rounded-xl border border-red-200 bg-red-50 p-6 text-center">
            <p className="text-red-700">{error}</p>
            <button
              onClick={() => window.location.reload()}
              className="mt-3 rounded-xl bg-[var(--color-blue)] px-5 py-2 text-white transition hover:bg-[var(--color-blue-dark)]"
            >
              Opnieuw proberen
            </button>
          </div>
        ) : postings.length === 0 ? (
          <div className="rounded-[28px] border border-[var(--color-stone)] bg-white p-12 text-center">
            <p className="text-lg text-[var(--color-body)]">
              Geen vacatures gevonden.
            </p>
            <p className="mt-2 text-sm text-[var(--color-body)]">
              Je hebt nog geen vacatures aangemaakt. Ga naar <strong>Nieuwe vacature aanmaken</strong> om te beginnen.
            </p>
          </div>
        ) : (
          <section className="overflow-hidden rounded-[28px] border border-[var(--color-stone)] bg-white shadow-sm">

            <div className="grid grid-cols-4 gap-4 bg-[var(--color-stone)] px-6 py-4 text-sm font-semibold text-[var(--color-headline)]">
              <span>Vacature Titel</span>
              <span>Datum Aangemaakt</span>
              <span>Status</span>
              <span className="text-right">Document</span>
            </div>

            {postings.map((posting) => (
              <div
                key={posting.job_posting_id}
                className="grid grid-cols-4 items-center gap-4 border-b border-[var(--color-stone)] px-6 py-5 last:border-b-0 hover:bg-[var(--color-sand)]"
              >
                <div>
                  <p className="font-semibold text-[var(--color-headline)]">
                    {posting.title}
                  </p>
                </div>

                <div>
                  <p className="text-[var(--color-body)]">
                    {formatDate(posting.created_at)}
                  </p>
                </div>

                <div>
                  {getStatusBadge(posting.approval_status)}
                </div>

                <div className="flex items-center justify-end gap-3">
                  {posting.job_posting_pdf_path && (
                    <a
                      href={posting.job_posting_pdf_path}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center rounded-full bg-[var(--color-bright)] px-5 py-2 text-sm font-semibold text-white transition hover:bg-[var(--color-blue)]"
                    >
                      Open PDF
                    </a>
                  )}
                </div>
              </div>
            ))}
          </section>
        )}
      </div>
    </main>
  );
}