import { ourWorkSteps } from "./about-next360-data";

export default function OurWork() {
  return (
    <section className="py-16 sm:py-24 bg-gray-50">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="max-w-2xl mx-auto text-center mb-12">
          <p className="text-sm font-semibold tracking-wider text-green-primary uppercase mb-3">
            OUR WORK
          </p>
          <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
            Where ideas become real work.
          </h2>
        </div>

        {/* Desktop: Horizontal Flow */}
        <div className="hidden md:block max-w-4xl mx-auto">
          <div className="relative">
            {/* Connecting line */}
            <div className="absolute top-10 left-[calc(12.5%+24px)] right-[calc(12.5%+24px)] h-px bg-gray-300" />

            <div className="grid grid-cols-4 gap-4">
              {ourWorkSteps.map((step, index) => (
                <div key={step.label} className="relative text-center">
                  <div className="relative z-10 mx-auto w-12 h-12 rounded-full bg-green-primary flex items-center justify-center mb-4">
                    <span className="text-sm font-bold text-white">
                      {index + 1}
                    </span>
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">
                    {step.label}
                  </h3>
                  <p className="text-sm text-gray-600 leading-relaxed">
                    {step.description}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Mobile: Vertical Flow */}
        <div className="md:hidden max-w-md mx-auto">
          <div className="relative pl-8">
            {/* Vertical Line */}
            <div className="absolute left-3 top-0 bottom-0 w-px bg-gray-300" />

            <div className="space-y-8">
              {ourWorkSteps.map((step, index) => (
                <div key={step.label} className="relative">
                  <div className="absolute -left-8 w-6 h-6 rounded-full bg-green-primary flex items-center justify-center">
                    <span className="text-[10px] font-bold text-white">
                      {index + 1}
                    </span>
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-1">
                      {step.label}
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
