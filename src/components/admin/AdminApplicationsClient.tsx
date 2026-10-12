"use client";

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import { usePathname, useRouter, useSearchParams } from "next/navigation";

interface ApplicationRow {
  id: string;
  jobId: string;
  jobTitle: string;
  department: string;
  location: string;
  candidateEmail: string;
  candidateFirstName: string;
  candidateLastName: string;
  status: string;
  appliedAt: string;
}

interface SummaryMetric {
  status: string;
  label: string;
  count: number;
  dotColor: string;
}

interface Summary {
  total: number;
  new: number;
  underReview: number;
  interviews: number;
  hired: number;
  byStatus: SummaryMetric[];
}

interface JobOption {
  id: string;
  title: string;
  department: string;
}

interface ApplicationsListData {
  applications: ApplicationRow[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
  totalCount: number;
  summary: Summary;
  jobOptions: JobOption[];
}

const STATUS_STYLES: Record<string, { bg: string; text: string; dot: string }> = {
  applied: { bg: "bg-gray-100", text: "text-gray-700", dot: "bg-gray-400" },
  under_review: { bg: "bg-blue-50", text: "text-blue-700", dot: "bg-blue-500" },
  interview: { bg: "bg-green-50", text: "text-green-700", dot: "bg-green-500" },
  selected: { bg: "bg-green-50", text: "text-green-700", dot: "bg-green-600" },
  rejected: { bg: "bg-red-50", text: "text-red-600", dot: "bg-red-400" },
  withdrawn: { bg: "bg-gray-50", text: "text-gray-500", dot: "bg-gray-300" },
};

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

function SkeletonCard() {
  return (
    <div className="bg-white rounded-xl border border-gray-200 p-5 animate-pulse">
      <div className="h-3 bg-gray-200 rounded w-20 mb-3" />
      <div className="h-7 bg-gray-200 rounded w-12 mb-2" />
      <div className="h-2.5 bg-gray-100 rounded w-24" />
    </div>
  );
}

function SkeletonRow() {
  return (
    <tr>
      <td className="px-6 py-4"><div className="h-4 bg-gray-200 rounded w-40 animate-pulse" /></td>
      <td className="px-6 py-4"><div className="h-4 bg-gray-200 rounded w-24 animate-pulse" /></td>
      <td className="px-6 py-4"><div className="h-6 bg-gray-200 rounded-full w-20 animate-pulse" /></td>
      <td className="px-6 py-4 hidden sm:table-cell"><div className="h-4 bg-gray-200 rounded w-20 animate-pulse" /></td>
      <td className="px-6 py-4 text-right"><div className="h-4 bg-gray-200 rounded w-16 animate-pulse ml-auto" /></td>
    </tr>
  );
}

export default function AdminApplicationsClient() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const [data, setData] = useState<ApplicationsListData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  const search = searchParams.get("search") || "";
  const status = searchParams.get("status") || "";
  const jobId = searchParams.get("jobId") || "";
  const sort = searchParams.get("sort") || "newest";
  const page = parseInt(searchParams.get("page") || "1", 10);

  const [searchInput, setSearchInput] = useState(search);

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
        if (
          "search" in updates ||
          "status" in updates ||
          "jobId" in updates ||
          "sort" in updates
        ) {
          params.delete("page");
        }
      }
      return params.toString();
    },
    [searchParams]
  );

  useEffect(() => {
    let cancelled = false;
    async function fetchApplications() {
      setLoading(true);
      setError(false);
      try {
        const params = new URLSearchParams();
        if (search) params.set("search", search);
        if (status) params.set("status", status);
        if (jobId) params.set("jobId", jobId);
        if (sort) params.set("sort", sort);
        params.set("page", String(page));
        params.set("limit", "20");

        const res = await fetch(`/api/admin/careers/applications?${params.toString()}`);
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
    void fetchApplications();
    return () => { cancelled = true; };
  }, [search, status, jobId, sort, page]);

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

  const hasActiveFilters = status || jobId || search;
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
            <h2 className="text-xl font-semibold text-gray-900 mb-2">Unable to load applications.</h2>
            <p className="text-gray-500 mb-6">Please try again.</p>
            <button
              type="button"
              onClick={() => { setError(false); setLoading(true); window.location.reload(); }}
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
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">Applications</h1>
            <p className="text-sm text-gray-500 mt-1">
              Review and manage applications submitted for Next360 job opportunities.
            </p>
          </div>
        </div>

        {/* Summary Cards */}
        {loading ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4 mb-6">
            {Array.from({ length: 5 }).map((_, i) => <SkeletonCard key={i} />)}
          </div>
        ) : data ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4 mb-6">
            <button
              type="button"
              onClick={() => handleFilterChange("status", "")}
              className={`bg-white rounded-xl border p-5 text-left transition-colors ${!status ? "border-green-primary ring-1 ring-green-primary" : "border-gray-200 hover:border-gray-300"}`}
            >
              <p className="text-sm font-medium text-gray-500">Total Applications</p>
              <p className="text-2xl font-bold text-gray-900 mt-1">{data.summary.total}</p>
              <p className="text-xs text-gray-400 mt-1">All time</p>
            </button>

            <div className="bg-white rounded-xl border border-gray-200 p-5">
              <p className="text-sm font-medium text-gray-500">New</p>
              <p className="text-2xl font-bold text-gray-900 mt-1">{data.summary.new}</p>
              <p className="text-xs text-gray-400 mt-1">Last 7 days</p>
            </div>

            {[
              { key: "under_review", value: data.summary.underReview, label: "In Review" },
              { key: "interview", value: data.summary.interviews, label: "Interviews" },
              { key: "selected", value: data.summary.hired, label: "Hired" },
            ].map((metric) => (
              <button
                key={metric.key}
                type="button"
                onClick={() => handleFilterChange("status", status === metric.key ? "" : metric.key)}
                className={`bg-white rounded-xl border p-5 text-left transition-colors ${status === metric.key ? "border-green-primary ring-1 ring-green-primary" : "border-gray-200 hover:border-gray-300"}`}
              >
                <p className="text-sm font-medium text-gray-500">{metric.label}</p>
                <p className="text-2xl font-bold text-gray-900 mt-1">{metric.value}</p>
                <p className="text-xs text-gray-400 mt-1">Applicants</p>
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
                  placeholder="Search by candidate name, email, job title, or application ID..."
                  className="w-full pl-10 pr-4 py-2.5 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-primary focus:border-transparent placeholder:text-gray-400"
                  aria-label="Search applications"
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

          <div className="px-4 sm:px-5 py-3 flex flex-wrap gap-3">
            <select
              value={status}
              onChange={(e) => handleFilterChange("status", e.target.value)}
              className="text-sm border border-gray-300 rounded-lg px-3 py-2 text-gray-700 focus:outline-none focus:ring-2 focus:ring-green-primary focus:border-transparent bg-white"
              aria-label="Filter by status"
            >
              <option value="">All Statuses</option>
              {data?.summary.byStatus.filter((s) => s.count > 0).map((s) => (
                <option key={s.status} value={s.status}>{s.label}</option>
              ))}
            </select>

            <select
              value={jobId}
              onChange={(e) => handleFilterChange("jobId", e.target.value)}
              className="text-sm border border-gray-300 rounded-lg px-3 py-2 text-gray-700 focus:outline-none focus:ring-2 focus:ring-green-primary focus:border-transparent bg-white"
              aria-label="Filter by job"
            >
              <option value="">All Jobs</option>
              {data?.jobOptions.map((j) => (
                <option key={j.id} value={j.id}>{j.title}</option>
              ))}
            </select>

            <select
              value={sort}
              onChange={(e) => handleFilterChange("sort", e.target.value)}
              className="text-sm border border-gray-300 rounded-lg px-3 py-2 text-gray-700 focus:outline-none focus:ring-2 focus:ring-green-primary focus:border-transparent bg-white"
              aria-label="Sort applications"
            >
              <option value="newest">Newest First</option>
              <option value="oldest">Oldest First</option>
              <option value="name-az">Candidate A–Z</option>
              <option value="name-za">Candidate Z–A</option>
              <option value="job-az">Job Title A–Z</option>
              <option value="job-za">Job Title Z–A</option>
            </select>

            {hasActiveFilters && (
              <button
                type="button"
                onClick={clearFilters}
                className="inline-flex items-center gap-1.5 text-sm font-medium text-gray-500 hover:text-gray-700 transition-colors"
              >
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" aria-hidden="true">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
                Clear Filters
              </button>
            )}
          </div>
        </div>

        {/* Applications Table */}
        <div className="bg-white rounded-xl border border-gray-200">
          <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between">
            <h2 className="text-base font-semibold text-gray-900">
              {loading ? "Loading applications..." : `${data?.total || 0} application${data?.total !== 1 ? "s" : ""}`}
            </h2>
          </div>

          {loading ? (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-100">
                    <th scope="col" className="text-left px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">Candidate</th>
                    <th scope="col" className="text-left px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">Applied For</th>
                    <th scope="col" className="text-left px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                    <th scope="col" className="text-left px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider hidden sm:table-cell">Applied Date</th>
                    <th scope="col" className="text-right px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {Array.from({ length: 8 }).map((_, i) => <SkeletonRow key={i} />)}
                </tbody>
              </table>
            </div>
          ) : data && databaseEmpty ? (
            <div className="text-center py-16">
              <svg className="w-12 h-12 mx-auto text-gray-300 mb-3" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" aria-hidden="true">
                <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" />
              </svg>
              <h3 className="text-lg font-semibold text-gray-900 mb-1">No applications yet</h3>
              <p className="text-sm text-gray-500 mb-6">
                Applications submitted through the Careers website will appear here.
              </p>
              <Link
                href="/admin/careers/jobs"
                className="inline-flex items-center justify-center px-5 py-2.5 text-sm font-medium text-white bg-green-primary hover:bg-green-dark rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-green-primary focus:ring-offset-2"
              >
                View Jobs
              </Link>
            </div>
          ) : data && data.applications.length === 0 ? (
            <div className="text-center py-16">
              <svg className="w-12 h-12 mx-auto text-gray-300 mb-3" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" aria-hidden="true">
                <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" />
              </svg>
              <h3 className="text-lg font-semibold text-gray-900 mb-1">No applications found</h3>
              <p className="text-sm text-gray-500 mb-6">Try changing your search or filters.</p>
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
                      <th scope="col" className="text-left px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">Applied For</th>
                      <th scope="col" className="text-left px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                      <th scope="col" className="text-left px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider hidden sm:table-cell">Applied Date</th>
                      <th scope="col" className="text-right px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-50">
                    {data.applications.map((app) => (
                      <tr key={app.id} className="hover:bg-gray-50/50 transition-colors">
                        <td className="px-6 py-3.5">
                          <p className="text-sm font-medium text-gray-900">
                            {app.candidateFirstName} {app.candidateLastName}
                          </p>
                          <p className="text-xs text-gray-400 mt-0.5 break-all">{app.candidateEmail}</p>
                        </td>
                        <td className="px-6 py-3.5">
                          <p className="text-sm text-gray-700">{app.jobTitle}</p>
                          <p className="text-xs text-gray-400 mt-0.5">{app.department}</p>
                        </td>
                        <td className="px-6 py-3.5">
                          <ApplicationStatusBadge status={app.status} />
                        </td>
                        <td className="px-6 py-3.5 hidden sm:table-cell">
                          <span className="text-sm text-gray-500">{formatDate(app.appliedAt)}</span>
                        </td>
                        <td className="px-6 py-3.5 text-right whitespace-nowrap">
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
                {data.applications.map((app) => (
                  <div key={app.id} className="px-6 py-4">
                    <div className="flex items-start justify-between gap-3 mb-2">
                      <div className="min-w-0">
                        <p className="text-sm font-medium text-gray-900">
                          {app.candidateFirstName} {app.candidateLastName}
                        </p>
                        <p className="text-xs text-gray-400 mt-0.5 break-all">{app.candidateEmail}</p>
                      </div>
                      <ApplicationStatusBadge status={app.status} />
                    </div>
                    <p className="text-sm text-gray-700 mb-0.5">{app.jobTitle}</p>
                    <div className="flex items-center justify-between mt-2">
                      <span className="text-xs text-gray-400">
                        {app.department} · {formatDate(app.appliedAt)}
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

              {/* Pagination */}
              {data.totalPages > 1 && (
                <div className="px-6 py-4 border-t border-gray-100 flex items-center justify-between gap-3 flex-wrap">
                  <p className="text-sm text-gray-500">
                    Showing {((data.page - 1) * data.limit) + 1}–{Math.min(data.page * data.limit, data.total)} of {data.total} applications
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
    </div>
  );
}