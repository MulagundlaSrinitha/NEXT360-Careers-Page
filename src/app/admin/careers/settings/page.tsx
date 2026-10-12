import type { Metadata } from "next";
import { Suspense } from "react";
import AdminCareersSettingsClient from "@/components/admin/AdminCareersSettingsClient";

export const metadata: Metadata = {
  title: "Careers Settings | Careers Admin | Next360",
  description: "Manage Careers module configuration.",
  robots: { index: false, follow: false },
};

function SettingsFallback() {
  return (
    <div className="p-4 sm:p-6 lg:p-8">
      <div className="max-w-5xl mx-auto">
        <div className="animate-pulse space-y-6">
          <div className="h-4 bg-gray-200 rounded w-16 mb-2" />
          <div className="h-8 bg-gray-200 rounded w-72" />
          <div className="h-4 bg-gray-200 rounded w-96 mt-1" />
          <div className="bg-white rounded-xl border border-gray-200 h-96 mt-6" />
        </div>
      </div>
    </div>
  );
}

export default function AdminCareersSettingsPage() {
  return (
    <Suspense fallback={<SettingsFallback />}>
      <AdminCareersSettingsClient />
    </Suspense>
  );
}
