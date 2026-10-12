import type { Metadata } from "next";
import CareersNavbar from "@/components/careers/CareersNavbar";
import CareersFooter from "@/components/careers/CareersFooter";
import CareersFAQHero from "@/components/careers/CareersFAQHero";
import CareersFAQClient from "@/components/careers/CareersFAQClient";

export const metadata: Metadata = {
  title: "Careers FAQ | Next360",
  description:
    "Find answers to common questions about careers, jobs, applications, early-career opportunities, and the hiring process at Next360.",
};

export default function CareersFAQPage() {
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
                <li className="text-gray-600 font-medium">FAQ</li>
              </ol>
            </nav>
          </div>
        </div>

        <CareersFAQHero />
        <CareersFAQClient />
      </main>
      <CareersFooter />
    </>
  );
}
