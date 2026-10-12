"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import CareersNavbar from "./CareersNavbar";
import CareersFooter from "./CareersFooter";
import ApplicationCard from "./ApplicationCard";
import {
  getCandidateEmail,
  setCandidateEmail,
  getApplicationsForCandidate,
  clearCandidateEmail,
} from "./mock-applications";
import type { StoredApplication } from "./mock-applications";

type FilterStatus = "all" | string;

function getInitialState(): {
  email: string | null;
  apps: StoredApplication[];
} {
  const email = getCandidateEmail();
  const apps = email ? getApplicationsForCandidate(email) : [];
  return { email, apps };
}

export default function MyApplicationsClient() {
  const [initialState] = useState(getInitialState);
  const [candidateEmail, setLocalEmail] = useState<string | null>(
    initialState.email
  );
  const [applications, setApplications] = useState<StoredApplication[]>(
    initialState.apps
  );
  const [filter, setFilter] = useState<FilterStatus>("all");

  const filteredApplications = useMemo(() => {
    if (filter === "all") return applications;
    return applications.filter((app) => app.status === filter);
  }, [applications, filter]);

  const uniqueStatuses = useMemo(() => {
    const statuses = new Set(applications.map((a) => a.status));
    return ["all", ...Array.from(statuses)];
  }, [applications]);

  const handleSignIn = () => {
    const email = prompt("Enter your email address to view your applications:");
    if (email && email.trim()) {
      setCandidateEmail(email.trim());
      setLocalEmail(email.trim());
      const apps = getApplicationsForCandidate(email.trim());
      setApplications(apps);
    }
  };

  const handleSignOut = () => {
    clearCandidateEmail();
    setLocalEmail(null);
    setApplications([]);
  };

  if (!candidateEmail) {
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
                  <li className="text-gray-600 font-medium">
                    My Applications
                  </li>
                </ol>
              </nav>
            </div>
          </div>

          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-16 sm:py-20">
            <div className="max-w-md mx-auto text-center">
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
                    d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z"
                  />
                </svg>
              </div>
              <h1 className="text-2xl font-bold text-gray-900 mb-2">
                Sign in to view your applications
              </h1>
              <p className="text-gray-500 mb-6">
                Your applications are available after you sign in.
              </p>
              <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
                <button
                  type="button"
                  onClick={handleSignIn}
                  className="inline-flex items-center justify-center px-6 py-3 text-base font-medium text-white bg-green-primary hover:bg-green-dark rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-green-primary focus:ring-offset-2"
                >
                  Sign In
                </button>
                <Link
                  href="/careers/jobs"
                  className="inline-flex items-center justify-center px-6 py-3 text-base font-medium text-gray-700 bg-white border border-gray-300 hover:bg-gray-50 rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-green-primary focus:ring-offset-2"
                >
                  Browse Jobs
                </Link>
              </div>
            </div>
          </div>
        </main>
        <CareersFooter />
      </>
    );
  }

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
                  <Link
                    href="/careers"
                    className="hover:text-gray-600 transition-colors"
                  >
                    Careers
                  </Link>
                </li>
                <li aria-hidden="true">/</li>
                <li className="text-gray-600 font-medium">My Applications</li>
              </ol>
            </nav>
          </div>
        </div>

        {/* Page Header */}
        <section className="bg-white border-b border-gray-200">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8 sm:py-10">
            <p className="text-sm font-semibold tracking-wider text-green-primary uppercase mb-3">
              My Applications
            </p>
            <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-2">
              Track your applications
            </h1>
            <p className="text-lg text-gray-600 max-w-2xl">
              View the roles you&apos;ve applied for and keep track of your
              application progress.
            </p>
          </div>
        </section>

        {/* Application Summary */}
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-6">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
            <div className="bg-white rounded-xl border border-gray-200 p-5">
              <p className="text-sm text-gray-500 mb-1">Total Applications</p>
              <p className="text-2xl font-bold text-gray-900">
                {applications.length}
              </p>
            </div>
            <div className="bg-white rounded-xl border border-gray-200 p-5">
              <p className="text-sm text-gray-500 mb-1">Signed in as</p>
              <p className="text-sm font-medium text-gray-900 truncate">
                {candidateEmail}
              </p>
            </div>
            <div className="bg-white rounded-xl border border-gray-200 p-5 flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500 mb-1">Account</p>
                <p className="text-sm font-medium text-gray-900">
                  Candidate
                </p>
              </div>
              <button
                type="button"
                onClick={handleSignOut}
                className="text-sm text-gray-400 hover:text-red-500 transition-colors"
              >
                Sign out
              </button>
            </div>
          </div>

          {/* Filters */}
          <div className="flex flex-wrap items-center gap-3 mb-6">
            <span className="text-sm font-medium text-gray-700">
              Filter by status:
            </span>
            {uniqueStatuses.map((status) => (
              <button
                key={status}
                type="button"
                onClick={() => setFilter(status)}
                className={`px-3 py-1.5 text-sm font-medium rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-green-primary ${
                  filter === status
                    ? "bg-green-primary text-white"
                    : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                }`}
              >
                {status === "all"
                  ? "All"
                  : status.replace(/_/g, " ").replace(/\b\w/g, (l) => l.toUpperCase())}
              </button>
            ))}
          </div>

          {/* Applications List */}
          {filteredApplications.length > 0 ? (
            <div className="space-y-4">
              {filteredApplications.map((app) => (
                <ApplicationCard key={app.id} application={app} />
              ))}
            </div>
          ) : applications.length === 0 ? (
            /* Empty State */
            <div className="text-center py-16 bg-white rounded-xl border border-gray-200">
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
                    d="M20.25 14.15v4.25c0 1.094-.787 2.036-1.872 2.18-2.087.277-4.216.42-6.378.42s-4.291-.143-6.378-.42c-1.085-.144-1.872-1.086-1.872-2.18v-4.25m16.5 0a2.18 2.18 0 00.75-1.661V8.706c0-1.081-.768-2.015-1.837-2.175a48.114 48.114 0 00-3.413-.387m4.5 8.006c-.194.165-.42.295-.673.38A23.978 23.978 0 0112 15.75c-2.648 0-5.195-.429-7.577-1.22a2.016 2.016 0 01-.673-.38m0 0A2.18 2.18 0 013 12.489V8.706c0-1.081.768-2.015 1.837-2.175a48.111 48.111 0 013.413-.387m7.5 0V5.25A2.25 2.25 0 0013.5 3h-3a2.25 2.25 0 00-2.25 2.25v.894m7.5 0a48.667 48.667 0 00-7.5 0M12 12.75h.008v.008H12v-.008z"
                  />
                </svg>
                <h2 className="text-lg font-semibold text-gray-900 mb-1">
                  You haven&apos;t applied to any roles yet
                </h2>
                <p className="text-gray-500 mb-6">
                  Explore current opportunities and find a role that matches
                  your skills and interests.
                </p>
                <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
                  <Link
                    href="/careers/jobs"
                    className="inline-flex items-center justify-center px-5 py-2.5 text-sm font-medium text-white bg-green-primary hover:bg-green-dark rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-green-primary focus:ring-offset-2"
                  >
                    Browse Jobs
                  </Link>
                  <Link
                    href="/careers"
                    className="inline-flex items-center justify-center px-5 py-2.5 text-sm font-medium text-gray-700 bg-white border border-gray-300 hover:bg-gray-50 rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-green-primary focus:ring-offset-2"
                  >
                    Back to Careers
                  </Link>
                </div>
              </div>
            </div>
          ) : (
            /* No Results */
            <div className="text-center py-12 bg-white rounded-xl border border-gray-200">
              <p className="text-gray-500 mb-4">
                No applications match your filters.
              </p>
              <button
                type="button"
                onClick={() => setFilter("all")}
                className="text-sm font-medium text-green-primary hover:text-green-dark transition-colors"
              >
                Clear Filters
              </button>
            </div>
          )}
        </div>

        {/* Helpful Message */}
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 pb-8">
          <div className="bg-gray-50 rounded-xl border border-gray-200 p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-2">
              Looking for another opportunity?
            </h2>
            <p className="text-gray-600 mb-4">
              Explore current openings and find a role that matches your
              experience.
            </p>
            <Link
              href="/careers/jobs"
              className="inline-flex items-center justify-center px-5 py-2.5 text-sm font-medium text-white bg-green-primary hover:bg-green-dark rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-green-primary focus:ring-offset-2"
            >
              Browse Jobs
            </Link>
          </div>
        </div>

        {/* Final CTA */}
        <section className="bg-green-primary">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-16 sm:py-20 text-center">
            <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">
              Keep exploring
            </h2>
            <p className="text-lg text-green-100 mb-8 max-w-2xl mx-auto">
              New opportunities may become available over time.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link
                href="/careers/jobs"
                className="inline-flex items-center justify-center px-6 py-3 text-base font-medium text-green-primary bg-white hover:bg-gray-50 rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-green-primary"
              >
                View Open Jobs
              </Link>
              <Link
                href="/careers"
                className="inline-flex items-center justify-center px-6 py-3 text-base font-medium text-white hover:text-green-100 transition-colors"
              >
                Back to Careers
              </Link>
            </div>
          </div>
        </section>
      </main>
      <CareersFooter />
    </>
  );
}
