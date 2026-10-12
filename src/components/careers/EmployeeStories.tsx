import { employeeStories } from "./careers-data";

export default function EmployeeStories() {
  return (
    <section className="py-16 sm:py-24 bg-white">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="max-w-2xl mx-auto text-center mb-12">
          <p className="text-sm font-semibold tracking-wider text-green-primary uppercase mb-3">
            People of Next360
          </p>
          <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
            Meet the people behind Next360.
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {employeeStories.map((story, index) => (
            <div
              key={index}
              className="bg-gray-50 rounded-xl border border-gray-200 p-6 hover:border-green-primary/30 transition-all duration-200"
            >
              <div className="flex items-center gap-4 mb-4">
                <div className="w-12 h-12 rounded-full bg-green-100 flex items-center justify-center">
                  <svg
                    className="w-6 h-6 text-green-primary"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth="1.5"
                    stroke="currentColor"
                    aria-hidden="true"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z"
                    />
                  </svg>
                </div>
                <div>
                  <p className="font-semibold text-gray-900">{story.name}</p>
                  <p className="text-sm text-gray-500">
                    {story.role} · {story.team}
                  </p>
                </div>
              </div>
              <blockquote className="text-gray-600 leading-relaxed mb-4">
                &ldquo;{story.quote}&rdquo;
              </blockquote>
              <a
                href="#"
                className="text-sm font-medium text-green-primary hover:text-green-dark transition-colors"
              >
                Read story →
              </a>
            </div>
          ))}
        </div>

        <p className="text-center text-xs text-gray-400 mt-6">
          * Placeholder data. Replace with real employee stories before launch.
        </p>
      </div>
    </section>
  );
}
