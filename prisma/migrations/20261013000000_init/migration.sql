-- CreateSchema
CREATE SCHEMA IF NOT EXISTS "public";

-- CreateTable
CREATE TABLE "jobs" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "department" TEXT NOT NULL,
    "location" TEXT NOT NULL,
    "experience" TEXT NOT NULL,
    "employmentType" TEXT NOT NULL,
    "workMode" TEXT NOT NULL,
    "team" TEXT NOT NULL DEFAULT '',
    "skills" TEXT[],
    "description" TEXT NOT NULL,
    "responsibilities" TEXT[],
    "qualifications" TEXT[],
    "preferredQualifications" TEXT[],
    "benefits" TEXT[],
    "postedAt" TEXT NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'Draft',
    "teamDescription" TEXT,

    CONSTRAINT "jobs_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "applications" (
    "id" TEXT NOT NULL,
    "jobId" TEXT NOT NULL,
    "jobTitle" TEXT NOT NULL,
    "department" TEXT NOT NULL,
    "location" TEXT NOT NULL,
    "candidateEmail" TEXT NOT NULL,
    "candidateFirstName" TEXT NOT NULL,
    "candidateLastName" TEXT NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'applied',
    "appliedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3),
    "phone" TEXT,
    "currentLocation" TEXT,
    "country" TEXT,
    "currentJobTitle" TEXT,
    "currentCompany" TEXT,
    "experienceLevel" TEXT,
    "yearsOfExperience" TEXT,
    "education" JSONB,
    "resumeFileName" TEXT,
    "resumeFileSize" TEXT,
    "linkedinUrl" TEXT,
    "githubUrl" TEXT,
    "portfolioUrl" TEXT,
    "otherWebsite" TEXT,
    "additionalAnswers" JSONB,
    "interviewStatus" TEXT,
    "interviewDate" TEXT,
    "interviewTime" TEXT,
    "interviewLocation" TEXT,
    "interviewNotes" TEXT,

    CONSTRAINT "applications_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "teams" (
    "id" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "longDescription" TEXT NOT NULL,
    "icon" TEXT NOT NULL,
    "departments" TEXT[],
    "roles" TEXT[],
    "skills" TEXT[],

    CONSTRAINT "teams_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "jobs_status_idx" ON "jobs"("status");

-- CreateIndex
CREATE INDEX "applications_status_idx" ON "applications"("status");

-- CreateIndex
CREATE INDEX "applications_candidateEmail_idx" ON "applications"("candidateEmail");

-- CreateIndex
CREATE UNIQUE INDEX "applications_jobId_candidateEmail_key" ON "applications"("jobId", "candidateEmail");

-- CreateIndex
CREATE UNIQUE INDEX "teams_slug_key" ON "teams"("slug");

-- AddForeignKey
ALTER TABLE "applications" ADD CONSTRAINT "applications_jobId_fkey" FOREIGN KEY ("jobId") REFERENCES "jobs"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
