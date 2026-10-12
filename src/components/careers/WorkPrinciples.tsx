import { workPrinciples } from "./life-at-next360-data";

export default function WorkPrinciples() {
  return (
    <section className="bg-white border-t border-gray-100">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-16 sm:py-20">
        <div className="max-w-2xl mx-auto text-center mb-12">
          <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
            How we work
          </h2>
        </div>

        {/* Desktop: Horizontal */}
        <div className="hidden md:block">
          <div className="relative">
            <div className="absolute top-8 left-0 right-0 h-px bg-gray-200" />
            <div className="grid grid-cols-4 gap-4">
              {workPrinciples.map((item) => (
                <div key={item.step} className="relative text-center">
                  <div className="relative z-10 mx-auto w-16 h-16 rounded-full bg-white border-2 border-green-primary flex items-center justify-center mb-4">
                    <span className="text-lg font-bold text-green-primary">
                      {item.step}
                    </span>
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">
                    {item.title}
                  </h3>
                  <p className="text-sm text-gray-600 leading-relaxed">
                    {item.description}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Mobile: Vertical */}
        <div className="md:hidden">
          <div className="relative pl-8">
            <div className="absolute left-3 top-0 bottom-0 w-px bg-gray-200" />
            <div className="space-y-8">
              {workPrinciples.map((item) => (
                <div key={item.step} className="relative">
                  <div className="absolute -left-8 w-6 h-6 rounded-full bg-white border-2 border-green-primary flex items-center justify-center">
                    <span className="text-[10px] font-bold text-green-primary">
                      {item.step}
                    </span>
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-1">
                      {item.title}
                    </h3>
                    <p className="text-sm text-gray-600 leading-relaxed">
                      {item.description}
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
