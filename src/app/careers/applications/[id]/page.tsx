import type { Metadata } from "next";
import ApplicationDetailsClient from "@/components/careers/ApplicationDetailsClient";

interface ApplicationDetailPageProps {
  params: Promise<{ id: string }>;
}

export async function generateMetadata({
  params,
}: ApplicationDetailPageProps): Promise<Metadata> {
  const { id } = await params;
  void id;
  return {
    title: "Application Details | Careers at Next360",
    description: "View the details of your job application at Next360.",
    robots: { index: false, follow: false },
  };
}

export default async function ApplicationDetailPage({
  params,
}: ApplicationDetailPageProps) {
  const { id } = await params;
  return <ApplicationDetailsClient applicationId={id} />;
}
