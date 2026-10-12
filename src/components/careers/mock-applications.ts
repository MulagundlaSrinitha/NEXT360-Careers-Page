import type { Job } from "./types";

export type ApplicationStatus =
  | "applied"
  | "under_review"
  | "interview"
  | "selected"
  | "rejected"
  | "withdrawn";

export interface EducationRecord {
  qualification: string;
  institution: string;
  fieldOfStudy: string;
  graduationYear: string;
}

export interface StoredApplication {
  id: string;
  jobId: string;
  jobTitle: string;
  department: string;
  location: string;
  employmentType: string;
  workMode: string;
  experience: string;
  candidateEmail: string;
  candidateFirstName: string;
  candidateLastName: string;
  status: ApplicationStatus;
  appliedAt: string;
  phone?: string;
  currentLocation?: string;
  country?: string;
  currentJobTitle?: string;
  currentCompany?: string;
  experienceLevel?: string;
  yearsOfExperience?: string;
  education?: EducationRecord[];
  resumeFileName?: string;
  resumeFileSize?: string;
  linkedinUrl?: string;
  githubUrl?: string;
  portfolioUrl?: string;
  otherWebsite?: string;
  additionalAnswers?: Record<string, string>;
}

const STORAGE_KEY = "next360_applications";
const AUTH_KEY = "next360_candidate_email";

function isClient(): boolean {
  return typeof window !== "undefined";
}

function generateApplicationId(): string {
  return `APP-${Date.now().toString(36).toUpperCase()}-${Math.random().toString(36).substring(2, 6).toUpperCase()}`;
}

function formatDate(date: Date): string {
  return date.toISOString();
}

export function getStoredApplications(): StoredApplication[] {
  if (!isClient()) return [];
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    return stored ? JSON.parse(stored) : [];
  } catch {
    return [];
  }
}

function saveStoredApplications(apps: StoredApplication[]): void {
  if (!isClient()) return;
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(apps));
  } catch {
    // Silently fail
  }
}

export function getCandidateEmail(): string | null {
  if (!isClient()) return null;
  try {
    return localStorage.getItem(AUTH_KEY);
  } catch {
    return null;
  }
}

export function setCandidateEmail(email: string): void {
  if (!isClient()) return;
  try {
    localStorage.setItem(AUTH_KEY, email);
  } catch {
    // Silently fail
  }
}

export function clearCandidateEmail(): void {
  if (!isClient()) return;
  try {
    localStorage.removeItem(AUTH_KEY);
  } catch {
    // Silently fail
  }
}

export function getApplicationsForCandidate(
  email: string
): StoredApplication[] {
  return getStoredApplications().filter(
    (app) => app.candidateEmail.toLowerCase() === email.toLowerCase()
  );
}

export interface SaveApplicationInput {
  job: Job;
  candidateEmail: string;
  candidateFirstName: string;
  candidateLastName: string;
  phone?: string;
  currentLocation?: string;
  country?: string;
  currentJobTitle?: string;
  currentCompany?: string;
  experienceLevel?: string;
  yearsOfExperience?: string;
  education?: EducationRecord[];
  resumeFileName?: string;
  resumeFileSize?: string;
  linkedinUrl?: string;
  githubUrl?: string;
  portfolioUrl?: string;
  otherWebsite?: string;
  additionalAnswers?: Record<string, string>;
}

export function saveApplication(input: SaveApplicationInput): StoredApplication {
  const apps = getStoredApplications();

  const existing = apps.find(
    (a) =>
      a.jobId === input.job.id &&
      a.candidateEmail.toLowerCase() === input.candidateEmail.toLowerCase()
  );

  if (existing) {
    return existing;
  }

  const newApp: StoredApplication = {
    id: generateApplicationId(),
    jobId: input.job.id,
    jobTitle: input.job.title,
    department: input.job.department,
    location: input.job.location,
    employmentType: input.job.employmentType,
    workMode: input.job.workMode,
    experience: input.job.experience,
    candidateEmail: input.candidateEmail,
    candidateFirstName: input.candidateFirstName,
    candidateLastName: input.candidateLastName,
    status: "applied",
    appliedAt: formatDate(new Date()),
    phone: input.phone || undefined,
    currentLocation: input.currentLocation || undefined,
    country: input.country || undefined,
    currentJobTitle: input.currentJobTitle || undefined,
    currentCompany: input.currentCompany || undefined,
    experienceLevel: input.experienceLevel || undefined,
    yearsOfExperience: input.yearsOfExperience || undefined,
    education: input.education?.filter(
      (e) =>
        e.qualification ||
        e.institution ||
        e.fieldOfStudy ||
        e.graduationYear
    ),
    resumeFileName: input.resumeFileName || undefined,
    resumeFileSize: input.resumeFileSize || undefined,
    linkedinUrl: input.linkedinUrl || undefined,
    githubUrl: input.githubUrl || undefined,
    portfolioUrl: input.portfolioUrl || undefined,
    otherWebsite: input.otherWebsite || undefined,
    additionalAnswers:
      input.additionalAnswers &&
      Object.keys(input.additionalAnswers).length > 0
        ? input.additionalAnswers
        : undefined,
  };

  apps.unshift(newApp);
  saveStoredApplications(apps);
  return newApp;
}

export function hasAppliedToJob(jobId: string, email: string): boolean {
  return getStoredApplications().some(
    (a) =>
      a.jobId === jobId &&
      a.candidateEmail.toLowerCase() === email.toLowerCase()
  );
}

export function getApplicationById(id: string): StoredApplication | undefined {
  return getStoredApplications().find((a) => a.id === id);
}

export function getApplicationForCandidate(
  id: string,
  email: string
): StoredApplication | undefined {
  return getStoredApplications().find(
    (a) =>
      a.id === id &&
      a.candidateEmail.toLowerCase() === email.toLowerCase()
  );
}

export const APPLICATION_QUESTIONS = [
  {
    id: "whyInterested",
    question: "Why are you interested in this role?",
    type: "long" as const,
  },
  {
    id: "noticePeriod",
    question: "What is your notice period?",
    type: "short" as const,
  },
  {
    id: "willingToRelocate",
    question: "Are you willing to relocate?",
    type: "select" as const,
    options: ["Yes", "No", "Maybe"],
  },
];

export const APPLICATION_STATUS_LABELS: Record<ApplicationStatus, string> = {
  applied: "Applied",
  under_review: "Under Review",
  interview: "Interview",
  selected: "Selected",
  rejected: "Rejected",
  withdrawn: "Withdrawn",
};

export const APPLICATION_STATUS_COLORS: Record<
  ApplicationStatus,
  { bg: string; text: string; dot: string }
> = {
  applied: { bg: "bg-gray-100", text: "text-gray-700", dot: "bg-gray-400" },
  under_review: {
    bg: "bg-blue-50",
    text: "text-blue-700",
    dot: "bg-blue-500",
  },
  interview: {
    bg: "bg-green-50",
    text: "text-green-700",
    dot: "bg-green-500",
  },
  selected: {
    bg: "bg-green-50",
    text: "text-green-700",
    dot: "bg-green-600",
  },
  rejected: { bg: "bg-red-50", text: "text-red-600", dot: "bg-red-400" },
  withdrawn: {
    bg: "bg-gray-50",
    text: "text-gray-500",
    dot: "bg-gray-300",
  },
};
