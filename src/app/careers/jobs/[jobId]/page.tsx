import type { Metadata } from "next";
import Link from "next/link";
import { getAdminJobById, getSimilarJobs } from "@/components/admin/admin-data";
import JobDetailsClient from "@/components/careers/JobDetailsClient";

interface JobDetailPageProps {
  params: Promise<{ jobId: string }>;
}

export async function generateMetadata({
  params,
}: JobDetailPageProps): Promise<Metadata> {
  const { jobId } = await params;
  const job = await getAdminJobById(jobId);
  if (!job) {
    return {
      title: "Job Not Found | Careers at Next360",
      description: "The job you are looking for could not be found.",
    };
  }
  const desc =
    job.description.length > 160
      ? job.description.slice(0, 157) + "..."
      : job.description;
  return {
    title: `${job.title} | Careers at Next360 | Next360 Organic Products Pvt. Ltd.`,
    description: desc,
  };
}

export default async function JobDetailPage({ params }: JobDetailPageProps) {
  const { jobId } = await params;
  const job = await getAdminJobById(jobId);

  if (!job) {
    return (
      <>
        <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
          <div className="text-center max-w-md">
            <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-gray-100 flex items-center justify-center">
              <svg
                className="w-8 h-8 text-gray-400"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth="1.5"
                stroke="currentColor"
                aria-hidden="true"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z"
                />
              </svg>
            </div>
            <h1 className="text-2xl font-bold text-gray-900 mb-2">
              Job not found
            </h1>
            <p className="text-gray-500 mb-6">
              The opportunity you&apos;re looking for may no longer be available.
            </p>
            <Link
              href="/careers/jobs"
              className="inline-flex items-center justify-center px-5 py-2.5 text-sm font-medium text-white bg-green-primary hover:bg-green-dark rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-green-primary focus:ring-offset-2"
            >
              View all jobs
            </Link>
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <JobDetailsClient job={job} similarJobs={await getSimilarJobs(job, 4)} />
    </>
  );
}
