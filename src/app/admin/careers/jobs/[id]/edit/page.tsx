import type { Metadata } from "next";
import { Suspense } from "react";
import AdminEditJobClient from "@/components/admin/AdminEditJobClient";

export const metadata: Metadata = {
  title: "Edit Job | Careers Admin | Next360",
  description: "Edit a job posting for Next360.",
  robots: { index: false, follow: false },
};

interface AdminEditJobPageProps {
  params: Promise<{ id: string }>;
}

function EditJobFallback() {
  return (
    <div className="p-4 sm:p-6 lg:p-8">
      <div className="max-w-4xl mx-auto">
        <div className="animate-pulse space-y-6">
          <div className="h-3 bg-gray-200 rounded w-40" />
          <div className="h-8 bg-gray-200 rounded w-32" />
          <div className="h-4 bg-gray-200 rounded w-72 mt-1" />
          <div className="bg-white rounded-xl border border-gray-200 p-6">
            <div className="h-5 bg-gray-200 rounded w-40 mb-6" />
            <div className="space-y-4">
              <div className="h-10 bg-gray-200 rounded w-full" />
              <div className="grid grid-cols-2 gap-4">
                <div className="h-10 bg-gray-200 rounded" />
                <div className="h-10 bg-gray-200 rounded" />
              </div>
              <div className="h-10 bg-gray-200 rounded" />
            </div>
          </div>
          <div className="bg-white rounded-xl border border-gray-200 p-6">
            <div className="h-5 bg-gray-200 rounded w-36 mb-6" />
            <div className="h-32 bg-gray-200 rounded" />
          </div>
        </div>
      </div>
    </div>
  );
}

export default async function AdminEditJobPage({
  params,
}: AdminEditJobPageProps) {
  const { id } = await params;

  return (
    <Suspense fallback={<EditJobFallback />}>
      <AdminEditJobClient id={id} />
    </Suspense>
  );
}