"use client";

import { useState, useCallback, useMemo, useEffect } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import type { Job, JobFilters, SortOption } from "./types";
import { mockJobs } from "./mock-jobs";
import CareersNavbar from "./CareersNavbar";
import CareersFooter from "./CareersFooter";
import JobSearchBar from "./JobSearchBar";
import JobFiltersSidebar from "./JobFiltersSidebar";
import MobileFilterDrawer from "./MobileFilterDrawer";
import ActiveFilters from "./ActiveFilters";
import JobSort from "./JobSort";
import JobCard from "./JobCard";
import Pagination from "./Pagination";
import JobSkeletons from "./JobSkeleton";
import JobsEmptyState from "./JobsEmptyState";
import JobsErrorState from "./JobsErrorState";

const ITEMS_PER_PAGE = 10;
const STORAGE_KEY = "next360_saved_jobs";

function getSavedJobs(): Set<string> {
  if (typeof window === "undefined") return new Set();
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    return saved ? new Set(JSON.parse(saved)) : new Set();
  } catch {
    return new Set();
  }
}

function saveJobsToStorage(jobs: Set<string>) {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify([...jobs]));
  } catch {
    // Silently fail if localStorage is unavailable
  }
}

function parseFilters(searchParams: URLSearchParams): JobFilters {
  return {
    search: searchParams.get("search") || "",
    department: searchParams.getAll("department"),
    location: searchParams.getAll("location"),
    experience: searchParams.getAll("experience"),
    employmentType: searchParams.getAll("employmentType"),
    workMode: searchParams.getAll("workMode"),
    skills: searchParams.getAll("skills"),
  };
}

function buildQueryString(filters: JobFilters, sort: SortOption, page: number): string {
  const params = new URLSearchParams();
  if (filters.search) params.set("search", filters.search);
  filters.department.forEach((v) => params.append("department", v));
  filters.location.forEach((v) => params.append("location", v));
  filters.experience.forEach((v) => params.append("experience", v));
  filters.employmentType.forEach((v) => params.append("employmentType", v));
  filters.workMode.forEach((v) => params.append("workMode", v));
  filters.skills.forEach((v) => params.append("skills", v));
  if (sort !== "relevance") params.set("sort", sort);
  if (page > 1) params.set("page", String(page));
  return params.toString();
}

function filterJobs(jobs: Job[], filters: JobFilters): Job[] {
  return jobs.filter((job) => {
    if (filters.search) {
      const q = filters.search.toLowerCase();
      const match =
        job.title.toLowerCase().includes(q) ||
        job.department.toLowerCase().includes(q) ||
        job.skills.some((s) => s.toLowerCase().includes(q)) ||
        job.description.toLowerCase().includes(q);
      if (!match) return false;
    }
    if (filters.department.length > 0 && !filters.department.includes(job.department)) return false;
    if (filters.location.length > 0 && !filters.location.includes(job.location)) return false;
    if (filters.experience.length > 0 && !filters.experience.includes(job.experience)) return false;
    if (filters.employmentType.length > 0 && !filters.employmentType.includes(job.employmentType)) return false;
    if (filters.workMode.length > 0 && !filters.workMode.includes(job.workMode)) return false;
    if (filters.skills.length > 0 && !filters.skills.some((s) => job.skills.includes(s))) return false;
    return true;
  });
}

function sortJobs(jobs: Job[], sort: SortOption): Job[] {
  const sorted = [...jobs];
  switch (sort) {
    case "newest":
      return sorted.sort((a, b) => new Date(b.postedAt).getTime() - new Date(a.postedAt).getTime());
    case "oldest":
      return sorted.sort((a, b) => new Date(a.postedAt).getTime() - new Date(b.postedAt).getTime());
    case "title-az":
      return sorted.sort((a, b) => a.title.localeCompare(b.title));
    case "relevance":
    default:
      return sorted;
  }
}

export default function JobsPageClient() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [filters, setFilters] = useState<JobFilters>(() => parseFilters(searchParams));
  const [sort, setSort] = useState<SortOption>((searchParams.get("sort") as SortOption) || "relevance");
  const [page, setPage] = useState(() => {
    const p = searchParams.get("page");
    return p ? parseInt(p, 10) : 1;
  });
  const [savedJobs, setSavedJobs] = useState<Set<string>>(() => getSavedJobs());
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);
  const [isLoading] = useState(false);
  const [hasError] = useState(false);

  // Update URL when filters change
  useEffect(() => {
    const qs = buildQueryString(filters, sort, page);
    const url = qs ? `/careers/jobs?${qs}` : "/careers/jobs";
    router.replace(url, { scroll: false });
  }, [filters, sort, page, router]);

  const handleToggleSave = useCallback((jobId: string) => {
    setSavedJobs((prev) => {
      const next = new Set(prev);
      if (next.has(jobId)) {
        next.delete(jobId);
      } else {
        next.add(jobId);
      }
      saveJobsToStorage(next);
      return next;
    });
  }, []);

  const handleSearch = useCallback((query: string) => {
    setFilters((prev) => ({ ...prev, search: query }));
    setPage(1);
  }, []);

  const handleFilterChange = useCallback((newFilters: JobFilters) => {
    setFilters(newFilters);
    setPage(1);
  }, []);

  const handleRemoveFilter = useCallback((category: string, value: string) => {
    setFilters((prev) => ({
      ...prev,
      [category]: (prev[category as keyof JobFilters] as string[]).filter((v) => v !== value),
    }));
    setPage(1);
  }, []);

  const handleClearAll = useCallback(() => {
    setFilters({ search: "", department: [], location: [], experience: [], employmentType: [], workMode: [], skills: [] });
    setPage(1);
  }, []);

  const handleSortChange = useCallback((newSort: SortOption) => {
    setSort(newSort);
    setPage(1);
  }, []);

  const handleRetry = useCallback(() => {
    window.location.reload();
  }, []);

  // Compute filtered and sorted results
  const filteredJobs = useMemo(() => {
    const filtered = filterJobs(mockJobs, filters);
    return sortJobs(filtered, sort);
  }, [filters, sort]);

  const totalPages = Math.ceil(filteredJobs.length / ITEMS_PER_PAGE);
  const paginatedJobs = filteredJobs.slice((page - 1) * ITEMS_PER_PAGE, page * ITEMS_PER_PAGE);

  // Build active filter chips
  const activeFilters = useMemo(() => {
    const chips: { category: string; value: string }[] = [];
    filters.department.forEach((v) => chips.push({ category: "department", value: v }));
    filters.location.forEach((v) => chips.push({ category: "location", value: v }));
    filters.experience.forEach((v) => chips.push({ category: "experience", value: v }));
    filters.employmentType.forEach((v) => chips.push({ category: "employmentType", value: v }));
    filters.workMode.forEach((v) => chips.push({ category: "workMode", value: v }));
    filters.skills.forEach((v) => chips.push({ category: "skills", value: v }));
    return chips;
  }, [filters]);

  return (
    <>
      <CareersNavbar />
      <main className="min-h-screen bg-gray-50">
        {/* Page Header */}
        <section className="bg-white border-b border-gray-200">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-10 sm:py-14">
            <p className="text-sm font-semibold tracking-wider text-green-primary uppercase mb-3">
              Careers
            </p>
            <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-3">
              Find your next opportunity.
            </h1>
            <p className="text-lg text-gray-600 max-w-2xl mb-6">
              Explore open roles across Next360 and find an opportunity that
              matches your skills, experience, and interests.
            </p>
            <div className="max-w-2xl">
              <JobSearchBar onSearch={handleSearch} initialQuery={filters.search} />
            </div>
            <div className="mt-4 flex items-center justify-between gap-4">
              <p className="text-sm text-gray-500">
                <span className="font-semibold text-gray-900">{filteredJobs.length}</span>{" "}
                {filteredJobs.length === 1 ? "opportunity" : "opportunities"}
              </p>
              <Link
                href="/careers/jobs/saved"
                className="text-sm font-medium text-green-primary hover:text-green-dark transition-colors"
              >
                Saved Jobs{savedJobs.size > 0 ? ` (${savedJobs.size})` : ""}
              </Link>
            </div>
          </div>
        </section>

        {/* Mobile filter/sort buttons */}
        <div className="lg:hidden border-b border-gray-200 bg-white">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 py-3 flex gap-3">
            <button
              type="button"
              onClick={() => setMobileFiltersOpen(true)}
              className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors focus:outline-none focus:ring-2 focus:ring-green-primary"
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" aria-hidden="true">
                <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 6h9.75M10.5 6a1.5 1.5 0 11-3 0m3 0a1.5 1.5 0 10-3 0M3.75 6H7.5m3 12h9.75m-9.75 0a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m-3.75 0H7.5m9-6h3.75m-3.75 0a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m-9.75 0h9.75" />
              </svg>
              Filters
              {activeFilters.length > 0 && (
                <span className="w-5 h-5 rounded-full bg-green-primary text-white text-xs flex items-center justify-center">
                  {activeFilters.length}
                </span>
              )}
            </button>
            <JobSort value={sort} onChange={handleSortChange} />
          </div>
        </div>

        {/* Active Filters */}
        {activeFilters.length > 0 && (
          <div className="border-b border-gray-200 bg-white">
            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-3">
              <ActiveFilters
                filters={activeFilters}
                onRemove={handleRemoveFilter}
                onClearAll={handleClearAll}
              />
            </div>
          </div>
        )}

        {/* Main Content */}
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex gap-8">
            {/* Desktop Sidebar */}
            <div className="hidden lg:block">
              <JobFiltersSidebar filters={filters} onFilterChange={handleFilterChange} />
            </div>

            {/* Results */}
            <div className="flex-1 min-w-0">
              {/* Results header */}
              <div className="hidden lg:flex items-center justify-between mb-4">
                <p className="text-sm text-gray-500">
                  <span className="font-semibold text-gray-900">{filteredJobs.length}</span>{" "}
                  {filteredJobs.length === 1 ? "job" : "jobs"}
                </p>
                <JobSort value={sort} onChange={handleSortChange} />
              </div>

              {/* Content */}
              {isLoading ? (
                <JobSkeletons />
              ) : hasError ? (
                <JobsErrorState onRetry={handleRetry} />
              ) : paginatedJobs.length === 0 ? (
                <JobsEmptyState onClearFilters={handleClearAll} />
              ) : (
                <>
                  <div className="space-y-4">
                    {paginatedJobs.map((job) => (
                      <JobCard
                        key={job.id}
                        job={job}
                        savedJobs={savedJobs}
                        onToggleSave={handleToggleSave}
                      />
                    ))}
                  </div>

                  <div className="mt-8">
                    <Pagination
                      currentPage={page}
                      totalPages={totalPages}
                      onPageChange={setPage}
                    />
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      </main>

      <CareersFooter />

      {/* Mobile Filter Drawer */}
      <MobileFilterDrawer
        isOpen={mobileFiltersOpen}
        filters={filters}
        onFilterChange={handleFilterChange}
        onClose={() => setMobileFiltersOpen(false)}
        onClearAll={handleClearAll}
      />
    </>
  );
}
