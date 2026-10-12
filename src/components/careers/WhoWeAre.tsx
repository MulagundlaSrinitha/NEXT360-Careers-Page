import { companyOverview } from "./about-next360-data";

export default function WhoWeAre() {
  return (
    <section className="py-16 sm:py-24 bg-gray-50">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          {/* Left: Visual */}
          <div className="relative order-2 lg:order-1">
            <div className="aspect-[4/3] rounded-2xl bg-white border border-gray-200 flex items-center justify-center">
              <div className="text-center p-8">
                <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-green-50 flex items-center justify-center">
                  <svg
                    className="w-8 h-8 text-green-primary"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth="1.5"
                    stroke="currentColor"
                    aria-hidden="true"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M18 18.72a9.094 9.094 0 003.741-.479 3 3 0 00-4.682-2.72m.94 3.198l.001.031c0 .225-.012.447-.037.666A11.944 11.944 0 0112 21c-2.17 0-4.207-.576-5.963-1.584A6.062 6.062 0 016 18.719m12 0a5.971 5.971 0 00-.941-3.197m0 0A5.995 5.995 0 0012 12.75a5.995 5.995 0 00-5.058 2.772m0 0a3 3 0 00-4.681 2.72 8.986 8.986 0 003.74.477m.94-3.197a5.971 5.971 0 00-.94 3.197M15 6.75a3 3 0 11-6 0 3 3 0 016 0zm6 3a2.25 2.25 0 11-4.5 0 2.25 2.25 0 014.5 0zm-13.5 0a2.25 2.25 0 11-4.5 0 2.25 2.25 0 014.5 0z"
                    />
                  </svg>
                </div>
                {/* Replace with approved Next360 image */}
                <p className="text-sm font-medium text-gray-500">
                  Our People
                </p>
              </div>
            </div>
          </div>

          {/* Right: Content */}
          <div className="order-1 lg:order-2">
            <p className="text-sm font-semibold tracking-wider text-green-primary uppercase mb-3">
              {companyOverview.eyebrow}
            </p>
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-6">
              {companyOverview.title}
            </h2>
            <p className="text-lg text-gray-600 leading-relaxed mb-4">
              {companyOverview.description}
            </p>
            <p className="text-base text-gray-500 leading-relaxed">
              {companyOverview.secondaryDescription}
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
