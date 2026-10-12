import { NextRequest, NextResponse } from "next/server";
import { getJobById } from "@/components/careers/mock-jobs";
import {
  getAdminApplicationById,
  getApplicationTransitions,
  updateAdminApplicationStatus,
  APPLICATION_STATUS_LABELS,
  VALID_APPLICATION_STATUSES,
  type ApplicationStatus,
} from "@/components/admin/admin-data";

interface RouteContext {
  params: Promise<{ id: string }>;
}

export async function GET(_request: NextRequest, context: RouteContext) {
  try {
    const { id } = await context.params;
    const application = getAdminApplicationById(id);

    if (!application) {
      return NextResponse.json(
        { error: "Application not found." },
        { status: 404 }
      );
    }

    const job = getJobById(application.jobId) ?? null;

    return NextResponse.json({ application, job });
  } catch {
    return NextResponse.json(
      { error: "Unable to load application." },
      { status: 500 }
    );
  }
}

export async function PATCH(request: NextRequest, context: RouteContext) {
  try {
    const { id } = await context.params;
    const application = getAdminApplicationById(id);

    if (!application) {
      return NextResponse.json(
        { error: "Application not found." },
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

    const rawStatus = (body as Record<string, unknown>).status;
    if (
      typeof rawStatus !== "string" ||
      !VALID_APPLICATION_STATUSES.includes(rawStatus as ApplicationStatus)
    ) {
      return NextResponse.json(
        {
          error:
            "Status must be one of applied, under_review, interview, selected, rejected, or withdrawn.",
        },
        { status: 400 }
      );
    }

    const status = rawStatus as ApplicationStatus;

    if (status === application.status) {
      return NextResponse.json(
        {
          error: `Application status is already ${APPLICATION_STATUS_LABELS[application.status]}.`,
        },
        { status: 400 }
      );
    }

    if (!getApplicationTransitions(application.status).includes(status)) {
      return NextResponse.json(
        {
          error: `Cannot change application status from ${APPLICATION_STATUS_LABELS[application.status]} to ${APPLICATION_STATUS_LABELS[status]}.`,
        },
        { status: 400 }
      );
    }

    const updated = updateAdminApplicationStatus(id, status);

    if (!updated) {
      return NextResponse.json(
        { error: "Application not found." },
        { status: 404 }
      );
    }

    return NextResponse.json({ application: updated });
  } catch {
    return NextResponse.json(
      { error: "Unable to update application status." },
      { status: 500 }
    );
  }
}