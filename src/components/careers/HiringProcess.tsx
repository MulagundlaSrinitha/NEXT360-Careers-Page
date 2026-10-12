import { hiringProcess } from "./careers-data";

export default function HiringProcess() {
  return (
    <section className="py-16 sm:py-24 bg-gray-50">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="max-w-2xl mx-auto text-center mb-12">
          <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
            Our hiring process
          </h2>
          <p className="text-lg text-gray-600">
            Every role is different, but our hiring process is designed to help
            both you and our teams understand whether there is a good fit.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 max-w-5xl mx-auto">
          {hiringProcess.map((step, index) => (
            <div key={step.step} className="relative">
              {/* Connector line (desktop) */}
              {index < hiringProcess.length - 1 && (
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

        <p className="text-center text-sm text-gray-500 mt-8">
          Process and interview stages may vary by role.
        </p>
      </div>
    </section>
  );
}
