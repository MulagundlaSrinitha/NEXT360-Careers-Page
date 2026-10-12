"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import CareersNavbar from "./CareersNavbar";
import CareersFooter from "./CareersFooter";
import JobCard from "./JobCard";
import { teams, getIcon, getJobCountForTeam } from "./teams-data";
import type { Job } from "./types";

interface TeamDetailsClientProps {
  team: {
    id: string;
    slug: string;
    name: string;
    description: string;
    longDescription: string;
    icon: string;
    departments: string[];
    roles: string[];
    skills: string[];
  };
  teamJobs: Job[];
  locations: string[];
}

export default function TeamDetailsClient({
  team,
  teamJobs,
  locations,
}: TeamDetailsClientProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [locationFilter, setLocationFilter] = useState("");
  const [experienceFilter, setExperienceFilter] = useState("");
  const [savedJobs, setSavedJobs] = useState<Set<string>>(() => {
    if (typeof window === "undefined") return new Set();
    try {
      const stored = localStorage.getItem("next360_saved_jobs");
      return stored ? new Set(JSON.parse(stored)) : new Set();
    } catch {
      return new Set();
    }
  });

  const handleToggleSave = (jobId: string) => {
    setSavedJobs((prev) => {
      const next = new Set(prev);
      if (next.has(jobId)) {
        next.delete(jobId);
      } else {
        next.add(jobId);
      }
      try {
        localStorage.setItem(
          "next360_saved_jobs",
          JSON.stringify([...next])
        );
      } catch {
        // localStorage not available
      }
      return next;
    });
  };

  const filteredJobs = useMemo(() => {
    return teamJobs.filter((job) => {
      const matchesSearch =
        !searchQuery ||
        job.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        job.skills.some((s) =>
          s.toLowerCase().includes(searchQuery.toLowerCase())
        );
      const matchesLocation =
        !locationFilter || job.location === locationFilter;
      const matchesExperience =
        !experienceFilter || job.experience === experienceFilter;
      return matchesSearch && matchesLocation && matchesExperience;
    });
  }, [teamJobs, searchQuery, locationFilter, experienceFilter]);

  const relatedTeams = teams
    .filter((t) => t.id !== team.id)
    .slice(0, 3);

  const uniqueExperiences = [
    ...new Set(teamJobs.map((job) => job.experience)),
  ];

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
                    href="/careers/teams"
                    className="hover:text-gray-600 transition-colors"
                  >
                    Teams
                  </Link>
                </li>
                <li aria-hidden="true">/</li>
                <li className="text-gray-600 font-medium">{team.name}</li>
              </ol>
            </nav>
          </div>
        </div>

        {/* Hero */}
        <section className="bg-white">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-16 sm:py-20">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">
              <div>
                <p className="text-sm font-semibold tracking-wider text-green-primary uppercase mb-3">
                  Team
                </p>
                <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
                  {team.name}
                </h1>
                <p className="text-lg text-gray-600 leading-relaxed mb-6">
                  {team.longDescription}
                </p>
                <p className="text-sm text-gray-500 mb-8">
                  {teamJobs.length > 0
                    ? `${teamJobs.length} open role${teamJobs.length === 1 ? "" : "s"}`
                    : "No open positions right now"}
                </p>
                <div className="flex flex-col sm:flex-row gap-3">
                  {teamJobs.length > 0 && (
                    <a
                      href="#open-positions"
                      className="inline-flex items-center justify-center px-6 py-3 text-base font-medium text-white bg-green-primary hover:bg-green-dark rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-green-primary focus:ring-offset-2"
                    >
                      View Open Roles
                    </a>
                  )}
                  <Link
                    href="/careers/teams"
                    className="inline-flex items-center justify-center px-6 py-3 text-base font-medium text-gray-700 bg-white border border-gray-300 hover:border-gray-400 hover:bg-gray-50 rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-green-primary focus:ring-offset-2"
                  >
                    Back to Teams
                  </Link>
                </div>
              </div>

              {/* Visual */}
              <div className="relative hidden lg:block">
                <div className="aspect-[4/3] rounded-2xl bg-gradient-to-br from-green-50 to-gray-100 border border-gray-200 flex items-center justify-center">
                  <div className="text-center p-8">
                    <div className="w-20 h-20 mx-auto mb-4 rounded-2xl bg-green-primary/10 text-green-primary flex items-center justify-center">
                      {getIcon(team.icon)}
                    </div>
                    <p className="text-sm font-medium text-gray-500">
                      {team.name} Team
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* About the Team */}
        <section className="bg-white border-t border-gray-100">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              About the team
            </h2>
            <p className="text-gray-600 leading-relaxed max-w-3xl">
              {team.longDescription}
            </p>
          </div>
        </section>

        {/* What We Work On */}
        <section className="bg-gray-50 border-t border-gray-100">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">
              What we work on
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {team.roles.map((role) => (
                <div
                  key={role}
                  className="flex items-center gap-3 bg-white rounded-lg border border-gray-200 p-4"
                >
                  <div className="w-8 h-8 rounded-lg bg-green-50 text-green-primary flex items-center justify-center flex-shrink-0">
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
                        d="M4.5 12.75l6 6 9-13.5"
                      />
                    </svg>
                  </div>
                  <span className="text-sm font-medium text-gray-700">
                    {role}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Skills & Areas */}
        {team.skills.length > 0 && (
          <section className="bg-white border-t border-gray-100">
            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">
                Skills and areas
              </h2>
              <div className="flex flex-wrap gap-2">
                {team.skills.map((skill) => (
                  <span
                    key={skill}
                    className="inline-flex items-center px-3 py-1.5 rounded-full text-sm font-medium bg-gray-100 text-gray-700"
                  >
                    {skill}
                  </span>
                ))}
              </div>
            </div>
          </section>
        )}

        {/* Team Locations */}
        {locations.length > 0 && (
          <section className="bg-gray-50 border-t border-gray-100">
            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">
                Where we work
              </h2>
              <div className="flex flex-wrap gap-2">
                {locations.map((location) => (
                  <span
                    key={location}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm font-medium bg-white border border-gray-200 text-gray-700"
                  >
                    <svg
                      className="w-4 h-4 text-gray-400"
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
                    {location}
                  </span>
                ))}
              </div>
            </div>
          </section>
        )}

        {/* Open Positions */}
        <section
          className="bg-white border-t border-gray-100"
          id="open-positions"
        >
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
              <div>
                <h2 className="text-2xl font-bold text-gray-900 mb-1">
                  Open positions
                </h2>
                <p className="text-sm text-gray-500">
                  Explore current opportunities within {team.name}.
                </p>
              </div>
              {teamJobs.length > 0 && (
                <span className="text-sm font-medium text-gray-500">
                  {teamJobs.length} position{teamJobs.length === 1 ? "" : "s"}
                </span>
              )}
            </div>

            {teamJobs.length > 0 ? (
              <>
                {/* Filters */}
                <div className="flex flex-col sm:flex-row gap-3 mb-6">
                  <div className="relative flex-1 max-w-sm">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <svg
                        className="w-5 h-5 text-gray-400"
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
                    <input
                      type="text"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      placeholder="Search this team"
                      className="w-full pl-10 pr-4 py-2.5 text-sm bg-white border border-gray-300 rounded-lg text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-green-primary focus:border-green-primary transition-colors"
                    />
                  </div>
                  <select
                    value={locationFilter}
                    onChange={(e) => setLocationFilter(e.target.value)}
                    className="px-3 py-2.5 text-sm bg-white border border-gray-300 rounded-lg text-gray-700 focus:outline-none focus:ring-2 focus:ring-green-primary focus:border-green-primary transition-colors"
                  >
                    <option value="">All Locations</option>
                    {locations.map((loc) => (
                      <option key={loc} value={loc}>
                        {loc}
                      </option>
                    ))}
                  </select>
                  {uniqueExperiences.length > 1 && (
                    <select
                      value={experienceFilter}
                      onChange={(e) => setExperienceFilter(e.target.value)}
                      className="px-3 py-2.5 text-sm bg-white border border-gray-300 rounded-lg text-gray-700 focus:outline-none focus:ring-2 focus:ring-green-primary focus:border-green-primary transition-colors"
                    >
                      <option value="">All Experience</option>
                      {uniqueExperiences.map((exp) => (
                        <option key={exp} value={exp}>
                          {exp}
                        </option>
                      ))}
                    </select>
                  )}
                </div>

                {/* Job Cards */}
                <div className="space-y-4">
                  {filteredJobs.length > 0 ? (
                    filteredJobs.map((job) => (
                      <JobCard
                        key={job.id}
                        job={job}
                        savedJobs={savedJobs}
                        onToggleSave={handleToggleSave}
                      />
                    ))
                  ) : (
                    <div className="text-center py-12">
                      <p className="text-gray-500 mb-4">
                        No positions match your filters.
                      </p>
                      <button
                        type="button"
                        onClick={() => {
                          setSearchQuery("");
                          setLocationFilter("");
                          setExperienceFilter("");
                        }}
                        className="text-sm font-medium text-green-primary hover:text-green-dark transition-colors"
                      >
                        Clear Filters
                      </button>
                    </div>
                  )}
                </div>

                {teamJobs.length > 6 && (
                  <div className="mt-8 text-center">
                    <Link
                      href={`/careers/jobs?department=${encodeURIComponent(team.departments[0])}`}
                      className="inline-flex items-center gap-1.5 text-sm font-medium text-green-primary hover:text-green-dark transition-colors"
                    >
                      View all {team.name} jobs
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
                )}
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
                  No open positions right now
                </h3>
                <p className="text-sm text-gray-500 mb-4">
                  Explore other opportunities across Next360.
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

        {/* Related Career Areas */}
        <section className="bg-gray-50 border-t border-gray-100">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">
              Explore other career areas
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {relatedTeams.map((relatedTeam) => {
                const jobCount = getJobCountForTeam(relatedTeam);
                return (
                  <Link
                    key={relatedTeam.id}
                    href={`/careers/teams/${relatedTeam.slug}`}
                    className="group block bg-white rounded-xl border border-gray-200 p-5 hover:border-green-primary/40 hover:shadow-sm transition-all duration-200"
                  >
                    <div className="flex items-start gap-3 mb-3">
                      <div className="w-9 h-9 rounded-lg bg-green-50 text-green-primary flex items-center justify-center flex-shrink-0 group-hover:bg-green-primary group-hover:text-white transition-colors">
                        {getIcon(relatedTeam.icon)}
                      </div>
                      <div>
                        <h3 className="text-base font-semibold text-gray-900 group-hover:text-green-primary transition-colors">
                          {relatedTeam.name}
                        </h3>
                        <p className="text-xs text-gray-500">
                          {jobCount > 0
                            ? `${jobCount} open role${jobCount === 1 ? "" : "s"}`
                            : "No openings"}
                        </p>
                      </div>
                    </div>
                    <p className="text-sm text-gray-600 line-clamp-2 mb-3">
                      {relatedTeam.description}
                    </p>
                    <span className="text-sm font-medium text-green-primary group-hover:text-green-dark transition-colors inline-flex items-center gap-1">
                      Explore
                      <svg
                        className="w-4 h-4 transition-transform group-hover:translate-x-0.5"
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
                    </span>
                  </Link>
                );
              })}
            </div>
          </div>
        </section>

        {/* Final CTA */}
        <section className="bg-green-primary">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12 sm:py-16 text-center">
            <h2 className="text-2xl sm:text-3xl font-bold text-white mb-3">
              Find your next opportunity
            </h2>
            <p className="text-green-100 mb-6 max-w-lg mx-auto">
              Explore all current roles at Next360.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link
                href="/careers/jobs"
                className="inline-flex items-center justify-center px-6 py-3 text-base font-medium text-green-primary bg-white hover:bg-gray-50 rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-green-primary"
              >
                View All Jobs
              </Link>
              <Link
                href="/careers/teams"
                className="inline-flex items-center justify-center px-6 py-3 text-base font-medium text-white hover:text-green-100 transition-colors"
              >
                Explore Teams
              </Link>
            </div>
          </div>
        </section>
      </main>
      <CareersFooter />
    </>
  );
}
