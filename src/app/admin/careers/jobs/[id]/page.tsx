import type { Metadata } from "next";
import { Suspense } from "react";
import AdminJobDetailsClient from "@/components/admin/AdminJobDetailsClient";

export const metadata: Metadata = {
  title: "Job Details | Careers Admin | Next360",
  description: "View job information, publication status, and recruitment details.",
  robots: { index: false, follow: false },
};

interface AdminJobDetailsPageProps {
  params: Promise<{ id: string }>;
}

function JobDetailsFallback() {
  return (
    <div className="p-4 sm:p-6 lg:p-8">
      <div className="max-w-5xl mx-auto">
        <div className="animate-pulse space-y-6">
          <div className="h-3 bg-gray-200 rounded w-56" />
          <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
            <div className="space-y-2">
              <div className="h-8 bg-gray-200 rounded w-64" />
              <div className="h-4 bg-gray-200 rounded w-80" />
            </div>
            <div className="flex items-center gap-3">
              <div className="h-10 bg-gray-200 rounded-lg w-28" />
              <div className="h-10 bg-gray-200 rounded-lg w-28" />
            </div>
          </div>
          <div className="bg-white rounded-xl border border-gray-200 p-6">
            <div className="h-5 bg-gray-200 rounded w-36 mb-5" />
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {Array.from({ length: 6 }).map((_, i) => (
                <div key={i}>
                  <div className="h-3 bg-gray-200 rounded w-20 mb-2" />
                  <div className="h-5 bg-gray-200 rounded w-28" />
                </div>
              ))}
            </div>
          </div>
          <div className="bg-white rounded-xl border border-gray-200 p-6">
            <div className="h-5 bg-gray-200 rounded w-40 mb-5" />
            <div className="h-32 bg-gray-200 rounded" />
          </div>
        </div>
      </div>
    </div>
  );
}

export default async function AdminJobDetailsPage({
  params,
}: AdminJobDetailsPageProps) {
  const { id } = await params;

  return (
    <Suspense fallback={<JobDetailsFallback />}>
      <AdminJobDetailsClient id={id} />
    </Suspense>
  );
}