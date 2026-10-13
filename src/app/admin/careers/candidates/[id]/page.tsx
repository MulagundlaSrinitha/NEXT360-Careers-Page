import type { Metadata } from "next";
import { Suspense } from "react";
import AdminCandidateDetailsClient from "@/components/admin/AdminCandidateDetailsClient";
import { getAdminCandidateDetail } from "@/components/admin/admin-data";

export const metadata: Metadata = {
  title: "Candidate Details | Careers Admin | Next360",
  description:
    "Review a candidate's profile and application history for opportunities at Next360.",
  robots: { index: false, follow: false },
};

interface AdminCandidateDetailsPageProps {
  params: Promise<{ id: string }>;
}

function CandidateDetailsFallback() {
  return (
    <div className="p-4 sm:p-6 lg:p-8">
      <div className="max-w-5xl mx-auto animate-pulse space-y-6">
        <div className="h-3 bg-gray-200 rounded w-56" />
        <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
          <div className="space-y-2">
            <div className="h-8 bg-gray-200 rounded w-64" />
            <div className="h-4 bg-gray-200 rounded w-80" />
          </div>
          <div className="h-10 bg-gray-200 rounded-lg w-36" />
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="h-24 bg-gray-200 rounded-xl" />
          ))}
        </div>
        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <div className="h-5 bg-gray-200 rounded w-40 mb-5" />
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
          <div className="h-5 bg-gray-200 rounded w-44 mb-5" />
          <div className="h-28 bg-gray-200 rounded" />
        </div>
      </div>
    </div>
  );
}

export default async function AdminCandidateDetailsPage({
  params,
}: AdminCandidateDetailsPageProps) {
  const { id } = await params;
  const initialData = await getAdminCandidateDetail(id);

  return (
    <Suspense fallback={<CandidateDetailsFallback />}>
      <AdminCandidateDetailsClient id={id} initialData={initialData} />
    </Suspense>
  );
}