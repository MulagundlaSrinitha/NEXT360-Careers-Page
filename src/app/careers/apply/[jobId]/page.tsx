import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getAdminJobById } from "@/components/admin/admin-data";
import JobApplicationClient from "@/components/careers/JobApplicationClient";

interface ApplyPageProps {
  params: Promise<{ jobId: string }>;
}

export async function generateMetadata({
  params,
}: ApplyPageProps): Promise<Metadata> {
  const { jobId } = await params;
  const job = await getAdminJobById(jobId);
  if (!job) {
    return {
      title: "Job Not Found | Careers at Next360",
      description: "The job you are looking for could not be found.",
    };
  }
  return {
    title: `Apply for ${job.title} | Careers at Next360`,
    description: `Apply for the ${job.title} position in the ${job.department} department at Next360 Organic Products Pvt. Ltd.`,
  };
}

export default async function ApplyPage({ params }: ApplyPageProps) {
  const { jobId } = await params;
  const job = await getAdminJobById(jobId);

  if (!job) {
    notFound();
  }

  return <JobApplicationClient job={job} />;
}
