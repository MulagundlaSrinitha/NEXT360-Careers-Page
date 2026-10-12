import Link from "next/link";
import { earlyOpportunities } from "./early-careers-data";

export default function EarlyOpportunities() {
  return (
    <section className="bg-gray-50 border-t border-gray-100">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-16 sm:py-20">
        <div className="max-w-2xl mx-auto text-center mb-12">
          <p className="text-sm font-semibold tracking-wider text-green-primary uppercase mb-3">
            Early Career Opportunities
          </p>
          <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
            Find your starting point.
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto">
          {earlyOpportunities.map((opp) => (
            <div
              key={opp.title}
              className="bg-white rounded-xl border border-gray-200 p-8 hover:border-green-primary/30 hover:shadow-sm transition-all duration-200"
            >
              <h3 className="text-xl font-semibold text-gray-900 mb-3">
                {opp.title}
              </h3>
              <p className="text-gray-600 mb-6 leading-relaxed">
                {opp.description}
              </p>
              <Link
                href={opp.href}
                className="inline-flex items-center justify-center px-5 py-2.5 text-sm font-medium text-green-primary border border-green-primary hover:bg-green-primary hover:text-white rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-green-primary focus:ring-offset-2"
              >
                {opp.cta}
              </Link>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
