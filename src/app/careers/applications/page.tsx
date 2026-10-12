import type { Metadata } from "next";
import MyApplicationsClient from "@/components/careers/MyApplicationsClient";

export const metadata: Metadata = {
  title: "My Applications | Careers at Next360",
  description:
    "View and track the job applications you've submitted at Next360.",
  robots: { index: false, follow: false },
};

export default function ApplicationsPage() {
  return <MyApplicationsClient />;
}
