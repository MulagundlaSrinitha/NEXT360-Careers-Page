import type { Metadata } from "next";
import CareersNavbar from "@/components/careers/CareersNavbar";
import CareersFooter from "@/components/careers/CareersFooter";
import LifeAtNext360Hero from "@/components/careers/LifeAtNext360Hero";
import OurPeople from "@/components/careers/OurPeople";
import LifeHighlights from "@/components/careers/LifeHighlights";
import WorkPrinciples from "@/components/careers/WorkPrinciples";
import LearningGrowth from "@/components/careers/LearningGrowth";
import CollaborationSection from "@/components/careers/CollaborationSection";
import LifeGallery from "@/components/careers/LifeGallery";
import EmployeeStories from "@/components/careers/EmployeeStories";
import LifeCTA from "@/components/careers/LifeCTA";

export const metadata: Metadata = {
  title: "Life at Next360 | Careers",
  description:
    "Discover life at Next360 through our people, workplace, learning, collaboration, and everyday experiences.",
};

export default function LifeAtNext360Page() {
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
                <li className="text-gray-600 font-medium">
                  Life at Next360
                </li>
              </ol>
            </nav>
          </div>
        </div>

        <LifeAtNext360Hero />
        <OurPeople />
        <LifeHighlights />
        <WorkPrinciples />
        <LearningGrowth />
        <CollaborationSection />
        <LifeGallery />
        <EmployeeStories />
        <LifeCTA />
      </main>
      <CareersFooter />
    </>
  );
}
