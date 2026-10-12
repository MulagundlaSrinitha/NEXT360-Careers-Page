"use client";

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import { usePathname, useRouter, useSearchParams } from "next/navigation";

interface CandidateRow {
  id: string;
  candidateEmail: string;
  candidateFirstName: string;
  candidateLastName: string;
  phone?: string;
  applicationCount: number;
  latestAppliedAt: string;
  latestStatus: string;
}

interface CandidateSummaryData {
  total: number;
  withApplications: number;
  multipleApplications: number;
}

interface JobOption {
  id: string;
  title: string;
  department: string;
}

interface CandidatesListData {
  candidates: CandidateRow[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
  totalCount: number;
  summary: CandidateSummaryData;
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
      <td className="px-6 py-4 hidden md:table-cell"><div className="h-4 bg-gray-200 rounded w-24 animate-pulse" /></td>
      <td className="px-6 py-4"><div className="h-4 bg-gray-200 rounded w-8 animate-pulse" /></td>
      <td className="px-6 py-4 hidden sm:table-cell"><div className="h-4 bg-gray-200 rounded w-20 animate-pulse" /></td>
      <td className="px-6 py-4"><div className="h-6 bg-gray-200 rounded-full w-20 animate-pulse" /></td>
      <td className="px-6 py-4 text-right"><div className="h-4 bg-gray-200 rounded w-24 animate-pulse ml-auto" /></td>
    </tr>
  );
}

export default function AdminCandidatesClient() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const [data, setData] = useState<CandidatesListData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  const search = searchParams.get("search") || "";
  const status = searchParams.get("status") || "";
  const jobId = searchParams.get("jobId") || "";
  const applicationCount = searchParams.get("applicationCount") || "";
  const sort = searchParams.get("sort") || "latest-desc";
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
          "applicationCount" in updates ||
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
    async function fetchCandidates() {
      setLoading(true);
      setError(false);
      try {
        const params = new URLSearchParams();
        if (search) params.set("search", search);
        if (status) params.set("status", status);
        if (jobId) params.set("jobId", jobId);
        if (applicationCount) params.set("applicationCount", applicationCount);
        if (sort) params.set("sort", sort);
        params.set("page", String(page));
        params.set("limit", "20");

        const res = await fetch(`/api/admin/careers/candidates?${params.toString()}`);
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
    void fetchCandidates();
    return () => { cancelled = true; };
  }, [search, status, jobId, applicationCount, sort, page]);

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

  const hasActiveFilters = status || jobId || applicationCount || search;
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
            <h2 className="text-xl font-semibold text-gray-900 mb-2">Unable to load candidates.</h2>
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
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">Candidates</h1>
            <p className="text-sm text-gray-500 mt-1">
              View and manage candidates who have applied for opportunities at Next360.
            </p>
          </div>
        </div>

        {/* Summary Cards */}
        {loading ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 mb-6">
            {Array.from({ length: 3 }).map((_, i) => <SkeletonCard key={i} />)}
          </div>
        ) : data ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 mb-6">
            <div className="bg-white rounded-xl border border-gray-200 p-5">
              <p className="text-sm font-medium text-gray-500">Total Candidates</p>
              <p className="text-2xl font-bold text-gray-900 mt-1">{data.summary.total}</p>
              <p className="text-xs text-gray-400 mt-1">All time</p>
            </div>

            <div className="bg-white rounded-xl border border-gray-200 p-5">
              <p className="text-sm font-medium text-gray-500">Candidates With Applications</p>
              <p className="text-2xl font-bold text-gray-900 mt-1">{data.summary.withApplications}</p>
              <p className="text-xs text-gray-400 mt-1">At least one application</p>
            </div>

            <div className="bg-white rounded-xl border border-gray-200 p-5">
              <p className="text-sm font-medium text-gray-500">Multiple Applications</p>
              <p className="text-2xl font-bold text-gray-900 mt-1">{data.summary.multipleApplications}</p>
              <p className="text-xs text-gray-400 mt-1">Two or more applications</p>
            </div>
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
                  placeholder="Search candidates by name or email..."
                  className="w-full pl-10 pr-4 py-2.5 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-primary focus:border-transparent placeholder:text-gray-400"
                  aria-label="Search candidates by name or email"
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
              aria-label="Filter by application status"
            >
              <option value="">All Statuses</option>
              {STATUS_ORDER.map((s) => (
                <option key={s} value={s}>{statusLabel(s)}</option>
              ))}
            </select>

            <select
              value={jobId}
              onChange={(e) => handleFilterChange("jobId", e.target.value)}
              className="text-sm border border-gray-300 rounded-lg px-3 py-2 text-gray-700 focus:outline-none focus:ring-2 focus:ring-green-primary focus:border-transparent bg-white"
              aria-label="Filter by job applied for"
            >
              <option value="">All Jobs</option>
              {data?.jobOptions.map((j) => (
                <option key={j.id} value={j.id}>{j.title}</option>
              ))}
            </select>

            <select
              value={applicationCount}
              onChange={(e) => handleFilterChange("applicationCount", e.target.value)}
              className="text-sm border border-gray-300 rounded-lg px-3 py-2 text-gray-700 focus:outline-none focus:ring-2 focus:ring-green-primary focus:border-transparent bg-white"
              aria-label="Filter by application count"
            >
              <option value="">All Candidates</option>
              <option value="one">One Application</option>
              <option value="multiple">Multiple Applications</option>
            </select>

            <select
              value={sort}
              onChange={(e) => handleFilterChange("sort", e.target.value)}
              className="text-sm border border-gray-300 rounded-lg px-3 py-2 text-gray-700 focus:outline-none focus:ring-2 focus:ring-green-primary focus:border-transparent bg-white"
              aria-label="Sort candidates"
            >
              <option value="latest-desc">Latest Application (Newest)</option>
              <option value="latest-asc">Latest Application (Oldest)</option>
              <option value="name-az">Candidate A–Z</option>
              <option value="name-za">Candidate Z–A</option>
              <option value="count-desc">Applications (High to Low)</option>
              <option value="count-asc">Applications (Low to High)</option>
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
                Reset Filters
              </button>
            )}
          </div>
        </div>

        {/* Candidates Table */}
        <div className="bg-white rounded-xl border border-gray-200">
          <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between">
            <h2 className="text-base font-semibold text-gray-900">
              {loading ? "Loading candidates..." : `${data?.total || 0} candidate${data?.total !== 1 ? "s" : ""}`}
            </h2>
          </div>

          {loading ? (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-100">
                    <th scope="col" className="text-left px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">Candidate</th>
                    <th scope="col" className="text-left px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider hidden md:table-cell">Phone</th>
                    <th scope="col" className="text-left px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">Applications</th>
                    <th scope="col" className="text-left px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider hidden sm:table-cell">Latest Application</th>
                    <th scope="col" className="text-left px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">Latest Status</th>
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
                <path strokeLinecap="round" strokeLinejoin="round" d="M15 19.128a9.38 9.38 0 002.625.372 9.337 9.337 0 004.121-.952 4.125 4.125 0 00-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.106A12.318 12.318 0 018.624 21c-2.331 0-4.512-.645-6.374-1.766l-.001-.109a6.375 6.375 0 0111.964-3.07M12 6.375a3.375 3.375 0 11-6.75 0 3.375 3.375 0 016.75 0zm8.25 2.25a2.625 2.625 0 11-5.25 0 2.625 2.625 0 015.25 0z" />
              </svg>
              <h3 className="text-lg font-semibold text-gray-900 mb-1">No candidates found yet</h3>
              <p className="text-sm text-gray-500 mb-6">Candidates derived from applications submitted through the Careers website will appear here.</p>
              <Link
                href="/admin/careers/applications"
                className="inline-flex items-center justify-center px-5 py-2.5 text-sm font-medium text-white bg-green-primary hover:bg-green-dark rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-green-primary focus:ring-offset-2"
              >
                View Applications
              </Link>
            </div>
          ) : data && data.candidates.length === 0 ? (
            <div className="text-center py-16">
              <svg className="w-12 h-12 mx-auto text-gray-300 mb-3" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" aria-hidden="true">
                <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" />
              </svg>
              <h3 className="text-lg font-semibold text-gray-900 mb-1">No candidates found</h3>
              <p className="text-sm text-gray-500 mb-6">No candidates match your current search or filters.</p>
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
                      <th scope="col" className="text-left px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">Phone</th>
                      <th scope="col" className="text-left px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">Applications</th>
                      <th scope="col" className="text-left px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">Latest Application</th>
                      <th scope="col" className="text-left px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">Latest Status</th>
                      <th scope="col" className="text-right px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-50">
                    {data.candidates.map((candidate) => (
                      <tr key={candidate.id} className="hover:bg-gray-50/50 transition-colors">
                        <td className="px-6 py-3.5">
                          <p className="text-sm font-medium text-gray-900">
                            {candidate.candidateFirstName} {candidate.candidateLastName}
                          </p>
                          <p className="text-xs text-gray-400 mt-0.5 break-all">{candidate.candidateEmail}</p>
                        </td>
                        <td className="px-6 py-3.5">
                          <span className="text-sm text-gray-500">{candidate.phone || "—"}</span>
                        </td>
                        <td className="px-6 py-3.5">
                          <span className="text-sm font-medium text-gray-900">{candidate.applicationCount}</span>
                        </td>
                        <td className="px-6 py-3.5">
                          <span className="text-sm text-gray-500">{formatDate(candidate.latestAppliedAt)}</span>
                        </td>
                        <td className="px-6 py-3.5">
                          <ApplicationStatusBadge status={candidate.latestStatus} />
                        </td>
                        <td className="px-6 py-3.5 text-right whitespace-nowrap">
                          <Link
                            href={`/admin/careers/candidates/${candidate.id}`}
                            className="text-sm font-medium text-green-primary hover:text-green-dark transition-colors"
                          >
                            View Candidate
                          </Link>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Mobile cards */}
              <div className="md:hidden divide-y divide-gray-100">
                {data.candidates.map((candidate) => (
                  <div key={candidate.id} className="px-6 py-4">
                    <div className="flex items-start justify-between gap-3 mb-2">
                      <div className="min-w-0">
                        <p className="text-sm font-medium text-gray-900">
                          {candidate.candidateFirstName} {candidate.candidateLastName}
                        </p>
                        <p className="text-xs text-gray-400 mt-0.5 break-all">{candidate.candidateEmail}</p>
                      </div>
                      <ApplicationStatusBadge status={candidate.latestStatus} />
                    </div>
                    {candidate.phone && (
                      <p className="text-sm text-gray-500 mb-0.5">Phone: {candidate.phone}</p>
                    )}
                    <div className="flex items-center justify-between mt-2">
                      <span className="text-xs text-gray-400">
                        {candidate.applicationCount} application{candidate.applicationCount !== 1 ? "s" : ""} · Latest {formatDate(candidate.latestAppliedAt)}
                      </span>
                      <Link
                        href={`/admin/careers/candidates/${candidate.id}`}
                        className="text-sm font-medium text-green-primary hover:text-green-dark transition-colors"
                      >
                        View Candidate
                      </Link>
                    </div>
                  </div>
                ))}
              </div>

              {/* Pagination */}
              {data.totalPages > 1 && (
                <div className="px-6 py-4 border-t border-gray-100 flex items-center justify-between gap-3 flex-wrap">
                  <p className="text-sm text-gray-500">
                    Showing {((data.page - 1) * data.limit) + 1}–{Math.min(data.page * data.limit, data.total)} of {data.total} candidates
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