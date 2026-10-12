import {
  mockJobs,
  EXPERIENCE_LEVELS,
} from "@/components/careers/mock-jobs";
import {
  type EducationRecord,
} from "@/components/careers/mock-applications";
import { teams as careersTeams } from "@/components/careers/teams-data";
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

const CITY_POOL = [
  "Hyderabad",
  "Bengaluru",
  "Mumbai",
  "Pune",
  "Chennai",
  "Delhi NCR",
  "Gurugram",
  "Kolkata",
  "Ahmedabad",
  "Indore",
  "Jaipur",
  "Noida",
];

const CURRENT_ROLE_POOL = [
  "Software Developer",
  "Support Engineer",
  "Product Analyst",
  "Marketing Executive",
  "Sales Executive",
  "Business Analyst",
  "Consultant",
  "Associate Engineer",
  "Content Specialist",
  "Analyst",
];

const COMPANY_POOL = [
  "Infosys",
  "Wipro",
  "TCS",
  "Accenture",
  "Cognizant",
  "Amazon",
  "Flipkart",
  "Zomato",
  "Paytm",
  "HCL Technologies",
  "Deloitte",
  "Swiggy",
];

const INSTITUTION_POOL = [
  "Indian Institute of Technology, Bombay",
  "National Institute of Technology, Trichy",
  "BITS Pilani",
  "University of Delhi",
  "Anna University, Chennai",
  "Vellore Institute of Technology",
  "Indian School of Business",
  "IIM Bangalore",
  "SRM Institute of Science and Technology",
  "Manipal Institute of Technology",
];

const QUALIFICATION_POOL = [
  "Bachelor's Degree",
  "Master's Degree",
  "MBA",
  "Postgraduate Diploma",
];

const FIELD_POOL = [
  "Computer Science",
  "Electronics & Communication",
  "Information Technology",
  "Business Administration",
  "Marketing",
  "Finance",
  "Human Resources",
  "Design",
];

const WHY_INTERESTED_POOL = [
  "I am excited about Next360's mission and the opportunity to deliver impactful work.",
  "The role aligns closely with my skills and long-term career goals.",
  "I admire Next360's culture of innovation and would love to contribute.",
  "This role offers a strong opportunity to grow and solve meaningful problems.",
  "I want to join a team where my experience can make a tangible difference.",
];

const NOTICE_PERIOD_POOL = ["Immediate", "15 days", "30 days", "60 days"];

const RELOCATE_POOL = ["Yes", "Maybe", "No"];

const RESUME_SIZE_POOL = ["245 KB", "1.1 MB", "890 KB", "642 KB", "518 KB", "1.4 MB"];

const STATUS_UPDATE_OFFSET_DAYS: Record<ApplicationStatus, number> = {
  applied: 0,
  under_review: 1,
  interview: 3,
  selected: 5,
  rejected: 2,
  withdrawn: 1,
};

function paddedMobile(seed: number): string {
  const a = String(87650 + seed * 137).slice(-5);
  const b = String(23410 + seed * 3791).slice(-5);
  return `+91 ${a} ${b}`;
}

function slugify(value: string): string {
  return value
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

function generateMockApplications(): AdminApplication[] {
  const names = [
    { first: "Priya", last: "Sharma" },
    { first: "Arjun", last: "Patel" },
    { first: "Sneha", last: "Reddy" },
    { first: "Rahul", last: "Kumar" },
    { first: "Ananya", last: "Nair" },
    { first: "Vikram", last: "Singh" },
    { first: "Meera", last: "Iyer" },
    { first: "Karthik", last: "Menon" },
    { first: "Divya", last: "Gupta" },
    { first: "Aditya", last: "Joshi" },
    { first: "Pooja", last: "Desai" },
    { first: "Suresh", last: "Babu" },
    { first: "Nisha", last: "Rao" },
    { first: "Amit", last: "Verma" },
    { first: "Lakshmi", last: "Prasad" },
    { first: "Rohan", last: "Mehta" },
    { first: "Swati", last: "Kulkarni" },
    { first: "Manish", last: "Tiwari" },
    { first: "Harini", last: "Subramanian" },
    { first: "Deepak", last: "Choudhary" },
    { first: "Tanvi", last: "Mishra" },
    { first: "Nikhil", last: "Agarwal" },
    { first: "Shruti", last: "Pandey" },
    { first: "Vishal", last: "Rathore" },
    { first: "Kavita", last: "Sinha" },
    { first: "Siddharth", last: "Kulkarni" },
    { first: "Ritu", last: "Chauhan" },
    { first: "Gaurav", last: "Saxena" },
    { first: "Preeti", last: "Chandra" },
    { first: "Tarun", last: "Bhatt" },
  ];

  const statuses: ApplicationStatus[] = [
    "applied",
    "applied",
    "applied",
    "under_review",
    "under_review",
    "under_review",
    "interview",
    "interview",
    "selected",
    "rejected",
    "rejected",
    "withdrawn",
  ];

  const applications: AdminApplication[] = [];
  const openJobs = mockJobs.filter((j) => j.status === "Open");

  for (let i = 0; i < 30; i++) {
    const job = openJobs[i % openJobs.length];
    const name = names[i % names.length];
    const status = statuses[i % statuses.length];
    const daysAgo = i * 2;
    const appliedDate = new Date();
    appliedDate.setDate(appliedDate.getDate() - daysAgo);

    const updatedDate = new Date(
      appliedDate.getTime() + STATUS_UPDATE_OFFSET_DAYS[status] * 86400000
    );

    const handle = slugify(`${name.first}.${name.last}`);
    const education: EducationRecord[] = [
      {
        qualification: QUALIFICATION_POOL[i % QUALIFICATION_POOL.length],
        institution: INSTITUTION_POOL[i % INSTITUTION_POOL.length],
        fieldOfStudy: FIELD_POOL[i % FIELD_POOL.length],
        graduationYear: String(2009 + (i % 16)),
      },
    ];
    if (i % 5 === 0) {
      education.push({
        qualification: QUALIFICATION_POOL[(i + 2) % QUALIFICATION_POOL.length],
        institution: INSTITUTION_POOL[(i + 4) % INSTITUTION_POOL.length],
        fieldOfStudy: FIELD_POOL[(i + 1) % FIELD_POOL.length],
        graduationYear: String(2005 + (i % 10)),
      });
    }

    const experienceLevel =
      status === "interview" || status === "selected"
        ? EXPERIENCE_LEVELS[(i + 1) % EXPERIENCE_LEVELS.length]
        : EXPERIENCE_LEVELS[i % EXPERIENCE_LEVELS.length];

    applications.push({
      id: `ADM-APP-${String(i + 1).padStart(3, "0")}`,
      jobId: job.id,
      jobTitle: job.title,
      department: job.department,
      location: job.location,
      candidateEmail: `${name.first.toLowerCase()}.${name.last.toLowerCase()}@example.com`,
      candidateFirstName: name.first,
      candidateLastName: name.last,
      status,
      appliedAt: appliedDate.toISOString(),
      updatedAt: updatedDate.toISOString(),
      phone: paddedMobile(i),
      currentLocation: CITY_POOL[(i + 3) % CITY_POOL.length],
      country: "India",
      currentJobTitle: CURRENT_ROLE_POOL[i % CURRENT_ROLE_POOL.length],
      currentCompany: COMPANY_POOL[i % COMPANY_POOL.length],
      experienceLevel,
      yearsOfExperience: String((i % 11) + 2),
      education,
      resumeFileName: `${name.first}_${name.last}_Resume.pdf`,
      resumeFileSize: RESUME_SIZE_POOL[i % RESUME_SIZE_POOL.length],
      linkedinUrl: `https://www.linkedin.com/in/${handle}`,
      githubUrl: `https://github.com/${handle}`,
      portfolioUrl:
        i % 2 === 0 ? `https://${slugify(name.first)}.dev` : undefined,
      additionalAnswers:
        i === 7
          ? undefined
          : {
              whyInterested:
                WHY_INTERESTED_POOL[i % WHY_INTERESTED_POOL.length],
              noticePeriod: NOTICE_PERIOD_POOL[i % NOTICE_PERIOD_POOL.length],
              willingToRelocate: RELOCATE_POOL[i % RELOCATE_POOL.length],
            },
    });
  }

  const multiApplicationIndexes = [2, 5, 8, 11];
  for (let m = 0; m < multiApplicationIndexes.length; m++) {
    const i = multiApplicationIndexes[m];
    const primary = applications[i];
    let secondJob = openJobs[(i + 7) % openJobs.length];
    if (secondJob.id === primary.jobId) {
      secondJob = openJobs[(i + 8) % openJobs.length];
    }
    const secondStatus = statuses[(i + 3) % statuses.length];
    const secondDate = new Date(
      new Date(primary.appliedAt).getTime() - 3 * 86400000
    );
    applications.push({
      id: `ADM-APP-${String(applications.length + 1).padStart(3, "0")}`,
      jobId: secondJob.id,
      jobTitle: secondJob.title,
      department: secondJob.department,
      location: secondJob.location,
      candidateEmail: primary.candidateEmail,
      candidateFirstName: primary.candidateFirstName,
      candidateLastName: primary.candidateLastName,
      status: secondStatus,
      appliedAt: secondDate.toISOString(),
      updatedAt: new Date(
        secondDate.getTime() + STATUS_UPDATE_OFFSET_DAYS[secondStatus] * 86400000
      ).toISOString(),
      phone: primary.phone,
      currentLocation: primary.currentLocation,
      country: primary.country,
      currentJobTitle: primary.currentJobTitle,
      currentCompany: primary.currentCompany,
      experienceLevel: primary.experienceLevel,
      yearsOfExperience: primary.yearsOfExperience,
      education: primary.education ? [primary.education[0]] : undefined,
      resumeFileName: primary.resumeFileName,
      resumeFileSize: primary.resumeFileSize,
      linkedinUrl: primary.linkedinUrl,
      githubUrl: primary.githubUrl,
      portfolioUrl: primary.portfolioUrl,
      additionalAnswers: primary.additionalAnswers,
    });
  }

  const interviewSeedPlan: {
    status: InterviewStatus | "unscheduled";
    offsetDays: number;
    time: string;
    location?: string;
  }[] = [
    { status: "scheduled", offsetDays: 3, time: "10:00", location: "Next360 Office, Bengaluru" },
    { status: "completed", offsetDays: -2, time: "14:30", location: "Next360 Office, Hyderabad" },
    { status: "cancelled", offsetDays: 1, time: "11:00", location: "Next360 Office, Pune" },
    { status: "unscheduled", offsetDays: 0, time: "" },
  ];

  const interviewApps = applications.filter((a) => a.status === "interview");
  interviewApps.forEach((app, idx) => {
    const plan = interviewSeedPlan[idx % interviewSeedPlan.length];
    if (plan.status === "unscheduled") return;
    const interviewDate = new Date();
    interviewDate.setDate(interviewDate.getDate() + plan.offsetDays);
    const month = String(interviewDate.getMonth() + 1).padStart(2, "0");
    const day = String(interviewDate.getDate()).padStart(2, "0");
    app.interviewStatus = plan.status;
    app.interviewDate = `${interviewDate.getFullYear()}-${month}-${day}`;
    app.interviewTime = plan.time;
    app.interviewLocation = plan.location;
  });

  return applications;
}

const ADMIN_APPLICATIONS_STORE_KEY = "__next360_admin_applications_store__";

function getAdminApplicationStore(): AdminApplication[] {
  const g = globalThis as Record<string, unknown>;
  const existing = g[ADMIN_APPLICATIONS_STORE_KEY] as
    | AdminApplication[]
    | undefined;
  if (Array.isArray(existing)) {
    return existing;
  }
  const store = generateMockApplications();
  Object.defineProperty(g, ADMIN_APPLICATIONS_STORE_KEY, {
    value: store,
    writable: false,
    enumerable: false,
    configurable: false,
  });
  return store;
}

function getApplications(): AdminApplication[] {
  return getAdminApplicationStore();
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

export function getDashboardData(): DashboardData {
  const jobs = mockJobs;
  const applications = getApplications();

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

export function getAdminJobs() {
  return mockJobs;
}

export function getAdminJobById(id: string): Job | undefined {
  return mockJobs.find((job) => job.id === id);
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

export function getJobApplicationStats(jobId: string): JobApplicationStats {
  const apps = getApplications().filter((a) => a.jobId === jobId);

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

export function getAdminApplications() {
  return getApplications();
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

export function createAdminJob(input: CreateJobInput) {
  const id = String(mockJobs.length + 1);
  const now = new Date().toISOString().split("T")[0];

  const newJob = {
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
  };

  mockJobs.push(newJob);
  return newJob;
}

export type UpdateJobInput = Partial<CreateJobInput>;

const VALID_JOB_STATUSES = ["Draft", "Open", "Closed", "Paused"];

function cleanList(items: string[] | undefined): string[] | undefined {
  if (!Array.isArray(items)) return undefined;
  return items.filter((i) => typeof i === "string" && i.trim());
}

export function updateAdminJob(
  id: string,
  patch: UpdateJobInput
): Job | null {
  const job = mockJobs.find((j) => j.id === id);
  if (!job) return null;

  if (typeof patch.title === "string") job.title = patch.title.trim();
  if (typeof patch.department === "string") {
    job.department = patch.department.trim();
  }
  if (typeof patch.location === "string") job.location = patch.location.trim();
  if (typeof patch.experience === "string") {
    job.experience = patch.experience.trim();
  }
  if (typeof patch.employmentType === "string") {
    job.employmentType = patch.employmentType.trim();
  }
  if (typeof patch.workMode === "string") job.workMode = patch.workMode.trim();
  if (typeof patch.team === "string") {
    const team = patch.team.trim();
    job.team = team || undefined;
  }
  if (typeof patch.description === "string") {
    job.description = patch.description.trim();
  }

  if (Array.isArray(patch.skills)) {
    job.skills = cleanList(patch.skills) ?? [];
  }
  if (Array.isArray(patch.responsibilities)) {
    job.responsibilities = cleanList(patch.responsibilities) ?? [];
  }
  if (Array.isArray(patch.qualifications)) {
    job.qualifications = cleanList(patch.qualifications) ?? [];
  }
  if (Array.isArray(patch.preferredQualifications)) {
    job.preferredQualifications = cleanList(patch.preferredQualifications) ?? [];
  }
  if (Array.isArray(patch.benefits)) {
    job.benefits = cleanList(patch.benefits) ?? [];
  }

  if (
    typeof patch.status === "string" &&
    VALID_JOB_STATUSES.includes(patch.status)
  ) {
    job.status = patch.status;
  }

  return job;
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

export function getAdminJobsList(query: AdminJobsQuery): AdminJobsListResult {
  let filtered = [...mockJobs];

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
  for (const j of mockJobs) {
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

  return { jobs, total, page, limit, totalPages, totalCount: mockJobs.length, statusCounts };
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

export function getAdminApplicationsList(
  query: AdminApplicationsQuery
): AdminApplicationsListResult {
  const applications = getAdminApplicationStore();
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

export function createAdminApplication(
  input: CreateAdminApplicationInput
): AdminApplication | null {
  const job = mockJobs.find((j) => j.id === input.jobId);
  if (!job) return null;

  const store = getAdminApplicationStore();
  const existing = store.find(
    (a) =>
      a.jobId === job.id &&
      a.candidateEmail.toLowerCase() === input.candidateEmail.toLowerCase()
  );
  if (existing) return existing;

  const now = new Date().toISOString();
  const newApplication: AdminApplication = {
    id: `ADM-APP-${String(store.length + 1).padStart(3, "0")}`,
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
    education: cleanEducation(input.education),
    resumeFileName: cleanOptional(input.resumeFileName),
    resumeFileSize: cleanOptional(input.resumeFileSize),
    linkedinUrl: cleanOptional(input.linkedinUrl),
    githubUrl: cleanOptional(input.githubUrl),
    portfolioUrl: cleanOptional(input.portfolioUrl),
    otherWebsite: cleanOptional(input.otherWebsite),
    additionalAnswers: cleanAdditionalAnswers(input.additionalAnswers),
  };

  store.unshift(newApplication);
  return newApplication;
}

export function getAdminApplicationById(id: string): AdminApplication | undefined {
  return getAdminApplicationStore().find((a) => a.id === id);
}

export function getApplicationTransitions(
  status: ApplicationStatus
): ApplicationStatus[] {
  return APPLICATION_TRANSITIONS[status] || [];
}

export function updateAdminApplicationStatus(
  id: string,
  status: ApplicationStatus
): AdminApplication | null {
  const application = getAdminApplicationStore().find((a) => a.id === id);
  if (!application) return null;
  application.status = status;
  application.updatedAt = new Date().toISOString();
  return application;
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

function getCandidatesByEmail(): Map<string, AdminApplication[]> {
  const grouped = new Map<string, AdminApplication[]>();
  for (const app of getAdminApplicationStore()) {
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

export function getAdminCandidatesList(
  query: AdminCandidatesQuery
): AdminCandidatesListResult {
  const grouped = getCandidatesByEmail();
  const jobOptions = getApplicationJobOptions(getAdminApplicationStore());

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

export function getAdminCandidateDetail(
  id: string,
  status?: string
): AdminCandidateDetailResult | null {
  const grouped = getCandidatesByEmail();
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

function getApplicationOptionsForInterviews(): InterviewApplicationOption[] {
  return getAdminApplicationStore()
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

export function getAdminInterviewsList(
  query: AdminInterviewsQuery
): AdminInterviewsListResult {
  const applications = getAdminApplicationStore();
  const records = applications.filter(isInterviewRecord);
  const jobOptions = getApplicationJobOptions(applications);
  const applicationOptions = getApplicationOptionsForInterviews();

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

export function getAdminInterviewById(
  interviewId: string
): InterviewListItem | null {
  const applicationId = applicationIdFromInterviewId(interviewId);
  if (!applicationId) return null;
  const app = getAdminApplicationStore().find((a) => a.id === applicationId);
  if (!app || !isInterviewRecord(app)) return null;
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

export function scheduleInterview(input: {
  applicationId: string;
  date: string;
  time: string;
  location?: string;
  notes?: string;
}): InterviewMutationResult {
  const app = getAdminApplicationStore().find((a) => a.id === input.applicationId);
  if (!app || !isInterviewRecord(app)) {
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

  app.interviewStatus = "scheduled";
  app.interviewDate = input.date;
  app.interviewTime = input.time;
  app.interviewLocation = cleanInterviewText(input.location);
  app.interviewNotes = cleanInterviewText(input.notes);

  return { interview: toInterviewListItem(app), status: 201 };
}

export function rescheduleInterview(
  interviewId: string,
  input: {
    date: string;
    time: string;
    location?: string;
    notes?: string;
  }
): InterviewMutationResult {
  const applicationId = applicationIdFromInterviewId(interviewId);
  if (!applicationId) return { error: "Interview not found.", status: 404 };
  const app = getAdminApplicationStore().find((a) => a.id === applicationId);
  if (!app || !isInterviewRecord(app)) {
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

  app.interviewStatus = "scheduled";
  app.interviewDate = input.date;
  app.interviewTime = input.time;
  app.interviewLocation = cleanInterviewText(input.location);
  app.interviewNotes = cleanInterviewText(input.notes);

  return { interview: toInterviewListItem(app), status: 200 };
}

export function cancelInterview(interviewId: string): InterviewMutationResult {
  const applicationId = applicationIdFromInterviewId(interviewId);
  if (!applicationId) return { error: "Interview not found.", status: 404 };
  const app = getAdminApplicationStore().find((a) => a.id === applicationId);
  if (!app || !isInterviewRecord(app)) {
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

  app.interviewStatus = "cancelled";

  return { interview: toInterviewListItem(app), status: 200 };
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

export function getAdminTeamsList(query: AdminTeamsQuery): AdminTeamsListResult {
  const jobDepartmentById = new Map(mockJobs.map((j) => [j.id, j.department]));
  const applications = getApplications();

  const base: TeamListItem[] = careersTeams.map((team) => {
    const jobCount = mockJobs.filter(
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
