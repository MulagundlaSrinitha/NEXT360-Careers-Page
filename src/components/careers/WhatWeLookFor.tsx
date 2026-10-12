import { candidateQualities } from "./early-careers-data";

export default function WhatWeLookFor() {
  return (
    <section className="bg-gray-50 border-t border-gray-100">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-16 sm:py-20">
        <div className="max-w-2xl mx-auto text-center mb-12">
          <p className="text-sm font-semibold tracking-wider text-green-primary uppercase mb-3">
            What We Look For
          </p>
          <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
            Bring curiosity and a willingness to learn.
          </h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
          {candidateQualities.map((item) => (
            <div
              key={item.step}
              className="bg-white rounded-xl border border-gray-200 p-5 hover:border-green-primary/30 hover:shadow-sm transition-all duration-200 text-center"
            >
              <div className="w-10 h-10 rounded-full bg-green-50 text-green-primary flex items-center justify-center mx-auto mb-3">
                <span className="text-sm font-bold">{item.step}</span>
              </div>
              <h3 className="text-sm font-semibold text-gray-900 mb-1">
                {item.title}
              </h3>
              <p className="text-xs text-gray-600 leading-relaxed">
                {item.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
