"use client";

import { useState, useEffect, useRef, type ReactNode } from "react";
import Link from "next/link";

interface CandidateDetailData {
  id: string;
  candidateEmail: string;
  candidateFirstName: string;
  candidateLastName: string;
  phone?: string;
  currentLocation?: string;
  country?: string;
  currentJobTitle?: string;
  currentCompany?: string;
  experienceLevel?: string;
  yearsOfExperience?: string;
  education?: Array<{
    qualification?: string;
    institution?: string;
    fieldOfStudy?: string;
    graduationYear?: string;
  }>;
  resumeFileName?: string;
  resumeFileSize?: string;
  firstAppliedAt: string;
  latestAppliedAt: string;
  applicationCount: number;
  activeApplicationCount: number;
}

interface CandidateDetailApplication {
  id: string;
  jobId: string;
  jobTitle: string;
  department: string;
  location: string;
  status: string;
  appliedAt: string;
  updatedAt?: string;
}

interface CandidateDetailSummary {
  total: number;
  latestAppliedAt: string;
  active: number;
}

interface CandidateDetailsData {
  candidate: CandidateDetailData;
  applications: CandidateDetailApplication[];
  summary: CandidateDetailSummary;
}

const STATUS_STYLES: Record<string, { bg: string; text: string; dot: string }> = {
  applied: { bg: "bg-gray-100", text: "text-gray-700", dot: "bg-gray-400" },
  under_review: { bg: "bg-blue-50", text: "text-blue-700", dot: "bg-blue-500" },
  interview: { bg: "bg-green-50", text: "text-green-700", dot: "bg-green-500" },
  selected: { bg: "bg-green-50", text: "text-green-700", dot: "bg-green-600" },
  rejected: { bg: "bg-red-50", text: "text-red-600", dot: "bg-red-400" },
  withdrawn: { bg: "bg-gray-50", text: "text-gray-500", dot: "bg-gray-300" },
};

const STATUS_ORDER = [
  "applied",
  "under_review",
  "interview",
  "selected",
  "rejected",
  "withdrawn",
];

function formatDate(iso: string): string {
  const d = new Date(iso);
  return d.toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" });
}

function statusLabel(status: string): string {
  return status.replace(/_/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());
}

function ApplicationStatusBadge({ status }: { status: string }) {
  const style = STATUS_STYLES[status] || STATUS_STYLES.applied;
  return (
    <span
      className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium ${style.bg} ${style.text}`}
    >
      <span className={`w-1.5 h-1.5 rounded-full ${style.dot}`} aria-hidden="true" />
      {statusLabel(status)}
    </span>
  );
}

function InfoField({ label, value, mono = false }: { label: string; value: string; mono?: boolean }) {
  return (
    <div>
      <dt className="text-xs font-medium text-gray-400 uppercase tracking-wider">{label}</dt>
      <dd className={`mt-1 text-sm text-gray-700 ${mono ? "font-mono break-all" : "break-words"}`}>{value}</dd>
    </div>
  );
}

function DetailCard({
  title,
  subtitle,
  children,
}: {
  title: string;
  subtitle?: string;
  children: ReactNode;
}) {
  return (
    <section className="bg-white rounded-xl border border-gray-200 p-6">
      <h2 className="text-base font-semibold text-gray-900">{title}</h2>
      {subtitle && <p className="text-sm text-gray-500 mt-0.5">{subtitle}</p>}
      {children}
    </section>
  );
}

function SkeletonBlock() {
  return (
    <div className="p-4 sm:p-6 lg:p-8">
      <div className="max-w-5xl mx-auto animate-pulse space-y-6">
        <div className="h-3 bg-gray-200 rounded w-56" />
        <div className="h-8 bg-gray-200 rounded w-64" />
        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-full bg-gray-200" />
            <div className="space-y-2 flex-1">
              <div className="h-5 bg-gray-200 rounded w-48" />
              <div className="h-3 bg-gray-200 rounded w-64" />
            </div>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-6">
            {Array.from({ length: 3 }).map((_, i) => (
              <div key={i} className="h-8 bg-gray-200 rounded" />
            ))}
          </div>
        </div>
        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <div className="h-5 bg-gray-200 rounded w-40 mb-5" />
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
          <div className="h-5 bg-gray-200 rounded w-44 mb-5" />
          <div className="h-28 bg-gray-200 rounded" />
        </div>
      </div>
    </div>
  );
}

export default function AdminCandidateDetailsClient({
  id,
  initialData,
}: {
  id: string;
  initialData: CandidateDetailsData | null;
}) {
  const [state, setState] = useState<"loading" | "ready" | "error" | "notfound">(
    initialData ? "ready" : "notfound"
  );
  const [data, setData] = useState<CandidateDetailsData | null>(initialData);
  const [statusFilter, setStatusFilter] = useState("");
  const [reloadKey, setReloadKey] = useState(0);
  const didInit = useRef(false);

  useEffect(() => {
    if (!didInit.current) {
      didInit.current = true;
      if (!statusFilter) return;
    }
    let cancelled = false;
    async function load() {
      setState("loading");
      try {
        const params = new URLSearchParams();
        if (statusFilter) params.set("status", statusFilter);
        const query = params.toString() ? `?${params.toString()}` : "";
        const res = await fetch(
          `/api/admin/careers/candidates/${encodeURIComponent(id)}${query}`
        );
        if (cancelled) return;
        if (!res.ok) {
          setState(res.status === 404 ? "notfound" : "error");
          return;
        }
        const json = (await res.json()) as CandidateDetailsData;
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
  }, [id, statusFilter, reloadKey]);

  function handleRetry() {
    setReloadKey((k) => k + 1);
  }

  if (state === "loading" && !data) {
    return <SkeletonBlock />;
  }

  if (state === "error") {
    return (
      <div className="p-4 sm:p-6 lg:p-8">
        <div className="max-w-5xl mx-auto">
          <div className="text-center py-16">
            <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-red-50 flex items-center justify-center">
              <svg className="w-8 h-8 text-red-500" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" aria-hidden="true">
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m9-.75a9 9 0 11-18 0 9 9 0 0118 0zm-9 3.75h.008v.008H12v-.008z" />
              </svg>
            </div>
            <h1 className="text-xl font-semibold text-gray-900 mb-2">Unable to load candidate.</h1>
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
                href="/admin/careers/candidates"
                className="inline-flex items-center justify-center px-5 py-2.5 text-sm font-medium text-gray-700 bg-white border border-gray-300 hover:border-gray-400 hover:bg-gray-50 rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-green-primary focus:ring-offset-2"
              >
                Back to Candidates
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
              <svg className="w-8 h-8 text-gray-400" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" aria-hidden="true">
                <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" />
              </svg>
            </div>
            <h1 className="text-xl font-semibold text-gray-900 mb-2">Candidate not found.</h1>
            <p className="text-gray-500 mb-6">
              This candidate may have been removed or the link may be incorrect.
            </p>
            <Link
              href="/admin/careers/candidates"
              className="inline-flex items-center justify-center px-5 py-2.5 text-sm font-medium text-white bg-green-primary hover:bg-green-dark rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-green-primary focus:ring-offset-2"
            >
              Back to Candidates
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const { candidate: candidate, applications } = data;
  const displayName = `${candidate.candidateFirstName} ${candidate.candidateLastName}`.trim();
  const headingName = displayName || candidate.candidateEmail || "Candidate";
  const initials =
    `${candidate.candidateFirstName.charAt(0) ?? ""}${
      candidate.candidateLastName.charAt(0) ?? ""
    }`.toUpperCase() || "?";
  const location = [candidate.currentLocation, candidate.country]
    .filter(Boolean)
    .join(", ");
  const currentRole = [candidate.currentJobTitle, candidate.currentCompany]
    .filter(Boolean)
    .join(" at ");
  const experience = [
    candidate.experienceLevel,
    candidate.yearsOfExperience ? `${candidate.yearsOfExperience} years` : "",
  ]
    .filter(Boolean)
    .join(" · ");
  const resume = [candidate.resumeFileName, candidate.resumeFileSize]
    .filter(Boolean)
    .join(" · ");

  return (
    <div className="p-4 sm:p-6 lg:p-8">
      <div className="max-w-5xl mx-auto">
        {/* Breadcrumb */}
        <nav aria-label="Breadcrumb" className="mb-4">
          <ol className="flex items-center gap-1.5 text-sm text-gray-400">
            <li>
              <Link href="/admin/careers" className="hover:text-gray-600 transition-colors">
                Careers
              </Link>
            </li>
            <li aria-hidden="true">/</li>
            <li>
              <Link
                href="/admin/careers/candidates"
                className="hover:text-gray-600 transition-colors"
              >
                Candidates
              </Link>
            </li>
            <li aria-hidden="true">/</li>
            <li className="text-gray-600 font-medium truncate max-w-[200px] sm:max-w-xs">
              {headingName}
            </li>
          </ol>
        </nav>

        {/* Page Header */}
        <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4 mb-8">
          <div className="min-w-0">
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 break-words">
              Candidate Details
            </h1>
            <p className="text-sm text-gray-500 mt-1">
              Review this candidate&apos;s profile and application history.
            </p>
          </div>
          <Link
            href="/admin/careers/candidates"
            className="inline-flex items-center justify-center gap-2 px-4 py-2.5 text-sm font-medium text-gray-700 bg-white border border-gray-300 hover:border-gray-400 hover:bg-gray-50 rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-green-primary focus:ring-offset-2 flex-shrink-0"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor" aria-hidden="true">
              <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18" />
            </svg>
            Back to Candidates
          </Link>
        </div>

        <div className="space-y-6">
          {/* Candidate Profile Header */}
          <section className="bg-white rounded-xl border border-gray-200 p-6">
            <div className="flex items-center gap-4 min-w-0">
              <div className="flex items-center justify-center w-12 h-12 rounded-full bg-green-50 text-green-primary font-semibold text-lg flex-shrink-0">
                {initials}
              </div>
              <div className="min-w-0">
                <p className="text-xs font-medium text-gray-400 uppercase tracking-wider">
                  Candidate Profile
                </p>
                <h2 className="text-lg font-semibold text-gray-900 break-words">
                  {headingName}
                </h2>
                <p className="text-sm text-gray-500 mt-0.5 truncate">
                  {candidate.candidateEmail}
                </p>
                {candidate.phone && (
                  <p className="text-sm text-gray-500 mt-0.5">{candidate.phone}</p>
                )}
              </div>
            </div>
            <dl className="mt-6 grid grid-cols-1 sm:grid-cols-3 gap-x-6 gap-y-4">
              <InfoField label="Candidate ID" value={candidate.id} mono />
              <InfoField label="First Applied" value={formatDate(candidate.firstAppliedAt)} />
              <InfoField label="Latest Application" value={formatDate(candidate.latestAppliedAt)} />
            </dl>
          </section>

          {/* Summary Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="bg-white rounded-xl border border-gray-200 p-5">
              <p className="text-sm font-medium text-gray-500">Total Applications</p>
              <p className="text-2xl font-bold text-gray-900 mt-1">{data.summary.total}</p>
              <p className="text-xs text-gray-400 mt-1">All time</p>
            </div>
            <div className="bg-white rounded-xl border border-gray-200 p-5">
              <p className="text-sm font-medium text-gray-500">Latest Application</p>
              <p className="text-2xl font-bold text-gray-900 mt-1">
                {formatDate(data.summary.latestAppliedAt)}
              </p>
              <p className="text-xs text-gray-400 mt-1">Date of most recent application</p>
            </div>
            <div className="bg-white rounded-xl border border-gray-200 p-5">
              <p className="text-sm font-medium text-gray-500">Active Applications</p>
              <p className="text-2xl font-bold text-gray-900 mt-1">{data.summary.active}</p>
              <p className="text-xs text-gray-400 mt-1">Applied, under review, or interview</p>
            </div>
          </div>

          {/* Candidate Information */}
          <DetailCard title="Candidate Information">
            <dl className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-6 gap-y-4">
              <InfoField label="Full Name" value={headingName} />
              <InfoField label="Email" value={candidate.candidateEmail} />
              {candidate.phone && <InfoField label="Phone" value={candidate.phone} />}
              {location && <InfoField label="Location" value={location} />}
              {currentRole && <InfoField label="Current Role" value={currentRole} />}
              {experience && <InfoField label="Experience" value={experience} />}
              {resume && <InfoField label="Resume" value={resume} />}
              <InfoField label="First Applied" value={formatDate(candidate.firstAppliedAt)} />
            </dl>
            {candidate.education && candidate.education.length > 0 && (
              <div className="mt-6">
                <p className="text-xs font-medium text-gray-400 uppercase tracking-wider mb-2">
                  Education
                </p>
                <ul className="space-y-2">
                  {candidate.education.map((edu, index) => {
                    const title = [edu.qualification, edu.institution]
                      .filter(Boolean)
                      .join(" — ");
                    const meta = [edu.fieldOfStudy, edu.graduationYear]
                      .filter(Boolean)
                      .join(" · ");
                    if (!title && !meta) return null;
                    return (
                      <li key={index} className="text-sm text-gray-700">
                        {title || "—"}
                        {meta && <span className="text-gray-400"> · {meta}</span>}
                      </li>
                    );
                  })}
                </ul>
              </div>
            )}
          </DetailCard>

          {/* Application History */}
          <DetailCard
            title="Application History"
            subtitle={
              applications.length === 0
                ? undefined
                : `${applications.length} application${applications.length !== 1 ? "s" : ""}`
            }
          >
            <div className="mb-4">
              <label
                htmlFor="application-status-filter"
                className="block text-xs font-medium text-gray-400 uppercase tracking-wider mb-1"
              >
                Filter by status
              </label>
              <select
                id="application-status-filter"
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="text-sm border border-gray-300 rounded-lg px-3 py-2 text-gray-700 focus:outline-none focus:ring-2 focus:ring-green-primary focus:border-transparent bg-white"
              >
                <option value="">All Statuses</option>
                {STATUS_ORDER.map((s) => (
                  <option key={s} value={s}>{statusLabel(s)}</option>
                ))}
              </select>
            </div>

            {data.summary.total === 0 ? (
              <div className="text-center py-12">
                <p className="text-base font-semibold text-gray-900 mb-1">
                  This candidate has no applications yet.
                </p>
                <p className="text-sm text-gray-500">
                  Applications submitted through the Careers website will appear here.
                </p>
              </div>
            ) : data.applications.length === 0 ? (
              <div className="text-center py-12">
                <p className="text-base font-semibold text-gray-900 mb-1">
                  No applications match the selected status.
                </p>
                <button
                  type="button"
                  onClick={() => setStatusFilter("")}
                  className="mt-4 inline-flex items-center justify-center px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 hover:border-gray-400 hover:bg-gray-50 rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-green-primary focus:ring-offset-2"
                >
                  Clear Filter
                </button>
              </div>
            ) : data.applications.length > 0 ? (
              <>
                {/* Desktop table */}
                <div className="hidden md:block overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b border-gray-100">
                        <th scope="col" className="text-left px-4 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">Job</th>
                        <th scope="col" className="text-left px-4 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">Department</th>
                        <th scope="col" className="text-left px-4 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">Application Date</th>
                        <th scope="col" className="text-left px-4 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                        <th scope="col" className="text-left px-4 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider hidden lg:table-cell">Last Updated</th>
                        <th scope="col" className="text-right px-4 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">Action</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-50">
                      {applications.map((app) => (
                        <tr key={app.id} className="hover:bg-gray-50/50 transition-colors">
                          <td className="px-4 py-3.5">
                            <Link
                              href={`/admin/careers/jobs/${app.jobId}`}
                              className="text-sm font-medium text-green-primary hover:text-green-dark transition-colors"
                            >
                              {app.jobTitle}
                            </Link>
                            <p className="text-xs text-gray-400 mt-0.5">{app.location}</p>
                          </td>
                          <td className="px-4 py-3.5">
                            <span className="text-sm text-gray-700">{app.department}</span>
                          </td>
                          <td className="px-4 py-3.5">
                            <span className="text-sm text-gray-500">{formatDate(app.appliedAt)}</span>
                          </td>
                          <td className="px-4 py-3.5">
                            <ApplicationStatusBadge status={app.status} />
                          </td>
                          <td className="px-4 py-3.5 hidden lg:table-cell">
                            <span className="text-sm text-gray-500">
                              {app.updatedAt ? formatDate(app.updatedAt) : "—"}
                            </span>
                          </td>
                          <td className="px-4 py-3.5 text-right whitespace-nowrap">
                            <Link
                              href={`/admin/careers/applications/${app.id}`}
                              className="text-sm font-medium text-green-primary hover:text-green-dark transition-colors"
                            >
                              View Application
                            </Link>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                {/* Mobile cards */}
                <div className="md:hidden divide-y divide-gray-100">
                  {applications.map((app) => (
                    <div key={app.id} className="py-4">
                      <div className="flex items-start justify-between gap-3 mb-1">
                        <div className="min-w-0">
                          <Link
                            href={`/admin/careers/jobs/${app.jobId}`}
                            className="text-sm font-medium text-green-primary hover:text-green-dark transition-colors"
                          >
                            {app.jobTitle}
                          </Link>
                          <p className="text-xs text-gray-400 mt-0.5">{app.department} · {app.location}</p>
                        </div>
                        <ApplicationStatusBadge status={app.status} />
                      </div>
                      <div className="flex items-center justify-between mt-2">
                        <span className="text-xs text-gray-400">
                          Applied {formatDate(app.appliedAt)}
                          {app.updatedAt ? ` · Updated ${formatDate(app.updatedAt)}` : ""}
                        </span>
                        <Link
                          href={`/admin/careers/applications/${app.id}`}
                          className="text-sm font-medium text-green-primary hover:text-green-dark transition-colors"
                        >
                          View Application
                        </Link>
                      </div>
                    </div>
                  ))}
                </div>
              </>
            ) : null}
          </DetailCard>
        </div>
      </div>
    </div>
  );
}