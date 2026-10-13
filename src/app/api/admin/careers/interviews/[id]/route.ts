import { NextRequest, NextResponse } from "next/server";
import {
  getAdminInterviewById,
  rescheduleInterview,
  cancelInterview,
  isValidInterviewDate,
  isValidInterviewTime,
} from "@/components/admin/admin-data";

interface RouteContext {
  params: Promise<{ id: string }>;
}

export async function GET(_request: NextRequest, context: RouteContext) {
  try {
    const { id } = await context.params;
    const interview = await getAdminInterviewById(id);

    if (!interview) {
      return NextResponse.json(
        { error: "Interview not found." },
        { status: 404 }
      );
    }

    return NextResponse.json({ interview });
  } catch {
    return NextResponse.json(
      { error: "Unable to load interview." },
      { status: 500 }
    );
  }
}

export async function PATCH(request: NextRequest, context: RouteContext) {
  try {
    const { id } = await context.params;

    const existing = await getAdminInterviewById(id);
    if (!existing) {
      return NextResponse.json(
        { error: "Interview not found." },
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

    const record = body as Record<string, unknown>;
    const action = typeof record.action === "string" ? record.action : "";

    if (action === "cancel") {
      const result = await cancelInterview(id);
      if (result.error || !result.interview) {
        return NextResponse.json(
          { error: result.error || "Unable to cancel interview." },
          { status: result.status }
        );
      }
      return NextResponse.json({ interview: result.interview });
    }

    const date = typeof record.date === "string" ? record.date.trim() : "";
    const time = typeof record.time === "string" ? record.time.trim() : "";
    const location =
      typeof record.location === "string" ? record.location : undefined;
    const notes = typeof record.notes === "string" ? record.notes : undefined;

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

    const result = await rescheduleInterview(id, { date, time, location, notes });
    if (result.error || !result.interview) {
      return NextResponse.json(
        { error: result.error || "Unable to reschedule interview." },
        { status: result.status }
      );
    }

    return NextResponse.json({ interview: result.interview });
  } catch {
    return NextResponse.json(
      { error: "Unable to update interview." },
      { status: 500 }
    );
  }
}
