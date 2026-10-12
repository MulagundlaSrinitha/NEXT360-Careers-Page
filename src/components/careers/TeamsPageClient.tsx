"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import CareersNavbar from "./CareersNavbar";
import CareersFooter from "./CareersFooter";
import {
  searchTeams,
  careerAreas,
  getIcon,
  type Team,
} from "./teams-data";

interface TeamCardProps {
  team: Team & { jobCount: number };
}

function TeamCard({ team }: TeamCardProps) {
  return (
    <div className="group block bg-white rounded-xl border border-gray-200 p-6 hover:border-green-primary/40 hover:shadow-sm transition-all duration-200">
      <div className="w-10 h-10 rounded-lg bg-green-50 text-green-primary flex items-center justify-center mb-4 group-hover:bg-green-primary group-hover:text-white transition-colors">
        {getIcon(team.icon)}
      </div>
      <h3 className="text-lg font-semibold text-gray-900 mb-2">{team.name}</h3>
      <p className="text-sm text-gray-600 leading-relaxed mb-4">
        {team.description}
      </p>
      <p className="text-sm font-medium text-gray-900 mb-3">
        {team.jobCount > 0
          ? `${team.jobCount} open role${team.jobCount === 1 ? "" : "s"}`
          : "No current openings"}
      </p>
      <div className="flex flex-wrap gap-1.5 mb-4">
        {team.roles.slice(0, 4).map((role) => (
          <span
            key={role}
            className="text-xs font-medium text-gray-500 bg-gray-100 px-2 py-1 rounded"
          >
            {role}
          </span>
        ))}
      </div>
      <Link
        href={`/careers/teams/${team.slug}`}
        className="text-sm font-medium text-green-primary group-hover:text-green-dark transition-colors inline-flex items-center gap-1"
      >
        Explore {team.name}
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
      </Link>
    </div>
  );
}

export default function TeamsPageClient() {
  const [query, setQuery] = useState("");

  const filteredTeams = useMemo(() => searchTeams(query), [query]);

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
                <li className="text-gray-600 font-medium">Teams</li>
              </ol>
            </nav>
          </div>
        </div>

        {/* Hero */}
        <section className="bg-white">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-16 sm:py-20">
            <div className="max-w-2xl">
              <p className="text-sm font-semibold tracking-wider text-green-primary uppercase mb-3">
                Explore Teams
              </p>
              <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
                Find where you belong.
              </h1>
              <p className="text-lg text-gray-600 leading-relaxed">
                Explore the teams behind Next360 and discover the people, work,
                and opportunities that could be your next step.
              </p>
            </div>
          </div>
        </section>

        {/* Search + Grid */}
        <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
          {/* Search */}
          <div className="mb-8">
            <label htmlFor="team-search" className="sr-only">
              Search teams
            </label>
            <div className="relative max-w-md">
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
                id="team-search"
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search teams or areas of work"
                className="w-full pl-10 pr-4 py-2.5 text-sm bg-white border border-gray-300 rounded-lg text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-green-primary focus:border-green-primary transition-colors"
              />
              {query && (
                <button
                  type="button"
                  onClick={() => setQuery("")}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600"
                  aria-label="Clear search"
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
                      d="M6 18L18 6M6 6l12 12"
                    />
                  </svg>
                </button>
              )}
            </div>
          </div>

          {/* Team Grid or Empty State */}
          {filteredTeams.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredTeams.map((team) => (
                <TeamCard key={team.id} team={team} />
              ))}
            </div>
          ) : (
            <div className="text-center py-16">
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
                    d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z"
                  />
                </svg>
              </div>
              <h2 className="text-lg font-semibold text-gray-900 mb-1">
                No teams found
              </h2>
              <p className="text-sm text-gray-500 mb-4">
                Try searching for another team or area of work.
              </p>
              <button
                type="button"
                onClick={() => setQuery("")}
                className="text-sm font-medium text-green-primary hover:text-green-dark transition-colors"
              >
                Clear Search
              </button>
            </div>
          )}
        </section>

        {/* Career Areas */}
        <section className="bg-white border-t border-gray-100">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">
              Explore by career area
            </h2>
            <div className="flex flex-wrap gap-2">
              {careerAreas.map((area) => (
                <Link
                  key={area.label}
                  href={`/careers/jobs?department=${encodeURIComponent(area.department)}`}
                  className="inline-flex items-center px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-full transition-colors"
                >
                  {area.label}
                </Link>
              ))}
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="bg-green-primary">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12 sm:py-16 text-center">
            <h2 className="text-2xl sm:text-3xl font-bold text-white mb-3">
              Looking for an open role?
            </h2>
            <p className="text-green-100 mb-6 max-w-lg mx-auto">
              Browse all current opportunities at Next360.
            </p>
            <Link
              href="/careers/jobs"
              className="inline-flex items-center justify-center px-6 py-3 text-base font-medium text-green-primary bg-white hover:bg-gray-50 rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-green-primary"
            >
              View All Jobs
            </Link>
          </div>
        </section>
      </main>
      <CareersFooter />
    </>
  );
}
