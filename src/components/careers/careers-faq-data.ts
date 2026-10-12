import { type ReactNode } from "react";

export type FAQItem = {
  id: string;
  category: string;
  question: string;
  answer: ReactNode;
};

export type FAQCategory = {
  id: string;
  label: string;
};

export const faqCategories: FAQCategory[] = [
  { id: "all", label: "All" },
  { id: "general", label: "General" },
  { id: "jobs-applications", label: "Jobs & Applications" },
  { id: "early-careers", label: "Early Careers" },
  { id: "application-process", label: "Application Process" },
  { id: "interviews", label: "Interviews" },
  { id: "technical-help", label: "Technical Help" },
];

export const faqItems: FAQItem[] = [
  // ── General ──────────────────────────────────────────────
  {
    id: "what-roles-are-available",
    category: "general",
    question: "What types of roles are available at Next360?",
    answer:
      "Current opportunities depend on the roles being recruited for at the time. Visit the Jobs page to see the latest openings.",
  },
  {
    id: "where-to-find-openings",
    category: "general",
    question: "Where can I find current job openings?",
    answer:
      "You can browse current opportunities on the Careers Jobs page.",
  },
  {
    id: "apply-for-more-than-one-role",
    category: "general",
    question: "Can I apply for more than one role?",
    answer:
      "If multiple roles match your background, review each job description and apply according to the requirements listed for each role.",
  },
  {
    id: "what-locations",
    category: "general",
    question: "What locations do you hire for?",
    answer:
      "We hire across multiple locations in India. Specific locations depend on the role and team.",
  },
  {
    id: "remote-or-hybrid",
    category: "general",
    question: "Is remote or hybrid work available?",
    answer:
      "Work arrangements vary by role and team. Check the job listing for details on the work model for each position.",
  },

  // ── Jobs & Applications ──────────────────────────────────
  {
    id: "how-to-apply",
    category: "jobs-applications",
    question: "How do I apply for a job?",
    answer:
      "Open a job from the Careers Jobs page, review the role requirements, and use the Apply button to submit your application.",
  },
  {
    id: "what-information-needed",
    category: "jobs-applications",
    question: "What information do I need to apply?",
    answer:
      "The information requested depends on the role and application form. You may be asked for contact details, education, professional experience, a resume, and relevant professional links.",
  },
  {
    id: "can-i-apply-after-closing",
    category: "jobs-applications",
    question: "Can I apply after a job closes?",
    answer:
      "Applications can only be submitted while a role is accepting applications. Check the individual job listing for its current availability.",
  },

  // ── Resume ───────────────────────────────────────────────
  {
    id: "what-to-include-in-resume",
    category: "jobs-applications",
    question: "What should I include in my resume?",
    answer:
      "Include relevant education, skills, projects, internships, professional experience, certifications, and links that help demonstrate your fit for the role.",
  },
  {
    id: "resume-file-formats",
    category: "jobs-applications",
    question: "What file formats are supported for resumes?",
    answer:
      "The application form accepts PDF, DOC, and DOCX files. The maximum file size is 10 MB.",
  },

  // ── Early Careers ────────────────────────────────────────
  {
    id: "can-students-apply",
    category: "early-careers",
    question: "Can students apply?",
    answer:
      "Eligibility depends on the requirements listed in each role. Review the individual job description to see whether the opportunity is suitable for students.",
  },
  {
    id: "can-recent-graduates-apply",
    category: "early-careers",
    question: "Can recent graduates apply?",
    answer:
      "Many early-career opportunities may be suitable for recent graduates. Check the experience and qualification requirements listed on each job.",
  },
  {
    id: "does-next360-offer-internships",
    category: "early-careers",
    question: "Does Next360 offer internships?",
    answer:
      "Internship opportunities depend on current openings. Check the Jobs page for the latest available opportunities.",
  },
  {
    id: "where-to-find-early-career",
    category: "early-careers",
    question: "Where can I find early-career opportunities?",
    answer:
      "Visit the Early Careers page and the Jobs page to explore current opportunities.",
  },

  // ── Application Process ──────────────────────────────────
  {
    id: "what-happens-after-apply",
    category: "application-process",
    question: "What happens after I submit an application?",
    answer:
      "Your application is recorded and may progress through the hiring process depending on the role and hiring team's assessment. You can use My Applications to review the status available for your application.",
  },
  {
    id: "how-to-check-application-status",
    category: "application-process",
    question: "How can I check my application status?",
    answer:
      "If the application tracking feature is available for your account, sign in and open My Applications to view your submitted applications and their current status.",
  },
  {
    id: "can-i-update-application",
    category: "application-process",
    question: "Can I update an application after submitting it?",
    answer:
      "Submitted applications are handled according to the application's current workflow. If the system does not provide an edit option, the submitted information cannot be changed through the Careers portal.",
  },

  // ── Interviews ───────────────────────────────────────────
  {
    id: "what-to-expect-hiring-process",
    category: "interviews",
    question: "What should I expect during the hiring process?",
    answer:
      "The process can vary by role. Review the job description carefully and follow any instructions provided during the application or subsequent stages.",
  },
  {
    id: "how-to-prepare-interview",
    category: "interviews",
    question: "How should I prepare for an interview?",
    answer:
      "Review the role, understand the skills it requires, and be prepared to discuss your relevant projects, experience, and problem-solving approach.",
  },

  // ── Technical Help ───────────────────────────────────────
  {
    id: "application-form-not-working",
    category: "technical-help",
    question: "What should I do if the application form is not working?",
    answer:
      "Check your internet connection, refresh the page, and try again. If the issue continues, use the available Careers support option if one is provided.",
  },
  {
    id: "resume-wont-upload",
    category: "technical-help",
    question: "My resume won't upload. What should I do?",
    answer:
      "Check that your file uses a format supported by the application form (PDF, DOC, or DOCX) and try uploading it again. If the issue continues, retry from a refreshed session or use the available support channel.",
  },
  {
    id: "cannot-see-application",
    category: "technical-help",
    question: "I cannot see my application.",
    answer:
      "Make sure you are signed in with the account used when the application was submitted. If the issue continues, retry after refreshing your session.",
  },
];
