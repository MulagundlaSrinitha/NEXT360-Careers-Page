"use client";

import { useState, useCallback } from "react";
import Link from "next/link";
import CareersNavbar from "./CareersNavbar";
import CareersFooter from "./CareersFooter";
import {
  getCandidateEmail,
  setCandidateEmail,
  clearCandidateEmail,
  getApplicationForCandidate,
  APPLICATION_STATUS_LABELS,
  APPLICATION_STATUS_COLORS,
  APPLICATION_QUESTIONS,
} from "./mock-applications";
import type { StoredApplication, ApplicationStatus } from "./mock-applications";

type PageState = "loading" | "unauthenticated" | "not_found" | "error" | "ready";

interface ApplicationDetailsClientProps {
  applicationId: string;
}

function formatAppliedDate(dateStr: string): string {
  const date = new Date(dateStr);
  return date.toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
  });
}

function LoadingSkeleton() {
  return (
    <>
      <CareersNavbar />
      <main className="min-h-screen bg-gray-50">
        <div className="bg-white border-b border-gray-100">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-3">
            <div className="h-4 w-48 bg-gray-100 rounded animate-pulse" />
          </div>
        </div>
        <section className="bg-white border-b border-gray-200">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8 sm:py-10">
            <div className="h-3 w-20 bg-gray-100 rounded animate-pulse mb-3" />
            <div className="h-8 w-72 bg-gray-100 rounded animate-pulse mb-2" />
            <div className="h-5 w-48 bg-gray-100 rounded animate-pulse mb-4" />
            <div className="h-4 w-64 bg-gray-100 rounded animate-pulse" />
          </div>
        </section>
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8 sm:py-10">
          <div className="flex flex-col lg:flex-row gap-8 lg:gap-12">
            <div className="flex-1 min-w-0 space-y-6">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="bg-white rounded-xl border border-gray-200 p-6">
                  <div className="h-5 w-40 bg-gray-100 rounded animate-pulse mb-4" />
                  <div className="space-y-3">
                    <div className="h-4 w-full bg-gray-50 rounded animate-pulse" />
                    <div className="h-4 w-3/4 bg-gray-50 rounded animate-pulse" />
                    <div className="h-4 w-1/2 bg-gray-50 rounded animate-pulse" />
                  </div>
                </div>
              ))}
            </div>
            <aside className="w-full lg:w-80 flex-shrink-0">
              <div className="bg-white rounded-xl border border-gray-200 p-6">
                <div className="h-5 w-32 bg-gray-100 rounded animate-pulse mb-4" />
                <div className="space-y-3">
                  <div className="h-4 w-full bg-gray-50 rounded animate-pulse" />
                  <div className="h-4 w-3/4 bg-gray-50 rounded animate-pulse" />
                </div>
              </div>
            </aside>
          </div>
        </div>
      </main>
      <CareersFooter />
    </>
  );
}

function SignInGate({ onSignIn }: { onSignIn: () => void }) {
  return (
    <>
      <CareersNavbar />
      <main className="min-h-screen bg-gray-50">
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
                <li>
                  <Link
                    href="/careers/applications"
                    className="hover:text-gray-600 transition-colors"
                  >
                    My Applications
                  </Link>
                </li>
                <li aria-hidden="true">/</li>
                <li className="text-gray-600 font-medium">Application Details</li>
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
              Sign in to view your application.
            </h1>
            <p className="text-gray-500 mb-6">
              Your application details are available after you sign in.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
              <button
                type="button"
                onClick={onSignIn}
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

function NotFoundState() {
  return (
    <>
      <CareersNavbar />
      <main className="min-h-screen bg-gray-50">
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
                <li>
                  <Link
                    href="/careers/applications"
                    className="hover:text-gray-600 transition-colors"
                  >
                    My Applications
                  </Link>
                </li>
                <li aria-hidden="true">/</li>
                <li className="text-gray-600 font-medium">Application Details</li>
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
                  d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z"
                />
              </svg>
            </div>
            <h1 className="text-2xl font-bold text-gray-900 mb-2">
              Application not found.
            </h1>
            <p className="text-gray-500 mb-6">
              We couldn&apos;t find the application you&apos;re looking for.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
              <Link
                href="/careers/applications"
                className="inline-flex items-center justify-center px-5 py-2.5 text-sm font-medium text-white bg-green-primary hover:bg-green-dark rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-green-primary focus:ring-offset-2"
              >
                Back to My Applications
              </Link>
              <Link
                href="/careers/jobs"
                className="inline-flex items-center justify-center px-5 py-2.5 text-sm font-medium text-gray-700 bg-white border border-gray-300 hover:bg-gray-50 rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-green-primary focus:ring-offset-2"
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

function ErrorState({ onRetry }: { onRetry: () => void }) {
  return (
    <>
      <CareersNavbar />
      <main className="min-h-screen bg-gray-50">
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
                <li>
                  <Link
                    href="/careers/applications"
                    className="hover:text-gray-600 transition-colors"
                  >
                    My Applications
                  </Link>
                </li>
                <li aria-hidden="true">/</li>
                <li className="text-gray-600 font-medium">Application Details</li>
              </ol>
            </nav>
          </div>
        </div>
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-16 sm:py-20">
          <div className="max-w-md mx-auto text-center">
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
            <h1 className="text-2xl font-bold text-gray-900 mb-2">
              Unable to load this application.
            </h1>
            <p className="text-gray-500 mb-6">
              Something went wrong while loading the application details.
            </p>
            <button
              type="button"
              onClick={onRetry}
              className="inline-flex items-center justify-center px-5 py-2.5 text-sm font-medium text-white bg-green-primary hover:bg-green-dark rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-green-primary focus:ring-offset-2"
            >
              Try Again
            </button>
          </div>
        </div>
      </main>
      <CareersFooter />
    </>
  );
}

function getInitialState(applicationId: string): {
  pageState: PageState;
  application: StoredApplication | null;
} {
  if (typeof window === "undefined") {
    return { pageState: "loading", application: null };
  }

  const email = getCandidateEmail();
  if (!email) {
    return { pageState: "unauthenticated", application: null };
  }

  const app = getApplicationForCandidate(applicationId, email);
  if (!app) {
    return { pageState: "not_found", application: null };
  }

  return { pageState: "ready", application: app };
}

export default function ApplicationDetailsClient({
  applicationId,
}: ApplicationDetailsClientProps) {
  const [initialData] = useState(() => getInitialState(applicationId));
  const [pageState, setPageState] = useState<PageState>(initialData.pageState);
  const [application, setApplication] = useState<StoredApplication | null>(
    initialData.application
  );

  const reloadApplication = useCallback(() => {
    const email = getCandidateEmail();
    if (!email) {
      setPageState("unauthenticated");
      setApplication(null);
      return;
    }

    const app = getApplicationForCandidate(applicationId, email);
    if (!app) {
      setPageState("not_found");
      setApplication(null);
      return;
    }

    setApplication(app);
    setPageState("ready");
  }, [applicationId]);

  const handleSignIn = () => {
    const email = prompt("Enter your email address to view your application:");
    if (email && email.trim()) {
      setCandidateEmail(email.trim());
      const app = getApplicationForCandidate(applicationId, email.trim());
      if (app) {
        setApplication(app);
        setPageState("ready");
      } else {
        setPageState("not_found");
      }
    }
  };

  const handleSignOut = () => {
    clearCandidateEmail();
    setApplication(null);
    setPageState("unauthenticated");
  };

  if (pageState === "loading") {
    return <LoadingSkeleton />;
  }

  if (pageState === "unauthenticated") {
    return <SignInGate onSignIn={handleSignIn} />;
  }

  if (pageState === "not_found" || pageState === "error") {
    return pageState === "error" ? (
      <ErrorState onRetry={reloadApplication} />
    ) : (
      <NotFoundState />
    );
  }

  if (!application) {
    return <NotFoundState />;
  }

  const statusLabel =
    APPLICATION_STATUS_LABELS[application.status as ApplicationStatus] ||
    application.status;
  const statusColors =
    APPLICATION_STATUS_COLORS[application.status as ApplicationStatus] || {
      bg: "bg-gray-100",
      text: "text-gray-700",
      dot: "bg-gray-400",
    };

  const hasPhone = !!application.phone;
  const hasCurrentLocation = !!application.currentLocation;
  const hasCountry = !!application.country;
  const hasProfessionalInfo =
    application.currentJobTitle || application.currentCompany || application.experienceLevel || application.yearsOfExperience;
  const hasEducation = application.education && application.education.length > 0;
  const hasResume = !!application.resumeFileName;
  const hasLinks =
    application.linkedinUrl ||
    application.githubUrl ||
    application.portfolioUrl ||
    application.otherWebsite;
  const hasAdditionalAnswers =
    application.additionalAnswers &&
    Object.keys(application.additionalAnswers).length > 0;

  const educationEntries = (application.education || []).filter(
    (e) => e.qualification || e.institution || e.fieldOfStudy || e.graduationYear
  );

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
                <li>
                  <Link
                    href="/careers/applications"
                    className="hover:text-gray-600 transition-colors"
                  >
                    My Applications
                  </Link>
                </li>
                <li aria-hidden="true">/</li>
                <li className="text-gray-600 font-medium">Application Details</li>
              </ol>
            </nav>
          </div>
        </div>

        {/* Application Header */}
        <section className="bg-white border-b border-gray-200">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8 sm:py-10">
            <p className="text-sm font-semibold tracking-wider text-green-primary uppercase mb-3">
              Application Details
            </p>
            <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-2">
              {application.jobTitle}
            </h1>
            <div className="flex flex-wrap items-center gap-x-5 gap-y-2 text-sm text-gray-500 mb-4">
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
                    d="M3.75 21h16.5M4.5 3h15M5.25 3v18m13.5-18v18M9 6.75h1.5m-1.5 3h1.5m-1.5 3h1.5m3-6H15m-1.5 3H15m-1.5 3H15M9 21v-3.375c0-.621.504-1.125 1.125-1.125h3.75c.621 0 1.125.504 1.125 1.125V21"
                  />
                </svg>
                {application.department}
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
                    d="M15 10.5a3 3 0 11-6 0 3 3 0 016 0z"
                  />
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1115 0z"
                  />
                </svg>
                {application.location}
              </span>
            </div>
            <p className="text-sm text-gray-500">
              Applied on {formatAppliedDate(application.appliedAt)}
            </p>
          </div>
        </section>

        {/* Application Status */}
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-6">
          <div className="bg-white rounded-xl border border-gray-200 p-5 sm:p-6 mb-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-500 mb-1">Status</p>
                <span
                  className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm font-medium ${statusColors.bg} ${statusColors.text}`}
                >
                  <span
                    className={`w-2 h-2 rounded-full ${statusColors.dot}`}
                    aria-hidden="true"
                  />
                  {statusLabel}
                </span>
              </div>
              <div className="text-right">
                <p className="text-xs text-gray-400">Application ID</p>
                <p className="text-xs font-mono text-gray-500">{application.id}</p>
              </div>
            </div>
          </div>

          {/* Two-column layout */}
          <div className="flex flex-col lg:flex-row gap-8 lg:gap-12">
            {/* Main Column */}
            <div className="flex-1 min-w-0 space-y-6">
              {/* Application Information */}
              <section className="bg-white rounded-xl border border-gray-200 p-6">
                <h2 className="text-lg font-semibold text-gray-900 mb-4 pb-2 border-b border-gray-200">
                  Application Information
                </h2>
                <dl className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <dt className="text-xs font-medium text-gray-400 uppercase tracking-wider mb-0.5">
                      Applied on
                    </dt>
                    <dd className="text-sm text-gray-700">
                      {formatAppliedDate(application.appliedAt)}
                    </dd>
                  </div>
                  <div>
                    <dt className="text-xs font-medium text-gray-400 uppercase tracking-wider mb-0.5">
                      Status
                    </dt>
                    <dd className="text-sm text-gray-700">{statusLabel}</dd>
                  </div>
                  <div>
                    <dt className="text-xs font-medium text-gray-400 uppercase tracking-wider mb-0.5">
                      Application ID
                    </dt>
                    <dd className="text-sm font-mono text-gray-700">
                      {application.id}
                    </dd>
                  </div>
                  <div>
                    <dt className="text-xs font-medium text-gray-400 uppercase tracking-wider mb-0.5">
                      Position
                    </dt>
                    <dd className="text-sm text-gray-700">
                      {application.jobTitle}
                    </dd>
                  </div>
                </dl>
              </section>

              {/* Candidate Information */}
              <section className="bg-white rounded-xl border border-gray-200 p-6">
                <h2 className="text-lg font-semibold text-gray-900 mb-4 pb-2 border-b border-gray-200">
                  Your Information
                </h2>
                <dl className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <dt className="text-xs font-medium text-gray-400 uppercase tracking-wider mb-0.5">
                      First name
                    </dt>
                    <dd className="text-sm text-gray-700">
                      {application.candidateFirstName}
                    </dd>
                  </div>
                  <div>
                    <dt className="text-xs font-medium text-gray-400 uppercase tracking-wider mb-0.5">
                      Last name
                    </dt>
                    <dd className="text-sm text-gray-700">
                      {application.candidateLastName}
                    </dd>
                  </div>
                  <div>
                    <dt className="text-xs font-medium text-gray-400 uppercase tracking-wider mb-0.5">
                      Email
                    </dt>
                    <dd className="text-sm text-gray-700">
                      {application.candidateEmail}
                    </dd>
                  </div>
                  {hasPhone && (
                    <div>
                      <dt className="text-xs font-medium text-gray-400 uppercase tracking-wider mb-0.5">
                        Phone
                      </dt>
                      <dd className="text-sm text-gray-700">
                        {application.phone}
                      </dd>
                    </div>
                  )}
                  {hasCurrentLocation && (
                    <div>
                      <dt className="text-xs font-medium text-gray-400 uppercase tracking-wider mb-0.5">
                        Current location
                      </dt>
                      <dd className="text-sm text-gray-700">
                        {application.currentLocation}
                      </dd>
                    </div>
                  )}
                  {hasCountry && (
                    <div>
                      <dt className="text-xs font-medium text-gray-400 uppercase tracking-wider mb-0.5">
                        Country
                      </dt>
                      <dd className="text-sm text-gray-700">
                        {application.country}
                      </dd>
                    </div>
                  )}
                </dl>
              </section>

              {/* Professional Information */}
              {hasProfessionalInfo && (
                <section className="bg-white rounded-xl border border-gray-200 p-6">
                  <h2 className="text-lg font-semibold text-gray-900 mb-4 pb-2 border-b border-gray-200">
                    Professional Information
                  </h2>
                  <dl className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {application.currentJobTitle && (
                      <div>
                        <dt className="text-xs font-medium text-gray-400 uppercase tracking-wider mb-0.5">
                          Current job title
                        </dt>
                        <dd className="text-sm text-gray-700">
                          {application.currentJobTitle}
                        </dd>
                      </div>
                    )}
                    {application.currentCompany && (
                      <div>
                        <dt className="text-xs font-medium text-gray-400 uppercase tracking-wider mb-0.5">
                          Current company
                        </dt>
                        <dd className="text-sm text-gray-700">
                          {application.currentCompany}
                        </dd>
                      </div>
                    )}
                    {application.experienceLevel && (
                      <div>
                        <dt className="text-xs font-medium text-gray-400 uppercase tracking-wider mb-0.5">
                          Experience level
                        </dt>
                        <dd className="text-sm text-gray-700">
                          {application.experienceLevel}
                        </dd>
                      </div>
                    )}
                    {application.yearsOfExperience && (
                      <div>
                        <dt className="text-xs font-medium text-gray-400 uppercase tracking-wider mb-0.5">
                          Years of experience
                        </dt>
                        <dd className="text-sm text-gray-700">
                          {application.yearsOfExperience}
                        </dd>
                      </div>
                    )}
                  </dl>
                </section>
              )}

              {/* Education */}
              {hasEducation && educationEntries.length > 0 && (
                <section className="bg-white rounded-xl border border-gray-200 p-6">
                  <h2 className="text-lg font-semibold text-gray-900 mb-4 pb-2 border-b border-gray-200">
                    Education
                  </h2>
                  <div className="space-y-4">
                    {educationEntries.map((edu, index) => (
                      <div
                        key={index}
                        className="p-4 rounded-lg border border-gray-100 bg-gray-50/50"
                      >
                        <dl className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                          {edu.qualification && (
                            <div>
                              <dt className="text-xs font-medium text-gray-400 uppercase tracking-wider mb-0.5">
                                Qualification
                              </dt>
                              <dd className="text-sm text-gray-700">
                                {edu.qualification}
                              </dd>
                            </div>
                          )}
                          {edu.institution && (
                            <div>
                              <dt className="text-xs font-medium text-gray-400 uppercase tracking-wider mb-0.5">
                                Institution
                              </dt>
                              <dd className="text-sm text-gray-700">
                                {edu.institution}
                              </dd>
                            </div>
                          )}
                          {edu.fieldOfStudy && (
                            <div>
                              <dt className="text-xs font-medium text-gray-400 uppercase tracking-wider mb-0.5">
                                Field of study
                              </dt>
                              <dd className="text-sm text-gray-700">
                                {edu.fieldOfStudy}
                              </dd>
                            </div>
                          )}
                          {edu.graduationYear && (
                            <div>
                              <dt className="text-xs font-medium text-gray-400 uppercase tracking-wider mb-0.5">
                                Graduation year
                              </dt>
                              <dd className="text-sm text-gray-700">
                                {edu.graduationYear}
                              </dd>
                            </div>
                          )}
                        </dl>
                      </div>
                    ))}
                  </div>
                </section>
              )}

              {/* Resume */}
              <section className="bg-white rounded-xl border border-gray-200 p-6">
                <h2 className="text-lg font-semibold text-gray-900 mb-4 pb-2 border-b border-gray-200">
                  Resume
                </h2>
                {hasResume ? (
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
                        {application.resumeFileName}
                      </p>
                      {application.resumeFileSize && (
                        <p className="text-xs text-gray-500">
                          {application.resumeFileSize}
                        </p>
                      )}
                    </div>
                  </div>
                ) : (
                  <p className="text-sm text-gray-500">Resume not available</p>
                )}
              </section>

              {/* Professional Links */}
              {hasLinks && (
                <section className="bg-white rounded-xl border border-gray-200 p-6">
                  <h2 className="text-lg font-semibold text-gray-900 mb-4 pb-2 border-b border-gray-200">
                    Professional Links
                  </h2>
                  <dl className="space-y-3">
                    {application.linkedinUrl && (
                      <div>
                        <dt className="text-xs font-medium text-gray-400 uppercase tracking-wider mb-0.5">
                          LinkedIn
                        </dt>
                        <dd>
                          <a
                            href={application.linkedinUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-sm text-green-primary hover:text-green-dark transition-colors break-all"
                          >
                            {application.linkedinUrl}
                          </a>
                        </dd>
                      </div>
                    )}
                    {application.githubUrl && (
                      <div>
                        <dt className="text-xs font-medium text-gray-400 uppercase tracking-wider mb-0.5">
                          GitHub
                        </dt>
                        <dd>
                          <a
                            href={application.githubUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-sm text-green-primary hover:text-green-dark transition-colors break-all"
                          >
                            {application.githubUrl}
                          </a>
                        </dd>
                      </div>
                    )}
                    {application.portfolioUrl && (
                      <div>
                        <dt className="text-xs font-medium text-gray-400 uppercase tracking-wider mb-0.5">
                          Portfolio
                        </dt>
                        <dd>
                          <a
                            href={application.portfolioUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-sm text-green-primary hover:text-green-dark transition-colors break-all"
                          >
                            {application.portfolioUrl}
                          </a>
                        </dd>
                      </div>
                    )}
                    {application.otherWebsite && (
                      <div>
                        <dt className="text-xs font-medium text-gray-400 uppercase tracking-wider mb-0.5">
                          Other website
                        </dt>
                        <dd>
                          <a
                            href={application.otherWebsite}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-sm text-green-primary hover:text-green-dark transition-colors break-all"
                          >
                            {application.otherWebsite}
                          </a>
                        </dd>
                      </div>
                    )}
                  </dl>
                </section>
              )}

              {/* Additional Questions */}
              {hasAdditionalAnswers && (
                <section className="bg-white rounded-xl border border-gray-200 p-6">
                  <h2 className="text-lg font-semibold text-gray-900 mb-4 pb-2 border-b border-gray-200">
                    Additional Information
                  </h2>
                  <dl className="space-y-4">
                    {APPLICATION_QUESTIONS.map((q) => {
                      const answer = application.additionalAnswers?.[q.id];
                      if (!answer) return null;
                      return (
                        <div key={q.id}>
                          <dt className="text-sm font-medium text-gray-700 mb-1">
                            {q.question}
                          </dt>
                          <dd className="text-sm text-gray-600 whitespace-pre-wrap break-words">
                            {answer}
                          </dd>
                        </div>
                      );
                    })}
                  </dl>
                </section>
              )}
            </div>

            {/* Sidebar */}
            <aside className="w-full lg:w-80 flex-shrink-0">
              <div className="lg:sticky lg:top-24 space-y-6">
                {/* Job Summary */}
                <div className="bg-white rounded-xl border border-gray-200 p-6">
                  <h2 className="text-sm font-semibold text-gray-900 mb-4">
                    Job Details
                  </h2>
                  <dl className="space-y-3">
                    <div>
                      <dt className="text-xs font-medium text-gray-400 uppercase tracking-wider mb-0.5">
                        Position
                      </dt>
                      <dd className="text-sm font-medium text-gray-900">
                        {application.jobTitle}
                      </dd>
                    </div>
                    <div>
                      <dt className="text-xs font-medium text-gray-400 uppercase tracking-wider mb-0.5">
                        Department
                      </dt>
                      <dd className="text-sm text-gray-700">
                        {application.department}
                      </dd>
                    </div>
                    <div>
                      <dt className="text-xs font-medium text-gray-400 uppercase tracking-wider mb-0.5">
                        Location
                      </dt>
                      <dd className="text-sm text-gray-700">
                        {application.location}
                      </dd>
                    </div>
                    <div>
                      <dt className="text-xs font-medium text-gray-400 uppercase tracking-wider mb-0.5">
                        Employment type
                      </dt>
                      <dd className="text-sm text-gray-700">
                        {application.employmentType}
                      </dd>
                    </div>
                    {application.workMode && (
                      <div>
                        <dt className="text-xs font-medium text-gray-400 uppercase tracking-wider mb-0.5">
                          Work mode
                        </dt>
                        <dd className="text-sm text-gray-700">
                          {application.workMode}
                        </dd>
                      </div>
                    )}
                    {application.experience && (
                      <div>
                        <dt className="text-xs font-medium text-gray-400 uppercase tracking-wider mb-0.5">
                          Experience
                        </dt>
                        <dd className="text-sm text-gray-700">
                          {application.experience}
                        </dd>
                      </div>
                    )}
                  </dl>
                  <div className="mt-5">
                    <Link
                      href={`/careers/jobs/${application.jobId}`}
                      className="block w-full text-center px-4 py-2.5 text-sm font-medium text-green-primary bg-green-50 hover:bg-green-100 rounded-lg transition-colors"
                    >
                      View Job
                    </Link>
                  </div>
                </div>

                {/* Actions */}
                <div className="bg-white rounded-xl border border-gray-200 p-6">
                  <h2 className="text-sm font-semibold text-gray-900 mb-4">
                    Actions
                  </h2>
                  <div className="space-y-3">
                    <Link
                      href="/careers/applications"
                      className="block w-full text-center px-4 py-2.5 text-sm font-medium text-gray-700 bg-white border border-gray-300 hover:bg-gray-50 rounded-lg transition-colors"
                    >
                      Back to My Applications
                    </Link>
                    <button
                      type="button"
                      onClick={handleSignOut}
                      className="block w-full text-center px-4 py-2.5 text-sm font-medium text-gray-500 hover:text-red-500 transition-colors"
                    >
                      Sign out
                    </button>
                  </div>
                </div>
              </div>
            </aside>
          </div>
        </div>

        {/* Helpful Careers CTA */}
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
