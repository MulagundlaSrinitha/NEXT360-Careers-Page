"use client";

import { useState, useMemo, useEffect } from "react";
import Link from "next/link";
import type { Job } from "./types";
import JobCard from "./JobCard";

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

export default function EarlyCurrentOpportunities() {
  const [savedJobs, setSavedJobs] = useState<Set<string>>(() => getSavedJobs());
  const [filter, setFilter] = useState<"all" | "internship" | "entry-level">(
    "all"
  );
  const [jobs, setJobs] = useState<Job[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    async function loadJobs() {
      try {
        const res = await fetch("/api/careers/jobs");
        if (!res.ok) throw new Error("Failed");
        const json = await res.json();
        if (!cancelled) {
          setJobs(Array.isArray(json.jobs) ? json.jobs : []);
        }
      } catch {
        if (!cancelled) {
          setJobs([]);
        }
      } finally {
        if (!cancelled) {
          setIsLoading(false);
        }
      }
    }
    void loadJobs();
    return () => {
      cancelled = true;
    };
  }, []);

  const earlyCareerJobs = useMemo(() => {
    return jobs.filter((job) => {
      if (job.status !== "Open") return false;
      return (
        job.experience === "Internship" || job.experience === "0-2 years"
      );
    });
  }, [jobs]);

  const filteredJobs = useMemo(() => {
    if (filter === "all") return earlyCareerJobs;
    if (filter === "internship")
      return earlyCareerJobs.filter((j) => j.experience === "Internship");
    return earlyCareerJobs.filter((j) => j.experience === "0-2 years");
  }, [earlyCareerJobs, filter]);

  const handleToggleSave = (jobId: string) => {
    setSavedJobs((prev) => {
      const next = new Set(prev);
      if (next.has(jobId)) {
        next.delete(jobId);
      } else {
        next.add(jobId);
      }
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify([...next]));
      } catch {
        // Silently fail
      }
      return next;
    });
  };

  return (
    <section className="bg-white border-t border-gray-100" id="current-opportunities">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-16 sm:py-20">
        <div className="max-w-2xl mx-auto text-center mb-12">
          <p className="text-sm font-semibold tracking-wider text-green-primary uppercase mb-3">
            Current Opportunities
          </p>
          <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
            Find your first opportunity.
          </h2>
          <p className="text-lg text-gray-600">
            Explore current openings that may be relevant to students, recent
            graduates, interns, and entry-level candidates.
          </p>
        </div>

        {isLoading ? (
          <div className="space-y-4">
            {Array.from({ length: 3 }).map((_, i) => (
              <div key={i} className="h-40 bg-gray-200 rounded-xl animate-pulse" />
            ))}
          </div>
        ) : earlyCareerJobs.length > 0 ? (
          <>
            {/* Filter tabs */}
            <div className="flex flex-wrap items-center gap-2 mb-6">
              <button
                type="button"
                onClick={() => setFilter("all")}
                className={`px-4 py-2 text-sm font-medium rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-green-primary ${
                  filter === "all"
                    ? "bg-green-primary text-white"
                    : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                }`}
              >
                All ({earlyCareerJobs.length})
              </button>
              <button
                type="button"
                onClick={() => setFilter("entry-level")}
                className={`px-4 py-2 text-sm font-medium rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-green-primary ${
                  filter === "entry-level"
                    ? "bg-green-primary text-white"
                    : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                }`}
              >
                Entry-Level (
                {
                  earlyCareerJobs.filter((j) => j.experience === "0-2 years")
                    .length
                }
                )
              </button>
              <button
                type="button"
                onClick={() => setFilter("internship")}
                className={`px-4 py-2 text-sm font-medium rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-green-primary ${
                  filter === "internship"
                    ? "bg-green-primary text-white"
                    : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                }`}
              >
                Internships (
                {
                  earlyCareerJobs.filter((j) => j.experience === "Internship")
                    .length
                }
                )
              </button>
            </div>

            {/* Job cards */}
            <div className="space-y-4">
              {filteredJobs.map((job) => (
                <JobCard
                  key={job.id}
                  job={job}
                  savedJobs={savedJobs}
                  onToggleSave={handleToggleSave}
                />
              ))}
            </div>

            <div className="mt-8 text-center">
              <Link
                href="/careers/jobs"
                className="inline-flex items-center gap-1.5 text-sm font-medium text-green-primary hover:text-green-dark transition-colors"
              >
                View all open roles
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
                    d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3"
                  />
                </svg>
              </Link>
            </div>
          </>
        ) : (
          <div className="text-center py-12 bg-gray-50 rounded-xl border border-gray-200">
            <div className="w-12 h-12 mx-auto mb-4 rounded-full bg-gray-100 flex items-center justify-center">
              <svg
                className="w-6 h-6 text-gray-400"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth="1.5"
                stroke="currentColor"
                aria-hidden="true"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M20.25 14.15v4.25c0 1.094-.787 2.036-1.872 2.18-2.087.277-4.216.42-6.378.42s-4.291-.143-6.378-.42c-1.085-.144-1.872-1.086-1.872-2.18v-4.25m16.5 0a2.18 2.18 0 00.75-1.661V8.706c0-1.081-.768-2.015-1.837-2.175a48.114 48.114 0 00-3.413-.387m4.5 8.006c-.194.165-.42.295-.673.38A23.978 23.978 0 0112 15.75c-2.648 0-5.195-.429-7.577-1.22a2.016 2.016 0 01-.673-.38m0 0A2.18 2.18 0 013 12.489V8.706c0-1.081.768-2.015 1.837-2.175a48.111 48.111 0 013.413-.387m7.5 0V5.25A2.25 2.25 0 0013.5 3h-3a2.25 2.25 0 00-2.25 2.25v.894m7.5 0a48.667 48.667 0 00-7.5 0M12 12.75h.008v.008H12v-.008z"
                />
              </svg>
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-1">
              No early-career roles are available right now.
            </h3>
            <p className="text-sm text-gray-500 mb-4">
              Check back later or explore all current opportunities.
            </p>
            <Link
              href="/careers/jobs"
              className="inline-flex items-center justify-center px-5 py-2.5 text-sm font-medium text-white bg-green-primary hover:bg-green-dark rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-green-primary focus:ring-offset-2"
            >
              View All Jobs
            </Link>
          </div>
        )}
      </div>
    </section>
  );
}
