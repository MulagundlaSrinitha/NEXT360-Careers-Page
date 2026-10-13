import type { Metadata } from "next";
import CareersNavbar from "@/components/careers/CareersNavbar";
import CareersFooter from "@/components/careers/CareersFooter";
import EarlyCareersHero from "@/components/careers/EarlyCareersHero";
import EarlyOpportunities from "@/components/careers/EarlyOpportunities";
import WhyStartHere from "@/components/careers/WhyStartHere";
import CareerAreasGrid from "@/components/careers/CareerAreasGrid";
import HowToGetStarted from "@/components/careers/HowToGetStarted";
import WhatWeLookFor from "@/components/careers/WhatWeLookFor";
import EarlyCurrentOpportunities from "@/components/careers/EarlyCurrentOpportunities";
import ApplicationTips from "@/components/careers/ApplicationTips";
import EarlyCareersFAQ from "@/components/careers/EarlyCareersFAQ";
import EarlyCareersCTA from "@/components/careers/EarlyCareersCTA";

export const metadata: Metadata = {
  title: "Early Careers at Next360 | Careers",
  description:
    "Explore early-career opportunities at Next360 for students, recent graduates, interns, and entry-level candidates.",
};

// Team job counts below are read from PostgreSQL at request time.
export const dynamic = "force-dynamic";

export default function EarlyCareersPage() {
  return (
    <>
      <CareersNavbar />
      <main className="min-h-screen bg-gray-50">
        {/* Breadcrumb */}
        <div className="bg-white border-b border-gray-100">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-3">
            <nav aria-label="Breadcrumb" className="text-sm text-gray-400">
              <ol className="flex items-center gap-1.5">
                <li>
                  <a
                    href="/careers"
                    className="hover:text-gray-600 transition-colors"
                  >
                    Careers
                  </a>
                </li>
                <li aria-hidden="true">/</li>
                <li className="text-gray-600 font-medium">Early Careers</li>
              </ol>
            </nav>
          </div>
        </div>

        <EarlyCareersHero />
        <EarlyOpportunities />
        <WhyStartHere />
        <CareerAreasGrid />
        <HowToGetStarted />
        <WhatWeLookFor />
        <EarlyCurrentOpportunities />
        <ApplicationTips />
        <EarlyCareersFAQ />
        <EarlyCareersCTA />
      </main>
      <CareersFooter />
    </>
  );
}
