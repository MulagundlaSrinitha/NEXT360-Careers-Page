import type { Metadata } from "next";
import CareersNavbar from "@/components/careers/CareersNavbar";
import CareersFooter from "@/components/careers/CareersFooter";
import AboutHero from "@/components/careers/AboutHero";
import WhoWeAre from "@/components/careers/WhoWeAre";
import WhatWeDo from "@/components/careers/WhatWeDo";
import OurPurpose from "@/components/careers/OurPurpose";
import HowWeWork from "@/components/careers/HowWeWork";
import OurWork from "@/components/careers/OurWork";
import CareersAtNext360 from "@/components/careers/CareersAtNext360";
import AboutCTA from "@/components/careers/AboutCTA";

export const metadata: Metadata = {
  title: "About Next360 | Careers",
  description:
    "Learn more about Next360, our work, and opportunities to build your career with us.",
};

export default function AboutPage() {
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
                <li className="text-gray-600 font-medium">About Next360</li>
              </ol>
            </nav>
          </div>
        </div>

        <AboutHero />
        <WhoWeAre />
        <WhatWeDo />
        <OurPurpose />
        <HowWeWork />
        <OurWork />
        <CareersAtNext360 />
        <AboutCTA />
      </main>
      <CareersFooter />
    </>
  );
}
