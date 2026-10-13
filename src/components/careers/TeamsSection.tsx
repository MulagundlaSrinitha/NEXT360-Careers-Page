import type { ReactNode } from "react";
import { getTeamsWithJobCounts } from "./teams-data";

function TeamIcon({ icon }: { icon: string }) {
  const icons: Record<string, ReactNode> = {
    code: (
      <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" aria-hidden="true">
        <path strokeLinecap="round" strokeLinejoin="round" d="M17.25 6.75L22.5 12l-5.25 5.25m-10.5 0L1.5 12l5.25-5.25m7.5-3l-4.5 16.5" />
      </svg>
    ),
    lightbulb: (
      <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" aria-hidden="true">
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 18v-5.25m0 0a6.01 6.01 0 001.5-.189m-1.5.189a6.01 6.01 0 01-1.5-.189m3.75 7.478a12.06 12.06 0 01-4.5 0m3.75 2.383a14.406 14.406 0 01-3 0M14.25 18v-.192c0-.983.658-1.823 1.508-2.316a7.5 7.5 0 10-7.517 0c.85.493 1.509 1.333 1.509 2.316V18" />
      </svg>
    ),
    settings: (
      <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" aria-hidden="true">
        <path strokeLinecap="round" strokeLinejoin="round" d="M9.594 3.94c.09-.542.56-.94 1.11-.94h2.593c.55 0 1.02.398 1.11.94l.213 1.281c.063.374.313.686.645.87.074.04.147.083.22.127.324.196.72.257 1.075.124l1.217-.456a1.125 1.125 0 011.37.49l1.296 2.247a1.125 1.125 0 01-.26 1.431l-1.003.827c-.293.24-.438.613-.431.992a6.759 6.759 0 010 .255c-.007.378.138.75.43.99l1.005.828c.424.35.534.954.26 1.43l-1.298 2.247a1.125 1.125 0 01-1.369.491l-1.217-.456c-.355-.133-.75-.072-1.076.124a6.57 6.57 0 01-.22.128c-.331.183-.581.495-.644.869l-.213 1.28c-.09.543-.56.941-1.11.941h-2.594c-.55 0-1.02-.398-1.11-.94l-.213-1.281c-.062-.374-.312-.686-.644-.87a6.52 6.52 0 01-.22-.127c-.325-.196-.72-.257-1.076-.124l-1.217.456a1.125 1.125 0 01-1.369-.49l-1.297-2.247a1.125 1.125 0 01.26-1.431l1.004-.827c.292-.24.437-.613.43-.992a6.932 6.932 0 010-.255c.007-.378-.138-.75-.43-.99l-1.004-.828a1.125 1.125 0 01-.26-1.43l1.297-2.247a1.125 1.125 0 011.37-.491l1.216.456c.356.133.751.072 1.076-.124.072-.044.146-.087.22-.128.332-.183.582-.495.644-.869l.214-1.281z" />
        <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
      </svg>
    ),
    "trending-up": (
      <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" aria-hidden="true">
        <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 18L9 11.25l4.306 4.307a11.95 11.95 0 015.814-5.519l2.74-1.22m0 0l-5.94-2.28m5.94 2.28l-2.28 5.941" />
      </svg>
    ),
  };

  return icons[icon] || icons.code;
}

export default async function TeamsSection() {
  const teams = await getTeamsWithJobCounts();
  return (
    <section className="py-16 sm:py-24 bg-white" id="teams">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="max-w-2xl mx-auto text-center mb-12">
          <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
            Explore opportunities by team
          </h2>
          <p className="text-lg text-gray-600">
            Find a role that matches your skills and interests.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {teams.map((team) => (
            <a
              key={team.id}
              href={`/careers/teams/${team.id}`}
              className="group block bg-white rounded-xl border border-gray-200 p-6 hover:border-green-primary/40 hover:shadow-md transition-all duration-200"
            >
              <div className="w-10 h-10 rounded-lg bg-green-50 text-green-primary flex items-center justify-center mb-4 group-hover:bg-green-primary group-hover:text-white transition-colors">
                <TeamIcon icon={team.icon} />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                {team.name}
              </h3>
              <p className="text-sm text-gray-600 leading-relaxed mb-4">
                {team.description}
              </p>
              <div className="flex flex-wrap gap-2 mb-4">
                {team.roles.map((role) => (
                  <span
                    key={role}
                    className="text-xs font-medium text-gray-500 bg-gray-100 px-2 py-1 rounded"
                  >
                    {role}
                  </span>
                ))}
              </div>
              <span className="text-sm font-medium text-green-primary group-hover:text-green-dark transition-colors">
                Explore team →
              </span>
            </a>
          ))}
        </div>
      </div>
    </section>
  );
}
