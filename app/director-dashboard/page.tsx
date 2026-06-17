"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";

type ApprovalRequest = {
  request_id: string;
  status: string;
  comment: string | null;
  created_at: string;
  reviewed_at: string | null;
  approval_pdf_path: string | null;
  manager: {
    email: string;
    profile_id: string;
  }[] | null;
  job_postings: {
    title: string;
  }[];
};

function getStatusStyle(status: string) {
  if (status === "approved") return "bg-[#B9E99C] text-[#081326]";
  if (status === "pending") return "bg-[#FFD8CA] text-[#081326]";
  return "bg-[#EBE3DC] text-[#384152]";
}

function formatStatus(status: string) {
  if (status === "approved") return "Reviewed";
  if (status === "pending") return "Pending";
  return "To do";
}

function formatDate(dateStr: string) {
  return new Date(dateStr).toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

export default function DirectorDashboard() {
  const router = useRouter();
  const [requests, setRequests] = useState<ApprovalRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchRequests() {
      setLoading(true);
      setError(null);

      const { data, error } = await supabase
        .from("approval_requests")
        .select(`
          request_id,
          status,
          comment,
          created_at,
          reviewed_at,
          approval_pdf_path,
          manager:profiles!manager_id(email, profile_id),
          job_postings(title)
        `)
        .order("created_at", { ascending: false });

      if (error) {
        setError(error.message);
      } else {
        setRequests(data as ApprovalRequest[]);
      }

      setLoading(false);
    }

    fetchRequests();
  }, []);

  const total = requests.length;
  const todo = requests.filter((r) => r.status === "rejected").length;
  const pending = requests.filter((r) => r.status === "pending").length;
  const reviewed = requests.filter((r) => r.status === "approved").length;

  return (
    <div className="min-h-screen bg-[var(--color-sand)] text-[var(--color-body)]">
      <div className="mx-auto max-w-7xl px-6 py-8">
        <header className="mb-8 rounded-[32px] bg-[var(--color-blue)] px-8 py-10 text-white">
          <p className="mb-2 text-sm font-semibold uppercase tracking-[0.25em] text-white/70">
            Aareon dashboard
          </p>
          <h1 className="font-serif text-4xl text-white md:text-5xl">
            Document approvals
          </h1>
          <p className="mt-3 max-w-2xl text-base leading-7 text-white/75">
            Overview of managers, submitted documents and current approval status.
          </p>
        </header>

        <section className="mb-8 grid gap-4 md:grid-cols-4">
          <StatCard title="Total documents" value={total} />
          <StatCard title="To do" value={todo} />
          <StatCard title="Pending" value={pending} />
          <StatCard title="Reviewed" value={reviewed} />
        </section>

        <section className="overflow-hidden rounded-[28px] bg-white shadow-sm">
          <div className="border-b border-[var(--color-stone)] px-6 py-5">
            <h2 className="text-xl font-semibold text-[var(--color-headline)]">
              Submitted documents
            </h2>
            <p className="mt-1 text-sm">
              Track approval progress from manager submissions.
            </p>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full min-w-[850px] border-collapse">
              <thead>
                <tr className="bg-[var(--color-sand)] text-left text-xs uppercase tracking-[0.15em]">
                  <th className="px-6 py-4 font-semibold">Manager</th>
                  <th className="px-6 py-4 font-semibold">Document</th>
                  <th className="px-6 py-4 font-semibold">Submitted</th>
                  <th className="px-6 py-4 font-semibold">Status</th>
                  <th className="px-6 py-4 font-semibold">Approval</th>
                </tr>
              </thead>

              <tbody>
                {loading ? (
                  <tr>
                    <td colSpan={5} className="px-6 py-12 text-center text-sm text-gray-400">
                      Loading…
                    </td>
                  </tr>
                ) : error ? (
                  <tr>
                    <td colSpan={5} className="px-6 py-12 text-center text-sm text-red-400">
                      {error}
                    </td>
                  </tr>
                ) : requests.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="px-6 py-12 text-center text-sm text-gray-400">
                      No submissions yet.
                    </td>
                  </tr>
                ) : (
                  requests.map((req) => (
                    <tr
                      key={req.request_id}
                      className="border-t border-[var(--color-stone)] transition hover:bg-[var(--color-sand)]/60"
                    >
                      <td className="px-6 py-5">
                        <div className="flex items-center gap-3">
                          <div className="flex h-11 w-11 items-center justify-center rounded-full bg-[var(--color-blue)] text-sm font-semibold text-white">
                            {req.manager?.[0]?.email?.[0]?.toUpperCase() ?? "?"}
                          </div>
                          <div>
                            <p className="font-semibold text-[var(--color-headline)]">
                            {req.manager?.[0]?.email ?? "Unknown"}
                            </p>
                          </div>
                        </div>
                      </td>

                      <td className="px-6 py-5 font-medium text-[var(--color-headline)]">
                        {req.job_postings?.[0]?.title ?? "—"}
                      </td>

                      <td className="px-6 py-5">
                        {formatDate(req.created_at)}
                      </td>

                      <td className="px-6 py-5">
                        <span className={`rounded-full px-4 py-2 text-xs font-semibold ${getStatusStyle(req.status)}`}>
                          {formatStatus(req.status)}
                        </span>
                      </td>

                      <td className="px-6 py-5">
                        {req.status === "pending" ? (
                          <button
                            onClick={() =>
                              router.push(`/review-request?id=${req.request_id}`)
                            }
                            className="rounded-full border border-[var(--color-blue)] px-4 py-2 text-sm font-semibold text-[var(--color-blue)] transition hover:bg-[var(--color-blue)] hover:text-white"
                          >
                            Review
                          </button>
                        ) : (
                          <span className="rounded-full border border-[var(--color-blue)] px-4 py-2 text-sm font-semibold text-[var(--color-blue)]">
                            {req.status === "approved" ? "Approved" : "Rejected"}
                          </span>
                        )}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </section>
      </div>
    </div>
  );
}

function StatCard({ title, value }: { title: string; value: number }) {
  return (
    <div className="rounded-[24px] bg-white p-6 shadow-sm">
      <p className="text-sm font-medium">{title}</p>
      <p className="mt-3 text-4xl font-semibold text-[var(--color-blue)]">
        {value}
      </p>
    </div>
  );
}