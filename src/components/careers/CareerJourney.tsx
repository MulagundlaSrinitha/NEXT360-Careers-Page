import { careerJourney } from "./careers-data";

export default function CareerJourney() {
  return (
    <section className="py-16 sm:py-24 bg-gray-50" id="career-growth">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="max-w-2xl mx-auto text-center mb-12">
          <p className="text-sm font-semibold tracking-wider text-green-primary uppercase mb-3">
            Grow Your Career
          </p>
          <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
            Your journey can keep moving forward.
          </h2>
        </div>

        {/* Desktop: Horizontal Timeline */}
        <div className="hidden md:block">
          <div className="relative">
            {/* Line */}
            <div className="absolute top-8 left-0 right-0 h-px bg-gray-200" />

            <div className="grid grid-cols-5 gap-4">
              {careerJourney.map((step) => (
                <div key={step.step} className="relative text-center">
                  {/* Dot */}
                  <div className="relative z-10 mx-auto w-16 h-16 rounded-full bg-white border-2 border-green-primary flex items-center justify-center mb-4">
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
              ))}
            </div>
          </div>
        </div>

        {/* Mobile: Vertical Timeline */}
        <div className="md:hidden">
          <div className="relative pl-8">
            {/* Vertical Line */}
            <div className="absolute left-3 top-0 bottom-0 w-px bg-gray-200" />

            <div className="space-y-8">
              {careerJourney.map((step) => (
                <div key={step.step} className="relative">
                  {/* Dot */}
                  <div className="absolute -left-8 w-6 h-6 rounded-full bg-white border-2 border-green-primary flex items-center justify-center">
                    <span className="text-[10px] font-bold text-green-primary">
                      {step.step}
                    </span>
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-1">
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
        </div>
      </div>
    </section>
  );
}
