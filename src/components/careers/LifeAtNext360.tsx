import { lifeAtNext360 } from "./careers-data";

export default function LifeAtNext360() {
  return (
    <section className="py-16 sm:py-24 bg-gray-50" id="life">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="max-w-2xl mx-auto text-center mb-12">
          <p className="text-sm font-semibold tracking-wider text-green-primary uppercase mb-3">
            Life at Next360
          </p>
          <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
            People first. Progress together.
          </h2>
          <p className="text-lg text-gray-600">
            See what it is like to work, learn, collaborate, and grow at
            Next360.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {lifeAtNext360.map((item) => (
            <div
              key={item.title}
              className="group rounded-xl overflow-hidden border border-gray-200 bg-white hover:shadow-md transition-all duration-200"
            >
              <div className={`aspect-[4/3] ${item.color} flex items-center justify-center`}>
                <div className="w-16 h-16 rounded-full bg-white/80 flex items-center justify-center group-hover:scale-110 transition-transform duration-200">
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
              </div>
              <div className="p-5">
                <p className="text-xs font-semibold text-green-primary uppercase tracking-wider mb-1">
                  {item.title}
                </p>
                <h3 className="text-base font-medium text-gray-700">
                  {item.description}
                </h3>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
