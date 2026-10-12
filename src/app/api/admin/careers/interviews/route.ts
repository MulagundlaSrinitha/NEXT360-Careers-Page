import { NextRequest, NextResponse } from "next/server";
import {
  getAdminInterviewsList,
  scheduleInterview,
  isValidInterviewDate,
  isValidInterviewTime,
  VALID_INTERVIEW_STATUSES,
  type InterviewSortOption,
  type InterviewStatus,
} from "@/components/admin/admin-data";

const VALID_SORTS: InterviewSortOption[] = [
  "date-desc",
  "date-asc",
  "name-az",
  "name-za",
  "job-az",
  "job-za",
];

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);

    const search = searchParams.get("search") || "";
    const status = searchParams.get("status") || "";
    const jobId = searchParams.get("jobId") || "";
    const from = searchParams.get("from") || "";
    const to = searchParams.get("to") || "";
    const sortParam = searchParams.get("sort") || "date-desc";
    const page = Math.max(1, parseInt(searchParams.get("page") || "1", 10) || 1);
    const limit = Math.min(
      100,
      Math.max(1, parseInt(searchParams.get("limit") || "20", 10) || 20)
    );

    if (status && !VALID_INTERVIEW_STATUSES.includes(status as InterviewStatus)) {
      return NextResponse.json(
        { error: "Invalid interview status." },
        { status: 400 }
      );
    }

    if (!VALID_SORTS.includes(sortParam as InterviewSortOption)) {
      return NextResponse.json({ error: "Invalid sort value." }, { status: 400 });
    }

    if (from && !isValidInterviewDate(from)) {
      return NextResponse.json(
        { error: "Invalid start date (YYYY-MM-DD)." },
        { status: 400 }
      );
    }

    if (to && !isValidInterviewDate(to)) {
      return NextResponse.json(
        { error: "Invalid end date (YYYY-MM-DD)." },
        { status: 400 }
      );
    }

    if (from && to && from > to) {
      return NextResponse.json(
        { error: "Start date must be on or before end date." },
        { status: 400 }
      );
    }

    const data = getAdminInterviewsList({
      search,
      status,
      jobId,
      from,
      to,
      sort: sortParam as InterviewSortOption,
      page,
      limit,
    });

    return NextResponse.json(data);
  } catch {
    return NextResponse.json(
      { error: "Unable to load interviews." },
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
    const applicationId =
      typeof record.applicationId === "string" ? record.applicationId.trim() : "";
    const date = typeof record.date === "string" ? record.date.trim() : "";
    const time = typeof record.time === "string" ? record.time.trim() : "";
    const location =
      typeof record.location === "string" ? record.location : undefined;
    const notes = typeof record.notes === "string" ? record.notes : undefined;

    if (!applicationId) {
      return NextResponse.json(
        { error: "An application must be selected." },
        { status: 400 }
      );
    }

    if (!date || !isValidInterviewDate(date)) {
      return NextResponse.json(
        { error: "Interview date must be a valid date (YYYY-MM-DD)." },
        { status: 400 }
      );
    }

    if (!time || !isValidInterviewTime(time)) {
      return NextResponse.json(
        { error: "Interview time must be a valid time (HH:MM)." },
        { status: 400 }
      );
    }

    const result = scheduleInterview({ applicationId, date, time, location, notes });

    if (result.error || !result.interview) {
      return NextResponse.json(
        { error: result.error || "Unable to schedule interview." },
        { status: result.status }
      );
    }

    return NextResponse.json({ interview: result.interview }, { status: 201 });
  } catch {
    return NextResponse.json(
      { error: "Unable to schedule interview." },
      { status: 500 }
    );
  }
}
