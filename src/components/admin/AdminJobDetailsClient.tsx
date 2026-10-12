"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import type { Job } from "@/components/careers/types";

interface JobApplicationStats {
  total: number;
  byStatus: {
    status: string;
    label: string;
    count: number;
    dotColor: string;
  }[];
  latestApplicationAt: string | null;
}

interface JobDetailsData {
  job: Job;
  stats: JobApplicationStats;
}

type LoadState = "loading" | "ready" | "error" | "notfound";

const JOB_STATUS_STYLES: Record<string, { bg: string; text: string; dot: string }> = {
  Open: { bg: "bg-green-50", text: "text-green-700", dot: "bg-green-500" },
  Draft: { bg: "bg-gray-100", text: "text-gray-600", dot: "bg-gray-400" },
  Closed: { bg: "bg-red-50", text: "text-red-600", dot: "bg-red-400" },
  Paused: { bg: "bg-amber-50", text: "text-amber-700", dot: "bg-amber-500" },
};

function formatDate(value: string): string {
  const d = new Date(value);
  if (Number.isNaN(d.getTime())) return value;
  return d.toLocaleDateString("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

function JobStatusBadge({ status }: { status: string }) {
  const style = JOB_STATUS_STYLES[status] || {
    bg: "bg-gray-100",
    text: "text-gray-700",
    dot: "bg-gray-400",
  };
  return (
    <span
      className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium ${style.bg} ${style.text}`}
    >
      <span className={`w-1.5 h-1.5 rounded-full ${style.dot}`} aria-hidden="true" />
      {status}
    </span>
  );
}

function InfoField({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <dt className="text-xs font-medium text-gray-400 uppercase tracking-wider mb-1">
        {label}
      </dt>
      <dd className="text-sm text-gray-700 break-words">{value}</dd>
    </div>
  );
}

function DetailCard({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <section className="bg-white rounded-xl border border-gray-200 p-6">
      <h2 className="text-base font-semibold text-gray-900 mb-5">{title}</h2>
      {children}
    </section>
  );
}

function ListSection({
  title,
  items,
}: {
  title: string;
  items: string[];
}) {
  if (!items || items.length === 0) return null;
  return (
    <DetailCard title={title}>
      <ul className="space-y-2.5">
        {items.map((item, i) => (
          <li key={i} className="flex items-start gap-3 text-gray-600">
            <svg
              className="w-4 h-4 text-green-primary mt-1 flex-shrink-0"
              fill="currentColor"
              viewBox="0 0 24 24"
              aria-hidden="true"
            >
              <circle cx="12" cy="12" r="4" />
            </svg>
            <span className="text-sm leading-relaxed">{item}</span>
          </li>
        ))}
      </ul>
    </DetailCard>
  );
}

function AdminJobDetailsSkeleton() {
  return (
    <div className="p-4 sm:p-6 lg:p-8">
      <div className="max-w-5xl mx-auto animate-pulse space-y-6">
        <div className="h-3 bg-gray-200 rounded w-56" />
        <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
          <div className="space-y-2">
            <div className="h-8 bg-gray-200 rounded w-64" />
            <div className="h-4 bg-gray-200 rounded w-80" />
          </div>
          <div className="flex items-center gap-3">
            <div className="h-10 bg-gray-200 rounded-lg w-28" />
            <div className="h-10 bg-gray-200 rounded-lg w-28" />
          </div>
        </div>
        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <div className="h-5 bg-gray-200 rounded w-36 mb-5" />
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i}>
                <div className="h-3 bg-gray-200 rounded w-20 mb-2" />
                <div className="h-5 bg-gray-200 rounded w-28" />
              </div>
            ))}
          </div>
        </div>
        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <div className="h-5 bg-gray-200 rounded w-40 mb-5" />
          <div className="h-32 bg-gray-200 rounded" />
        </div>
      </div>
    </div>
  );
}

interface AdminJobDetailsClientProps {
  id: string;
}

export default function AdminJobDetailsClient({ id }: AdminJobDetailsClientProps) {
  const [state, setState] = useState<LoadState>("loading");
  const [data, setData] = useState<JobDetailsData | null>(null);
  const [reloadKey, setReloadKey] = useState(0);

  useEffect(() => {
    let cancelled = false;
    async function load() {
      setState("loading");
      try {
        const res = await fetch(
          `/api/admin/careers/jobs/${encodeURIComponent(id)}`
        );
        if (cancelled) return;
        if (!res.ok) {
          setState(res.status === 404 ? "notfound" : "error");
          return;
        }
        const json = (await res.json()) as JobDetailsData;
        if (cancelled) return;
        setData(json);
        setState("ready");
      } catch {
        if (!cancelled) setState("error");
      }
    }
    void load();
    return () => {
      cancelled = true;
    };
  }, [id, reloadKey]);

  function handleRetry() {
    setReloadKey((k) => k + 1);
  }

  if (state === "loading") {
    return <AdminJobDetailsSkeleton />;
  }

  if (state === "error") {
    return (
      <div className="p-4 sm:p-6 lg:p-8">
        <div className="max-w-5xl mx-auto">
          <div className="text-center py-16">
            <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-red-50 flex items-center justify-center">
              <svg
                className="w-8 h-8 text-red-500"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth="1.5"
                stroke="currentColor"
                aria-hidden="true"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M12 9v3.75m9-.75a9 9 0 11-18 0 9 9 0 0118 0zm-9 3.75h.008v.008H12v-.008z"
                />
              </svg>
            </div>
            <h1 className="text-xl font-semibold text-gray-900 mb-2">
              Unable to load job details
            </h1>
            <p className="text-gray-500 mb-6">Please try again.</p>
            <div className="flex items-center justify-center gap-3">
              <button
                type="button"
                onClick={handleRetry}
                className="inline-flex items-center justify-center px-5 py-2.5 text-sm font-medium text-white bg-green-primary hover:bg-green-dark rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-green-primary focus:ring-offset-2"
              >
                Retry
              </button>
              <Link
                href="/admin/careers/jobs"
                className="inline-flex items-center justify-center px-5 py-2.5 text-sm font-medium text-gray-700 bg-white border border-gray-300 hover:border-gray-400 hover:bg-gray-50 rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-green-primary focus:ring-offset-2"
              >
                Back to Jobs
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (state === "notfound" || !data) {
    return (
      <div className="p-4 sm:p-6 lg:p-8">
        <div className="max-w-5xl mx-auto">
          <div className="text-center py-16">
            <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-gray-100 flex items-center justify-center">
              <svg
                className="w-8 h-8 text-gray-400"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth="1.5"
                stroke="currentColor"
                aria-hidden="true"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z"
                />
              </svg>
            </div>
            <h1 className="text-xl font-semibold text-gray-900 mb-2">
              Job not found
            </h1>
            <p className="text-gray-500 mb-6">
              This job may have been removed or the link may be incorrect.
            </p>
            <Link
              href="/admin/careers/jobs"
              className="inline-flex items-center justify-center px-5 py-2.5 text-sm font-medium text-white bg-green-primary hover:bg-green-dark rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-green-primary focus:ring-offset-2"
            >
              Back to Jobs
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const { job, stats } = data;

  return (
    <div className="p-4 sm:p-6 lg:p-8">
      <div className="max-w-5xl mx-auto">
        {/* Breadcrumb */}
        <nav aria-label="Breadcrumb" className="mb-4">
          <ol className="flex items-center gap-1.5 text-sm text-gray-400">
            <li>
              <Link
                href="/admin/careers"
                className="hover:text-gray-600 transition-colors"
              >
                Careers
              </Link>
            </li>
            <li aria-hidden="true">/</li>
            <li>
              <Link
                href="/admin/careers/jobs"
                className="hover:text-gray-600 transition-colors"
              >
                Jobs
              </Link>
            </li>
            <li aria-hidden="true">/</li>
            <li className="text-gray-600 font-medium truncate max-w-[220px] sm:max-w-xs">
              {job.title}
            </li>
          </ol>
        </nav>

        {/* Page Header */}
        <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-4 mb-8">
          <div className="min-w-0">
            <div className="flex flex-wrap items-center gap-x-3 gap-y-2 mb-1.5">
              <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 break-words">
                {job.title}
              </h1>
              <JobStatusBadge status={job.status} />
            </div>
            <p className="text-sm text-gray-500">
              View job information, publication status, and recruitment details.
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-3 flex-shrink-0">
            <Link
              href="/admin/careers/jobs"
              className="inline-flex items-center justify-center gap-2 px-4 py-2.5 text-sm font-medium text-gray-700 bg-white border border-gray-300 hover:border-gray-400 hover:bg-gray-50 rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-green-primary focus:ring-offset-2"
            >
              <svg
                className="w-4 h-4"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth="2"
                stroke="currentColor"
                aria-hidden="true"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18"
                />
              </svg>
              Back to Jobs
            </Link>
            <Link
              href={`/admin/careers/jobs/${job.id}/edit`}
              className="inline-flex items-center justify-center gap-2 px-4 py-2.5 text-sm font-medium text-white bg-green-primary hover:bg-green-dark rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-green-primary focus:ring-offset-2"
            >
              <svg
                className="w-4 h-4"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth="1.5"
                stroke="currentColor"
                aria-hidden="true"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0115.75 21H5.25A2.25 2.25 0 013 18.75V8.25A2.25 2.25 0 015.25 6H10"
                />
              </svg>
              Edit Job
            </Link>
          </div>
        </div>

        <div className="space-y-6">
          {/* Job Information */}
          <DetailCard title="Job Information">
            <dl className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-6 gap-y-5">
              <InfoField label="Department" value={job.department} />
              <InfoField
                label="Team"
                value={job.team && job.team.trim() ? job.team : "Not specified"}
              />
              <InfoField label="Location" value={job.location} />
              <InfoField label="Employment Type" value={job.employmentType} />
              <InfoField label="Work Mode" value={job.workMode} />
              <InfoField label="Experience" value={job.experience} />
              <InfoField label="Job ID" value={job.id} />
              <InfoField label="Posted" value={formatDate(job.postedAt)} />
            </dl>
          </DetailCard>

          {/* Job Description */}
          <DetailCard title="Job Description">
            <p className="text-sm leading-relaxed text-gray-600 whitespace-pre-line">
              {job.description.trim() || "No description provided."}
            </p>
          </DetailCard>

          <ListSection title="Responsibilities" items={job.responsibilities || []} />
          <ListSection title="Qualifications" items={job.qualifications || []} />
          <ListSection
            title="Preferred Qualifications"
            items={job.preferredQualifications || []}
          />

          {/* Skills */}
          {job.skills && job.skills.length > 0 && (
            <DetailCard title="Skills">
              <div className="flex flex-wrap gap-2">
                {job.skills.map((skill) => (
                  <span
                    key={skill}
                    className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-gray-100 text-gray-700"
                  >
                    {skill}
                  </span>
                ))}
              </div>
            </DetailCard>
          )}

          {/* Benefits */}
          {job.benefits && job.benefits.length > 0 && (
            <ListSection title="Benefits" items={job.benefits} />
          )}

          {/* Applications */}
          <DetailCard title="Applications">
            {stats.total === 0 ? (
              <>
                <p className="text-sm text-gray-500">
                  No applications yet for this job.
                </p>
              </>
            ) : (
              <>
                <p className="text-sm text-gray-500 mb-4">
                  Total applications:{" "}
                  <span className="font-semibold text-gray-900">
                    {stats.total}
                  </span>
                </p>
                <ul className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-6 gap-y-2">
                  {stats.byStatus.map((s) => (
                    <li key={s.status} className="flex items-center justify-between gap-3 text-sm">
                      <span className="flex items-center gap-2 text-gray-600">
                        <span
                          className={`w-2 h-2 rounded-full ${s.dotColor}`}
                          aria-hidden="true"
                        />
                        {s.label}
                      </span>
                      <span className="font-medium text-gray-900">{s.count}</span>
                    </li>
                  ))}
                </ul>
                {stats.latestApplicationAt && (
                  <p className="mt-4 text-xs text-gray-400">
                    Latest application:{" "}
                    {formatDate(stats.latestApplicationAt)}
                  </p>
                )}
              </>
            )}
          </DetailCard>
        </div>
      </div>
    </div>
  );
}