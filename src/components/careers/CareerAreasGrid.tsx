import Link from "next/link";
import { getTeamsWithJobCounts } from "./teams-data";

export default function CareerAreasGrid() {
  const teamsWithCounts = getTeamsWithJobCounts();

  return (
    <section className="bg-gray-50 border-t border-gray-100">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-16 sm:py-20">
        <div className="max-w-2xl mx-auto text-center mb-12">
          <p className="text-sm font-semibold tracking-wider text-green-primary uppercase mb-3">
            Career Areas
          </p>
          <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
            Explore different ways to contribute.
          </h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {teamsWithCounts.map((team) => (
            <Link
              key={team.id}
              href={`/careers/teams/${team.slug}`}
              className="group block bg-white rounded-xl border border-gray-200 p-5 hover:border-green-primary/40 hover:shadow-sm transition-all duration-200"
            >
              <div className="flex items-start justify-between gap-3 mb-2">
                <h3 className="text-base font-semibold text-gray-900 group-hover:text-green-primary transition-colors">
                  {team.name}
                </h3>
                <span className="text-xs text-gray-400 whitespace-nowrap">
                  {team.jobCount > 0
                    ? `${team.jobCount} role${team.jobCount === 1 ? "" : "s"}`
                    : "No openings"}
                </span>
              </div>
              <p className="text-sm text-gray-600 line-clamp-2 mb-3">
                {team.description}
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
          ))}
        </div>
      </div>
    </section>
  );
}
