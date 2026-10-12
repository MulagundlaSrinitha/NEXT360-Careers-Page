import { NextRequest, NextResponse } from "next/server";
import {
  getCareersSettings,
  updateCareersSettings,
  resetCareersSettings,
  type CareersSettings,
} from "@/components/admin/admin-data";

export async function GET() {
  try {
    const settings = getCareersSettings();
    return NextResponse.json({ settings });
  } catch {
    return NextResponse.json(
      { error: "Unable to load settings." },
      { status: 500 }
    );
  }
}

function isBoolean(value: unknown): value is boolean {
  return typeof value === "boolean";
}

function isNumberInRange(value: unknown): value is number {
  return typeof value === "number" && Number.isFinite(value);
}

export async function PUT(request: NextRequest) {
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

    const record = body as Record<string, unknown>;
    const patch: Partial<CareersSettings> = {};

    if ("pageSizeJobs" in record && isNumberInRange(record.pageSizeJobs)) {
      patch.pageSizeJobs = record.pageSizeJobs;
    }
    if ("pageSizeApplications" in record && isNumberInRange(record.pageSizeApplications)) {
      patch.pageSizeApplications = record.pageSizeApplications;
    }
    if ("pageSizeCandidates" in record && isNumberInRange(record.pageSizeCandidates)) {
      patch.pageSizeCandidates = record.pageSizeCandidates;
    }
    if ("pageSizeInterviews" in record && isNumberInRange(record.pageSizeInterviews)) {
      patch.pageSizeInterviews = record.pageSizeInterviews;
    }
    if ("pageSizeTeams" in record && isNumberInRange(record.pageSizeTeams)) {
      patch.pageSizeTeams = record.pageSizeTeams;
    }
    if ("enablePublicCareers" in record && isBoolean(record.enablePublicCareers)) {
      patch.enablePublicCareers = record.enablePublicCareers;
    }
    if ("defaultJobStatus" in record && typeof record.defaultJobStatus === "string") {
      patch.defaultJobStatus = record.defaultJobStatus;
    }
    if ("showApplicationCount" in record && isBoolean(record.showApplicationCount)) {
      patch.showApplicationCount = record.showApplicationCount;
    }
    if ("showInterviewCount" in record && isBoolean(record.showInterviewCount)) {
      patch.showInterviewCount = record.showInterviewCount;
    }

    const settings = updateCareersSettings(patch);
    return NextResponse.json({ settings });
  } catch {
    return NextResponse.json(
      { error: "Unable to save settings." },
      { status: 500 }
    );
  }
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

    const record = body as Record<string, unknown>;
    const action = typeof record.action === "string" ? record.action : "";

    if (action === "reset") {
      const settings = resetCareersSettings();
      return NextResponse.json({ settings });
    }

    return NextResponse.json({ error: "Invalid action." }, { status: 400 });
  } catch {
    return NextResponse.json(
      { error: "Unable to update settings." },
      { status: 500 }
    );
  }
}
