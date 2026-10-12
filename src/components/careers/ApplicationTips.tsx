import { applicationTips } from "./early-careers-data";

export default function ApplicationTips() {
  return (
    <section className="bg-gray-50 border-t border-gray-100">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-16 sm:py-20">
        <div className="max-w-2xl mx-auto text-center mb-12">
          <p className="text-sm font-semibold tracking-wider text-green-primary uppercase mb-3">
            Application Tips
          </p>
          <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
            Make your application count.
          </h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 max-w-4xl mx-auto">
          {applicationTips.map((tip) => (
            <div
              key={tip.step}
              className="bg-white rounded-xl border border-gray-200 p-6 hover:border-green-primary/30 hover:shadow-sm transition-all duration-200"
            >
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-full bg-green-50 text-green-primary flex items-center justify-center flex-shrink-0 mt-0.5">
                  <span className="text-sm font-bold">{tip.step}</span>
                </div>
                <div>
                  <h3 className="text-base font-semibold text-gray-900 mb-1">
                    {tip.title}
                  </h3>
                  <p className="text-sm text-gray-600 leading-relaxed">
                    {tip.description}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
