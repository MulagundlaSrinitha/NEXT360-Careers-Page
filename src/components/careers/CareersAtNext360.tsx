import Link from "next/link";

export default function CareersAtNext360() {
  return (
    <section className="py-16 sm:py-24 bg-white">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="max-w-2xl mx-auto text-center mb-12">
          <p className="text-sm font-semibold tracking-wider text-green-primary uppercase mb-3">
            CAREERS AT NEXT360
          </p>
          <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
            Where you fit in
          </h2>
          <p className="text-lg text-gray-600 leading-relaxed">
            Explore the teams, roles, and opportunities where you can
            contribute to the work we&apos;re building.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <Link
            href="/careers"
            className="inline-flex items-center justify-center px-6 py-3 text-base font-medium text-white bg-green-primary hover:bg-green-dark rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-green-primary focus:ring-offset-2"
          >
            Explore Careers
          </Link>
          <Link
            href="/careers/jobs"
            className="inline-flex items-center justify-center px-6 py-3 text-base font-medium text-gray-700 bg-white border border-gray-300 hover:border-gray-400 hover:bg-gray-50 rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-green-primary focus:ring-offset-2"
          >
            View Open Roles
          </Link>
        </div>

        <div className="mt-12 text-center">
          <Link
            href="/careers/teams"
            className="inline-flex items-center gap-1 text-sm font-medium text-green-primary hover:text-green-dark transition-colors"
          >
            Explore Teams
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
      </div>
    </section>
  );
}
