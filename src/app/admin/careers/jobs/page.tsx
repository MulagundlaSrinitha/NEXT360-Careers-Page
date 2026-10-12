import type { Metadata } from "next";
import { Suspense } from "react";
import AdminJobsClient from "@/components/admin/AdminJobsClient";

export const metadata: Metadata = {
  title: "Jobs Management | Careers Admin | Next360",
  description: "Create, manage, and monitor Next360 job postings.",
  robots: { index: false, follow: false },
};

function JobsFallback() {
  return (
    <div className="p-4 sm:p-6 lg:p-8">
      <div className="max-w-7xl mx-auto">
        <div className="animate-pulse space-y-6">
          <div className="h-4 bg-gray-200 rounded w-16 mb-2" />
          <div className="h-8 bg-gray-200 rounded w-32" />
          <div className="h-4 bg-gray-200 rounded w-64 mt-1" />
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4 mt-6">
            {Array.from({ length: 5 }).map((_, i) => (
              <div key={i} className="h-24 bg-gray-200 rounded-xl" />
            ))}
          </div>
          <div className="h-16 bg-gray-200 rounded-xl" />
          <div className="bg-white rounded-xl border border-gray-200 h-96" />
        </div>
      </div>
    </div>
  );
}

export default function AdminJobsPage() {
  return (
    <Suspense fallback={<JobsFallback />}>
      <AdminJobsClient />
    </Suspense>
  );
}
