import Link from "next/link";
import { earlyCareersCards } from "./careers-data";

export default function EarlyCareers() {
  return (
    <section className="py-16 sm:py-24 bg-white" id="early-careers">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="max-w-2xl mx-auto text-center mb-12">
          <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
            Start your career with Next360
          </h2>
          <p className="text-lg text-gray-600">
            Whether you&apos;re starting your first job or looking for an
            internship, explore opportunities to learn and contribute from day
            one.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto">
          {earlyCareersCards.map((card) => (
            <div
              key={card.title}
              className="bg-gray-50 rounded-xl border border-gray-200 p-8 text-center hover:border-green-primary/30 transition-all duration-200"
            >
              <div className="w-14 h-14 rounded-full bg-green-50 text-green-primary flex items-center justify-center mx-auto mb-5">
                <svg
                  className="w-7 h-7"
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
              <h3 className="text-xl font-semibold text-gray-900 mb-3">
                {card.title}
              </h3>
              <p className="text-gray-600 mb-6">{card.description}</p>
              <Link
                href="/careers/jobs"
                className="inline-flex items-center justify-center px-5 py-2.5 text-sm font-medium text-green-primary border border-green-primary hover:bg-green-primary hover:text-white rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-green-primary focus:ring-offset-2"
              >
                {card.buttonText}
              </Link>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
