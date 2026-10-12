import { NextRequest, NextResponse } from "next/server";
import {
  getAdminJobById,
  getJobApplicationStats,
  updateAdminJob,
  type UpdateJobInput,
} from "@/components/admin/admin-data";

interface RouteContext {
  params: Promise<{ id: string }>;
}

const REQUIRED_TEXT_FIELDS = [
  "title",
  "department",
  "location",
  "experience",
  "employmentType",
  "workMode",
  "description",
];

const LIST_FIELDS = [
  "skills",
  "responsibilities",
  "qualifications",
  "preferredQualifications",
  "benefits",
];

const VALID_STATUSES = ["Draft", "Open", "Closed", "Paused"];

export async function GET(_request: NextRequest, context: RouteContext) {
  try {
    const { id } = await context.params;
    const job = getAdminJobById(id);

    if (!job) {
      return NextResponse.json(
        { error: "Job not found." },
        { status: 404 }
      );
    }

    const stats = getJobApplicationStats(job.id);
    return NextResponse.json({ job, stats });
  } catch {
    return NextResponse.json(
      { error: "Unable to load job details." },
      { status: 500 }
    );
  }
}

export async function PATCH(request: NextRequest, context: RouteContext) {
  try {
    const { id } = await context.params;

    if (!getAdminJobById(id)) {
      return NextResponse.json(
        { error: "Job not found." },
        { status: 404 }
      );
    }

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

    const patch = body as Record<string, unknown>;

    for (const field of REQUIRED_TEXT_FIELDS) {
      if (field in patch) {
        const value = patch[field];
        if (typeof value !== "string" || !value.trim()) {
          return NextResponse.json(
            { error: `${field} is required.` },
            { status: 400 }
          );
        }
      }
    }

    if ("team" in patch && typeof patch.team !== "string") {
      return NextResponse.json(
        { error: "team must be a string." },
        { status: 400 }
      );
    }

    for (const field of LIST_FIELDS) {
      if (field in patch) {
        const value = patch[field];
        if (
          !Array.isArray(value) ||
          value.some((v) => typeof v !== "string")
        ) {
          return NextResponse.json(
            { error: `${field} must be a list of strings.` },
            { status: 400 }
          );
        }
      }
    }

    if ("status" in patch) {
      const status = patch.status;
      if (typeof status !== "string" || !VALID_STATUSES.includes(status)) {
        return NextResponse.json(
          { error: "Status must be one of Draft, Open, Closed, or Paused." },
          { status: 400 }
        );
      }
    }

    const job = updateAdminJob(id, patch as UpdateJobInput);

    if (!job) {
      return NextResponse.json(
        { error: "Job not found." },
        { status: 404 }
      );
    }

    const stats = getJobApplicationStats(job.id);
    return NextResponse.json({ job, stats });
  } catch {
    return NextResponse.json(
      { error: "Unable to update job." },
      { status: 500 }
    );
  }
}