import { collaborationPoints } from "./life-at-next360-data";

export default function CollaborationSection() {
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
                      d="M2.25 21h19.5m-18-18v18m10.5-18v18m6-13.5V21M6.75 6.75h.75m-.75 3h.75m-.75 3h.75m3-6h.75m-.75 3h.75m-.75 3h.75M6.75 21v-3.375c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21M3 3h12m-.75 4.5H21m-3.75 3H21m-3.75 3H21"
                    />
                  </svg>
                </div>
                {/* Replace with approved Next360 image */}
                <p className="text-sm font-medium text-gray-500">
                  Collaboration
                </p>
              </div>
            </div>
          </div>

          {/* Right: Content */}
          <div>
            <p className="text-sm font-semibold tracking-wider text-green-primary uppercase mb-3">
              Collaboration
            </p>
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
              Better ideas come from working together.
            </h2>
            <p className="text-lg text-gray-600 leading-relaxed mb-8">
              Collaboration helps people share knowledge, challenge ideas, solve
              problems, and build better outcomes.
            </p>

            <div className="space-y-6">
              {collaborationPoints.map((point) => (
                <div key={point.title} className="flex items-start gap-4">
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
                      {point.title}
                    </h3>
                    <p className="text-sm text-gray-600 leading-relaxed">
                      {point.description}
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
