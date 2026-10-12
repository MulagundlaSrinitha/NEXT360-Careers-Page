import { ourPeoplePrinciples } from "./life-at-next360-data";

export default function OurPeople() {
  return (
    <section className="bg-white border-t border-gray-100">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-16 sm:py-20">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          {/* Left: Image */}
          <div className="relative">
            <div className="aspect-[4/3] rounded-2xl bg-gradient-to-br from-green-50 to-gray-100 border border-gray-200 flex items-center justify-center">
              <div className="text-center p-8">
                <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-green-primary/10 flex items-center justify-center">
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
                      d="M15 19.128a9.38 9.38 0 002.625.372 9.337 9.337 0 004.121-.952 4.125 4.125 0 00-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.106A12.318 12.318 0 018.624 21c-2.331 0-4.512-.645-6.374-1.766l-.001-.109a6.375 6.375 0 0111.964-3.07M12 6.375a3.375 3.375 0 11-6.75 0 3.375 3.375 0 016.75 0zm8.25 2.25a2.625 2.625 0 11-5.25 0 2.625 2.625 0 015.25 0z"
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
          <div>
            <p className="text-sm font-semibold tracking-wider text-green-primary uppercase mb-3">
              Our People
            </p>
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
              People bring the work to life.
            </h2>
            <p className="text-lg text-gray-600 leading-relaxed mb-8">
              Life at Next360 is shaped by the people who bring their ideas,
              skills, and perspectives to work every day.
            </p>

            <div className="space-y-6">
              {ourPeoplePrinciples.map((principle) => (
                <div key={principle.title} className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-lg bg-green-50 text-green-primary flex items-center justify-center flex-shrink-0 mt-0.5">
                    <svg
                      className="w-5 h-5"
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
                  <div>
                    <h3 className="text-base font-semibold text-gray-900 mb-1">
                      {principle.title}
                    </h3>
                    <p className="text-sm text-gray-600 leading-relaxed">
                      {principle.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
