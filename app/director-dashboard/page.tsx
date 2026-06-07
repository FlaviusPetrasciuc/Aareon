"use client";

import { useRouter } from "next/navigation";

const documents = [
  {
    id: 1,
    manager: "Olena Popova",
    email: "olena.popova@aareon.nl",
    document: "Frontend Developer Job Posting",
    department: "IT",
    submitted: "06 Jun 2026",
    status: "Pending",
    approval: "Waiting for review",
  },
  {
    id: 2,
    manager: "Anna de Vries",
    email: "anna.devries@aareon.nl",
    document: "Backend Developer Job Posting",
    department: "Engineering",
    submitted: "05 Jun 2026",
    status: "Reviewed",
    approval: "Approved",
  },
  {
    id: 3,
    manager: "Mark Jansen",
    email: "mark.jansen@aareon.nl",
    document: "UX Designer Job Posting",
    department: "Design",
    submitted: "04 Jun 2026",
    status: "To do",
    approval: "Not started",
  },
];

function getStatusStyle(status: string) {
  if (status === "Reviewed") {
    return "bg-[#B9E99C] text-[#081326]";
  }

  if (status === "Pending") {
    return "bg-[#FFD8CA] text-[#081326]";
  }

  return "bg-[#EBE3DC] text-[#384152]";
}

export default function DirectorDashboard() {
  const router = useRouter();

  const total = documents.length;
  const todo = documents.filter((doc) => doc.status === "To do").length;
  const pending = documents.filter((doc) => doc.status === "Pending").length;
  const reviewed = documents.filter((doc) => doc.status === "Reviewed").length;

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
            Overview of managers, submitted documents and current approval
            status.
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
                  <th className="px-6 py-4 font-semibold">Department</th>
                  <th className="px-6 py-4 font-semibold">Submitted</th>
                  <th className="px-6 py-4 font-semibold">Status</th>
                  <th className="px-6 py-4 font-semibold">Approval</th>
                </tr>
              </thead>

              <tbody>
                {documents.map((doc) => (
                  <tr
                    key={doc.id}
                    className="border-t border-[var(--color-stone)] transition hover:bg-[var(--color-sand)]/60"
                  >
                    <td className="px-6 py-5">
                      <div className="flex items-center gap-3">
                        <div className="flex h-11 w-11 items-center justify-center rounded-full bg-[var(--color-blue)] text-sm font-semibold text-white">
                          {doc.manager
                            .split(" ")
                            .map((name) => name[0])
                            .join("")}
                        </div>

                        <div>
                          <p className="font-semibold text-[var(--color-headline)]">
                            {doc.manager}
                          </p>
                          <p className="text-sm">{doc.email}</p>
                        </div>
                      </div>
                    </td>

                    <td className="px-6 py-5 font-medium text-[var(--color-headline)]">
                      {doc.document}
                    </td>

                    <td className="px-6 py-5">{doc.department}</td>
                    <td className="px-6 py-5">{doc.submitted}</td>

                    <td className="px-6 py-5">
                      <span
                        className={`rounded-full px-4 py-2 text-xs font-semibold ${getStatusStyle(
                          doc.status
                        )}`}
                      >
                        {doc.status}
                      </span>
                    </td>

                    <td className="px-6 py-5">
                      {doc.status === "Pending" ? (
                        <button
                          onClick={() => router.push("/review-request")}
                          className="rounded-full border border-[var(--color-blue)] px-4 py-2 text-sm font-semibold text-[var(--color-blue)] transition hover:bg-[var(--color-blue)] hover:text-white"
                        >
                          Waiting for review
                        </button>
                      ) : (
                        <span className="rounded-full border border-[var(--color-blue)] px-4 py-2 text-sm font-semibold text-[var(--color-blue)]">
                          {doc.approval}
                        </span>
                      )}
                    </td>
                  </tr>
                ))}
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