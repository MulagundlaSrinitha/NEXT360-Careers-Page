import { learningCards } from "./life-at-next360-data";

export default function LearningGrowth() {
  return (
    <section className="bg-gray-50 border-t border-gray-100">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-16 sm:py-20">
        <div className="max-w-2xl mx-auto text-center mb-12">
          <p className="text-sm font-semibold tracking-wider text-green-primary uppercase mb-3">
            Learning &amp; Growth
          </p>
          <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
            Keep learning. Keep moving forward.
          </h2>
          <p className="text-lg text-gray-600">
            Growth happens through the work you do, the people you learn from,
            and the challenges you take on.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 max-w-5xl mx-auto">
          {learningCards.map((card) => (
            <div
              key={card.step}
              className="bg-white rounded-xl border border-gray-200 p-6 hover:border-green-primary/30 hover:shadow-sm transition-all duration-200"
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
