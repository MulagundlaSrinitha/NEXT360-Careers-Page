import { workPrinciples } from "./about-next360-data";

export default function HowWeWork() {
  return (
    <section className="py-16 sm:py-24 bg-white">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="max-w-2xl mx-auto text-center mb-12">
          <p className="text-sm font-semibold tracking-wider text-green-primary uppercase mb-3">
            HOW WE WORK
          </p>
          <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
            How we approach the work
          </h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 max-w-5xl mx-auto">
          {workPrinciples.map((step, index) => (
            <div key={step.step} className="relative">
              {/* Connector line (desktop) */}
              {index < workPrinciples.length - 1 && (
                <div className="hidden lg:block absolute top-8 left-[calc(50%+32px)] right-[calc(-50%+32px)] h-px bg-gray-200" />
              )}

              <div className="text-center relative z-10">
                <div className="w-16 h-16 rounded-full bg-white border-2 border-green-primary flex items-center justify-center mx-auto mb-4">
                  <span className="text-lg font-bold text-green-primary">
                    {step.step}
                  </span>
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  {step.title}
                </h3>
                <p className="text-sm text-gray-600 leading-relaxed">
                  {step.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
