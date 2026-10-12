import type { Metadata } from "next";
import { Suspense } from "react";
import JobsPageClient from "@/components/careers/JobsPageClient";

export const metadata: Metadata = {
  title: "Job Openings | Careers at Next360 | Next360 Organic Products Pvt. Ltd.",
  description:
    "Browse open job opportunities at Next360 Organic Products Pvt. Ltd. Search and filter roles across technology, product, operations, and business teams.",
};

function JobsPageFallback() {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-10">
        <div className="animate-pulse space-y-6">
          <div className="h-4 bg-gray-200 rounded w-20" />
          <div className="h-9 bg-gray-200 rounded w-80" />
          <div className="h-5 bg-gray-200 rounded w-96" />
          <div className="h-12 bg-gray-200 rounded w-full max-w-2xl" />
          <div className="space-y-4 mt-8">
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="h-40 bg-gray-200 rounded-xl" />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default function JobsPage() {
  return (
    <Suspense fallback={<JobsPageFallback />}>
      <JobsPageClient />
    </Suspense>
  );
}
