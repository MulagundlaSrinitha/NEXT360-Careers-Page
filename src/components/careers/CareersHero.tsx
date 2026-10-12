export default function CareersHero() {
  return (
    <section className="relative bg-white pt-16 pb-20 sm:pt-20 sm:pb-24 overflow-hidden" id="careers">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          {/* Left Content */}
          <div className="max-w-2xl">
            <p className="text-sm font-semibold tracking-wider text-green-primary uppercase mb-4">
              Careers at Next360
            </p>
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-gray-900 tracking-tight leading-tight mb-6">
              Grow with Next360.
            </h1>
            <p className="text-lg sm:text-xl text-gray-600 leading-relaxed mb-8">
              Build meaningful products, solve real problems, and grow with a
              team that is shaping the future of organic products.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <a
                href="#job-search"
                className="inline-flex items-center justify-center px-6 py-3 text-base font-medium text-white bg-green-primary hover:bg-green-dark rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-green-primary focus:ring-offset-2"
              >
                Explore Jobs
              </a>
              <a
                href="#teams"
                className="inline-flex items-center justify-center px-6 py-3 text-base font-medium text-gray-700 bg-white border border-gray-300 hover:border-gray-400 hover:bg-gray-50 rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-green-primary focus:ring-offset-2"
              >
                Meet Our Teams
              </a>
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
                      d="M12 21v-8.25M15.75 21v-8.25M8.25 21v-8.25M3 9l9-6 9 6m-1.5 12V10.332A48.36 48.36 0 0012 9.75c-2.551 0-5.056.2-7.5.582V21M3 21h18M12 6.75h.008v.008H12V6.75z"
                    />
                  </svg>
                </div>
                <p className="text-sm font-medium text-gray-500">
                  Next360 Organic Products
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Trust/Stat Row */}
        <div className="mt-16 pt-8 border-t border-gray-200">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-6">
            {[
              { label: "Open Roles", value: "Multiple" },
              { label: "Teams", value: "4+" },
              { label: "Growth", value: "Growing" },
              { label: "Location", value: "India" },
            ].map((stat) => (
              <div key={stat.label} className="text-center sm:text-left">
                <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
                <p className="text-sm text-gray-500 mt-1">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
