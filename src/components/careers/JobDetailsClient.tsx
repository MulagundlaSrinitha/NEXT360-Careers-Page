"use client";

import { useState, useCallback, useEffect } from "react";
import Link from "next/link";
import type { Job } from "./types";
import CareersNavbar from "./CareersNavbar";
import CareersFooter from "./CareersFooter";
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

function saveJobsToStorage(jobs: Set<string>) {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify([...jobs]));
  } catch {
    // Silently fail
  }
}

function formatPostedDate(dateStr: string): string {
  const d = new Date(dateStr);
  return d.toLocaleDateString("en-US", {
    month: "long",
    year: "numeric",
    day: "numeric",
  });
}

interface JobDetailsClientProps {
  job: Job;
  similarJobs: Job[];
}

export default function JobDetailsClient({ job, similarJobs }: JobDetailsClientProps) {
  const [savedJobs, setSavedJobs] = useState<Set<string>>(() => getSavedJobs());
  const [copied, setCopied] = useState(false);

  const isOpen = job.status === "Open";
  const isClosed = job.status === "Closed";
  const isPaused = job.status === "Paused";
  const isSaved = savedJobs.has(job.id);

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

  const handleShare = useCallback(async () => {
    const url = window.location.href;
    if (navigator.share) {
      try {
        await navigator.share({ title: job.title, url });
      } catch {
        // User cancelled or error
      }
    } else {
      try {
        await navigator.clipboard.writeText(url);
        setCopied(true);
      } catch {
        // Clipboard not available
      }
    }
  }, [job.title]);

  useEffect(() => {
    if (copied) {
      const timer = setTimeout(() => setCopied(false), 2000);
      return () => clearTimeout(timer);
    }
  }, [copied]);

  return (
    <>
      <CareersNavbar />
      <main className="min-h-screen bg-gray-50">
        {/* Breadcrumb */}
        <div className="bg-white border-b border-gray-100">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-3">
            <nav aria-label="Breadcrumb" className="text-sm text-gray-400">
              <ol className="flex items-center gap-1.5">
                <li>
                  <a
                    href="/careers"
                    className="hover:text-gray-600 transition-colors"
                  >
                    Careers
                  </a>
                </li>
                <li aria-hidden="true">/</li>
                <li>
                  <Link
                    href="/careers/jobs"
                    className="hover:text-gray-600 transition-colors"
                  >
                    Jobs
                  </Link>
                </li>
                <li aria-hidden="true">/</li>
                <li className="text-gray-600 font-medium truncate max-w-[200px] sm:max-w-none">
                  {job.title}
                </li>
              </ol>
            </nav>
          </div>
        </div>

        {/* Job Hero */}
        <section className="bg-white border-b border-gray-200">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
            <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-6">
              <div className="flex-1 min-w-0">
                <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold bg-green-50 text-green-primary mb-4">
                  {job.department}
                </span>
                <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-3">
                  {job.title}
                </h1>
                <p className="text-lg text-gray-600 mb-5 max-w-2xl">
                  {job.description}
                </p>
                <div className="flex flex-wrap items-center gap-x-5 gap-y-2 text-sm text-gray-500">
                  <span className="inline-flex items-center gap-1.5">
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
                        d="M15 10.5a3 3 0 11-6 0 3 3 0 016 0z"
                      />
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1115 0z"
                      />
                    </svg>
                    {job.location}
                  </span>
                  <span className="inline-flex items-center gap-1.5">
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
                        d="M20.25 14.15v4.25c0 1.094-.787 2.036-1.872 2.18-2.087.277-4.216.42-6.378.42s-4.291-.143-6.378-.42c-1.085-.144-1.872-1.086-1.872-2.18v-4.25m16.5 0a2.18 2.18 0 00.75-1.661V8.706c0-1.081-.768-2.015-1.837-2.175a48.114 48.114 0 00-3.413-.387m4.5 8.006c-.194.165-.42.295-.673.38A23.978 23.978 0 0112 15.75c-2.648 0-5.195-.429-7.577-1.22a2.016 2.016 0 01-.673-.38m0 0A2.18 2.18 0 013 12.489V8.706c0-1.081.768-2.015 1.837-2.175a48.111 48.111 0 013.413-.387m7.5 0V5.25A2.25 2.25 0 0013.5 3h-3a2.25 2.25 0 00-2.25 2.25v.894m7.5 0a48.667 48.667 0 00-7.5 0M12 12.75h.008v.008H12v-.008z"
                      />
                    </svg>
                    {job.employmentType}
                  </span>
                  <span className="inline-flex items-center gap-1.5">
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
                        d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z"
                      />
                    </svg>
                    {job.experience}
                  </span>
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded text-xs font-medium bg-gray-100 text-gray-600">
                    {job.workMode}
                  </span>
                </div>
              </div>

              {/* Desktop actions */}
              <div className="hidden lg:flex flex-col items-end gap-3 flex-shrink-0">
                {isOpen ? (
                  <a
                    href={`/careers/apply/${job.id}`}
                    className="inline-flex items-center justify-center px-6 py-3 text-base font-medium text-white bg-green-primary hover:bg-green-dark rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-green-primary focus:ring-offset-2"
                  >
                    Apply Now
                  </a>
                ) : isClosed ? (
                  <span className="inline-flex items-center justify-center px-6 py-3 text-base font-medium text-gray-500 bg-gray-100 rounded-lg cursor-not-allowed">
                    Applications closed
                  </span>
                ) : isPaused ? (
                  <span className="inline-flex items-center justify-center px-6 py-3 text-base font-medium text-amber-700 bg-amber-50 rounded-lg">
                    Applications paused
                  </span>
                ) : null}
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => handleToggleSave(job.id)}
                    className={`inline-flex items-center gap-1.5 px-4 py-2 text-sm font-medium rounded-lg border transition-colors focus:outline-none focus:ring-2 focus:ring-green-primary ${
                      isSaved
                        ? "border-red-200 text-red-600 bg-red-50 hover:bg-red-100"
                        : "border-gray-300 text-gray-600 bg-white hover:bg-gray-50"
                    }`}
                    aria-label={isSaved ? "Unsave job" : "Save job"}
                  >
                    {isSaved ? (
                      <svg
                        className="w-4 h-4"
                        fill="currentColor"
                        viewBox="0 0 24 24"
                        aria-hidden="true"
                      >
                        <path d="M11.645 20.91l-.007-.003-.022-.012a15.247 15.247 0 01-.383-.218 25.18 25.18 0 01-4.244-3.17C4.688 15.36 2.25 12.174 2.25 8.25 2.25 5.322 4.714 3 7.688 3A5.5 5.5 0 0112 5.052 5.5 5.5 0 0116.313 3c2.973 0 5.437 2.322 5.437 5.25 0 3.925-2.438 7.111-4.739 9.256a25.175 25.175 0 01-4.244 3.17 15.247 15.247 0 01-.383.219l-.022.012-.007.004-.003.001a.752.752 0 01-.704 0l-.003-.001z" />
                      </svg>
                    ) : (
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
                          d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z"
                        />
                      </svg>
                    )}
                    {isSaved ? "Saved" : "Save"}
                  </button>
                  <button
                    type="button"
                    onClick={handleShare}
                    className="inline-flex items-center gap-1.5 px-4 py-2 text-sm font-medium text-gray-600 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors focus:outline-none focus:ring-2 focus:ring-green-primary"
                    aria-label="Share job"
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
                        d="M7.217 10.907a2.25 2.25 0 100 2.186m0-2.186c.18.324.283.696.283 1.093s-.103.77-.283 1.093m0-2.186l9.566-5.314m-9.566 7.5l9.566 5.314m0 0a2.25 2.25 0 103.935 2.186 2.25 2.25 0 00-3.935-2.186zm0-12.814a2.25 2.25 0 103.933-2.185 2.25 2.25 0 00-3.933 2.185z"
                      />
                    </svg>
                    {copied ? "Copied!" : "Share"}
                  </button>
                </div>
              </div>
            </div>

            {/* Mobile actions */}
            <div className="flex lg:hidden items-center gap-3 mt-6">
              {isOpen ? (
                <a
                  href={`/careers/apply/${job.id}`}
                  className="flex-1 inline-flex items-center justify-center px-5 py-3 text-base font-medium text-white bg-green-primary hover:bg-green-dark rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-green-primary focus:ring-offset-2"
                >
                  Apply Now
                </a>
              ) : isClosed ? (
                <span className="flex-1 inline-flex items-center justify-center px-5 py-3 text-base font-medium text-gray-500 bg-gray-100 rounded-lg cursor-not-allowed">
                  Applications closed
                </span>
              ) : isPaused ? (
                <span className="flex-1 inline-flex items-center justify-center px-5 py-3 text-base font-medium text-amber-700 bg-amber-50 rounded-lg">
                  Applications paused
                </span>
              ) : null}
              <button
                type="button"
                onClick={() => handleToggleSave(job.id)}
                className={`p-3 rounded-lg border transition-colors focus:outline-none focus:ring-2 focus:ring-green-primary ${
                  isSaved
                    ? "border-red-200 text-red-600 bg-red-50"
                    : "border-gray-300 text-gray-500 bg-white hover:bg-gray-50"
                }`}
                aria-label={isSaved ? "Unsave job" : "Save job"}
              >
                {isSaved ? (
                  <svg
                    className="w-5 h-5"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                    aria-hidden="true"
                  >
                    <path d="M11.645 20.91l-.007-.003-.022-.012a15.247 15.247 0 01-.383-.218 25.18 25.18 0 01-4.244-3.17C4.688 15.36 2.25 12.174 2.25 8.25 2.25 5.322 4.714 3 7.688 3A5.5 5.5 0 0112 5.052 5.5 5.5 0 0116.313 3c2.973 0 5.437 2.322 5.437 5.25 0 3.925-2.438 7.111-4.739 9.256a25.175 25.175 0 01-4.244 3.17 15.247 15.247 0 01-.383.219l-.022.012-.007.004-.003.001a.752.752 0 01-.704 0l-.003-.001z" />
                  </svg>
                ) : (
                  <svg
                    className="w-5 h-5"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth="1.5"
                    stroke="currentColor"
                    aria-hidden="true"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z"
                    />
                  </svg>
                )}
              </button>
              <button
                type="button"
                onClick={handleShare}
                className="p-3 rounded-lg border border-gray-300 text-gray-500 bg-white hover:bg-gray-50 transition-colors focus:outline-none focus:ring-2 focus:ring-green-primary"
                aria-label="Share job"
              >
                <svg
                  className="w-5 h-5"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth="1.5"
                  stroke="currentColor"
                  aria-hidden="true"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M7.217 10.907a2.25 2.25 0 100 2.186m0-2.186c.18.324.283.696.283 1.093s-.103.77-.283 1.093m0-2.186l9.566-5.314m-9.566 7.5l9.566 5.314m0 0a2.25 2.25 0 103.935 2.186 2.25 2.25 0 00-3.935-2.186zm0-12.814a2.25 2.25 0 103.933-2.185 2.25 2.25 0 00-3.933 2.185z"
                  />
                </svg>
              </button>
            </div>
          </div>
        </section>

        {/* Main Content: Two-column layout */}
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8 sm:py-10">
          <div className="flex flex-col lg:flex-row gap-8 lg:gap-12">
            {/* Left: Main content */}
            <article className="flex-1 min-w-0 space-y-8">
              {/* About the role */}
              <section>
                <h2 className="text-xl font-semibold text-gray-900 mb-3">
                  About the role
                </h2>
                <p className="text-gray-600 leading-relaxed whitespace-pre-line">
                  {job.description}
                </p>
              </section>

              {/* Responsibilities */}
              {job.responsibilities && job.responsibilities.length > 0 && (
                <section>
                  <h2 className="text-xl font-semibold text-gray-900 mb-3">
                    What you&apos;ll do
                  </h2>
                  <ul className="space-y-2.5">
                    {job.responsibilities.map((item, i) => (
                      <li
                        key={i}
                        className="flex items-start gap-3 text-gray-600"
                      >
                        <svg
                          className="w-5 h-5 text-green-primary mt-0.5 flex-shrink-0"
                          fill="none"
                          viewBox="0 0 24 24"
                          strokeWidth="2"
                          stroke="currentColor"
                          aria-hidden="true"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M4.5 12.75l6 6 9-13.5"
                          />
                        </svg>
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </section>
              )}

              {/* Qualifications */}
              {job.qualifications && job.qualifications.length > 0 && (
                <section>
                  <h2 className="text-xl font-semibold text-gray-900 mb-3">
                    What we&apos;re looking for
                  </h2>
                  <ul className="space-y-2.5">
                    {job.qualifications.map((item, i) => (
                      <li
                        key={i}
                        className="flex items-start gap-3 text-gray-600"
                      >
                        <svg
                          className="w-4 h-4 text-gray-400 mt-1 flex-shrink-0"
                          fill="currentColor"
                          viewBox="0 0 24 24"
                          aria-hidden="true"
                        >
                          <circle cx="12" cy="12" r="4" />
                        </svg>
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </section>
              )}

              {/* Preferred Qualifications */}
              {job.preferredQualifications &&
                job.preferredQualifications.length > 0 && (
                  <section>
                    <h2 className="text-xl font-semibold text-gray-900 mb-3">
                      Nice to have
                    </h2>
                    <ul className="space-y-2.5">
                      {job.preferredQualifications.map((item, i) => (
                        <li
                          key={i}
                          className="flex items-start gap-3 text-gray-600"
                        >
                          <svg
                            className="w-4 h-4 text-gray-300 mt-1 flex-shrink-0"
                            fill="currentColor"
                            viewBox="0 0 24 24"
                            aria-hidden="true"
                          >
                            <circle cx="12" cy="12" r="4" />
                          </svg>
                          <span>{item}</span>
                        </li>
                      ))}
                    </ul>
                  </section>
                )}

              {/* Skills */}
              {job.skills && job.skills.length > 0 && (
                <section>
                  <h2 className="text-xl font-semibold text-gray-900 mb-3">
                    Skills
                  </h2>
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
                </section>
              )}

              {/* About the team */}
              {job.teamDescription && (
                <section>
                  <h2 className="text-xl font-semibold text-gray-900 mb-3">
                    About the team
                  </h2>
                  {job.team && (
                    <p className="text-sm font-medium text-green-primary mb-2">
                      {job.team}
                    </p>
                  )}
                  <p className="text-gray-600 leading-relaxed">
                    {job.teamDescription}
                  </p>
                </section>
              )}

              {/* About Next360 */}
              <section>
                <h2 className="text-xl font-semibold text-gray-900 mb-3">
                  About Next360
                </h2>
                <p className="text-gray-600 leading-relaxed">
                  Next360 Organic Products Pvt. Ltd. is building products and
                  experiences for a better everyday. We combine technology,
                  design, and operations to deliver meaningful products to our
                  customers.
                </p>
                <a
                  href="/careers"
                  className="inline-flex items-center gap-1 text-sm font-medium text-green-primary hover:text-green-dark mt-3 transition-colors"
                >
                  Learn more about Next360
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
                </a>
              </section>

              {/* Benefits */}
              {job.benefits && job.benefits.length > 0 && (
                <section>
                  <h2 className="text-xl font-semibold text-gray-900 mb-3">
                    What we offer
                  </h2>
                  <ul className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {job.benefits.map((benefit, i) => (
                      <li
                        key={i}
                        className="flex items-center gap-3 p-3 bg-white rounded-lg border border-gray-100"
                      >
                        <svg
                          className="w-5 h-5 text-green-primary flex-shrink-0"
                          fill="none"
                          viewBox="0 0 24 24"
                          strokeWidth="1.5"
                          stroke="currentColor"
                          aria-hidden="true"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M21 11.25v8.25a1.5 1.5 0 01-1.5 1.5H5.25a1.5 1.5 0 01-1.5-1.5v-8.25M12 4.875A2.625 2.625 0 109.375 7.5H12m0-2.625V7.5m0-2.625A2.625 2.625 0 1114.625 7.5H12m0 0V21m-8.625-9.75h18c.621 0 1.125-.504 1.125-1.125v-1.5c0-.621-.504-1.125-1.125-1.125h-18c-.621 0-1.125.504-1.125 1.125v1.5c0 .621.504 1.125 1.125 1.125z"
                          />
                        </svg>
                        <span className="text-sm text-gray-600">{benefit}</span>
                      </li>
                    ))}
                  </ul>
                </section>
              )}

              {/* Bottom apply CTA */}
              <section id="apply-cta" className="pt-4">
                <div className="bg-green-50 rounded-xl border border-green-primary/10 p-6 text-center">
                  <p className="text-gray-700 mb-4">
                    Interested in this role?
                  </p>
                  {isOpen ? (
                    <a
                      href={`/careers/apply/${job.id}`}
                      className="inline-flex items-center justify-center px-6 py-3 text-base font-medium text-white bg-green-primary hover:bg-green-dark rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-green-primary focus:ring-offset-2"
                    >
                      Apply Now
                    </a>
                  ) : isClosed ? (
                    <span className="inline-flex items-center justify-center px-6 py-3 text-base font-medium text-gray-500 bg-gray-100 rounded-lg cursor-not-allowed">
                      Applications closed
                    </span>
                  ) : (
                    <span className="inline-flex items-center justify-center px-6 py-3 text-base font-medium text-amber-700 bg-amber-50 rounded-lg">
                      Applications paused
                    </span>
                  )}
                </div>
              </section>
            </article>

            {/* Right: Sidebar */}
            <aside className="w-full lg:w-80 flex-shrink-0">
              <div className="lg:sticky lg:top-24 space-y-6">
                {/* Job details card */}
                <div className="bg-white rounded-xl border border-gray-200 p-6">
                  <h2 className="text-base font-semibold text-gray-900 mb-4">
                    Job details
                  </h2>
                  <dl className="space-y-4">
                    <div>
                      <dt className="text-xs font-medium text-gray-400 uppercase tracking-wider mb-1">
                        Location
                      </dt>
                      <dd className="text-sm text-gray-700">{job.location}</dd>
                    </div>
                    <div>
                      <dt className="text-xs font-medium text-gray-400 uppercase tracking-wider mb-1">
                        Employment
                      </dt>
                      <dd className="text-sm text-gray-700">
                        {job.employmentType}
                      </dd>
                    </div>
                    <div>
                      <dt className="text-xs font-medium text-gray-400 uppercase tracking-wider mb-1">
                        Experience
                      </dt>
                      <dd className="text-sm text-gray-700">
                        {job.experience}
                      </dd>
                    </div>
                    <div>
                      <dt className="text-xs font-medium text-gray-400 uppercase tracking-wider mb-1">
                        Work Mode
                      </dt>
                      <dd className="text-sm text-gray-700">{job.workMode}</dd>
                    </div>
                    <div>
                      <dt className="text-xs font-medium text-gray-400 uppercase tracking-wider mb-1">
                        Department
                      </dt>
                      <dd className="text-sm text-gray-700">
                        {job.department}
                      </dd>
                    </div>
                    {job.team && (
                      <div>
                        <dt className="text-xs font-medium text-gray-400 uppercase tracking-wider mb-1">
                          Team
                        </dt>
                        <dd className="text-sm text-gray-700">{job.team}</dd>
                      </div>
                    )}
                    <div>
                      <dt className="text-xs font-medium text-gray-400 uppercase tracking-wider mb-1">
                        Posted
                      </dt>
                      <dd className="text-sm text-gray-700">
                        {formatPostedDate(job.postedAt)}
                      </dd>
                    </div>
                  </dl>
                </div>

                {/* Sidebar apply CTA */}
                <div className="bg-white rounded-xl border border-gray-200 p-6 space-y-3">
                  {isOpen ? (
                    <a
                      href={`/careers/apply/${job.id}`}
                      className="block w-full text-center px-5 py-3 text-sm font-medium text-white bg-green-primary hover:bg-green-dark rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-green-primary focus:ring-offset-2"
                    >
                      Apply Now
                    </a>
                  ) : isClosed ? (
                    <span className="block w-full text-center px-5 py-3 text-sm font-medium text-gray-500 bg-gray-100 rounded-lg cursor-not-allowed">
                      Applications closed
                    </span>
                  ) : isPaused ? (
                    <span className="block w-full text-center px-5 py-3 text-sm font-medium text-amber-700 bg-amber-50 rounded-lg">
                      Applications paused
                    </span>
                  ) : null}
                  <button
                    type="button"
                    onClick={() => handleToggleSave(job.id)}
                    className={`w-full inline-flex items-center justify-center gap-2 px-5 py-3 text-sm font-medium rounded-lg border transition-colors focus:outline-none focus:ring-2 focus:ring-green-primary ${
                      isSaved
                        ? "border-red-200 text-red-600 bg-red-50 hover:bg-red-100"
                        : "border-gray-300 text-gray-600 bg-white hover:bg-gray-50"
                    }`}
                    aria-label={isSaved ? "Unsave job" : "Save job"}
                  >
                    {isSaved ? (
                      <svg
                        className="w-4 h-4"
                        fill="currentColor"
                        viewBox="0 0 24 24"
                        aria-hidden="true"
                      >
                        <path d="M11.645 20.91l-.007-.003-.022-.012a15.247 15.247 0 01-.383-.218 25.18 25.18 0 01-4.244-3.17C4.688 15.36 2.25 12.174 2.25 8.25 2.25 5.322 4.714 3 7.688 3A5.5 5.5 0 0112 5.052 5.5 5.5 0 0116.313 3c2.973 0 5.437 2.322 5.437 5.25 0 3.925-2.438 7.111-4.739 9.256a25.175 25.175 0 01-4.244 3.17 15.247 15.247 0 01-.383.219l-.022.012-.007.004-.003.001a.752.752 0 01-.704 0l-.003-.001z" />
                      </svg>
                    ) : (
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
                          d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z"
                        />
                      </svg>
                    )}
                    {isSaved ? "Saved" : "Save Job"}
                  </button>
                </div>
              </div>
            </aside>
          </div>
        </div>

        {/* Back to jobs */}
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 pb-4">
          <Link
            href="/careers/jobs"
            className="inline-flex items-center gap-1.5 text-sm font-medium text-gray-500 hover:text-gray-700 transition-colors"
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
            Back to jobs
          </Link>
        </div>

        {/* Similar Jobs */}
        {similarJobs.length > 0 && (
          <section className="border-t border-gray-200 bg-white">
            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-10 sm:py-14">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">
                Similar opportunities
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {similarJobs.map((sj) => (
                  <JobCard
                    key={sj.id}
                    job={sj}
                    savedJobs={savedJobs}
                    onToggleSave={handleToggleSave}
                  />
                ))}
              </div>
            </div>
          </section>
        )}

        {/* Final CTA */}
        <section className="bg-green-primary">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12 sm:py-16 text-center">
            <h2 className="text-2xl sm:text-3xl font-bold text-white mb-3">
              Don&apos;t see the right fit?
            </h2>
            <p className="text-green-100 mb-6 max-w-lg mx-auto">
              We&apos;re always looking for talented people. Explore all open
              positions or check back later.
            </p>
            <Link
              href="/careers/jobs"
              className="inline-flex items-center justify-center px-6 py-3 text-base font-medium text-green-primary bg-white hover:bg-gray-50 rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-green-primary"
            >
              View all jobs
            </Link>
          </div>
        </section>
      </main>
      <CareersFooter />
    </>
  );
}
