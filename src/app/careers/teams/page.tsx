import type { Metadata } from "next";
import TeamsPageClient from "@/components/careers/TeamsPageClient";

export const metadata: Metadata = {
  title: "Teams | Careers at Next360",
  description:
    "Explore teams and career opportunities at Next360 Organic Products Pvt. Ltd.",
};

export default function TeamsPage() {
  return <TeamsPageClient />;
}
