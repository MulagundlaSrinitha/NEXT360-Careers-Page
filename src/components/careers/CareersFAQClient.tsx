"use client";

import { useState, useMemo, useCallback, useRef, useEffect } from "react";
import Link from "next/link";
import {
  faqCategories,
  faqItems,
} from "./careers-faq-data";

function getInitialOpenId(): string | null {
  if (typeof window === "undefined") return null;
  const hash = window.location.hash.replace("#", "");
  if (!hash) return null;
  const item = faqItems.find((i) => i.id === hash);
  return item ? item.id : null;
}

export default function CareersFAQClient() {
  const [searchQuery, setSearchQuery] = useState("");
  const [activeCategory, setActiveCategory] = useState("all");
  const [openId, setOpenId] = useState<string | null>(getInitialOpenId);
  const searchInputRef = useRef<HTMLInputElement>(null);
  const hasScrolledToHash = useRef(false);

  const filteredItems = useMemo(() => {
    let items = faqItems;

    if (activeCategory !== "all") {
      items = items.filter((item) => item.category === activeCategory);
    }

    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      items = items.filter(
        (item) =>
          item.question.toLowerCase().includes(query) ||
          (typeof item.answer === "string" &&
            item.answer.toLowerCase().includes(query)) ||
          item.category.toLowerCase().includes(query)
      );
    }

    return items;
  }, [searchQuery, activeCategory]);

  const resultCount = filteredItems.length;

  const toggleFAQ = useCallback(
    (id: string) => {
      setOpenId((prev) => (prev === id ? null : id));
    },
    []
  );

  const clearSearch = useCallback(() => {
    setSearchQuery("");
    searchInputRef.current?.focus();
  }, []);

  const clearFilters = useCallback(() => {
    setSearchQuery("");
    setActiveCategory("all");
    setOpenId(null);
  }, []);

  const handleCategoryChange = useCallback((categoryId: string) => {
    setActiveCategory(categoryId);
    setOpenId(null);
  }, []);

  useEffect(() => {
    if (typeof window === "undefined") return;
    if (hasScrolledToHash.current) return;
    const hash = window.location.hash.replace("#", "");
    if (hash && faqItems.some((i) => i.id === hash)) {
      hasScrolledToHash.current = true;
      setTimeout(() => {
        const el = document.getElementById(`faq-item-${hash}`);
        el?.scrollIntoView({ behavior: "smooth", block: "center" });
      }, 100);
    }
  }, []);

  return (
    <>
      {/* Search */}
      <section className="bg-white">
        <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8 -mt-6 pb-8">
          <div className="relative">
            <label htmlFor="faq-search" className="sr-only">
              Search questions
            </label>
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
              <svg
                className="w-5 h-5 text-gray-400"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth="2"
                stroke="currentColor"
                aria-hidden="true"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z"
                />
              </svg>
            </div>
            <input
              ref={searchInputRef}
              id="faq-search"
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search questions..."
              className="w-full pl-11 pr-10 py-3.5 text-sm rounded-xl border border-gray-200 bg-gray-50 text-gray-900 placeholder-gray-400 transition-colors focus:outline-none focus:ring-2 focus:ring-green-primary focus:border-green-primary focus:bg-white"
            />
            {searchQuery && (
              <button
                type="button"
                onClick={clearSearch}
                className="absolute inset-y-0 right-0 pr-4 flex items-center text-gray-400 hover:text-gray-600 transition-colors"
                aria-label="Clear search"
              >
                <svg
                  className="w-5 h-5"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth="1.5"
                  stroke="currentColor"
                  aria-hidden="true"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
            )}
          </div>
        </div>
      </section>

      {/* Categories */}
      <section className="bg-white border-b border-gray-100">
        <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
          <div
            className="flex gap-2 overflow-x-auto pb-4 scrollbar-hide -mx-4 px-4 sm:mx-0 sm:px-0"
            role="tablist"
            aria-label="FAQ categories"
          >
            {faqCategories.map((cat) => (
              <button
                key={cat.id}
                type="button"
                role="tab"
                aria-selected={activeCategory === cat.id}
                onClick={() => handleCategoryChange(cat.id)}
                className={`flex-shrink-0 px-4 py-2 text-sm font-medium rounded-lg transition-colors whitespace-nowrap ${
                  activeCategory === cat.id
                    ? "bg-green-primary text-white"
                    : "bg-gray-100 text-gray-600 hover:bg-gray-200 hover:text-gray-900"
                }`}
              >
                {cat.label}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ Content */}
      <section className="bg-white">
        <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
          {/* Result count */}
          {searchQuery.trim() && (
            <p className="text-sm text-gray-500 mb-6">
              {resultCount === 1
                ? "1 question matches your search"
                : `${resultCount} questions match your search`}
            </p>
          )}

          {/* Empty state */}
          {resultCount === 0 && (
            <div className="text-center py-12">
              <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-gray-100 flex items-center justify-center">
                <svg
                  className="w-8 h-8 text-gray-400"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth="1.5"
                  stroke="currentColor"
                  aria-hidden="true"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z"
                  />
                </svg>
              </div>
              <h2 className="text-xl font-semibold text-gray-900 mb-2">
                No matching questions
              </h2>
              <p className="text-gray-500 mb-6">
                Try a different search term or browse the categories below.
              </p>
              <button
                type="button"
                onClick={clearFilters}
                className="inline-flex items-center justify-center px-5 py-2.5 text-sm font-medium text-green-primary border border-green-primary hover:bg-green-primary hover:text-white rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-green-primary focus:ring-offset-2"
              >
                Clear Search
              </button>
            </div>
          )}

          {/* Accordion */}
          {resultCount > 0 && (
            <div className="space-y-3" role="list">
              {filteredItems.map((item) => (
                <div
                  key={item.id}
                  id={`faq-item-${item.id}`}
                  className="border border-gray-200 rounded-xl overflow-hidden"
                  role="listitem"
                >
                  <button
                    type="button"
                    onClick={() => toggleFAQ(item.id)}
                    className="w-full flex items-center justify-between px-6 py-5 text-left hover:bg-gray-50 transition-colors focus:outline-none focus:ring-2 focus:ring-green-primary focus:ring-inset"
                    aria-expanded={openId === item.id}
                    aria-controls={`faq-answer-${item.id}`}
                    id={`faq-question-${item.id}`}
                  >
                    <span className="text-base font-medium text-gray-900 pr-4">
                      {item.question}
                    </span>
                    <svg
                      className={`w-5 h-5 text-gray-500 flex-shrink-0 transition-transform duration-200 ${
                        openId === item.id ? "rotate-180" : ""
                      }`}
                      fill="none"
                      viewBox="0 0 24 24"
                      strokeWidth="2"
                      stroke="currentColor"
                      aria-hidden="true"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M19.5 8.25l-7.5 7.5-7.5-7.5"
                      />
                    </svg>
                  </button>
                  <div
                    id={`faq-answer-${item.id}`}
                    role="region"
                    aria-labelledby={`faq-question-${item.id}`}
                    className={`overflow-hidden transition-all duration-200 ${
                      openId === item.id ? "max-h-96" : "max-h-0"
                    }`}
                  >
                    <div className="px-6 pb-5 text-gray-600 leading-relaxed">
                      {item.id === "where-to-find-openings" ? (
                        <>
                          You can browse current opportunities on the{" "}
                          <Link
                            href="/careers/jobs"
                            className="text-green-primary hover:text-green-dark font-medium transition-colors"
                          >
                            Careers Jobs page
                          </Link>
                          .
                        </>
                      ) : item.id === "how-to-apply" ? (
                        <>
                          Open a job from the{" "}
                          <Link
                            href="/careers/jobs"
                            className="text-green-primary hover:text-green-dark font-medium transition-colors"
                          >
                            Careers Jobs page
                          </Link>
                          , review the role requirements, and use the Apply
                          button to submit your application.
                        </>
                      ) : item.id === "what-happens-after-apply" ? (
                        <>
                          Your application is recorded and may progress through
                          the hiring process depending on the role and hiring
                          team&apos;s assessment. You can use{" "}
                          <Link
                            href="/careers/applications"
                            className="text-green-primary hover:text-green-dark font-medium transition-colors"
                          >
                            My Applications
                          </Link>{" "}
                          to review the status available for your application.
                        </>
                      ) : item.id === "how-to-check-application-status" ? (
                        <>
                          If the application tracking feature is available for
                          your account, sign in and open{" "}
                          <Link
                            href="/careers/applications"
                            className="text-green-primary hover:text-green-dark font-medium transition-colors"
                          >
                            My Applications
                          </Link>{" "}
                          to view your submitted applications and their current
                          status.
                        </>
                      ) : item.id === "where-to-find-early-career" ? (
                        <>
                          Visit the{" "}
                          <Link
                            href="/careers/early-careers"
                            className="text-green-primary hover:text-green-dark font-medium transition-colors"
                          >
                            Early Careers page
                          </Link>{" "}
                          and the{" "}
                          <Link
                            href="/careers/jobs"
                            className="text-green-primary hover:text-green-dark font-medium transition-colors"
                          >
                            Jobs page
                          </Link>{" "}
                          to explore current opportunities.
                        </>
                      ) : (
                        item.answer
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Still Have Questions */}
      <section className="bg-gray-50 border-t border-gray-100">
        <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8 py-16 sm:py-20 text-center">
          <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-3">
            Still have questions?
          </h2>
          <p className="text-gray-600 mb-8 max-w-lg mx-auto">
            If you didn&apos;t find what you&apos;re looking for, continue
            exploring our Careers pages.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
            <Link
              href="/careers/jobs"
              className="inline-flex items-center justify-center px-6 py-3 text-base font-medium text-white bg-green-primary hover:bg-green-dark rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-green-primary focus:ring-offset-2"
            >
              Browse Jobs
            </Link>
            <Link
              href="/careers"
              className="inline-flex items-center justify-center px-6 py-3 text-base font-medium text-gray-700 bg-white border border-gray-300 hover:border-gray-400 hover:bg-gray-50 rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-green-primary focus:ring-offset-2"
            >
              Back to Careers
            </Link>
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="bg-green-primary">
        <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8 py-16 sm:py-20 text-center">
          <h2 className="text-2xl sm:text-3xl font-bold text-white mb-3">
            Ready to explore your next opportunity?
          </h2>
          <p className="text-green-100 mb-8 max-w-lg mx-auto">
            Browse current openings and find a role that matches your skills and
            experience.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
            <Link
              href="/careers/jobs"
              className="inline-flex items-center justify-center px-6 py-3 text-base font-medium text-green-primary bg-white hover:bg-gray-50 rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-green-primary"
            >
              Explore Open Roles
            </Link>
            <Link
              href="/careers/early-careers"
              className="inline-flex items-center justify-center px-6 py-3 text-base font-medium text-white border border-white/40 hover:bg-white/10 rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-green-primary"
            >
              Explore Early Careers
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
