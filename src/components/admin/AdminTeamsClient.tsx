"use client";

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import { usePathname, useRouter, useSearchParams } from "next/navigation";

interface TeamRow {
  slug: string;
  name: string;
  description: string;
  departments: string[];
  jobCount: number;
  applicationCount: number;
}

interface TeamSummaryData {
  total: number;
  withJobs: number;
  totalJobs: number;
}

interface TeamsListData {
  teams: TeamRow[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
  totalCount: number;
  summary: TeamSummaryData;
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
      <td className="px-6 py-4 hidden xl:table-cell"><div className="h-4 bg-gray-200 rounded w-56 animate-pulse" /></td>
      <td className="px-6 py-4"><div className="h-4 bg-gray-200 rounded w-16 animate-pulse" /></td>
      <td className="px-6 py-4"><div className="h-4 bg-gray-200 rounded w-16 animate-pulse" /></td>
      <td className="px-6 py-4 text-right"><div className="h-4 bg-gray-200 rounded w-32 animate-pulse ml-auto" /></td>
    </tr>
  );
}

const inputClass =
  "w-full text-sm border border-gray-300 rounded-lg px-3 py-2 text-gray-700 focus:outline-none focus:ring-2 focus:ring-green-primary focus:border-transparent bg-white";

export default function AdminTeamsClient() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const [data, setData] = useState<TeamsListData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [reloadKey, setReloadKey] = useState(0);

  const search = searchParams.get("search") || "";
  const jobs = searchParams.get("jobs") || "";
  const sort = searchParams.get("sort") || "name-az";
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
          "jobs" in updates ||
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
    async function fetchTeams() {
      setLoading(true);
      setError(false);
      try {
        const params = new URLSearchParams();
        if (search) params.set("search", search);
        if (jobs) params.set("jobs", jobs);
        if (sort) params.set("sort", sort);
        params.set("page", String(page));
        params.set("limit", "20");

        const res = await fetch(`/api/admin/careers/teams?${params.toString()}`);
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
    void fetchTeams();
    return () => {
      cancelled = true;
    };
  }, [search, jobs, sort, page, reloadKey]);

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

  const hasActiveFilters = Boolean(jobs || search);
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
            <h2 className="text-xl font-semibold text-gray-900 mb-2">Unable to load teams.</h2>
            <p className="text-gray-500 mb-6">Please try again.</p>
            <button
              type="button"
              onClick={() => { setError(false); setLoading(true); setReloadKey((k) => k + 1); }}
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
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">Teams Management</h1>
            <p className="text-sm text-gray-500 mt-1">
              Manage the teams associated with recruitment and Careers opportunities.
            </p>
          </div>
          <Link
            href="/careers/teams"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center justify-center gap-2 px-4 py-2.5 text-sm font-medium text-gray-700 bg-white border border-gray-300 hover:border-gray-400 hover:bg-gray-50 rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-green-primary focus:ring-offset-2 flex-shrink-0"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" aria-hidden="true">
              <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 6H5.25A2.25 2.25 0 003 8.25v10.5A2.25 2.25 0 005.25 21h10.5A2.25 2.25 0 0018 18.75V10.5m-10.5 6L21 3m0 0h-5.25M21 3v5.25" />
            </svg>
            View Public Teams
          </Link>
        </div>

        {/* Summary Cards */}
        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
            {Array.from({ length: 3 }).map((_, i) => <SkeletonCard key={i} />)}
          </div>
        ) : data ? (
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
            <button
              type="button"
              onClick={() => handleFilterChange("jobs", "")}
              className={`bg-white rounded-xl border p-5 text-left transition-colors ${!jobs ? "border-green-primary ring-1 ring-green-primary" : "border-gray-200 hover:border-gray-300"}`}
            >
              <p className="text-sm font-medium text-gray-500">Total Teams</p>
              <p className="text-2xl font-bold text-gray-900 mt-1">{data.summary.total}</p>
              <p className="text-xs text-gray-400 mt-1">Across Careers</p>
            </button>

            <button
              type="button"
              onClick={() => handleFilterChange("jobs", jobs === "with" ? "" : "with")}
              className={`bg-white rounded-xl border p-5 text-left transition-colors ${jobs === "with" ? "border-green-primary ring-1 ring-green-primary" : "border-gray-200 hover:border-gray-300"}`}
            >
              <p className="text-sm font-medium text-gray-500">Teams With Active Jobs</p>
              <p className="text-2xl font-bold text-gray-900 mt-1">{data.summary.withJobs}</p>
              <p className="text-xs text-gray-400 mt-1">Have open roles</p>
            </button>

            <div className="bg-white rounded-xl border border-gray-200 p-5 text-left">
              <p className="text-sm font-medium text-gray-500">Associated Job Listings</p>
              <p className="text-2xl font-bold text-gray-900 mt-1">{data.summary.totalJobs}</p>
              <p className="text-xs text-gray-400 mt-1">Open roles across teams</p>
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
                  placeholder="Search teams by name or description..."
                  className="w-full pl-10 pr-4 py-2.5 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-primary focus:border-transparent placeholder:text-gray-400"
                  aria-label="Search teams"
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
              <label htmlFor="filter-jobs" className="block text-xs font-medium text-gray-400 uppercase tracking-wider mb-1">
                Jobs
              </label>
              <select
                id="filter-jobs"
                value={jobs}
                onChange={(e) => handleFilterChange("jobs", e.target.value)}
                className={inputClass}
              >
                <option value="">All Teams</option>
                <option value="with">Teams With Jobs</option>
                <option value="without">Teams Without Jobs</option>
              </select>
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
                <option value="name-az">Team Name A–Z</option>
                <option value="name-za">Team Name Z–A</option>
                <option value="jobs-desc">Most Jobs</option>
                <option value="jobs-asc">Fewest Jobs</option>
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

        {/* Teams Table */}
        <div className="bg-white rounded-xl border border-gray-200">
          <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between">
            <h2 className="text-base font-semibold text-gray-900">
              {loading ? "Loading teams..." : `${data?.total || 0} team${data?.total !== 1 ? "s" : ""}`}
            </h2>
          </div>

          {loading ? (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-100">
                    <th scope="col" className="text-left px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">Team</th>
                    <th scope="col" className="text-left px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider hidden xl:table-cell">Description</th>
                    <th scope="col" className="text-left px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">Associated Jobs</th>
                    <th scope="col" className="text-left px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">Applications</th>
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
                <path strokeLinecap="round" strokeLinejoin="round" d="M15 19.128a9.38 9.38 0 002.625.372 9.337 9.337 0 004.121-.952 4.125 4.125 0 00-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.106A12.318 12.318 0 018.624 21c-2.331 0-4.512-.645-6.374-1.766l-.001-.109a6.375 6.375 0 0111.964-3.07M12 6.375a3.375 3.375 0 11-6.75 0 3.375 3.375 0 016.75 0zm8.25 2.25a2.625 2.625 0 11-5.25 0 2.625 2.625 0 015.25 0z" />
              </svg>
              <h3 className="text-lg font-semibold text-gray-900 mb-1">No teams found</h3>
              <p className="text-sm text-gray-500">
                Teams will appear here when they are available in the Careers system.
              </p>
            </div>
          ) : data && data.teams.length === 0 ? (
            <div className="text-center py-16">
              <svg className="w-12 h-12 mx-auto text-gray-300 mb-3" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" aria-hidden="true">
                <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" />
              </svg>
              <h3 className="text-lg font-semibold text-gray-900 mb-1">No teams found</h3>
              <p className="text-sm text-gray-500 mb-6">No teams match your current search or filters.</p>
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
                      <th scope="col" className="text-left px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">Team</th>
                      <th scope="col" className="text-left px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider hidden xl:table-cell">Description</th>
                      <th scope="col" className="text-left px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">Associated Jobs</th>
                      <th scope="col" className="text-left px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">Applications</th>
                      <th scope="col" className="text-right px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-50">
                    {data.teams.map((row) => (
                      <tr key={row.slug} className="hover:bg-gray-50/50 transition-colors">
                        <td className="px-6 py-3.5">
                          <Link
                            href={`/careers/teams/${row.slug}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-sm font-medium text-gray-900 hover:text-green-primary transition-colors"
                          >
                            {row.name}
                          </Link>
                          <p className="text-xs text-gray-400 mt-0.5">
                            {row.departments.join(", ")}
                          </p>
                        </td>
                        <td className="px-6 py-3.5 hidden xl:table-cell max-w-xs">
                          <p className="text-sm text-gray-600 line-clamp-2">{row.description}</p>
                        </td>
                        <td className="px-6 py-3.5">
                          {row.jobCount > 0 ? (
                            <Link
                              href={`/admin/careers/jobs?department=${encodeURIComponent(row.departments[0] || "")}`}
                              className="text-sm text-green-primary hover:text-green-dark transition-colors"
                            >
                              {row.jobCount} open role{row.jobCount === 1 ? "" : "s"}
                            </Link>
                          ) : (
                            <span className="text-sm text-gray-400">No open roles</span>
                          )}
                        </td>
                        <td className="px-6 py-3.5">
                          <span className="text-sm text-gray-700">{row.applicationCount}</span>
                        </td>
                        <td className="px-6 py-3.5 text-right whitespace-nowrap">
                          <div className="inline-flex items-center gap-3">
                            <Link
                              href={`/careers/teams/${row.slug}`}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-sm font-medium text-green-primary hover:text-green-dark transition-colors"
                            >
                              View Public Page
                            </Link>
                            <Link
                              href={`/admin/careers/jobs?department=${encodeURIComponent(row.departments[0] || "")}`}
                              className="text-sm font-medium text-gray-600 hover:text-gray-800 transition-colors"
                            >
                              View Jobs
                            </Link>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Mobile cards */}
              <div className="md:hidden divide-y divide-gray-100">
                {data.teams.map((row) => (
                  <div key={row.slug} className="px-6 py-4">
                    <div className="flex items-start justify-between gap-3 mb-1">
                      <Link
                        href={`/careers/teams/${row.slug}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-sm font-medium text-gray-900"
                      >
                        {row.name}
                      </Link>
                    </div>
                    <p className="text-xs text-gray-400">{row.departments.join(", ")}</p>
                    <p className="text-sm text-gray-600 mt-2">{row.description}</p>
                    <div className="flex flex-wrap gap-x-4 gap-y-1 mt-3 text-sm">
                      <span className="text-gray-700">
                        {row.jobCount > 0
                          ? `${row.jobCount} open role${row.jobCount === 1 ? "" : "s"}`
                          : "No open roles"}
                      </span>
                      <span className="text-gray-500">
                        {row.applicationCount} application{row.applicationCount === 1 ? "" : "s"}
                      </span>
                    </div>
                    <div className="flex flex-wrap items-center gap-3 mt-3">
                      <Link
                        href={`/careers/teams/${row.slug}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-sm font-medium text-green-primary hover:text-green-dark transition-colors"
                      >
                        View Public Page
                      </Link>
                      <Link
                        href={`/admin/careers/jobs?department=${encodeURIComponent(row.departments[0] || "")}`}
                        className="text-sm font-medium text-gray-600 hover:text-gray-800 transition-colors"
                      >
                        View Jobs
                      </Link>
                    </div>
                  </div>
                ))}
              </div>

              {/* Pagination */}
              {data.totalPages > 1 && (
                <div className="px-6 py-4 border-t border-gray-100 flex items-center justify-between gap-3 flex-wrap">
                  <p className="text-sm text-gray-500">
                    Showing {((data.page - 1) * data.limit) + 1}–{Math.min(data.page * data.limit, data.total)} of {data.total} teams
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
