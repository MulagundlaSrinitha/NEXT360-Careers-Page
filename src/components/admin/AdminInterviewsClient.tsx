"use client";

import { useState, useEffect, useCallback, type ReactNode } from "react";
import Link from "next/link";
import { usePathname, useRouter, useSearchParams } from "next/navigation";

interface InterviewRow {
  id: string;
  applicationId: string;
  jobId: string;
  jobTitle: string;
  department: string;
  location: string;
  candidateEmail: string;
  candidateFirstName: string;
  candidateLastName: string;
  interviewStatus?: string;
  interviewDate?: string;
  interviewTime?: string;
  interviewLocation?: string;
  interviewNotes?: string;
}

interface InterviewSummaryData {
  total: number;
  upcoming: number;
  completed: number;
  cancelled: number;
}

interface JobOption {
  id: string;
  title: string;
  department: string;
}

interface ApplicationOption {
  applicationId: string;
  jobId: string;
  jobTitle: string;
  department: string;
  candidateFirstName: string;
  candidateLastName: string;
  candidateEmail: string;
}

interface InterviewsListData {
  interviews: InterviewRow[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
  totalCount: number;
  summary: InterviewSummaryData;
  jobOptions: JobOption[];
  applicationOptions: ApplicationOption[];
}

const INTERVIEW_STATUS_STYLES: Record<string, { bg: string; text: string; dot: string }> = {
  scheduled: { bg: "bg-blue-50", text: "text-blue-700", dot: "bg-blue-500" },
  completed: { bg: "bg-green-50", text: "text-green-700", dot: "bg-green-600" },
  cancelled: { bg: "bg-red-50", text: "text-red-600", dot: "bg-red-400" },
};

const UNSCHEDULED_STYLE = { bg: "bg-gray-50", text: "text-gray-500", dot: "bg-gray-300" };

const VALID_STATUS_FILTERS = ["scheduled", "completed", "cancelled"];

function statusLabel(status: string): string {
  return status.replace(/_/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());
}

function InterviewStatusBadge({ status }: { status?: string }) {
  const style = status ? INTERVIEW_STATUS_STYLES[status] || UNSCHEDULED_STYLE : UNSCHEDULED_STYLE;
  return (
    <span
      className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium ${style.bg} ${style.text}`}
    >
      <span className={`w-1.5 h-1.5 rounded-full ${style.dot}`} aria-hidden="true" />
      {status ? statusLabel(status) : "Not Scheduled"}
    </span>
  );
}

function formatInterviewDate(value?: string): string {
  if (!value) return "—";
  const parts = /^(\d{4})-(\d{2})-(\d{2})$/.exec(value);
  if (parts) {
    const d = new Date(Number(parts[1]), Number(parts[2]) - 1, Number(parts[3]));
    return d.toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" });
  }
  const d = new Date(value);
  return Number.isNaN(d.getTime())
    ? "—"
    : d.toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" });
}

function SkeletonCard() {
  return (
    <div className="bg-white rounded-xl border border-gray-200 p-5 animate-pulse">
      <div className="h-3 bg-gray-200 rounded w-24 mb-3" />
      <div className="h-7 bg-gray-200 rounded w-12 mb-2" />
      <div className="h-2.5 bg-gray-100 rounded w-20" />
    </div>
  );
}

function SkeletonRow() {
  return (
    <tr>
      <td className="px-6 py-4"><div className="h-4 bg-gray-200 rounded w-40 animate-pulse" /></td>
      <td className="px-6 py-4"><div className="h-4 bg-gray-200 rounded w-32 animate-pulse" /></td>
      <td className="px-6 py-4"><div className="h-4 bg-gray-200 rounded w-24 animate-pulse" /></td>
      <td className="px-6 py-4 hidden lg:table-cell"><div className="h-4 bg-gray-200 rounded w-16 animate-pulse" /></td>
      <td className="px-6 py-4"><div className="h-6 bg-gray-200 rounded-full w-24 animate-pulse" /></td>
      <td className="px-6 py-4 text-right"><div className="h-4 bg-gray-200 rounded w-28 animate-pulse ml-auto" /></td>
    </tr>
  );
}

function Modal({
  title,
  description,
  onClose,
  children,
}: {
  title: string;
  description?: string;
  onClose: () => void;
  children: ReactNode;
}) {
  useEffect(() => {
    function handleKey(event: KeyboardEvent) {
      if (event.key === "Escape") onClose();
    }
    document.addEventListener("keydown", handleKey);
    return () => document.removeEventListener("keydown", handleKey);
  }, [onClose]);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div
        className="absolute inset-0 bg-gray-900/50"
        onClick={onClose}
        aria-hidden="true"
      />
      <div
        role="dialog"
        aria-modal="true"
        aria-label={title}
        className="relative w-full max-w-lg bg-white rounded-xl border border-gray-200 shadow-lg max-h-[90vh] overflow-y-auto"
      >
        <div className="flex items-start justify-between gap-4 px-6 py-4 border-b border-gray-100">
          <div>
            <h2 className="text-base font-semibold text-gray-900">{title}</h2>
            {description && <p className="text-sm text-gray-500 mt-0.5">{description}</p>}
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1 rounded-md text-gray-400 hover:text-gray-600 focus:outline-none focus:ring-2 focus:ring-green-primary focus:ring-offset-2"
            aria-label="Close dialog"
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" aria-hidden="true">
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        <div className="px-6 py-5">{children}</div>
      </div>
    </div>
  );
}

const inputClass =
  "w-full text-sm border border-gray-300 rounded-lg px-3 py-2 text-gray-700 focus:outline-none focus:ring-2 focus:ring-green-primary focus:border-transparent bg-white";
const labelClass = "block text-sm font-medium text-gray-700 mb-1";

export default function AdminInterviewsClient() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const [data, setData] = useState<InterviewsListData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [reloadKey, setReloadKey] = useState(0);
  const [successMessage, setSuccessMessage] = useState("");

  const search = searchParams.get("search") || "";
  const status = searchParams.get("status") || "";
  const jobId = searchParams.get("jobId") || "";
  const from = searchParams.get("from") || "";
  const to = searchParams.get("to") || "";
  const sort = searchParams.get("sort") || "date-desc";
  const page = parseInt(searchParams.get("page") || "1", 10);

  const [searchInput, setSearchInput] = useState(search);

  // Schedule dialog state
  const [scheduleOpen, setScheduleOpen] = useState(false);
  const [scheduleForm, setScheduleForm] = useState({
    applicationId: "",
    date: "",
    time: "",
    location: "",
    notes: "",
  });

  // Reschedule dialog state
  const [rescheduleTarget, setRescheduleTarget] = useState<InterviewRow | null>(null);
  const [rescheduleForm, setRescheduleForm] = useState({
    date: "",
    time: "",
    location: "",
    notes: "",
  });

  // Cancel dialog state
  const [cancelTarget, setCancelTarget] = useState<InterviewRow | null>(null);

  const [submitting, setSubmitting] = useState(false);
  const [formError, setFormError] = useState("");

  const createQueryString = useCallback(
    (updates: Record<string, string>) => {
      const params = new URLSearchParams(searchParams.toString());
      for (const [key, value] of Object.entries(updates)) {
        if (value) {
          params.set(key, value);
        } else {
          params.delete(key);
        }
      }
      if (!("page" in updates)) {
        if ("search" in updates || "status" in updates || "jobId" in updates || "from" in updates || "to" in updates || "sort" in updates) {
          params.delete("page");
        }
      }
      return params.toString();
    },
    [searchParams]
  );

  useEffect(() => {
    let cancelled = false;
    async function fetchInterviews() {
      setLoading(true);
      setError(false);
      try {
        const params = new URLSearchParams();
        if (search) params.set("search", search);
        if (status) params.set("status", status);
        if (jobId) params.set("jobId", jobId);
        if (from) params.set("from", from);
        if (to) params.set("to", to);
        if (sort) params.set("sort", sort);
        params.set("page", String(page));
        params.set("limit", "20");

        const res = await fetch(`/api/admin/careers/interviews?${params.toString()}`);
        if (!res.ok) throw new Error("Failed");
        const json = await res.json();
        if (!cancelled) {
          setData(json);
          setLoading(false);
        }
      } catch {
        if (!cancelled) {
          setError(true);
          setLoading(false);
        }
      }
    }
    void fetchInterviews();
    return () => { cancelled = true; };
  }, [search, status, jobId, from, to, sort, page, reloadKey]);

  function handleSearchSubmit(e: React.FormEvent) {
    e.preventDefault();
    router.push(`${pathname}?${createQueryString({ search: searchInput, page: "1" })}`);
  }

  function handleFilterChange(key: string, value: string) {
    router.push(`${pathname}?${createQueryString({ [key]: value, page: "1" })}`);
  }

  function handlePageChange(newPage: number) {
    router.push(`${pathname}?${createQueryString({ page: String(newPage) })}`);
  }

  function clearFilters() {
    setSearchInput("");
    router.push(pathname);
  }

  function refresh() {
    setReloadKey((k) => k + 1);
  }

  function openSchedule(applicationId = "") {
    setFormError("");
    setSuccessMessage("");
    setScheduleForm({ applicationId, date: "", time: "", location: "", notes: "" });
    setScheduleOpen(true);
  }

  function openReschedule(row: InterviewRow) {
    setFormError("");
    setSuccessMessage("");
    setRescheduleForm({
      date: row.interviewDate || "",
      time: row.interviewTime || "",
      location: row.interviewLocation || "",
      notes: row.interviewNotes || "",
    });
    setRescheduleTarget(row);
  }

  function openCancel(row: InterviewRow) {
    setFormError("");
    setSuccessMessage("");
    setCancelTarget(row);
  }

  async function submitSchedule(e: React.FormEvent) {
    e.preventDefault();
    if (submitting) return;
    setFormError("");

    if (!scheduleForm.applicationId) {
      setFormError("Please select an application.");
      return;
    }
    if (!scheduleForm.date || !scheduleForm.time) {
      setFormError("Please provide an interview date and time.");
      return;
    }

    setSubmitting(true);
    try {
      const res = await fetch("/api/admin/careers/interviews", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(scheduleForm),
      });
      const json = await res.json().catch(() => null);
      if (!res.ok) {
        setFormError(json?.error || "Unable to schedule interview. Please try again.");
        return;
      }
      setScheduleOpen(false);
      setSuccessMessage("Interview scheduled successfully.");
      refresh();
    } catch {
      setFormError("Unable to schedule interview. Please try again.");
    } finally {
      setSubmitting(false);
    }
  }

  async function submitReschedule(e: React.FormEvent) {
    e.preventDefault();
    if (!rescheduleTarget || submitting) return;
    setFormError("");

    if (!rescheduleForm.date || !rescheduleForm.time) {
      setFormError("Please provide an interview date and time.");
      return;
    }

    setSubmitting(true);
    try {
      const res = await fetch(
        `/api/admin/careers/interviews/${encodeURIComponent(rescheduleTarget.id)}`,
        {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(rescheduleForm),
        }
      );
      const json = await res.json().catch(() => null);
      if (!res.ok) {
        setFormError(json?.error || "Unable to reschedule interview. Please try again.");
        return;
      }
      setRescheduleTarget(null);
      setSuccessMessage("Interview rescheduled successfully.");
      refresh();
    } catch {
      setFormError("Unable to reschedule interview. Please try again.");
    } finally {
      setSubmitting(false);
    }
  }

  async function submitCancel() {
    if (!cancelTarget || submitting) return;
    setFormError("");
    setSubmitting(true);
    try {
      const res = await fetch(
        `/api/admin/careers/interviews/${encodeURIComponent(cancelTarget.id)}`,
        {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ action: "cancel" }),
        }
      );
      const json = await res.json().catch(() => null);
      if (!res.ok) {
        setFormError(json?.error || "Unable to cancel interview. Please try again.");
        return;
      }
      setCancelTarget(null);
      setSuccessMessage("Interview cancelled.");
      refresh();
    } catch {
      setFormError("Unable to cancel interview. Please try again.");
    } finally {
      setSubmitting(false);
    }
  }

  const hasActiveFilters = Boolean(status || jobId || from || to || search);
  const databaseEmpty = data ? data.totalCount === 0 : false;

  if (error) {
    return (
      <div className="p-4 sm:p-6 lg:p-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center py-16">
            <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-red-50 flex items-center justify-center">
              <svg className="w-8 h-8 text-red-500" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" aria-hidden="true">
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m9-.75a9 9 0 11-18 0 9 9 0 0118 0zm-9 3.75h.008v.008H12v-.008z" />
              </svg>
            </div>
            <h2 className="text-xl font-semibold text-gray-900 mb-2">Unable to load interviews.</h2>
            <p className="text-gray-500 mb-6">Please try again.</p>
            <button
              type="button"
              onClick={() => { setError(false); setLoading(true); refresh(); }}
              className="inline-flex items-center justify-center px-5 py-2.5 text-sm font-medium text-white bg-green-primary hover:bg-green-dark rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-green-primary focus:ring-offset-2"
            >
              Retry
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-4 sm:p-6 lg:p-8">
      <div className="max-w-7xl mx-auto">
        {/* Page Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
          <div>
            <p className="text-xs font-semibold tracking-wider text-green-primary uppercase mb-1">
              CAREERS
            </p>
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">Interview Management</h1>
            <p className="text-sm text-gray-500 mt-1">
              Manage recruitment interviews and review their schedules and current status.
            </p>
          </div>
          <button
            type="button"
            onClick={() => openSchedule()}
            className="inline-flex items-center justify-center gap-2 px-4 py-2.5 text-sm font-medium text-white bg-green-primary hover:bg-green-dark rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-green-primary focus:ring-offset-2 flex-shrink-0"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" aria-hidden="true">
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
            </svg>
            Schedule Interview
          </button>
        </div>

        {successMessage && (
          <div
            role="status"
            className="mb-6 flex items-center gap-2 rounded-lg border border-green-200 bg-green-50 px-4 py-3 text-sm text-green-700"
          >
            <svg className="w-5 h-5 flex-shrink-0" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" aria-hidden="true">
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            {successMessage}
          </div>
        )}

        {/* Summary Cards */}
        {loading ? (
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-6">
            {Array.from({ length: 4 }).map((_, i) => <SkeletonCard key={i} />)}
          </div>
        ) : data ? (
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-6">
            <button
              type="button"
              onClick={() => handleFilterChange("status", "")}
              className={`bg-white rounded-xl border p-5 text-left transition-colors ${!status ? "border-green-primary ring-1 ring-green-primary" : "border-gray-200 hover:border-gray-300"}`}
            >
              <p className="text-sm font-medium text-gray-500">Total Interviews</p>
              <p className="text-2xl font-bold text-gray-900 mt-1">{data.summary.total}</p>
              <p className="text-xs text-gray-400 mt-1">All time</p>
            </button>

            {[
              { key: "scheduled", value: data.summary.upcoming, label: "Upcoming", hint: "Scheduled ahead" },
              { key: "completed", value: data.summary.completed, label: "Completed", hint: "Interviewed" },
              { key: "cancelled", value: data.summary.cancelled, label: "Cancelled", hint: "Cancelled" },
            ].map((metric) => (
              <button
                key={metric.key}
                type="button"
                onClick={() => handleFilterChange("status", status === metric.key ? "" : metric.key)}
                className={`bg-white rounded-xl border p-5 text-left transition-colors ${status === metric.key ? "border-green-primary ring-1 ring-green-primary" : "border-gray-200 hover:border-gray-300"}`}
              >
                <p className="text-sm font-medium text-gray-500">{metric.label}</p>
                <p className="text-2xl font-bold text-gray-900 mt-1">{metric.value}</p>
                <p className="text-xs text-gray-400 mt-1">{metric.hint}</p>
              </button>
            ))}
          </div>
        ) : null}

        {/* Search and Filters */}
        <div className="bg-white rounded-xl border border-gray-200 mb-6">
          <div className="p-4 sm:p-5 border-b border-gray-100">
            <form onSubmit={handleSearchSubmit} className="flex gap-3">
              <div className="flex-1 relative">
                <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" aria-hidden="true">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" />
                </svg>
                <input
                  type="text"
                  value={searchInput}
                  onChange={(e) => setSearchInput(e.target.value)}
                  placeholder="Search by candidate, job title, or interview location..."
                  className="w-full pl-10 pr-4 py-2.5 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-primary focus:border-transparent placeholder:text-gray-400"
                  aria-label="Search interviews"
                />
              </div>
              <button
                type="submit"
                className="inline-flex items-center justify-center px-4 py-2.5 text-sm font-medium text-white bg-green-primary hover:bg-green-dark rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-green-primary focus:ring-offset-2"
              >
                Search
              </button>
            </form>
          </div>

          <div className="px-4 sm:px-5 py-3 flex flex-wrap items-end gap-3">
            <div>
              <label htmlFor="filter-status" className="block text-xs font-medium text-gray-400 uppercase tracking-wider mb-1">
                Status
              </label>
              <select
                id="filter-status"
                value={status}
                onChange={(e) => handleFilterChange("status", e.target.value)}
                className={inputClass}
              >
                <option value="">All Statuses</option>
                {VALID_STATUS_FILTERS.map((s) => (
                  <option key={s} value={s}>{statusLabel(s)}</option>
                ))}
              </select>
            </div>

            <div>
              <label htmlFor="filter-job" className="block text-xs font-medium text-gray-400 uppercase tracking-wider mb-1">
                Job
              </label>
              <select
                id="filter-job"
                value={jobId}
                onChange={(e) => handleFilterChange("jobId", e.target.value)}
                className={inputClass}
              >
                <option value="">All Jobs</option>
                {data?.jobOptions.map((j) => (
                  <option key={j.id} value={j.id}>{j.title}</option>
                ))}
              </select>
            </div>

            <div>
              <label htmlFor="filter-from" className="block text-xs font-medium text-gray-400 uppercase tracking-wider mb-1">
                From
              </label>
              <input
                id="filter-from"
                type="date"
                value={from}
                onChange={(e) => handleFilterChange("from", e.target.value)}
                className={inputClass}
              />
            </div>

            <div>
              <label htmlFor="filter-to" className="block text-xs font-medium text-gray-400 uppercase tracking-wider mb-1">
                To
              </label>
              <input
                id="filter-to"
                type="date"
                value={to}
                onChange={(e) => handleFilterChange("to", e.target.value)}
                className={inputClass}
              />
            </div>

            <div>
              <label htmlFor="filter-sort" className="block text-xs font-medium text-gray-400 uppercase tracking-wider mb-1">
                Sort
              </label>
              <select
                id="filter-sort"
                value={sort}
                onChange={(e) => handleFilterChange("sort", e.target.value)}
                className={inputClass}
              >
                <option value="date-desc">Interview Date (Latest)</option>
                <option value="date-asc">Interview Date (Soonest)</option>
                <option value="name-az">Candidate A–Z</option>
                <option value="name-za">Candidate Z–A</option>
                <option value="job-az">Job Title A–Z</option>
                <option value="job-za">Job Title Z–A</option>
              </select>
            </div>

            {hasActiveFilters && (
              <button
                type="button"
                onClick={clearFilters}
                className="inline-flex items-center gap-1.5 text-sm font-medium text-gray-500 hover:text-gray-700 transition-colors py-2"
              >
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" aria-hidden="true">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
                Clear Filters
              </button>
            )}
          </div>
        </div>

        {/* Interviews Table */}
        <div className="bg-white rounded-xl border border-gray-200">
          <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between">
            <h2 className="text-base font-semibold text-gray-900">
              {loading ? "Loading interviews..." : `${data?.total || 0} interview${data?.total !== 1 ? "s" : ""}`}
            </h2>
          </div>

          {loading ? (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-100">
                    <th scope="col" className="text-left px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">Candidate</th>
                    <th scope="col" className="text-left px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">Job</th>
                    <th scope="col" className="text-left px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                    <th scope="col" className="text-left px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider hidden lg:table-cell">Time</th>
                    <th scope="col" className="text-left px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                    <th scope="col" className="text-right px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {Array.from({ length: 6 }).map((_, i) => <SkeletonRow key={i} />)}
                </tbody>
              </table>
            </div>
          ) : data && databaseEmpty ? (
            <div className="text-center py-16">
              <svg className="w-12 h-12 mx-auto text-gray-300 mb-3" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" aria-hidden="true">
                <path strokeLinecap="round" strokeLinejoin="round" d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 012.25-2.25h13.5A2.25 2.25 0 0121 7.5v11.25m-18 0A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75m-18 0v-7.5A2.25 2.25 0 015.25 9h13.5A2.25 2.25 0 0121 11.25v7.5" />
              </svg>
              <h3 className="text-lg font-semibold text-gray-900 mb-1">No interviews found</h3>
              <p className="text-sm text-gray-500 mb-6">
                Interviews will appear here when they are available in the recruitment workflow.
              </p>
              <button
                type="button"
                onClick={() => openSchedule()}
                className="inline-flex items-center justify-center px-5 py-2.5 text-sm font-medium text-white bg-green-primary hover:bg-green-dark rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-green-primary focus:ring-offset-2"
              >
                Schedule Interview
              </button>
            </div>
          ) : data && data.interviews.length === 0 ? (
            <div className="text-center py-16">
              <svg className="w-12 h-12 mx-auto text-gray-300 mb-3" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" aria-hidden="true">
                <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" />
              </svg>
              <h3 className="text-lg font-semibold text-gray-900 mb-1">No interviews found</h3>
              <p className="text-sm text-gray-500 mb-6">No interviews match your current search or filters.</p>
              <button
                type="button"
                onClick={clearFilters}
                className="inline-flex items-center justify-center px-4 py-2.5 text-sm font-medium text-gray-700 bg-white border border-gray-300 hover:border-gray-400 hover:bg-gray-50 rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-green-primary focus:ring-offset-2"
              >
                Clear Filters
              </button>
            </div>
          ) : data ? (
            <>
              {/* Desktop table */}
              <div className="hidden md:block overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-gray-100">
                      <th scope="col" className="text-left px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">Candidate</th>
                      <th scope="col" className="text-left px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">Job</th>
                      <th scope="col" className="text-left px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">Interview Date</th>
                      <th scope="col" className="text-left px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider hidden lg:table-cell">Time</th>
                      <th scope="col" className="text-left px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                      <th scope="col" className="text-right px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-50">
                    {data.interviews.map((row) => (
                      <tr key={row.id} className="hover:bg-gray-50/50 transition-colors">
                        <td className="px-6 py-3.5">
                          <p className="text-sm font-medium text-gray-900">
                            {row.candidateFirstName} {row.candidateLastName}
                          </p>
                          <p className="text-xs text-gray-400 mt-0.5 break-all">{row.candidateEmail}</p>
                        </td>
                        <td className="px-6 py-3.5">
                          <Link
                            href={`/admin/careers/jobs/${row.jobId}`}
                            className="text-sm text-green-primary hover:text-green-dark transition-colors"
                          >
                            {row.jobTitle}
                          </Link>
                          <p className="text-xs text-gray-400 mt-0.5">{row.department}</p>
                        </td>
                        <td className="px-6 py-3.5">
                          <span className="text-sm text-gray-700">{formatInterviewDate(row.interviewDate)}</span>
                          {row.interviewLocation && (
                            <p className="text-xs text-gray-400 mt-0.5">{row.interviewLocation}</p>
                          )}
                        </td>
                        <td className="px-6 py-3.5 hidden lg:table-cell">
                          <span className="text-sm text-gray-500">{row.interviewTime || "—"}</span>
                        </td>
                        <td className="px-6 py-3.5">
                          <InterviewStatusBadge status={row.interviewStatus} />
                        </td>
                        <td className="px-6 py-3.5 text-right whitespace-nowrap">
                          <div className="inline-flex items-center gap-3">
                            <Link
                              href={`/admin/careers/applications/${row.applicationId}`}
                              className="text-sm font-medium text-green-primary hover:text-green-dark transition-colors"
                            >
                              View Application
                            </Link>
                            {!row.interviewStatus && (
                              <button
                                type="button"
                                onClick={() => openSchedule(row.applicationId)}
                                className="text-sm font-medium text-gray-600 hover:text-gray-800 transition-colors"
                              >
                                Schedule
                              </button>
                            )}
                            {row.interviewStatus === "scheduled" && (
                              <>
                                <button
                                  type="button"
                                  onClick={() => openReschedule(row)}
                                  className="text-sm font-medium text-gray-600 hover:text-gray-800 transition-colors"
                                >
                                  Reschedule
                                </button>
                                <button
                                  type="button"
                                  onClick={() => openCancel(row)}
                                  className="text-sm font-medium text-red-600 hover:text-red-700 transition-colors"
                                >
                                  Cancel
                                </button>
                              </>
                            )}
                            {row.interviewStatus === "cancelled" && (
                              <button
                                type="button"
                                onClick={() => openReschedule(row)}
                                className="text-sm font-medium text-gray-600 hover:text-gray-800 transition-colors"
                              >
                                Reschedule
                              </button>
                            )}
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Mobile cards */}
              <div className="md:hidden divide-y divide-gray-100">
                {data.interviews.map((row) => (
                  <div key={row.id} className="px-6 py-4">
                    <div className="flex items-start justify-between gap-3 mb-2">
                      <div className="min-w-0">
                        <p className="text-sm font-medium text-gray-900">
                          {row.candidateFirstName} {row.candidateLastName}
                        </p>
                        <p className="text-xs text-gray-400 mt-0.5 break-all">{row.candidateEmail}</p>
                      </div>
                      <InterviewStatusBadge status={row.interviewStatus} />
                    </div>
                    <p className="text-sm text-gray-700">{row.jobTitle}</p>
                    <p className="text-xs text-gray-400 mt-0.5">{row.department}</p>
                    <p className="text-xs text-gray-500 mt-2">
                      {formatInterviewDate(row.interviewDate)}
                      {row.interviewTime ? ` · ${row.interviewTime}` : ""}
                      {row.interviewLocation ? ` · ${row.interviewLocation}` : ""}
                    </p>
                    <div className="flex flex-wrap items-center gap-3 mt-3">
                      <Link
                        href={`/admin/careers/applications/${row.applicationId}`}
                        className="text-sm font-medium text-green-primary hover:text-green-dark transition-colors"
                      >
                        View Application
                      </Link>
                      {!row.interviewStatus && (
                        <button
                          type="button"
                          onClick={() => openSchedule(row.applicationId)}
                          className="text-sm font-medium text-gray-600 hover:text-gray-800 transition-colors"
                        >
                          Schedule
                        </button>
                      )}
                      {row.interviewStatus === "scheduled" && (
                        <>
                          <button
                            type="button"
                            onClick={() => openReschedule(row)}
                            className="text-sm font-medium text-gray-600 hover:text-gray-800 transition-colors"
                          >
                            Reschedule
                          </button>
                          <button
                            type="button"
                            onClick={() => openCancel(row)}
                            className="text-sm font-medium text-red-600 hover:text-red-700 transition-colors"
                          >
                            Cancel
                          </button>
                        </>
                      )}
                      {row.interviewStatus === "cancelled" && (
                        <button
                          type="button"
                          onClick={() => openReschedule(row)}
                          className="text-sm font-medium text-gray-600 hover:text-gray-800 transition-colors"
                        >
                          Reschedule
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>

              {/* Pagination */}
              {data.totalPages > 1 && (
                <div className="px-6 py-4 border-t border-gray-100 flex items-center justify-between gap-3 flex-wrap">
                  <p className="text-sm text-gray-500">
                    Showing {((data.page - 1) * data.limit) + 1}–{Math.min(data.page * data.limit, data.total)} of {data.total} interviews
                  </p>
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => handlePageChange(data.page - 1)}
                      disabled={data.page <= 1}
                      className="inline-flex items-center justify-center px-3 py-1.5 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors focus:outline-none focus:ring-2 focus:ring-green-primary focus:ring-offset-2"
                    >
                      Previous
                    </button>
                    <button
                      type="button"
                      onClick={() => handlePageChange(data.page + 1)}
                      disabled={data.page >= data.totalPages}
                      className="inline-flex items-center justify-center px-3 py-1.5 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors focus:outline-none focus:ring-2 focus:ring-green-primary focus:ring-offset-2"
                    >
                      Next
                    </button>
                  </div>
                </div>
              )}
            </>
          ) : null}
        </div>
      </div>

      {/* Schedule Dialog */}
      {scheduleOpen && (
        <Modal
          title="Schedule Interview"
          description="Schedule an interview for an application at the interview stage."
          onClose={() => { if (!submitting) setScheduleOpen(false); }}
        >
          <form onSubmit={submitSchedule} className="space-y-4">
            <div>
              <label htmlFor="schedule-application" className={labelClass}>Application</label>
              <select
                id="schedule-application"
                value={scheduleForm.applicationId}
                onChange={(e) => setScheduleForm((f) => ({ ...f, applicationId: e.target.value }))}
                className={inputClass}
                disabled={data?.applicationOptions.length === 0}
              >
                <option value="">Select an application</option>
                {data?.applicationOptions.map((opt) => (
                  <option key={opt.applicationId} value={opt.applicationId}>
                    {opt.candidateFirstName} {opt.candidateLastName} — {opt.jobTitle}
                  </option>
                ))}
              </select>
              {data && data.applicationOptions.length === 0 && (
                <p className="text-xs text-gray-500 mt-1">
                  No applications are currently awaiting an interview. Applications reached the interview stage are eligible.
                </p>
              )}
            </div>

            {scheduleForm.applicationId && (() => {
              const opt = data?.applicationOptions.find(
                (o) => o.applicationId === scheduleForm.applicationId
              );
              if (!opt) return null;
              return (
                <div className="rounded-lg bg-gray-50 border border-gray-200 px-4 py-3 text-sm">
                  <p className="text-gray-700">
                    <span className="font-medium">Candidate:</span> {opt.candidateFirstName} {opt.candidateLastName}
                  </p>
                  <p className="text-gray-500">{opt.candidateEmail}</p>
                  <p className="text-gray-700 mt-1">
                    <span className="font-medium">Job:</span> {opt.jobTitle} · {opt.department}
                  </p>
                </div>
              );
            })()}

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label htmlFor="schedule-date" className={labelClass}>Interview Date</label>
                <input
                  id="schedule-date"
                  type="date"
                  value={scheduleForm.date}
                  onChange={(e) => setScheduleForm((f) => ({ ...f, date: e.target.value }))}
                  className={inputClass}
                  required
                />
              </div>
              <div>
                <label htmlFor="schedule-time" className={labelClass}>Interview Time</label>
                <input
                  id="schedule-time"
                  type="time"
                  value={scheduleForm.time}
                  onChange={(e) => setScheduleForm((f) => ({ ...f, time: e.target.value }))}
                  className={inputClass}
                  required
                />
              </div>
            </div>

            <div>
              <label htmlFor="schedule-location" className={labelClass}>
                Location or Meeting Details <span className="text-gray-400 font-normal">(optional)</span>
              </label>
              <input
                id="schedule-location"
                type="text"
                value={scheduleForm.location}
                onChange={(e) => setScheduleForm((f) => ({ ...f, location: e.target.value }))}
                className={inputClass}
                placeholder="e.g. Next360 Office, Bengaluru"
              />
            </div>

            <div>
              <label htmlFor="schedule-notes" className={labelClass}>
                Notes <span className="text-gray-400 font-normal">(optional)</span>
              </label>
              <textarea
                id="schedule-notes"
                value={scheduleForm.notes}
                onChange={(e) => setScheduleForm((f) => ({ ...f, notes: e.target.value }))}
                className={inputClass}
                rows={3}
              />
            </div>

            {formError && (
              <p role="alert" className="text-sm text-red-600">{formError}</p>
            )}

            <div className="flex items-center justify-end gap-3 pt-2">
              <button
                type="button"
                onClick={() => setScheduleOpen(false)}
                disabled={submitting}
                className="inline-flex items-center justify-center px-4 py-2.5 text-sm font-medium text-gray-700 bg-white border border-gray-300 hover:border-gray-400 hover:bg-gray-50 rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-green-primary focus:ring-offset-2 disabled:opacity-50"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={submitting || data?.applicationOptions.length === 0}
                className="inline-flex items-center justify-center px-4 py-2.5 text-sm font-medium text-white bg-green-primary hover:bg-green-dark rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-green-primary focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {submitting ? "Scheduling..." : "Schedule Interview"}
              </button>
            </div>
          </form>
        </Modal>
      )}

      {/* Reschedule Dialog */}
      {rescheduleTarget && (
        <Modal
          title="Reschedule Interview"
          description={`${rescheduleTarget.candidateFirstName} ${rescheduleTarget.candidateLastName} — ${rescheduleTarget.jobTitle}`}
          onClose={() => { if (!submitting) setRescheduleTarget(null); }}
        >
          <form onSubmit={submitReschedule} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label htmlFor="reschedule-date" className={labelClass}>Interview Date</label>
                <input
                  id="reschedule-date"
                  type="date"
                  value={rescheduleForm.date}
                  onChange={(e) => setRescheduleForm((f) => ({ ...f, date: e.target.value }))}
                  className={inputClass}
                  required
                />
              </div>
              <div>
                <label htmlFor="reschedule-time" className={labelClass}>Interview Time</label>
                <input
                  id="reschedule-time"
                  type="time"
                  value={rescheduleForm.time}
                  onChange={(e) => setRescheduleForm((f) => ({ ...f, time: e.target.value }))}
                  className={inputClass}
                  required
                />
              </div>
            </div>

            <div>
              <label htmlFor="reschedule-location" className={labelClass}>
                Location or Meeting Details <span className="text-gray-400 font-normal">(optional)</span>
              </label>
              <input
                id="reschedule-location"
                type="text"
                value={rescheduleForm.location}
                onChange={(e) => setRescheduleForm((f) => ({ ...f, location: e.target.value }))}
                className={inputClass}
              />
            </div>

            <div>
              <label htmlFor="reschedule-notes" className={labelClass}>
                Notes <span className="text-gray-400 font-normal">(optional)</span>
              </label>
              <textarea
                id="reschedule-notes"
                value={rescheduleForm.notes}
                onChange={(e) => setRescheduleForm((f) => ({ ...f, notes: e.target.value }))}
                className={inputClass}
                rows={3}
              />
            </div>

            {formError && (
              <p role="alert" className="text-sm text-red-600">{formError}</p>
            )}

            <div className="flex items-center justify-end gap-3 pt-2">
              <button
                type="button"
                onClick={() => setRescheduleTarget(null)}
                disabled={submitting}
                className="inline-flex items-center justify-center px-4 py-2.5 text-sm font-medium text-gray-700 bg-white border border-gray-300 hover:border-gray-400 hover:bg-gray-50 rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-green-primary focus:ring-offset-2 disabled:opacity-50"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={submitting}
                className="inline-flex items-center justify-center px-4 py-2.5 text-sm font-medium text-white bg-green-primary hover:bg-green-dark rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-green-primary focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {submitting ? "Saving..." : "Save Changes"}
              </button>
            </div>
          </form>
        </Modal>
      )}

      {/* Cancel Confirmation Dialog */}
      {cancelTarget && (
        <Modal
          title="Cancel Interview"
          onClose={() => { if (!submitting) setCancelTarget(null); }}
        >
          <div className="space-y-4">
            <p className="text-sm text-gray-600">
              Cancel the interview for{" "}
              <span className="font-medium text-gray-900">
                {cancelTarget.candidateFirstName} {cancelTarget.candidateLastName}
              </span>{" "}
              ({cancelTarget.jobTitle}) scheduled on{" "}
              {formatInterviewDate(cancelTarget.interviewDate)}
              {cancelTarget.interviewTime ? ` at ${cancelTarget.interviewTime}` : ""}?
            </p>
            <p className="text-sm text-gray-500">
              The interview record will be preserved and marked as cancelled. You can reschedule it later.
            </p>

            {formError && (
              <p role="alert" className="text-sm text-red-600">{formError}</p>
            )}

            <div className="flex items-center justify-end gap-3 pt-2">
              <button
                type="button"
                onClick={() => setCancelTarget(null)}
                disabled={submitting}
                className="inline-flex items-center justify-center px-4 py-2.5 text-sm font-medium text-gray-700 bg-white border border-gray-300 hover:border-gray-400 hover:bg-gray-50 rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-green-primary focus:ring-offset-2 disabled:opacity-50"
              >
                Keep Interview
              </button>
              <button
                type="button"
                onClick={submitCancel}
                disabled={submitting}
                className="inline-flex items-center justify-center px-4 py-2.5 text-sm font-medium text-white bg-red-600 hover:bg-red-700 rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {submitting ? "Cancelling..." : "Cancel Interview"}
              </button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
}
