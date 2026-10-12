import type { Metadata } from "next";
import AdminLayout from "@/components/admin/AdminLayout";

export const metadata: Metadata = {
  title: "Careers Dashboard | Next360 Admin",
  description: "Manage jobs, applications, candidates, and recruitment activity.",
  robots: { index: false, follow: false },
};

export default function AdminCareersLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <AdminLayout>{children}</AdminLayout>;
}
