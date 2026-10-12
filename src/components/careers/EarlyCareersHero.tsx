import Link from "next/link";
import { earlyCareersHero } from "./early-careers-data";

export default function EarlyCareersHero() {
  return (
    <section className="bg-white">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-16 sm:py-20">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          {/* Left Content */}
          <div className="max-w-2xl">
            <p className="text-sm font-semibold tracking-wider text-green-primary uppercase mb-4">
              {earlyCareersHero.eyebrow}
            </p>
            <h1 className="text-4xl sm:text-5xl font-bold text-gray-900 tracking-tight leading-tight mb-6">
              {earlyCareersHero.title}
            </h1>
            <p className="text-lg sm:text-xl text-gray-600 leading-relaxed mb-8">
              {earlyCareersHero.description}
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Link
                href="/careers/jobs"
                className="inline-flex items-center justify-center px-6 py-3 text-base font-medium text-white bg-green-primary hover:bg-green-dark rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-green-primary focus:ring-offset-2"
              >
                Explore Open Roles
              </Link>
              <Link
                href="/careers/jobs?experience=Internship"
                className="inline-flex items-center justify-center px-6 py-3 text-base font-medium text-gray-700 bg-white border border-gray-300 hover:border-gray-400 hover:bg-gray-50 rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-green-primary focus:ring-offset-2"
              >
                View Internships
              </Link>
            </div>
          </div>

          {/* Right Visual Area */}
          <div className="relative hidden lg:block">
            <div className="aspect-[4/3] rounded-2xl bg-gradient-to-br from-green-50 to-gray-100 border border-gray-200 flex items-center justify-center">
              <div className="text-center p-8">
                <div className="w-20 h-20 mx-auto mb-4 rounded-2xl bg-green-primary/10 flex items-center justify-center">
                  <svg
                    className="w-10 h-10 text-green-primary"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth="1.5"
                    stroke="currentColor"
                    aria-hidden="true"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M4.26 10.147a60.436 60.436 0 00-.491 6.347A48.627 48.627 0 0112 20.904a48.627 48.627 0 018.232-4.41 60.46 60.46 0 00-.491-6.347m-15.482 0a50.57 50.57 0 00-2.658-.813A59.905 59.905 0 0112 3.493a59.902 59.902 0 0110.399 5.84c-.896.248-1.783.52-2.658.814m-15.482 0A50.697 50.697 0 0112 13.489a50.702 50.702 0 017.74-3.342M6.75 15a.75.75 0 100-1.5.75.75 0 000 1.5zm0 0v-3.675A55.378 55.378 0 0112 8.443m-7.007 11.55A5.981 5.981 0 006.75 15.75v-1.5"
                    />
                  </svg>
                </div>
                {/* Replace with approved Next360 image */}
                <p className="text-sm font-medium text-gray-500">
                  Early Careers
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
