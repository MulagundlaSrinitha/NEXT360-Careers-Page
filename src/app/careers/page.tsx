import type { Metadata } from "next";
import CareersNavbar from "@/components/careers/CareersNavbar";
import CareersHero from "@/components/careers/CareersHero";
import JobSearch from "@/components/careers/JobSearch";
import WhyNext360 from "@/components/careers/WhyNext360";
import TeamsSection from "@/components/careers/TeamsSection";
import LifeAtNext360 from "@/components/careers/LifeAtNext360";
import EmployeeStories from "@/components/careers/EmployeeStories";
import CareerJourney from "@/components/careers/CareerJourney";
import EarlyCareers from "@/components/careers/EarlyCareers";
import HiringProcess from "@/components/careers/HiringProcess";
import FAQ from "@/components/careers/FAQ";
import FinalCTA from "@/components/careers/FinalCTA";
import CareersFooter from "@/components/careers/CareersFooter";

export const metadata: Metadata = {
  title: "Careers at Next360 | Next360 Organic Products Pvt. Ltd.",
  description:
    "Explore career opportunities at Next360 Organic Products Pvt. Ltd. Find jobs across technology, product, operations, business, and more.",
};

export default function CareersPage() {
  return (
    <>
      <CareersNavbar />
      <main>
        <CareersHero />
        <JobSearch />
        <WhyNext360 />
        <TeamsSection />
        <LifeAtNext360 />
        <EmployeeStories />
        <CareerJourney />
        <EarlyCareers />
        <HiringProcess />
        <FAQ />
        <FinalCTA />
      </main>
      <CareersFooter />
    </>
  );
}
