import type { Metadata } from "next";
import AdminCareersDashboardClient from "@/components/admin/AdminCareersDashboardClient";

export const metadata: Metadata = {
  title: "Careers Dashboard | Next360 Admin",
  description: "Manage jobs, applications, candidates, and recruitment activity.",
  robots: { index: false, follow: false },
};

export default function AdminCareersDashboardPage() {
  return <AdminCareersDashboardClient />;
}
