"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import Link from "next/link";
import type { AdminApplication, ApplicationStatus } from "@/components/admin/admin-data";
import type { Job } from "@/components/careers/types";
import { APPLICATION_QUESTIONS } from "@/components/careers/mock-applications";

interface ApplicationReviewData {
  application: AdminApplication;
  job: Job | null;
}

type LoadState = "loading" | "ready" | "error" | "notfound";

const STATUS_LABELS: Record<string, string> = {
  applied: "Applied",
  under_review: "Under Review",
  interview: "Interview",
  selected: "Selected",
  rejected: "Rejected",
  withdrawn: "Withdrawn",
};

const STATUS_STYLES: Record<string, { bg: string; text: string; dot: string }> = {
  applied: { bg: "bg-gray-100", text: "text-gray-700", dot: "bg-gray-400" },
  under_review: { bg: "bg-blue-50", text: "text-blue-700", dot: "bg-blue-500" },
  interview: { bg: "bg-green-50", text: "text-green-700", dot: "bg-green-500" },
  selected: { bg: "bg-green-50", text: "text-green-700", dot: "bg-green-600" },
  rejected: { bg: "bg-red-50", text: "text-red-600", dot: "bg-red-400" },
  withdrawn: { bg: "bg-gray-50", text: "text-gray-500", dot: "bg-gray-300" },
};

const APPLICATION_TRANSITIONS: Record<string, ApplicationStatus[]> = {
  applied: ["under_review", "rejected", "withdrawn"],
  under_review: ["interview", "applied", "rejected", "withdrawn"],
  interview: ["selected", "under_review", "rejected", "withdrawn"],
  selected: [],
  rejected: [],
  withdrawn: [],
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

function isSafeUrl(value: string): boolean {
  try {
    const parsed = new URL(value);
    return parsed.protocol === "http:" || parsed.protocol === "https:";
  } catch {
    return false;
  }
}

function statusLabel(status: string): string {
  return STATUS_LABELS[status] || status.replace(/_/g, " ");
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

function InfoField({
  label,
  value,
  mono = false,
}: {
  label: string;
  value: string;
  mono?: boolean;
}) {
  return (
    <div>
      <dt className="text-xs font-medium text-gray-400 uppercase tracking-wider mb-1">
        {label}
      </dt>
      <dd className={`text-sm text-gray-700 break-words ${mono ? "font-mono" : ""}`}>
        {value}
      </dd>
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

function EducationCard({ entries }: { entries: AdminApplication["education"] }) {
  const filtered = (entries || []).filter(
    (e) =>
      e.qualification?.trim() ||
      e.institution?.trim() ||
      e.fieldOfStudy?.trim() ||
      e.graduationYear?.trim()
  );
  if (filtered.length === 0) return null;
  return (
    <DetailCard title="Education">
      <div className="space-y-4">
        {filtered.map((edu, index) => (
          <div
            key={index}
            className="p-4 rounded-lg border border-gray-100 bg-gray-50/50"
          >
            <dl className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-3">
              {edu.qualification && (
                <InfoField label="Qualification" value={edu.qualification} />
              )}
              {edu.institution && (
                <InfoField label="Institution" value={edu.institution} />
              )}
              {edu.fieldOfStudy && (
                <InfoField label="Field of study" value={edu.fieldOfStudy} />
              )}
              {edu.graduationYear && (
                <InfoField label="Graduation year" value={edu.graduationYear} />
              )}
            </dl>
          </div>
        ))}
      </div>
    </DetailCard>
  );
}

function AdditionalQuestionsCard({
  answers,
}: {
  answers: AdminApplication["additionalAnswers"];
}) {
  if (!answers || Object.keys(answers).length === 0) return null;
  const pairs = APPLICATION_QUESTIONS.map((q) => {
    const answer = answers[q.id];
    if (!answer) return null;
    return (
      <div key={q.id}>
        <dt className="text-sm font-medium text-gray-700 mb-1">{q.question}</dt>
        <dd className="text-sm text-gray-600 whitespace-pre-wrap break-words">
          {answer}
        </dd>
      </div>
    );
  }).filter(Boolean);
  if (pairs.length === 0) return null;
  return (
    <DetailCard title="Additional Questions">
      <dl className="space-y-4">{pairs}</dl>
    </DetailCard>
  );
}

function LinksCard({ application }: { application: AdminApplication }) {
  const links = [
    { label: "LinkedIn", url: application.linkedinUrl },
    { label: "GitHub", url: application.githubUrl },
    { label: "Portfolio", url: application.portfolioUrl },
    { label: "Other website", url: application.otherWebsite },
  ].filter((l): l is { label: string; url: string } => !!l.url && isSafeUrl(l.url));

  if (links.length === 0) return null;
  return (
    <DetailCard title="Professional Links">
      <dl className="space-y-3">
        {links.map((link) => (
          <div key={link.label}>
            <dt className="text-xs font-medium text-gray-400 uppercase tracking-wider mb-0.5">
              {link.label}
            </dt>
            <dd>
              <a
                href={link.url}
                target="_blank"
                rel="noopener noreferrer"
                className="text-sm text-green-primary hover:text-green-dark transition-colors break-all"
              >
                {link.url}
              </a>
            </dd>
          </div>
        ))}
      </dl>
    </DetailCard>
  );
}

function ApplicationReviewSkeleton() {
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
          <div className="h-24 bg-gray-200 rounded" />
        </div>
        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <div className="h-5 bg-gray-200 rounded w-36 mb-5" />
          <div className="h-24 bg-gray-200 rounded" />
        </div>
      </div>
    </div>
  );
}

interface AdminApplicationReviewClientProps {
  id: string;
}

export default function AdminApplicationReviewClient({
  id,
}: AdminApplicationReviewClientProps) {
  const [state, setState] = useState<LoadState>("loading");
  const [data, setData] = useState<ApplicationReviewData | null>(null);
  const [reloadKey, setReloadKey] = useState(0);

  const [selectedStatus, setSelectedStatus] = useState("");
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [targetStatus, setTargetStatus] = useState<ApplicationStatus | null>(null);
  const [updating, setUpdating] = useState(false);
  const [notice, setNotice] = useState<{
    type: "success" | "error";
    message: string;
  } | null>(null);
  const confirmRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    let cancelled = false;
    async function load() {
      setState("loading");
      try {
        const res = await fetch(
          `/api/admin/careers/applications/${encodeURIComponent(id)}`
        );
        if (cancelled) return;
        if (!res.ok) {
          setState(res.status === 404 ? "notfound" : "error");
          return;
        }
        const json = (await res.json()) as ApplicationReviewData;
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

  const refreshData = useCallback(async () => {
    try {
      const res = await fetch(
        `/api/admin/careers/applications/${encodeURIComponent(id)}`
      );
      if (!res.ok) {
        setNotice({
          type: "error",
          message: "Unable to refresh application details.",
        });
        return;
      }
      const json = (await res.json()) as ApplicationReviewData;
      setData(json);
      setState("ready");
    } catch {
      setNotice({
        type: "error",
        message: "Unable to refresh application details.",
      });
    }
  }, [id]);

  useEffect(() => {
    if (!confirmOpen) return;
    confirmRef.current?.focus();
    function handleKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape") setConfirmOpen(false);
    }
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [confirmOpen]);

  function handleRetry() {
    setReloadKey((k) => k + 1);
  }

  function openConfirm() {
    if (!selectedStatus || !data) return;
    setTargetStatus(selectedStatus as ApplicationStatus);
    setNotice(null);
    setConfirmOpen(true);
  }

  async function handleConfirm() {
    if (!targetStatus || !data) return;
    setUpdating(true);
    try {
      const res = await fetch(
        `/api/admin/careers/applications/${encodeURIComponent(id)}`,
        {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ status: targetStatus }),
        }
      );
      const json = (await res.json()) as { error?: string };
      if (!res.ok) {
        setNotice({
          type: "error",
          message: json.error || "Unable to update application status.",
        });
        setConfirmOpen(false);
        return;
      }
      await refreshData();
      setNotice({
        type: "success",
        message: `Application status updated to ${statusLabel(targetStatus)}.`,
      });
      window.setTimeout(() => setNotice(null), 5000);
    } catch {
      setNotice({
        type: "error",
        message: "Unable to update application status.",
      });
    } finally {
      setUpdating(false);
      setConfirmOpen(false);
      setTargetStatus(null);
      setSelectedStatus("");
    }
  }

  if (state === "loading") {
    return <ApplicationReviewSkeleton />;
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
              Unable to load application.
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
                href="/admin/careers/applications"
                className="inline-flex items-center justify-center px-5 py-2.5 text-sm font-medium text-gray-700 bg-white border border-gray-300 hover:border-gray-400 hover:bg-gray-50 rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-green-primary focus:ring-offset-2"
              >
                Back to Applications
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
              Application not found
            </h1>
            <p className="text-gray-500 mb-6">
              This application may have been removed or the link may be incorrect.
            </p>
            <Link
              href="/admin/careers/applications"
              className="inline-flex items-center justify-center px-5 py-2.5 text-sm font-medium text-white bg-green-primary hover:bg-green-dark rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-green-primary focus:ring-offset-2"
            >
              Back to Applications
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const { application: app, job } = data;
  const allowedTransitions = APPLICATION_TRANSITIONS[app.status] || [];
  const initials = `${app.candidateFirstName.charAt(0) ?? ""}${
    app.candidateLastName.charAt(0) ?? ""
  }`.toUpperCase();

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
                href="/admin/careers/applications"
                className="hover:text-gray-600 transition-colors"
              >
                Applications
              </Link>
            </li>
            <li aria-hidden="true">/</li>
            <li className="text-gray-600 font-medium truncate max-w-[220px] sm:max-w-xs">
              Application Review
            </li>
          </ol>
        </nav>

        {/* Page Header */}
        <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-4 mb-8">
          <div className="min-w-0">
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 break-words">
              Application Review
            </h1>
            <p className="text-sm text-gray-500 mt-1">
              Review the candidate&apos;s application and manage its current
              recruitment status.
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-3 flex-shrink-0">
            <Link
              href="/admin/careers/applications"
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
              Back to Applications
            </Link>
            {job && (
              <Link
                href={`/admin/careers/jobs/${job.id}`}
                className="inline-flex items-center justify-center gap-2 px-4 py-2.5 text-sm font-medium text-gray-700 bg-white border border-gray-300 hover:border-gray-400 hover:bg-gray-50 rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-green-primary focus:ring-offset-2"
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
                    d="M13.5 6H5.25A2.25 2.25 0 003 8.25v10.5A2.25 2.25 0 005.25 21h10.5A2.25 2.25 0 0018 18.75V10.5m-10.5 6L21 3m0 0h-5.25M21 3v5.25"
                  />
                </svg>
                View Job
              </Link>
            )}
          </div>
        </div>

        <div className="space-y-6">
          {notice && (
            <div
              role="status"
              aria-live="polite"
              className={`rounded-lg border px-4 py-3 text-sm font-medium ${
                notice.type === "success"
                  ? "bg-green-50 border-green-200 text-green-700"
                  : "bg-red-50 border-red-200 text-red-600"
              }`}
            >
              {notice.message}
            </div>
          )}

          {/* Application Summary */}
          <section className="bg-white rounded-xl border border-gray-200 p-6">
            <div className="flex flex-col sm:flex-row sm:items-center gap-4">
              <div className="flex items-center gap-4 min-w-0">
                <div className="flex items-center justify-center w-12 h-12 rounded-full bg-green-50 text-green-primary font-semibold text-lg flex-shrink-0">
                  {initials}
                </div>
                <div className="min-w-0">
                  <h2 className="text-lg font-semibold text-gray-900 break-words">
                    {app.candidateFirstName} {app.candidateLastName}
                  </h2>
                  <p className="text-sm text-gray-500 mt-0.5 truncate">
                    {app.jobTitle}
                  </p>
                  <div className="mt-1.5">
                    <ApplicationStatusBadge status={app.status} />
                  </div>
                </div>
              </div>
            </div>
            <dl className="mt-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-6 gap-y-4">
              <InfoField label="Application ID" value={app.id} mono />
              <InfoField label="Applied" value={formatDate(app.appliedAt)} />
              <InfoField
                label="Last Updated"
                value={app.updatedAt ? formatDate(app.updatedAt) : "—"}
              />
            </dl>
          </section>

          {/* Application Status */}
          <DetailCard title="Application Status">
            <div className="flex flex-col sm:flex-row sm:items-center gap-6">
              <div className="flex flex-col gap-1.5">
                <span className="text-xs font-medium text-gray-400 uppercase tracking-wider">
                  Current status
                </span>
                <ApplicationStatusBadge status={app.status} />
              </div>
              {allowedTransitions.length > 0 ? (
                <div className="flex flex-col sm:flex-row sm:items-end gap-3">
                  <div>
                    <label
                      htmlFor="status-update"
                      className="block text-xs font-medium text-gray-400 uppercase tracking-wider mb-1"
                    >
                      Update status
                    </label>
                    <select
                      id="status-update"
                      value={selectedStatus}
                      onChange={(e) => {
                        setSelectedStatus(e.target.value);
                        setNotice(null);
                      }}
                      className="w-full sm:w-56 text-sm border border-gray-300 rounded-lg px-3 py-2 text-gray-700 focus:outline-none focus:ring-2 focus:ring-green-primary focus:border-transparent bg-white"
                    >
                      <option value="">Select new status…</option>
                      {allowedTransitions.map((s) => (
                        <option key={s} value={s}>
                          {statusLabel(s)}
                        </option>
                      ))}
                    </select>
                  </div>
                  <button
                    type="button"
                    onClick={openConfirm}
                    disabled={!selectedStatus}
                    className="inline-flex items-center justify-center gap-2 px-4 py-2 text-sm font-medium text-white bg-green-primary hover:bg-green-dark rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-green-primary focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Update Status
                  </button>
                </div>
              ) : (
                <p className="text-sm text-gray-500">
                  No further status changes are available for this application.
                </p>
              )}
            </div>
          </DetailCard>

          {/* Candidate Information */}
          <DetailCard title="Candidate Information">
            <dl className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-6 gap-y-5">
              <InfoField
                label="Full name"
                value={`${app.candidateFirstName} ${app.candidateLastName}`}
              />
              <InfoField label="Email" value={app.candidateEmail} />
              {app.phone && <InfoField label="Phone" value={app.phone} />}
              {app.currentLocation && (
                <InfoField label="Current location" value={app.currentLocation} />
              )}
              {app.country && <InfoField label="Country" value={app.country} />}
            </dl>
          </DetailCard>

          {/* Professional Information */}
          {(app.currentJobTitle ||
            app.currentCompany ||
            app.experienceLevel ||
            app.yearsOfExperience) && (
            <DetailCard title="Professional Information">
              <dl className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-6 gap-y-5">
                {app.currentJobTitle && (
                  <InfoField label="Current job title" value={app.currentJobTitle} />
                )}
                {app.currentCompany && (
                  <InfoField label="Current company" value={app.currentCompany} />
                )}
                {app.experienceLevel && (
                  <InfoField label="Experience level" value={app.experienceLevel} />
                )}
                {app.yearsOfExperience && (
                  <InfoField
                    label="Years of experience"
                    value={app.yearsOfExperience}
                  />
                )}
              </dl>
            </DetailCard>
          )}

          <EducationCard entries={app.education} />

          {/* Resume */}
          <DetailCard title="Resume">
            {app.resumeFileName ? (
              <div className="flex items-center gap-3 p-4 rounded-lg border border-gray-200 bg-gray-50">
                <div className="flex-shrink-0 w-10 h-10 rounded-lg bg-green-50 flex items-center justify-center">
                  <svg
                    className="w-5 h-5 text-green-primary"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth="1.5"
                    stroke="currentColor"
                    aria-hidden="true"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m2.25 0H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z"
                    />
                  </svg>
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-900 truncate">
                    {app.resumeFileName}
                  </p>
                  {app.resumeFileSize && (
                    <p className="text-xs text-gray-500">{app.resumeFileSize}</p>
                  )}
                </div>
                <span className="text-xs text-gray-400">
                  No file download available
                </span>
              </div>
            ) : (
              <p className="text-sm text-gray-500">Resume not available</p>
            )}
          </DetailCard>

          <LinksCard application={app} />

          <AdditionalQuestionsCard answers={app.additionalAnswers} />

          {/* Job Information */}
          <DetailCard title="Job Information">
            {job ? (
              <>
                <dl className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-6 gap-y-5">
                  <InfoField label="Job title" value={job.title} />
                  <InfoField label="Department" value={job.department} />
                  {job.team && <InfoField label="Team" value={job.team} />}
                  <InfoField label="Location" value={job.location} />
                  <InfoField label="Employment type" value={job.employmentType} />
                  <InfoField label="Work mode" value={job.workMode} />
                  <InfoField label="Experience" value={job.experience} />
                </dl>
                <div className="mt-6">
                  <Link
                    href={`/admin/careers/jobs/${job.id}`}
                    className="inline-flex items-center justify-center px-4 py-2.5 text-sm font-medium text-green-primary bg-green-50 hover:bg-green-100 rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-green-primary focus:ring-offset-2"
                  >
                    View Job
                  </Link>
                </div>
              </>
            ) : (
              <p className="text-sm text-gray-500">
                This job is no longer available.
              </p>
            )}
          </DetailCard>
        </div>
      </div>

      {/* Confirmation Dialog */}
      {confirmOpen && targetStatus && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div
            className="absolute inset-0 bg-gray-900/50"
            onClick={() => setConfirmOpen(false)}
            aria-hidden="true"
          />
          <div
            role="dialog"
            aria-modal="true"
            aria-labelledby="confirm-title"
            aria-describedby="confirm-desc"
            className="relative bg-white rounded-xl shadow-xl w-full max-w-md p-6"
          >
            <h2 id="confirm-title" className="text-lg font-semibold text-gray-900 mb-2">
              {targetStatus === "rejected"
                ? "Reject application?"
                : `Change status to ${statusLabel(targetStatus)}?`}
            </h2>
            <p id="confirm-desc" className="text-sm text-gray-500 mb-6">
              Confirm that you want to change this application&apos;s status from{" "}
              <span className="font-medium text-gray-700">{statusLabel(app.status)}</span> to{" "}
              <span className="font-medium text-gray-700">{statusLabel(targetStatus)}</span>.
            </p>
            <div className="flex items-center justify-end gap-3">
              <button
                type="button"
                onClick={() => setConfirmOpen(false)}
                disabled={updating}
                className="inline-flex items-center justify-center px-4 py-2.5 text-sm font-medium text-gray-700 bg-white border border-gray-300 hover:border-gray-400 hover:bg-gray-50 rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-green-primary focus:ring-offset-2 disabled:opacity-60"
              >
                Cancel
              </button>
              <button
                ref={confirmRef}
                type="button"
                onClick={handleConfirm}
                disabled={updating}
                className="inline-flex items-center justify-center gap-2 px-4 py-2.5 text-sm font-medium text-white bg-green-primary hover:bg-green-dark rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-green-primary focus:ring-offset-2 disabled:opacity-60 disabled:cursor-not-allowed"
              >
                {updating && (
                  <svg
                    className="animate-spin -ml-1 h-4 w-4"
                    fill="none"
                    viewBox="0 0 24 24"
                    aria-hidden="true"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    />
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    />
                  </svg>
                )}
                {updating ? "Updating…" : "Confirm"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}