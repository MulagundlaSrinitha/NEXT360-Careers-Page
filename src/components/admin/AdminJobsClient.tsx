"use client";

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import { usePathname, useRouter, useSearchParams } from "next/navigation";

interface AdminJob {
  id: string;
  title: string;
  department: string;
  location: string;
  experience: string;
  employmentType: string;
  workMode: string;
  team: string;
  status: string;
  postedAt: string;
}

interface JobsListData {
  jobs: AdminJob[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
  totalCount: number;
  statusCounts: Record<string, number>;
}

const JOB_STATUS_STYLES: Record<string, { bg: string; text: string; dot: string }> = {
  Open: { bg: "bg-green-50", text: "text-green-700", dot: "bg-green-500" },
  Draft: { bg: "bg-gray-100", text: "text-gray-600", dot: "bg-gray-400" },
  Closed: { bg: "bg-red-50", text: "text-red-600", dot: "bg-red-400" },
  Paused: { bg: "bg-amber-50", text: "text-amber-700", dot: "bg-amber-500" },
};

function formatDate(iso: string): string {
  const d = new Date(iso);
  return d.toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" });
}

function JobStatusBadge({ status }: { status: string }) {
  const style = JOB_STATUS_STYLES[status] || JOB_STATUS_STYLES.Open;
  return (
    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium ${style.bg} ${style.text}`}>
      <span className={`w-1.5 h-1.5 rounded-full ${style.dot}`} aria-hidden="true" />
      {status}
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
      <td className="px-6 py-4 hidden lg:table-cell"><div className="h-4 bg-gray-200 rounded w-24 animate-pulse" /></td>
      <td className="px-6 py-4 hidden md:table-cell"><div className="h-4 bg-gray-200 rounded w-24 animate-pulse" /></td>
      <td className="px-6 py-4 hidden lg:table-cell"><div className="h-4 bg-gray-200 rounded w-20 animate-pulse" /></td>
      <td className="px-6 py-4 hidden xl:table-cell"><div className="h-4 bg-gray-200 rounded w-16 animate-pulse" /></td>
      <td className="px-6 py-4"><div className="h-6 bg-gray-200 rounded-full w-16 animate-pulse" /></td>
      <td className="px-6 py-4 hidden sm:table-cell"><div className="h-4 bg-gray-200 rounded w-20 animate-pulse" /></td>
      <td className="px-6 py-4 text-right"><div className="h-4 bg-gray-200 rounded w-12 animate-pulse ml-auto" /></td>
    </tr>
  );
}

export default function AdminJobsClient() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const [data, setData] = useState<JobsListData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  const search = searchParams.get("search") || "";
  const status = searchParams.get("status") || "";
  const department = searchParams.get("department") || "";
  const location = searchParams.get("location") || "";
  const employmentType = searchParams.get("employmentType") || "";
  const workMode = searchParams.get("workMode") || "";
  const sort = searchParams.get("sort") || "newest";
  const page = parseInt(searchParams.get("page") || "1", 10);

  const [searchInput, setSearchInput] = useState(search);
  const [actionMenuOpen, setActionMenuOpen] = useState<string | null>(null);

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
      if ("page" in updates) {
        // page changed, keep as-is
      } else if ("search" in updates || "status" in updates || "department" in updates || "location" in updates || "employmentType" in updates || "workMode" in updates || "sort" in updates) {
        params.delete("page");
      }
      return params.toString();
    },
    [searchParams]
  );

  useEffect(() => {
    let cancelled = false;
    async function fetchJobs() {
      try {
        const params = new URLSearchParams();
        if (search) params.set("search", search);
        if (status) params.set("status", status);
        if (department) params.set("department", department);
        if (location) params.set("location", location);
        if (employmentType) params.set("employmentType", employmentType);
        if (workMode) params.set("workMode", workMode);
        if (sort) params.set("sort", sort);
        params.set("page", String(page));
        params.set("limit", "20");

        const res = await fetch(`/api/admin/careers/jobs?${params.toString()}`);
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
    void fetchJobs();
    return () => { cancelled = true; };
  }, [search, status, department, location, employmentType, workMode, sort, page]);

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

  function toggleActionMenu(id: string) {
    setActionMenuOpen((prev) => (prev === id ? null : id));
  }

  const hasActiveFilters = status || department || location || employmentType || workMode || search;

  const statusOptions = data?.statusCounts ? Object.entries(data.statusCounts) : [];

  const departments = [
    "Technology", "Product", "Operations", "Marketing", "Sales", "Finance", "Human Resources",
  ];
  const locations = ["Hyderabad", "Bengaluru", "Mumbai", "Chennai", "Delhi", "Remote"];
  const employmentTypes = ["Full Time", "Part Time", "Internship", "Contract"];
  const workModes = ["On-site", "Hybrid", "Remote"];

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
            <h2 className="text-xl font-semibold text-gray-900 mb-2">Unable to load jobs</h2>
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
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">Jobs</h1>
            <p className="text-sm text-gray-500 mt-1">
              Create, manage, and monitor Next360 job postings.
            </p>
          </div>
          <Link
            href="/admin/careers/jobs/create"
            className="inline-flex items-center justify-center gap-2 px-4 py-2.5 text-sm font-medium text-white bg-green-primary hover:bg-green-dark rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-green-primary focus:ring-offset-2 flex-shrink-0"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor" aria-hidden="true">
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
            </svg>
            Create Job
          </Link>
        </div>

        {/* KPI Strip */}
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
              <p className="text-sm font-medium text-gray-500">Total Jobs</p>
              <p className="text-2xl font-bold text-gray-900 mt-1">{data.totalCount}</p>
            </button>
            {statusOptions.map(([s, count]) => (
              <button
                key={s}
                type="button"
                onClick={() => handleFilterChange("status", status === s ? "" : s)}
                className={`bg-white rounded-xl border p-5 text-left transition-colors ${status === s ? "border-green-primary ring-1 ring-green-primary" : "border-gray-200 hover:border-gray-300"}`}
              >
                <p className="text-sm font-medium text-gray-500">{s}</p>
                <p className="text-2xl font-bold text-gray-900 mt-1">{count}</p>
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
                  placeholder="Search jobs by title, department, location, or keyword..."
                  className="w-full pl-10 pr-4 py-2.5 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-primary focus:border-transparent placeholder:text-gray-400"
                  aria-label="Search jobs"
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
              value={department}
              onChange={(e) => handleFilterChange("department", e.target.value)}
              className="text-sm border border-gray-300 rounded-lg px-3 py-2 text-gray-700 focus:outline-none focus:ring-2 focus:ring-green-primary focus:border-transparent bg-white"
              aria-label="Filter by department"
            >
              <option value="">All Departments</option>
              {departments.map((d) => <option key={d} value={d}>{d}</option>)}
            </select>

            <select
              value={location}
              onChange={(e) => handleFilterChange("location", e.target.value)}
              className="text-sm border border-gray-300 rounded-lg px-3 py-2 text-gray-700 focus:outline-none focus:ring-2 focus:ring-green-primary focus:border-transparent bg-white"
              aria-label="Filter by location"
            >
              <option value="">All Locations</option>
              {locations.map((l) => <option key={l} value={l}>{l}</option>)}
            </select>

            <select
              value={employmentType}
              onChange={(e) => handleFilterChange("employmentType", e.target.value)}
              className="text-sm border border-gray-300 rounded-lg px-3 py-2 text-gray-700 focus:outline-none focus:ring-2 focus:ring-green-primary focus:border-transparent bg-white"
              aria-label="Filter by employment type"
            >
              <option value="">All Types</option>
              {employmentTypes.map((t) => <option key={t} value={t}>{t}</option>)}
            </select>

            <select
              value={workMode}
              onChange={(e) => handleFilterChange("workMode", e.target.value)}
              className="text-sm border border-gray-300 rounded-lg px-3 py-2 text-gray-700 focus:outline-none focus:ring-2 focus:ring-green-primary focus:border-transparent bg-white"
              aria-label="Filter by work mode"
            >
              <option value="">All Work Modes</option>
              {workModes.map((m) => <option key={m} value={m}>{m}</option>)}
            </select>

            <select
              value={sort}
              onChange={(e) => handleFilterChange("sort", e.target.value)}
              className="text-sm border border-gray-300 rounded-lg px-3 py-2 text-gray-700 focus:outline-none focus:ring-2 focus:ring-green-primary focus:border-transparent bg-white"
              aria-label="Sort jobs"
            >
              <option value="newest">Newest First</option>
              <option value="oldest">Oldest First</option>
              <option value="title-az">Title A–Z</option>
              <option value="title-za">Title Z–A</option>
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

        {/* Jobs Table */}
        <div className="bg-white rounded-xl border border-gray-200">
          <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between">
            <h2 className="text-base font-semibold text-gray-900">
              {loading ? "Loading jobs..." : `${data?.total || 0} job${data?.total !== 1 ? "s" : ""}`}
            </h2>
          </div>

          {loading ? (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-100">
                    <th className="text-left px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">Job</th>
                    <th className="text-left px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider hidden lg:table-cell">Department</th>
                    <th className="text-left px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider hidden md:table-cell">Location</th>
                    <th className="text-left px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider hidden lg:table-cell">Type</th>
                    <th className="text-left px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider hidden xl:table-cell">Work Mode</th>
                    <th className="text-left px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                    <th className="text-left px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider hidden sm:table-cell">Posted</th>
                    <th className="text-right px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {Array.from({ length: 8 }).map((_, i) => <SkeletonRow key={i} />)}
                </tbody>
              </table>
            </div>
          ) : data && data.jobs.length === 0 ? (
            <div className="text-center py-16">
              {hasActiveFilters ? (
                <>
                  <svg className="w-12 h-12 mx-auto text-gray-300 mb-3" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" aria-hidden="true">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" />
                  </svg>
                  <h3 className="text-lg font-semibold text-gray-900 mb-1">No jobs found</h3>
                  <p className="text-sm text-gray-500 mb-6">Try adjusting your search or filters.</p>
                  <button
                    type="button"
                    onClick={clearFilters}
                    className="inline-flex items-center justify-center px-4 py-2.5 text-sm font-medium text-gray-700 bg-white border border-gray-300 hover:border-gray-400 hover:bg-gray-50 rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-green-primary focus:ring-offset-2"
                  >
                    Clear Filters
                  </button>
                </>
              ) : (
                <>
                  <svg className="w-12 h-12 mx-auto text-gray-300 mb-3" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" aria-hidden="true">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M20.25 14.15v4.25c0 1.094-.787 2.036-1.872 2.18-2.087.277-4.216.42-6.378.42s-4.291-.143-6.378-.42c-1.085-.144-1.872-1.086-1.872-2.18v-4.25m16.5 0a2.18 2.18 0 00.75-1.661V8.706c0-1.081-.768-2.015-1.837-2.175a48.114 48.114 0 00-3.413-.387m4.5 8.006c-.194.165-.42.295-.673.38A23.978 23.978 0 0112 15.75c-2.648 0-5.195-.429-7.577-1.22a2.016 2.016 0 01-.673-.38m0 0A2.18 2.18 0 013 12.489V8.706c0-1.081.768-2.015 1.837-2.175a48.111 48.111 0 013.413-.387m7.5 0V5.25A2.25 2.25 0 0013.5 3h-3a2.25 2.25 0 00-2.25 2.25v.894m7.5 0a48.667 48.667 0 00-7.5 0M12 12.75h.008v.008H12v-.008z" />
                  </svg>
                  <h3 className="text-lg font-semibold text-gray-900 mb-1">No jobs yet</h3>
                  <p className="text-sm text-gray-500 mb-6">Create your first job posting to start hiring.</p>
                  <Link
                    href="/admin/careers/jobs/create"
                    className="inline-flex items-center gap-2 px-5 py-2.5 text-sm font-medium text-white bg-green-primary hover:bg-green-dark rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-green-primary focus:ring-offset-2"
                  >
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor" aria-hidden="true">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
                    </svg>
                    Create Job
                  </Link>
                </>
              )}
            </div>
          ) : data ? (
            <>
              {/* Desktop table */}
              <div className="hidden md:block overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-gray-100">
                      <th className="text-left px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">Job</th>
                      <th className="text-left px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider hidden lg:table-cell">Department</th>
                      <th className="text-left px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider hidden md:table-cell">Location</th>
                      <th className="text-left px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider hidden lg:table-cell">Type</th>
                      <th className="text-left px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider hidden xl:table-cell">Work Mode</th>
                      <th className="text-left px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                      <th className="text-left px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider hidden sm:table-cell">Posted</th>
                      <th className="text-right px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-50">
                    {data.jobs.map((job) => (
                      <tr key={job.id} className="hover:bg-gray-50/50 transition-colors">
                        <td className="px-6 py-3.5">
                          <Link
                            href={`/admin/careers/jobs/${job.id}`}
                            className="text-sm font-medium text-gray-900 hover:text-green-primary transition-colors"
                          >
                            {job.title}
                          </Link>
                          {job.team && (
                            <p className="text-xs text-gray-400 mt-0.5">{job.team}</p>
                          )}
                        </td>
                        <td className="px-6 py-3.5 hidden lg:table-cell">
                          <span className="text-sm text-gray-700">{job.department}</span>
                        </td>
                        <td className="px-6 py-3.5 hidden md:table-cell">
                          <span className="text-sm text-gray-700">{job.location}</span>
                        </td>
                        <td className="px-6 py-3.5 hidden lg:table-cell">
                          <span className="text-sm text-gray-700">{job.employmentType}</span>
                        </td>
                        <td className="px-6 py-3.5 hidden xl:table-cell">
                          <span className="text-sm text-gray-700">{job.workMode}</span>
                        </td>
                        <td className="px-6 py-3.5">
                          <JobStatusBadge status={job.status} />
                        </td>
                        <td className="px-6 py-3.5 hidden sm:table-cell">
                          <span className="text-sm text-gray-500">{formatDate(job.postedAt)}</span>
                        </td>
                        <td className="px-6 py-3.5 text-right">
                          <div className="relative inline-block">
                            <button
                              type="button"
                              onClick={() => toggleActionMenu(job.id)}
                              className="inline-flex items-center justify-center w-8 h-8 rounded-lg text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition-colors focus:outline-none focus:ring-2 focus:ring-green-primary"
                              aria-label={`Actions for ${job.title}`}
                              aria-expanded={actionMenuOpen === job.id}
                            >
                              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" aria-hidden="true">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M12 6.75a.75.75 0 110-1.5.75.75 0 010 1.5zM12 12.75a.75.75 0 110-1.5.75.75 0 010 1.5zM12 18.75a.75.75 0 110-1.5.75.75 0 010 1.5z" />
                              </svg>
                            </button>
                            {actionMenuOpen === job.id && (
                              <>
                                <div
                                  className="fixed inset-0 z-10"
                                  onClick={() => setActionMenuOpen(null)}
                                  aria-hidden="true"
                                />
                                <div className="absolute right-0 z-20 mt-1 w-40 bg-white border border-gray-200 rounded-lg shadow-lg py-1">
                                  <Link
                                    href={`/admin/careers/jobs/${job.id}`}
                                    className="flex items-center gap-2 px-3 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                                    onClick={() => setActionMenuOpen(null)}
                                  >
                                    <svg className="w-4 h-4 text-gray-400" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" aria-hidden="true">
                                      <path strokeLinecap="round" strokeLinejoin="round" d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z" />
                                      <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                    </svg>
                                    View
                                  </Link>
                                  <Link
                                    href={`/admin/careers/jobs/${job.id}/edit`}
                                    className="flex items-center gap-2 px-3 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                                    onClick={() => setActionMenuOpen(null)}
                                  >
                                    <svg className="w-4 h-4 text-gray-400" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" aria-hidden="true">
                                      <path strokeLinecap="round" strokeLinejoin="round" d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0115.75 21H5.25A2.25 2.25 0 013 18.75V8.25A2.25 2.25 0 015.25 6H10" />
                                    </svg>
                                    Edit
                                  </Link>
                                </div>
                              </>
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
                {data.jobs.map((job) => (
                  <div key={job.id} className="px-6 py-4">
                    <div className="flex items-start justify-between gap-3 mb-2">
                      <div className="min-w-0">
                        <Link
                          href={`/admin/careers/jobs/${job.id}`}
                          className="text-sm font-medium text-gray-900 hover:text-green-primary transition-colors"
                        >
                          {job.title}
                        </Link>
                        <p className="text-xs text-gray-400 mt-0.5">{job.department} · {job.location}</p>
                      </div>
                      <JobStatusBadge status={job.status} />
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-xs text-gray-400">{job.employmentType} · {job.workMode}</span>
                      <Link
                        href={`/admin/careers/jobs/${job.id}`}
                        className="text-sm font-medium text-green-primary hover:text-green-dark transition-colors"
                      >
                        View
                      </Link>
                    </div>
                  </div>
                ))}
              </div>

              {/* Pagination */}
              {data.totalPages > 1 && (
                <div className="px-6 py-4 border-t border-gray-100 flex items-center justify-between">
                  <p className="text-sm text-gray-500">
                    Showing {((data.page - 1) * data.limit) + 1}–{Math.min(data.page * data.limit, data.total)} of {data.total} jobs
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
