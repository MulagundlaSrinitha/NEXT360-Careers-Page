import { whyStartHereCards } from "./early-careers-data";

export default function WhyStartHere() {
  return (
    <section className="bg-white border-t border-gray-100">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-16 sm:py-20">
        <div className="max-w-2xl mx-auto text-center mb-12">
          <p className="text-sm font-semibold tracking-wider text-green-primary uppercase mb-3">
            Why Next360
          </p>
          <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
            Build your foundation with real experience.
          </h2>
          <p className="text-lg text-gray-600">
            Your early career is a chance to learn, contribute, and discover
            where your skills can take you.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {whyStartHereCards.map((card) => (
            <div
              key={card.step}
              className="bg-gray-50 rounded-xl border border-gray-200 p-6 hover:border-green-primary/30 transition-all duration-200"
            >
              <div className="w-12 h-12 rounded-full bg-green-50 text-green-primary flex items-center justify-center mb-4">
                <span className="text-lg font-bold">{card.step}</span>
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                {card.title}
              </h3>
              <p className="text-sm text-gray-600 leading-relaxed">
                {card.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
