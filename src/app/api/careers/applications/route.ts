import { NextRequest, NextResponse } from "next/server";
import { getJobById } from "@/components/careers/mock-jobs";
import type { EducationRecord } from "@/components/careers/mock-applications";
import { createAdminApplication } from "@/components/admin/admin-data";

function isNonEmptyString(value: unknown): value is string {
  return typeof value === "string" && value.trim().length > 0;
}

function parseOptionalString(value: unknown): string | undefined {
  return isNonEmptyString(value) ? value.trim() : undefined;
}

function parseEducation(value: unknown): EducationRecord[] | undefined {
  if (!Array.isArray(value)) return undefined;
  const entries: EducationRecord[] = [];
  for (const item of value) {
    if (!item || typeof item !== "object" || Array.isArray(item)) continue;
    const record = item as Record<string, unknown>;
    entries.push({
      qualification: parseOptionalString(record.qualification) ?? "",
      institution: parseOptionalString(record.institution) ?? "",
      fieldOfStudy: parseOptionalString(record.fieldOfStudy) ?? "",
      graduationYear: parseOptionalString(record.graduationYear) ?? "",
    });
  }
  return entries.length > 0 ? entries : undefined;
}

function parseAdditionalAnswers(
  value: unknown
): Record<string, string> | undefined {
  if (!value || typeof value !== "object" || Array.isArray(value)) {
    return undefined;
  }
  const answers: Record<string, string> = {};
  for (const [key, answer] of Object.entries(value)) {
    if (typeof answer === "string" && answer.trim()) {
      answers[key] = answer.trim();
    }
  }
  return Object.keys(answers).length > 0 ? answers : undefined;
}

export async function POST(request: NextRequest) {
  try {
    let body: unknown;
    try {
      body = await request.json();
    } catch {
      return NextResponse.json(
        { error: "Invalid request body." },
        { status: 400 }
      );
    }

    if (!body || typeof body !== "object" || Array.isArray(body)) {
      return NextResponse.json(
        { error: "Invalid request body." },
        { status: 400 }
      );
    }

    const input = body as Record<string, unknown>;
    const requiredFields = [
      "jobId",
      "candidateEmail",
      "candidateFirstName",
      "candidateLastName",
    ];

    for (const field of requiredFields) {
      if (!isNonEmptyString(input[field])) {
        return NextResponse.json(
          { error: `Field "${field}" is required.` },
          { status: 400 }
        );
      }
    }

    const job = getJobById(input.jobId as string);
    if (!job) {
      return NextResponse.json(
        { error: "Job not found." },
        { status: 404 }
      );
    }

    const application = createAdminApplication({
      jobId: job.id,
      candidateEmail: (input.candidateEmail as string).trim(),
      candidateFirstName: (input.candidateFirstName as string).trim(),
      candidateLastName: (input.candidateLastName as string).trim(),
      phone: parseOptionalString(input.phone),
      currentLocation: parseOptionalString(input.currentLocation),
      country: parseOptionalString(input.country),
      currentJobTitle: parseOptionalString(input.currentJobTitle),
      currentCompany: parseOptionalString(input.currentCompany),
      experienceLevel: parseOptionalString(input.experienceLevel),
      yearsOfExperience: parseOptionalString(input.yearsOfExperience),
      education: parseEducation(input.education),
      resumeFileName: parseOptionalString(input.resumeFileName),
      resumeFileSize: parseOptionalString(input.resumeFileSize),
      linkedinUrl: parseOptionalString(input.linkedinUrl),
      githubUrl: parseOptionalString(input.githubUrl),
      portfolioUrl: parseOptionalString(input.portfolioUrl),
      otherWebsite: parseOptionalString(input.otherWebsite),
      additionalAnswers: parseAdditionalAnswers(input.additionalAnswers),
    });

    if (!application) {
      return NextResponse.json(
        { error: "Unable to save application." },
        { status: 500 }
      );
    }

    return NextResponse.json(application, { status: 201 });
  } catch {
    return NextResponse.json(
      { error: "Unable to save application." },
      { status: 500 }
    );
  }
}