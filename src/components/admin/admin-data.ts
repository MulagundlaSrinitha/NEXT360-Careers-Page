import { prisma } from "@/lib/prisma";
import { Prisma } from "@prisma/client";
import type {
  Application as ApplicationRow,
  Job as JobRow,
  Team as TeamRow,
} from "@prisma/client";
import {
  type EducationRecord,
} from "@/components/careers/mock-applications";
import type { Job } from "@/components/careers/types";

export type ApplicationStatus =
  | "applied"
  | "under_review"
  | "interview"
  | "selected"
  | "rejected"
  | "withdrawn";

export type InterviewStatus = "scheduled" | "completed" | "cancelled";

export interface AdminApplication {
  id: string;
  jobId: string;
  jobTitle: string;
  department: string;
  location: string;
  candidateEmail: string;
  candidateFirstName: string;
  candidateLastName: string;
  status: ApplicationStatus;
  appliedAt: string;
  updatedAt?: string;
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
  interviewStatus?: InterviewStatus;
  interviewDate?: string;
  interviewTime?: string;
  interviewLocation?: string;
  interviewNotes?: string;
}

export const VALID_APPLICATION_STATUSES: ApplicationStatus[] = [
  "applied",
  "under_review",
  "interview",
  "selected",
  "rejected",
  "withdrawn",
];

export const APPLICATION_TRANSITIONS: Record<
  ApplicationStatus,
  ApplicationStatus[]
> = {
  applied: ["under_review", "rejected", "withdrawn"],
  under_review: ["interview", "applied", "rejected", "withdrawn"],
  interview: ["selected", "under_review", "rejected", "withdrawn"],
  selected: [],
  rejected: [],
  withdrawn: [],
};

export const APPLICATION_STATUS_LABELS: Record<ApplicationStatus, string> = {
  applied: "Applied",
  under_review: "Under Review",
  interview: "Interview",
  selected: "Selected",
  rejected: "Rejected",
  withdrawn: "Withdrawn",
};

const APPLICATION_STATUS_COLORS: Record<
  ApplicationStatus,
  { bg: string; text: string; dot: string }
> = {
  applied: { bg: "bg-gray-100", text: "text-gray-700", dot: "bg-gray-400" },
  under_review: { bg: "bg-blue-50", text: "text-blue-700", dot: "bg-blue-500" },
  interview: { bg: "bg-green-50", text: "text-green-700", dot: "bg-green-500" },
  selected: { bg: "bg-green-50", text: "text-green-700", dot: "bg-green-600" },
  rejected: { bg: "bg-red-50", text: "text-red-600", dot: "bg-red-400" },
  withdrawn: { bg: "bg-gray-50", text: "text-gray-500", dot: "bg-gray-300" },
};

export const INTERVIEW_STATUS_LABELS: Record<InterviewStatus, string> = {
  scheduled: "Scheduled",
  completed: "Completed",
  cancelled: "Cancelled",
};

export const VALID_INTERVIEW_STATUSES: InterviewStatus[] = [
  "scheduled",
  "completed",
  "cancelled",
];

function toJob(row: JobRow): Job {
  return {
    id: row.id,
    title: row.title,
    department: row.department,
    location: row.location,
    experience: row.experience,
    employmentType: row.employmentType,
    workMode: row.workMode,
    team: row.team,
    skills: [...row.skills],
    description: row.description,
    responsibilities: [...row.responsibilities],
    qualifications: [...row.qualifications],
    preferredQualifications: [...row.preferredQualifications],
    benefits: [...row.benefits],
    postedAt: row.postedAt,
    status: row.status,
    teamDescription: row.teamDescription ?? undefined,
  };
}

function toAdminApplication(row: ApplicationRow): AdminApplication {
  return {
    id: row.id,
    jobId: row.jobId,
    jobTitle: row.jobTitle,
    department: row.department,
    location: row.location,
    candidateEmail: row.candidateEmail,
    candidateFirstName: row.candidateFirstName,
    candidateLastName: row.candidateLastName,
    status: row.status as ApplicationStatus,
    appliedAt: row.appliedAt.toISOString(),
    updatedAt: row.updatedAt ? row.updatedAt.toISOString() : undefined,
    phone: row.phone ?? undefined,
    currentLocation: row.currentLocation ?? undefined,
    country: row.country ?? undefined,
    currentJobTitle: row.currentJobTitle ?? undefined,
    currentCompany: row.currentCompany ?? undefined,
    experienceLevel: row.experienceLevel ?? undefined,
    yearsOfExperience: row.yearsOfExperience ?? undefined,
    education: (row.education as unknown as EducationRecord[] | null) ?? undefined,
    resumeFileName: row.resumeFileName ?? undefined,
    resumeFileSize: row.resumeFileSize ?? undefined,
    linkedinUrl: row.linkedinUrl ?? undefined,
    githubUrl: row.githubUrl ?? undefined,
    portfolioUrl: row.portfolioUrl ?? undefined,
    otherWebsite: row.otherWebsite ?? undefined,
    additionalAnswers:
      (row.additionalAnswers as unknown as Record<string, string> | null) ??
      undefined,
    interviewStatus: (row.interviewStatus as InterviewStatus | null) ?? undefined,
    interviewDate: row.interviewDate ?? undefined,
    interviewTime: row.interviewTime ?? undefined,
    interviewLocation: row.interviewLocation ?? undefined,
    interviewNotes: row.interviewNotes ?? undefined,
  };
}

async function getAllJobs(): Promise<Job[]> {
  const rows = await prisma.job.findMany();
  return rows.map(toJob);
}

async function getAllApplications(): Promise<AdminApplication[]> {
  const rows = await prisma.application.findMany();
  return rows.map(toAdminApplication);
}

async function getAllTeams(): Promise<TeamRow[]> {
  return prisma.team.findMany();
}

function toAdminApplicationListItem(a: AdminApplication) {
  return {
    id: a.id,
    jobId: a.jobId,
    jobTitle: a.jobTitle,
    department: a.department,
    location: a.location,
    candidateEmail: a.candidateEmail,
    candidateFirstName: a.candidateFirstName,
    candidateLastName: a.candidateLastName,
    status: a.status,
    appliedAt: a.appliedAt,
  };
}

export interface DashboardData {
  openJobs: number;
  totalApplications: number;
  newApplications: number;
  interviewCount: number;
  statusBreakdown: { status: string; label: string; count: number; color: string; dotColor: string }[];
  recentApplications: AdminApplication[];
  jobsNeedingAttention: { id: string; title: string; reason: string }[];
}

export async function getDashboardData(): Promise<DashboardData> {
  const jobs = await getAllJobs();
  const applications = await getAllApplications();

  const openJobs = jobs.filter((j) => j.status === "Open").length;
  const totalApplications = applications.length;
  const oneWeekAgo = new Date();
  oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);
  const newApplications = applications.filter(
    (a) => new Date(a.appliedAt) >= oneWeekAgo
  ).length;
  const interviewCount = applications.filter(
    (a) => a.status === "interview"
  ).length;

  const statusCounts: Record<string, number> = {};
  for (const app of applications) {
    statusCounts[app.status] = (statusCounts[app.status] || 0) + 1;
  }

  const statusBreakdown = (
    Object.entries(APPLICATION_STATUS_LABELS) as [ApplicationStatus, string][]
  ).map(([status, label]) => ({
    status,
    label,
    count: statusCounts[status] || 0,
    color: APPLICATION_STATUS_COLORS[status].bg,
    dotColor: APPLICATION_STATUS_COLORS[status].dot,
  }));

  const recentApplications = [...applications]
    .sort((a, b) => new Date(b.appliedAt).getTime() - new Date(a.appliedAt).getTime())
    .slice(0, 8)
    .map(toAdminApplicationListItem);

  const jobsNeedingAttention: { id: string; title: string; reason: string }[] = [];
  const closedJobs = jobs.filter((j) => j.status !== "Open");
  for (const job of closedJobs.slice(0, 3)) {
    jobsNeedingAttention.push({
      id: job.id,
      title: job.title,
      reason: `Status: ${job.status}`,
    });
  }

  const jobAppCounts: Record<string, number> = {};
  for (const app of applications) {
    jobAppCounts[app.jobId] = (jobAppCounts[app.jobId] || 0) + 1;
  }
  const noAppJobs = jobs
    .filter((j) => j.status === "Open" && !jobAppCounts[j.id])
    .slice(0, 3);
  for (const job of noAppJobs) {
    jobsNeedingAttention.push({
      id: job.id,
      title: job.title,
      reason: "No applications yet",
    });
  }

  return {
    openJobs,
    totalApplications,
    newApplications,
    interviewCount,
    statusBreakdown,
    recentApplications,
    jobsNeedingAttention: jobsNeedingAttention.slice(0, 5),
  };
}

export async function getAdminJobs(): Promise<Job[]> {
  return getAllJobs();
}

export async function getAdminJobById(id: string): Promise<Job | undefined> {
  const row = await prisma.job.findUnique({ where: { id } });
  return row ? toJob(row) : undefined;
}

export async function getPublicOpenJobs(): Promise<Job[]> {
  try {
    const rows = await prisma.job.findMany({ where: { status: "Open" } });
    return rows.map(toJob);
  } catch (error) {
    console.error("[admin-data] Failed to load public open jobs:", error);
    return [];
  }
}

export async function getJobById(id: string): Promise<Job | undefined> {
  return getAdminJobById(id);
}

export async function getSimilarJobs(job: Job, limit = 4): Promise<Job[]> {
  const rows = await prisma.job.findMany({ where: { NOT: { id: job.id } } });
  return rows
    .map(toJob)
    .sort((a, b) => {
      let scoreA = 0;
      let scoreB = 0;
      if (a.department === job.department) scoreA += 3;
      if (b.department === job.department) scoreB += 3;
      if (a.team === job.team) scoreA += 2;
      if (b.team === job.team) scoreB += 2;
      if (a.location === job.location) scoreA += 1;
      if (b.location === job.location) scoreB += 1;
      const sharedA = a.skills.filter((s) => job.skills.includes(s)).length;
      const sharedB = b.skills.filter((s) => job.skills.includes(s)).length;
      scoreA += sharedA;
      scoreB += sharedB;
      return scoreB - scoreA;
    })
    .slice(0, limit);
}

export interface JobApplicationStats {
  total: number;
  byStatus: {
    status: ApplicationStatus;
    label: string;
    count: number;
    dotColor: string;
  }[];
  latestApplicationAt: string | null;
}

export async function getJobApplicationStats(
  jobId: string
): Promise<JobApplicationStats> {
  const apps = (await getAllApplications()).filter((a) => a.jobId === jobId);

  const total = apps.length;

  const byStatus = (
    Object.entries(APPLICATION_STATUS_LABELS) as [ApplicationStatus, string][]
  ).map(([status, label]) => ({
    status,
    label,
    count: apps.filter((a) => a.status === status).length,
    dotColor: APPLICATION_STATUS_COLORS[status].dot,
  }));

  let latestApplicationAt: string | null = null;
  for (const app of apps) {
    if (
      !latestApplicationAt ||
      new Date(app.appliedAt).getTime() > new Date(latestApplicationAt).getTime()
    ) {
      latestApplicationAt = app.appliedAt;
    }
  }

  return { total, byStatus, latestApplicationAt };
}

export async function getAdminApplications(): Promise<AdminApplication[]> {
  return getAllApplications();
}

export interface CreateJobInput {
  title: string;
  department: string;
  location: string;
  experience: string;
  employmentType: string;
  workMode: string;
  team?: string;
  skills: string[];
  description: string;
  responsibilities?: string[];
  qualifications?: string[];
  preferredQualifications?: string[];
  benefits?: string[];
  status?: string;
}

async function nextJobId(): Promise<string> {
  const jobs = await prisma.job.findMany({ select: { id: true } });
  let max = 0;
  for (const j of jobs) {
    const n = parseInt(j.id, 10);
    if (!Number.isNaN(n) && n > max) max = n;
  }
  return String(max + 1);
}

export async function createAdminJob(
  input: CreateJobInput
): Promise<Job> {
  const id = await nextJobId();
  const now = new Date().toISOString().split("T")[0];

  const row = await prisma.job.create({
    data: {
      id,
      title: input.title,
      department: input.department,
      location: input.location,
      experience: input.experience,
      employmentType: input.employmentType,
      workMode: input.workMode,
      team: input.team || "",
      skills: input.skills,
      description: input.description,
      responsibilities: input.responsibilities || [],
      qualifications: input.qualifications || [],
      preferredQualifications: input.preferredQualifications || [],
      benefits: input.benefits || [],
      postedAt: now,
      status: input.status || "Draft",
    },
  });
  return toJob(row);
}

export type UpdateJobInput = Partial<CreateJobInput>;

const VALID_JOB_STATUSES = ["Draft", "Open", "Closed", "Paused"];

function cleanList(items: string[] | undefined): string[] | undefined {
  if (!Array.isArray(items)) return undefined;
  return items.filter((i) => typeof i === "string" && i.trim());
}

export async function updateAdminJob(
  id: string,
  patch: UpdateJobInput
): Promise<Job | null> {
  const existing = await prisma.job.findUnique({ where: { id } });
  if (!existing) return null;

  const data: {
    title?: string;
    department?: string;
    location?: string;
    experience?: string;
    employmentType?: string;
    workMode?: string;
    team?: string;
    description?: string;
    skills?: string[];
    responsibilities?: string[];
    qualifications?: string[];
    preferredQualifications?: string[];
    benefits?: string[];
    status?: string;
  } = {};

  if (typeof patch.title === "string") data.title = patch.title.trim();
  if (typeof patch.department === "string") {
    data.department = patch.department.trim();
  }
  if (typeof patch.location === "string") data.location = patch.location.trim();
  if (typeof patch.experience === "string") {
    data.experience = patch.experience.trim();
  }
  if (typeof patch.employmentType === "string") {
    data.employmentType = patch.employmentType.trim();
  }
  if (typeof patch.workMode === "string") data.workMode = patch.workMode.trim();
  if (typeof patch.team === "string") {
    data.team = patch.team.trim() || "";
  }
  if (typeof patch.description === "string") {
    data.description = patch.description.trim();
  }

  if (Array.isArray(patch.skills)) {
    data.skills = cleanList(patch.skills) ?? [];
  }
  if (Array.isArray(patch.responsibilities)) {
    data.responsibilities = cleanList(patch.responsibilities) ?? [];
  }
  if (Array.isArray(patch.qualifications)) {
    data.qualifications = cleanList(patch.qualifications) ?? [];
  }
  if (Array.isArray(patch.preferredQualifications)) {
    data.preferredQualifications = cleanList(patch.preferredQualifications) ?? [];
  }
  if (Array.isArray(patch.benefits)) {
    data.benefits = cleanList(patch.benefits) ?? [];
  }

  if (
    typeof patch.status === "string" &&
    VALID_JOB_STATUSES.includes(patch.status)
  ) {
    data.status = patch.status;
  }

  const row = await prisma.job.update({ where: { id }, data });
  return toJob(row);
}

export type JobSortOption = "newest" | "oldest" | "title-az" | "title-za";

export interface AdminJobsQuery {
  search?: string;
  status?: string;
  department?: string;
  location?: string;
  employmentType?: string;
  workMode?: string;
  sort?: JobSortOption;
  page?: number;
  limit?: number;
}

export interface AdminJobSummary {
  id: string;
  title: string;
  department: string;
  location: string;
  experience: string;
  employmentType: string;
  workMode: string;
  team: string;
  status: string;
  postedAt: string;
}

export interface AdminJobsListResult {
  jobs: AdminJobSummary[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
  totalCount: number;
  statusCounts: Record<string, number>;
}

export async function getAdminJobsList(
  query: AdminJobsQuery
): Promise<AdminJobsListResult> {
  const allJobs = await getAllJobs();
  let filtered = [...allJobs];

  if (query.search) {
    const term = query.search.toLowerCase();
    filtered = filtered.filter(
      (j) =>
        j.title.toLowerCase().includes(term) ||
        j.department.toLowerCase().includes(term) ||
        j.location.toLowerCase().includes(term) ||
        j.team?.toLowerCase().includes(term)
    );
  }

  if (query.status) {
    filtered = filtered.filter((j) => j.status === query.status);
  }
  if (query.department) {
    filtered = filtered.filter((j) => j.department === query.department);
  }
  if (query.location) {
    filtered = filtered.filter((j) => j.location === query.location);
  }
  if (query.employmentType) {
    filtered = filtered.filter((j) => j.employmentType === query.employmentType);
  }
  if (query.workMode) {
    filtered = filtered.filter((j) => j.workMode === query.workMode);
  }

  const statusCounts: Record<string, number> = {};
  for (const j of allJobs) {
    statusCounts[j.status] = (statusCounts[j.status] || 0) + 1;
  }

  const sort = query.sort || "newest";
  switch (sort) {
    case "newest":
      filtered.sort((a, b) => new Date(b.postedAt).getTime() - new Date(a.postedAt).getTime());
      break;
    case "oldest":
      filtered.sort((a, b) => new Date(a.postedAt).getTime() - new Date(b.postedAt).getTime());
      break;
    case "title-az":
      filtered.sort((a, b) => a.title.localeCompare(b.title));
      break;
    case "title-za":
      filtered.sort((a, b) => b.title.localeCompare(a.title));
      break;
  }

  const total = filtered.length;
  const page = query.page || 1;
  const limit = query.limit || 20;
  const totalPages = Math.max(1, Math.ceil(total / limit));
  const start = (page - 1) * limit;
  const paged = filtered.slice(start, start + limit);

  const jobs: AdminJobSummary[] = paged.map((j) => ({
    id: j.id,
    title: j.title,
    department: j.department,
    location: j.location,
    experience: j.experience,
    employmentType: j.employmentType,
    workMode: j.workMode,
    team: j.team || "",
    status: j.status,
    postedAt: j.postedAt,
  }));

  return { jobs, total, page, limit, totalPages, totalCount: allJobs.length, statusCounts };
}

export type ApplicationsSortOption =
  | "newest"
  | "oldest"
  | "name-az"
  | "name-za"
  | "job-az"
  | "job-za";

export interface AdminApplicationsQuery {
  search?: string;
  status?: string;
  jobId?: string;
  sort?: ApplicationsSortOption;
  page?: number;
  limit?: number;
}

export interface ApplicationSummaryMetric {
  status: ApplicationStatus;
  label: string;
  count: number;
  dotColor: string;
}

export interface ApplicationSummary {
  total: number;
  new: number;
  underReview: number;
  interviews: number;
  hired: number;
  byStatus: ApplicationSummaryMetric[];
}

export interface ApplicationJobOption {
  id: string;
  title: string;
  department: string;
}

export interface AdminApplicationsListResult {
  applications: AdminApplication[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
  totalCount: number;
  summary: ApplicationSummary;
  jobOptions: ApplicationJobOption[];
}

export function getApplicationsSummary(
  applications: AdminApplication[]
): ApplicationSummary {
  const statusCounts: Record<ApplicationStatus, number> = {
    applied: 0,
    under_review: 0,
    interview: 0,
    selected: 0,
    rejected: 0,
    withdrawn: 0,
  };

  let newCount = 0;
  const sevenDaysAgo = new Date();
  sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

  for (const app of applications) {
    statusCounts[app.status] = (statusCounts[app.status] || 0) + 1;
    const appliedAt = new Date(app.appliedAt);
    if (!Number.isNaN(appliedAt.getTime()) && appliedAt >= sevenDaysAgo) {
      newCount += 1;
    }
  }

  const byStatus = (
    Object.entries(APPLICATION_STATUS_LABELS) as [
      ApplicationStatus,
      string
    ][]
  ).map(([status, label]) => ({
    status,
    label,
    count: statusCounts[status] || 0,
    dotColor: APPLICATION_STATUS_COLORS[status].dot,
  }));

  return {
    total: applications.length,
    new: newCount,
    underReview: statusCounts.under_review,
    interviews: statusCounts.interview,
    hired: statusCounts.selected,
    byStatus,
  };
}

export function getApplicationJobOptions(
  applications: AdminApplication[]
): ApplicationJobOption[] {
  const seen = new Set<string>();
  const options: ApplicationJobOption[] = [];
  for (const app of applications) {
    if (seen.has(app.jobId)) continue;
    seen.add(app.jobId);
    options.push({
      id: app.jobId,
      title: app.jobTitle,
      department: app.department,
    });
  }
  options.sort((a, b) => a.title.localeCompare(b.title));
  return options;
}

export async function getAdminApplicationsList(
  query: AdminApplicationsQuery
): Promise<AdminApplicationsListResult> {
  const applications = await getAllApplications();
  const summary = getApplicationsSummary(applications);
  const jobOptions = getApplicationJobOptions(applications);

  let filtered = [...applications];

  if (query.search) {
    const term = query.search.toLowerCase();
    filtered = filtered.filter(
      (a) =>
        a.candidateFirstName.toLowerCase().includes(term) ||
        a.candidateLastName.toLowerCase().includes(term) ||
        a.candidateEmail.toLowerCase().includes(term) ||
        a.jobTitle.toLowerCase().includes(term) ||
        a.department.toLowerCase().includes(term) ||
        a.location.toLowerCase().includes(term) ||
        a.id.toLowerCase().includes(term)
    );
  }

  if (query.status) {
    filtered = filtered.filter((a) => a.status === query.status);
  }

  if (query.jobId) {
    filtered = filtered.filter((a) => a.jobId === query.jobId);
  }

  const sort = query.sort || "newest";
  switch (sort) {
    case "newest":
      filtered.sort(
        (a, b) => new Date(b.appliedAt).getTime() - new Date(a.appliedAt).getTime()
      );
      break;
    case "oldest":
      filtered.sort(
        (a, b) => new Date(a.appliedAt).getTime() - new Date(b.appliedAt).getTime()
      );
      break;
    case "name-az":
      filtered.sort((a, b) =>
        `${a.candidateFirstName} ${a.candidateLastName}`.localeCompare(
          `${b.candidateFirstName} ${b.candidateLastName}`
        )
      );
      break;
    case "name-za":
      filtered.sort((a, b) =>
        `${b.candidateFirstName} ${b.candidateLastName}`.localeCompare(
          `${a.candidateFirstName} ${a.candidateLastName}`
        )
      );
      break;
    case "job-az":
      filtered.sort((a, b) =>
        `${a.jobTitle} ${a.department}`.localeCompare(`${b.jobTitle} ${b.department}`)
      );
      break;
    case "job-za":
      filtered.sort((a, b) =>
        `${b.jobTitle} ${b.department}`.localeCompare(`${a.jobTitle} ${a.department}`)
      );
      break;
  }

  const limit = Math.min(100, Math.max(1, query.limit || 20));
  const totalPages = Math.max(1, Math.ceil(filtered.length / limit));
  const page = Math.min(Math.max(1, query.page || 1), totalPages);
  const start = (page - 1) * limit;
  const paged = filtered.slice(start, start + limit);

  const withSummary = paged.map(toAdminApplicationListItem);

  return {
    applications: withSummary,
    total: filtered.length,
    page,
    limit,
    totalPages,
    totalCount: applications.length,
    summary,
    jobOptions,
  };
}

export interface CreateAdminApplicationInput {
  jobId: string;
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

function cleanOptional(value: string | undefined): string | undefined {
  const trimmed = value?.trim();
  return trimmed ? trimmed : undefined;
}

function cleanEducation(
  education: EducationRecord[] | undefined
): EducationRecord[] | undefined {
  if (!Array.isArray(education)) return undefined;
  const cleaned = education.filter(
    (e) =>
      e.qualification?.trim() ||
      e.institution?.trim() ||
      e.fieldOfStudy?.trim() ||
      e.graduationYear?.trim()
  );
  return cleaned.length > 0 ? cleaned : undefined;
}

function cleanAdditionalAnswers(
  answers: Record<string, string> | undefined
): Record<string, string> | undefined {
  if (!answers || typeof answers !== "object") return undefined;
  const cleaned: Record<string, string> = {};
  for (const [key, value] of Object.entries(answers)) {
    if (typeof value === "string" && value.trim()) {
      cleaned[key] = value.trim();
    }
  }
  return Object.keys(cleaned).length > 0 ? cleaned : undefined;
}

async function nextApplicationId(): Promise<string> {
  const apps = await prisma.application.findMany({ select: { id: true } });
  let max = 0;
  for (const a of apps) {
    const m = /^ADM-APP-(\d+)$/.exec(a.id);
    if (m) {
      const n = parseInt(m[1], 10);
      if (!Number.isNaN(n) && n > max) max = n;
    }
  }
  return `ADM-APP-${String(max + 1).padStart(3, "0")}`;
}

function isUniqueViolation(error: unknown): boolean {
  return (
    error instanceof Prisma.PrismaClientKnownRequestError && error.code === "P2002"
  );
}

export async function createAdminApplication(
  input: CreateAdminApplicationInput
): Promise<AdminApplication | null> {
  const jobRow = await prisma.job.findUnique({ where: { id: input.jobId } });
  if (!jobRow) return null;
  const job = toJob(jobRow);

  const existingRow = await prisma.application.findFirst({
    where: {
      jobId: job.id,
      candidateEmail: { equals: input.candidateEmail, mode: "insensitive" },
    },
  });
  if (existingRow) return toAdminApplication(existingRow);

  const now = new Date();
  const id = await nextApplicationId();
  const education = cleanEducation(input.education);
  const additionalAnswers = cleanAdditionalAnswers(input.additionalAnswers);
  try {
    const row = await prisma.application.create({
      data: {
        id,
        jobId: job.id,
        jobTitle: job.title,
        department: job.department,
        location: job.location,
        candidateEmail: input.candidateEmail,
        candidateFirstName: input.candidateFirstName,
        candidateLastName: input.candidateLastName,
        status: "applied",
        appliedAt: now,
        updatedAt: now,
        phone: cleanOptional(input.phone),
        currentLocation: cleanOptional(input.currentLocation),
        country: cleanOptional(input.country),
        currentJobTitle: cleanOptional(input.currentJobTitle),
        currentCompany: cleanOptional(input.currentCompany),
        experienceLevel: cleanOptional(input.experienceLevel),
        yearsOfExperience: cleanOptional(input.yearsOfExperience),
        education: education
          ? (education as unknown as Prisma.InputJsonValue)
          : Prisma.DbNull,
        resumeFileName: cleanOptional(input.resumeFileName),
        resumeFileSize: cleanOptional(input.resumeFileSize),
        linkedinUrl: cleanOptional(input.linkedinUrl),
        githubUrl: cleanOptional(input.githubUrl),
        portfolioUrl: cleanOptional(input.portfolioUrl),
        otherWebsite: cleanOptional(input.otherWebsite),
        additionalAnswers: additionalAnswers
          ? (additionalAnswers as unknown as Prisma.InputJsonValue)
          : Prisma.DbNull,
      },
    });
    return toAdminApplication(row);
  } catch (error) {
    if (!isUniqueViolation(error)) throw error;
    const raced = await prisma.application.findFirst({
      where: {
        jobId: job.id,
        candidateEmail: { equals: input.candidateEmail, mode: "insensitive" },
      },
    });
    return raced ? toAdminApplication(raced) : null;
  }
}

export async function getAdminApplicationById(
  id: string
): Promise<AdminApplication | undefined> {
  const row = await prisma.application.findUnique({ where: { id } });
  return row ? toAdminApplication(row) : undefined;
}

export function getApplicationTransitions(
  status: ApplicationStatus
): ApplicationStatus[] {
  return APPLICATION_TRANSITIONS[status] || [];
}

export async function updateAdminApplicationStatus(
  id: string,
  status: ApplicationStatus
): Promise<AdminApplication | null> {
  const existing = await prisma.application.findUnique({ where: { id } });
  if (!existing) return null;
  const row = await prisma.application.update({
    where: { id },
    data: { status, updatedAt: new Date() },
  });
  return toAdminApplication(row);
}

export type CandidateSortOption =
  | "name-az"
  | "name-za"
  | "count-desc"
  | "count-asc"
  | "latest-desc"
  | "latest-asc";

export interface CandidateListItem {
  id: string;
  candidateEmail: string;
  candidateFirstName: string;
  candidateLastName: string;
  phone?: string;
  applicationCount: number;
  latestAppliedAt: string;
  latestStatus: ApplicationStatus;
}

export interface CandidateSummary {
  total: number;
  withApplications: number;
  multipleApplications: number;
}

export interface AdminCandidatesQuery {
  search?: string;
  status?: string;
  jobId?: string;
  applicationCount?: string;
  sort?: CandidateSortOption;
  page?: number;
  limit?: number;
}

export interface AdminCandidatesListResult {
  candidates: CandidateListItem[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
  totalCount: number;
  summary: CandidateSummary;
  jobOptions: ApplicationJobOption[];
}

function candidateIdFromEmail(email: string): string {
  const key = email.trim().toLowerCase();
  let hash = 2166136261;
  for (let i = 0; i < key.length; i++) {
    hash ^= key.charCodeAt(i);
    hash = Math.imul(hash, 16777619);
  }
  return `can-${(hash >>> 0).toString(36)}`;
}

async function getCandidatesByEmail(): Promise<Map<string, AdminApplication[]>> {
  const grouped = new Map<string, AdminApplication[]>();
  for (const app of await getAllApplications()) {
    const key = app.candidateEmail.trim().toLowerCase();
    const existing = grouped.get(key);
    if (existing) {
      existing.push(app);
    } else {
      grouped.set(key, [app]);
    }
  }
  return grouped;
}

function candidateEmailKey(email: string): string {
  return email.trim().toLowerCase();
}

export async function getAdminCandidatesList(
  query: AdminCandidatesQuery
): Promise<AdminCandidatesListResult> {
  const grouped = await getCandidatesByEmail();
  const jobOptions = getApplicationJobOptions(await getAllApplications());

  const candidates: CandidateListItem[] = [];
  for (const [, apps] of grouped) {
    const sorted = [...apps].sort(
      (a, b) =>
        new Date(b.appliedAt).getTime() - new Date(a.appliedAt).getTime()
    );
    const latest = sorted[0];
    candidates.push({
      id: candidateIdFromEmail(latest.candidateEmail),
      candidateEmail: latest.candidateEmail,
      candidateFirstName: latest.candidateFirstName,
      candidateLastName: latest.candidateLastName,
      phone: latest.phone,
      applicationCount: apps.length,
      latestAppliedAt: latest.appliedAt,
      latestStatus: latest.status,
    });
  }

  let filtered = candidates;

  if (query.search) {
    const term = query.search.toLowerCase();
    filtered = filtered.filter(
      (c) =>
        c.candidateFirstName.toLowerCase().includes(term) ||
        c.candidateLastName.toLowerCase().includes(term) ||
        `${c.candidateFirstName} ${c.candidateLastName}`
          .toLowerCase()
          .includes(term) ||
        c.candidateEmail.toLowerCase().includes(term)
    );
  }

  if (query.status) {
    filtered = filtered.filter((c) =>
      (grouped.get(candidateEmailKey(c.candidateEmail)) || []).some(
        (a) => a.status === query.status
      )
    );
  }

  if (query.jobId) {
    filtered = filtered.filter((c) =>
      (grouped.get(candidateEmailKey(c.candidateEmail)) || []).some(
        (a) => a.jobId === query.jobId
      )
    );
  }

  if (query.applicationCount === "multiple") {
    filtered = filtered.filter((c) => c.applicationCount > 1);
  } else if (query.applicationCount === "one") {
    filtered = filtered.filter((c) => c.applicationCount === 1);
  }

  const sort = query.sort || "latest-desc";
  switch (sort) {
    case "name-az":
      filtered.sort(
        (a, b) =>
          `${a.candidateFirstName} ${a.candidateLastName}`.localeCompare(
            `${b.candidateFirstName} ${b.candidateLastName}`
          ) || a.candidateEmail.localeCompare(b.candidateEmail)
      );
      break;
    case "name-za":
      filtered.sort(
        (a, b) =>
          `${b.candidateFirstName} ${b.candidateLastName}`.localeCompare(
            `${a.candidateFirstName} ${a.candidateLastName}`
          ) || a.candidateEmail.localeCompare(b.candidateEmail)
      );
      break;
    case "latest-desc":
      filtered.sort(
        (a, b) =>
          new Date(b.latestAppliedAt).getTime() -
            new Date(a.latestAppliedAt).getTime() ||
          a.candidateEmail.localeCompare(b.candidateEmail)
      );
      break;
    case "latest-asc":
      filtered.sort(
        (a, b) =>
          new Date(a.latestAppliedAt).getTime() -
            new Date(b.latestAppliedAt).getTime() ||
          a.candidateEmail.localeCompare(b.candidateEmail)
      );
      break;
    case "count-desc":
      filtered.sort(
        (a, b) =>
          b.applicationCount - a.applicationCount ||
          a.candidateEmail.localeCompare(b.candidateEmail)
      );
      break;
    case "count-asc":
      filtered.sort(
        (a, b) =>
          a.applicationCount - b.applicationCount ||
          a.candidateEmail.localeCompare(b.candidateEmail)
      );
      break;
  }

  const summary: CandidateSummary = {
    total: candidates.length,
    withApplications: candidates.filter(
      (c) => c.applicationCount >= 1
    ).length,
    multipleApplications: candidates.filter(
      (c) => c.applicationCount > 1
    ).length,
  };

  const limit = Math.min(100, Math.max(1, query.limit || 20));
  const totalPages = Math.max(1, Math.ceil(filtered.length / limit));
  const page = Math.min(Math.max(1, query.page || 1), totalPages);
  const start = (page - 1) * limit;
  const paged = filtered.slice(start, start + limit);

  return {
    candidates: paged,
    total: filtered.length,
    page,
    limit,
    totalPages,
    totalCount: candidates.length,
    summary,
    jobOptions,
  };
}

const TERMINAL_APPLICATION_STATUSES: ApplicationStatus[] = [
  "selected",
  "rejected",
  "withdrawn",
];

export interface CandidateDetailApplication {
  id: string;
  jobId: string;
  jobTitle: string;
  department: string;
  location: string;
  status: ApplicationStatus;
  appliedAt: string;
  updatedAt?: string;
}

export interface CandidateDetail {
  id: string;
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
  firstAppliedAt: string;
  latestAppliedAt: string;
  applicationCount: number;
  activeApplicationCount: number;
}

export interface CandidateDetailSummary {
  total: number;
  latestAppliedAt: string;
  active: number;
}

export interface AdminCandidateDetailResult {
  candidate: CandidateDetail;
  applications: CandidateDetailApplication[];
  summary: CandidateDetailSummary;
}

export async function getAdminCandidateDetail(
  id: string,
  status?: string
): Promise<AdminCandidateDetailResult | null> {
  const grouped = await getCandidatesByEmail();
  for (const emailKey of grouped.keys()) {
    if (candidateIdFromEmail(emailKey) !== id) continue;
    const apps = grouped.get(emailKey) || [];
    const sorted = [...apps].sort(
      (a, b) =>
        new Date(b.appliedAt).getTime() - new Date(a.appliedAt).getTime()
    );
    const latest = sorted[0];
    const first = sorted[sorted.length - 1];
    const active = apps.filter(
      (a) => !TERMINAL_APPLICATION_STATUSES.includes(a.status)
    ).length;

    const candidate: CandidateDetail = {
      id,
      candidateEmail: latest.candidateEmail,
      candidateFirstName: latest.candidateFirstName,
      candidateLastName: latest.candidateLastName,
      phone: latest.phone,
      currentLocation: latest.currentLocation,
      country: latest.country,
      currentJobTitle: latest.currentJobTitle,
      currentCompany: latest.currentCompany,
      experienceLevel: latest.experienceLevel,
      yearsOfExperience: latest.yearsOfExperience,
      education: latest.education,
      resumeFileName: latest.resumeFileName,
      resumeFileSize: latest.resumeFileSize,
      firstAppliedAt: first.appliedAt,
      latestAppliedAt: latest.appliedAt,
      applicationCount: apps.length,
      activeApplicationCount: active,
    };

    let applications: CandidateDetailApplication[] = sorted.map((a) => ({
      id: a.id,
      jobId: a.jobId,
      jobTitle: a.jobTitle,
      department: a.department,
      location: a.location,
      status: a.status,
      appliedAt: a.appliedAt,
      updatedAt: a.updatedAt,
    }));

    if (status) {
      applications = applications.filter((a) => a.status === status);
    }

    return {
      candidate,
      applications,
      summary: {
        total: apps.length,
        latestAppliedAt: latest.appliedAt,
        active,
      },
    };
  }

  return null;
}

const INTERVIEW_ID_PREFIX = "INT-";

export interface InterviewListItem {
  id: string;
  applicationId: string;
  jobId: string;
  jobTitle: string;
  department: string;
  location: string;
  candidateEmail: string;
  candidateFirstName: string;
  candidateLastName: string;
  interviewStatus?: InterviewStatus;
  interviewDate?: string;
  interviewTime?: string;
  interviewLocation?: string;
  interviewNotes?: string;
}

export interface InterviewSummary {
  total: number;
  upcoming: number;
  completed: number;
  cancelled: number;
}

export interface InterviewApplicationOption {
  applicationId: string;
  jobId: string;
  jobTitle: string;
  department: string;
  candidateFirstName: string;
  candidateLastName: string;
  candidateEmail: string;
}

export type InterviewSortOption =
  | "date-desc"
  | "date-asc"
  | "name-az"
  | "name-za"
  | "job-az"
  | "job-za";

export interface AdminInterviewsQuery {
  search?: string;
  status?: string;
  jobId?: string;
  from?: string;
  to?: string;
  sort?: InterviewSortOption;
  page?: number;
  limit?: number;
}

export interface AdminInterviewsListResult {
  interviews: InterviewListItem[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
  totalCount: number;
  summary: InterviewSummary;
  jobOptions: ApplicationJobOption[];
  applicationOptions: InterviewApplicationOption[];
}

export function interviewIdFromApplication(applicationId: string): string {
  return `${INTERVIEW_ID_PREFIX}${applicationId}`;
}

export function applicationIdFromInterviewId(interviewId: string): string | null {
  if (!interviewId.startsWith(INTERVIEW_ID_PREFIX)) return null;
  const applicationId = interviewId.slice(INTERVIEW_ID_PREFIX.length);
  return applicationId ? applicationId : null;
}

function isInterviewRecord(app: AdminApplication): boolean {
  return (
    app.status === "interview" ||
    app.interviewStatus !== undefined ||
    app.interviewDate !== undefined
  );
}

function interviewDateTime(app: AdminApplication): number | null {
  if (!app.interviewDate || !app.interviewTime) return null;
  const value = new Date(`${app.interviewDate}T${app.interviewTime}:00`);
  const time = value.getTime();
  return Number.isNaN(time) ? null : time;
}

function toInterviewListItem(app: AdminApplication): InterviewListItem {
  return {
    id: interviewIdFromApplication(app.id),
    applicationId: app.id,
    jobId: app.jobId,
    jobTitle: app.jobTitle,
    department: app.department,
    location: app.location,
    candidateEmail: app.candidateEmail,
    candidateFirstName: app.candidateFirstName,
    candidateLastName: app.candidateLastName,
    interviewStatus: app.interviewStatus,
    interviewDate: app.interviewDate,
    interviewTime: app.interviewTime,
    interviewLocation: app.interviewLocation,
    interviewNotes: app.interviewNotes,
  };
}

export function isSchedulableApplication(app: AdminApplication): boolean {
  return app.status === "interview" && !app.interviewDate;
}

async function getApplicationOptionsForInterviews(): Promise<
  InterviewApplicationOption[]
> {
  return (await getAllApplications())
    .filter(isSchedulableApplication)
    .map((a) => ({
      applicationId: a.id,
      jobId: a.jobId,
      jobTitle: a.jobTitle,
      department: a.department,
      candidateFirstName: a.candidateFirstName,
      candidateLastName: a.candidateLastName,
      candidateEmail: a.candidateEmail,
    }));
}

export async function getAdminInterviewsList(
  query: AdminInterviewsQuery
): Promise<AdminInterviewsListResult> {
  const applications = await getAllApplications();
  const records = applications.filter(isInterviewRecord);
  const jobOptions = getApplicationJobOptions(applications);
  const applicationOptions = await getApplicationOptionsForInterviews();

  const now = Date.now();
  const summary: InterviewSummary = {
    total: records.length,
    upcoming: 0,
    completed: 0,
    cancelled: 0,
  };
  for (const app of records) {
    if (app.interviewStatus === "completed") summary.completed += 1;
    else if (app.interviewStatus === "cancelled") summary.cancelled += 1;
    else if (app.interviewStatus === "scheduled") {
      const ts = interviewDateTime(app);
      if (ts !== null && ts > now) summary.upcoming += 1;
    }
  }

  let filtered = [...records];

  if (query.search) {
    const term = query.search.toLowerCase();
    filtered = filtered.filter(
      (a) =>
        a.candidateFirstName.toLowerCase().includes(term) ||
        a.candidateLastName.toLowerCase().includes(term) ||
        a.candidateEmail.toLowerCase().includes(term) ||
        a.jobTitle.toLowerCase().includes(term) ||
        a.department.toLowerCase().includes(term) ||
        (a.interviewLocation || "").toLowerCase().includes(term)
    );
  }

  if (query.status) {
    filtered = filtered.filter((a) => a.interviewStatus === query.status);
  }

  if (query.jobId) {
    filtered = filtered.filter((a) => a.jobId === query.jobId);
  }

  if (query.from) {
    filtered = filtered.filter(
      (a) => a.interviewDate !== undefined && a.interviewDate >= query.from!
    );
  }

  if (query.to) {
    filtered = filtered.filter(
      (a) => a.interviewDate !== undefined && a.interviewDate <= query.to!
    );
  }

  const sort = query.sort || "date-desc";
  const byDate = (a: AdminApplication) => interviewDateTime(a);
  const compareDateTime = (
    a: AdminApplication,
    b: AdminApplication,
    direction: 1 | -1
  ) => {
    const at = byDate(a);
    const bt = byDate(b);
    if (at === null && bt === null) return a.id.localeCompare(b.id);
    if (at === null) return 1;
    if (bt === null) return -1;
    if (at === bt) return a.id.localeCompare(b.id);
    return (at - bt) * direction;
  };

  switch (sort) {
    case "date-desc":
      filtered.sort((a, b) => compareDateTime(a, b, -1));
      break;
    case "date-asc":
      filtered.sort((a, b) => compareDateTime(a, b, 1));
      break;
    case "name-az":
      filtered.sort((a, b) =>
        `${a.candidateFirstName} ${a.candidateLastName}`.localeCompare(
          `${b.candidateFirstName} ${b.candidateLastName}`
        )
      );
      break;
    case "name-za":
      filtered.sort((a, b) =>
        `${b.candidateFirstName} ${b.candidateLastName}`.localeCompare(
          `${a.candidateFirstName} ${a.candidateLastName}`
        )
      );
      break;
    case "job-az":
      filtered.sort((a, b) =>
        `${a.jobTitle} ${a.department}`.localeCompare(`${b.jobTitle} ${b.department}`)
      );
      break;
    case "job-za":
      filtered.sort((a, b) =>
        `${b.jobTitle} ${b.department}`.localeCompare(`${a.jobTitle} ${a.department}`)
      );
      break;
  }

  const limit = Math.min(100, Math.max(1, query.limit || 20));
  const totalPages = Math.max(1, Math.ceil(filtered.length / limit));
  const page = Math.min(Math.max(1, query.page || 1), totalPages);
  const start = (page - 1) * limit;
  const paged = filtered.slice(start, start + limit);

  return {
    interviews: paged.map(toInterviewListItem),
    total: filtered.length,
    page,
    limit,
    totalPages,
    totalCount: records.length,
    summary,
    jobOptions,
    applicationOptions,
  };
}

export async function getAdminInterviewById(
  interviewId: string
): Promise<InterviewListItem | null> {
  const applicationId = applicationIdFromInterviewId(interviewId);
  if (!applicationId) return null;
  const row = await prisma.application.findUnique({
    where: { id: applicationId },
  });
  if (!row) return null;
  const app = toAdminApplication(row);
  if (!isInterviewRecord(app)) return null;
  return toInterviewListItem(app);
}

export function isValidInterviewDate(value: string): boolean {
  const parts = /^(\d{4})-(\d{2})-(\d{2})$/.exec(value);
  if (!parts) return false;
  const year = Number(parts[1]);
  const month = Number(parts[2]);
  const day = Number(parts[3]);
  if (month < 1 || month > 12 || day < 1 || day > 31) return false;
  const parsed = new Date(year, month - 1, day);
  return (
    parsed.getFullYear() === year &&
    parsed.getMonth() === month - 1 &&
    parsed.getDate() === day
  );
}

export function isValidInterviewTime(value: string): boolean {
  return /^([01]\d|2[0-3]):[0-5]\d$/.test(value);
}

function isInThePast(date: string, time: string): boolean {
  const value = new Date(`${date}T${time}:00`);
  if (Number.isNaN(value.getTime())) return true;
  return value.getTime() <= Date.now();
}

function cleanInterviewText(value: string | undefined): string | undefined {
  const trimmed = value?.trim();
  return trimmed ? trimmed : undefined;
}

export interface InterviewMutationResult {
  interview?: InterviewListItem;
  error?: string;
  status: number;
}

export async function scheduleInterview(input: {
  applicationId: string;
  date: string;
  time: string;
  location?: string;
  notes?: string;
}): Promise<InterviewMutationResult> {
  const row = await prisma.application.findUnique({
    where: { id: input.applicationId },
  });
  if (!row) {
    return { error: "Application not found.", status: 404 };
  }
  const app = toAdminApplication(row);
  if (!isInterviewRecord(app)) {
    return { error: "Application not found.", status: 404 };
  }
  if (app.status !== "interview") {
    return {
      error: "Interviews can only be scheduled for applications at the interview stage.",
      status: 400,
    };
  }
  if (app.interviewDate) {
    return {
      error: "An interview is already scheduled for this application.",
      status: 409,
    };
  }
  if (!isValidInterviewDate(input.date)) {
    return { error: "Interview date must be a valid date (YYYY-MM-DD).", status: 400 };
  }
  if (!isValidInterviewTime(input.time)) {
    return { error: "Interview time must be a valid time (HH:MM).", status: 400 };
  }
  if (isInThePast(input.date, input.time)) {
    return { error: "Interview date and time cannot be in the past.", status: 400 };
  }

  const updated = await prisma.application.update({
    where: { id: input.applicationId },
    data: {
      interviewStatus: "scheduled",
      interviewDate: input.date,
      interviewTime: input.time,
      interviewLocation: cleanInterviewText(input.location),
      interviewNotes: cleanInterviewText(input.notes),
    },
  });

  return { interview: toInterviewListItem(toAdminApplication(updated)), status: 201 };
}

export async function rescheduleInterview(
  interviewId: string,
  input: {
    date: string;
    time: string;
    location?: string;
    notes?: string;
  }
): Promise<InterviewMutationResult> {
  const applicationId = applicationIdFromInterviewId(interviewId);
  if (!applicationId) return { error: "Interview not found.", status: 404 };
  const row = await prisma.application.findUnique({
    where: { id: applicationId },
  });
  if (!row) {
    return { error: "Interview not found.", status: 404 };
  }
  const app = toAdminApplication(row);
  if (!isInterviewRecord(app)) {
    return { error: "Interview not found.", status: 404 };
  }
  if (!app.interviewDate) {
    return { error: "This interview has not been scheduled yet.", status: 400 };
  }
  if (app.interviewStatus === "completed") {
    return { error: "A completed interview cannot be rescheduled.", status: 400 };
  }
  if (!isValidInterviewDate(input.date)) {
    return { error: "Interview date must be a valid date (YYYY-MM-DD).", status: 400 };
  }
  if (!isValidInterviewTime(input.time)) {
    return { error: "Interview time must be a valid time (HH:MM).", status: 400 };
  }
  if (isInThePast(input.date, input.time)) {
    return { error: "Interview date and time cannot be in the past.", status: 400 };
  }

  const updated = await prisma.application.update({
    where: { id: applicationId },
    data: {
      interviewStatus: "scheduled",
      interviewDate: input.date,
      interviewTime: input.time,
      interviewLocation: cleanInterviewText(input.location),
      interviewNotes: cleanInterviewText(input.notes),
    },
  });

  return { interview: toInterviewListItem(toAdminApplication(updated)), status: 200 };
}

export async function cancelInterview(
  interviewId: string
): Promise<InterviewMutationResult> {
  const applicationId = applicationIdFromInterviewId(interviewId);
  if (!applicationId) return { error: "Interview not found.", status: 404 };
  const row = await prisma.application.findUnique({
    where: { id: applicationId },
  });
  if (!row) {
    return { error: "Interview not found.", status: 404 };
  }
  const app = toAdminApplication(row);
  if (!isInterviewRecord(app)) {
    return { error: "Interview not found.", status: 404 };
  }
  if (!app.interviewDate) {
    return { error: "This interview has not been scheduled yet.", status: 400 };
  }
  if (app.interviewStatus === "cancelled") {
    return { error: "Interview is already cancelled.", status: 400 };
  }
  if (app.interviewStatus === "completed") {
    return { error: "A completed interview cannot be cancelled.", status: 400 };
  }

  const updated = await prisma.application.update({
    where: { id: applicationId },
    data: { interviewStatus: "cancelled" },
  });

  return { interview: toInterviewListItem(toAdminApplication(updated)), status: 200 };
}

export type TeamJobsFilter = "with" | "without";

export type TeamSortOption = "name-az" | "name-za" | "jobs-desc" | "jobs-asc";

export interface TeamListItem {
  slug: string;
  name: string;
  description: string;
  departments: string[];
  jobCount: number;
  applicationCount: number;
}

export interface TeamSummary {
  total: number;
  withJobs: number;
  totalJobs: number;
}

export interface AdminTeamsQuery {
  search?: string;
  jobs?: string;
  sort?: TeamSortOption;
  page?: number;
  limit?: number;
}

export interface AdminTeamsListResult {
  teams: TeamListItem[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
  totalCount: number;
  summary: TeamSummary;
}

export async function getAdminTeamsList(
  query: AdminTeamsQuery
): Promise<AdminTeamsListResult> {
  const teams = await getAllTeams();
  const jobs = await getAllJobs();
  const jobDepartmentById = new Map(jobs.map((j) => [j.id, j.department]));
  const applications = await getAllApplications();

  const base: TeamListItem[] = teams.map((team) => {
    const jobCount = jobs.filter(
      (j) => j.status === "Open" && team.departments.includes(j.department)
    ).length;
    const applicationCount = applications.filter((a) => {
      const department = jobDepartmentById.get(a.jobId);
      return department !== undefined && team.departments.includes(department);
    }).length;
    return {
      slug: team.slug,
      name: team.name,
      description: team.description,
      departments: team.departments,
      jobCount,
      applicationCount,
    };
  });

  const summary: TeamSummary = {
    total: base.length,
    withJobs: base.filter((t) => t.jobCount > 0).length,
    totalJobs: base.reduce((sum, t) => sum + t.jobCount, 0),
  };

  let filtered = [...base];

  if (query.search) {
    const term = query.search.toLowerCase();
    filtered = filtered.filter(
      (t) =>
        t.name.toLowerCase().includes(term) ||
        t.description.toLowerCase().includes(term) ||
        t.departments.some((d) => d.toLowerCase().includes(term))
    );
  }

  if (query.jobs === "with") {
    filtered = filtered.filter((t) => t.jobCount > 0);
  } else if (query.jobs === "without") {
    filtered = filtered.filter((t) => t.jobCount === 0);
  }

  const sort = query.sort || "name-az";
  switch (sort) {
    case "name-az":
      filtered.sort((a, b) => a.name.localeCompare(b.name));
      break;
    case "name-za":
      filtered.sort((a, b) => b.name.localeCompare(a.name));
      break;
    case "jobs-desc":
      filtered.sort(
        (a, b) => b.jobCount - a.jobCount || a.name.localeCompare(b.name)
      );
      break;
    case "jobs-asc":
      filtered.sort(
        (a, b) => a.jobCount - b.jobCount || a.name.localeCompare(b.name)
      );
      break;
  }

  const limit = Math.min(100, Math.max(1, query.limit || 20));
  const totalPages = Math.max(1, Math.ceil(filtered.length / limit));
  const page = Math.min(Math.max(1, query.page || 1), totalPages);
  const start = (page - 1) * limit;
  const paged = filtered.slice(start, start + limit);

  return {
    teams: paged,
    total: filtered.length,
    page,
    limit,
    totalPages,
    totalCount: base.length,
    summary,
  };
}

export interface CareersSettings {
  pageSizeJobs: number;
  pageSizeApplications: number;
  pageSizeCandidates: number;
  pageSizeInterviews: number;
  pageSizeTeams: number;
  enablePublicCareers: boolean;
  defaultJobStatus: string;
  showApplicationCount: boolean;
  showInterviewCount: boolean;
}

const DEFAULT_CAREERS_SETTINGS: CareersSettings = {
  pageSizeJobs: 20,
  pageSizeApplications: 20,
  pageSizeCandidates: 20,
  pageSizeInterviews: 20,
  pageSizeTeams: 20,
  enablePublicCareers: true,
  defaultJobStatus: "Draft",
  showApplicationCount: true,
  showInterviewCount: true,
};

const CAREERS_SETTINGS_STORE_KEY = "__next360_careers_settings_store__";

function getCareersSettingsStore(): CareersSettings {
  const g = globalThis as Record<string, unknown>;
  const existing = g[CAREERS_SETTINGS_STORE_KEY] as CareersSettings | undefined;
  if (existing && typeof existing === "object") {
    return existing;
  }
  const store: CareersSettings = { ...DEFAULT_CAREERS_SETTINGS };
  Object.defineProperty(g, CAREERS_SETTINGS_STORE_KEY, {
    value: store,
    writable: false,
    enumerable: false,
    configurable: false,
  });
  return store;
}

export function getCareersSettings(): CareersSettings {
  return { ...getCareersSettingsStore() };
}

export function updateCareersSettings(
  patch: Partial<CareersSettings>
): CareersSettings {
  const store = getCareersSettingsStore();
  if (typeof patch.pageSizeJobs === "number") {
    store.pageSizeJobs = Math.min(100, Math.max(10, Math.floor(patch.pageSizeJobs)));
  }
  if (typeof patch.pageSizeApplications === "number") {
    store.pageSizeApplications = Math.min(100, Math.max(10, Math.floor(patch.pageSizeApplications)));
  }
  if (typeof patch.pageSizeCandidates === "number") {
    store.pageSizeCandidates = Math.min(100, Math.max(10, Math.floor(patch.pageSizeCandidates)));
  }
  if (typeof patch.pageSizeInterviews === "number") {
    store.pageSizeInterviews = Math.min(100, Math.max(10, Math.floor(patch.pageSizeInterviews)));
  }
  if (typeof patch.pageSizeTeams === "number") {
    store.pageSizeTeams = Math.min(100, Math.max(10, Math.floor(patch.pageSizeTeams)));
  }
  if (typeof patch.enablePublicCareers === "boolean") {
    store.enablePublicCareers = patch.enablePublicCareers;
  }
  if (typeof patch.defaultJobStatus === "string") {
    const allowed = ["Draft", "Open", "Closed", "Paused"];
    if (allowed.includes(patch.defaultJobStatus)) {
      store.defaultJobStatus = patch.defaultJobStatus;
    }
  }
  if (typeof patch.showApplicationCount === "boolean") {
    store.showApplicationCount = patch.showApplicationCount;
  }
  if (typeof patch.showInterviewCount === "boolean") {
    store.showInterviewCount = patch.showInterviewCount;
  }
  return { ...store };
}

export function resetCareersSettings(): CareersSettings {
  const store = getCareersSettingsStore();
  store.pageSizeJobs = DEFAULT_CAREERS_SETTINGS.pageSizeJobs;
  store.pageSizeApplications = DEFAULT_CAREERS_SETTINGS.pageSizeApplications;
  store.pageSizeCandidates = DEFAULT_CAREERS_SETTINGS.pageSizeCandidates;
  store.pageSizeInterviews = DEFAULT_CAREERS_SETTINGS.pageSizeInterviews;
  store.pageSizeTeams = DEFAULT_CAREERS_SETTINGS.pageSizeTeams;
  store.enablePublicCareers = DEFAULT_CAREERS_SETTINGS.enablePublicCareers;
  store.defaultJobStatus = DEFAULT_CAREERS_SETTINGS.defaultJobStatus;
  store.showApplicationCount = DEFAULT_CAREERS_SETTINGS.showApplicationCount;
  store.showInterviewCount = DEFAULT_CAREERS_SETTINGS.showInterviewCount;
  return { ...store };
}