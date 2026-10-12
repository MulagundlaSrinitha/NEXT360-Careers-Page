import { NextRequest, NextResponse } from "next/server";
import { getAdminCandidateDetail } from "@/components/admin/admin-data";

const VALID_STATUSES = [
  "applied",
  "under_review",
  "interview",
  "selected",
  "rejected",
  "withdrawn",
];

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const { searchParams } = new URL(request.url);
    const status = searchParams.get("status") || "";

    if (status && !VALID_STATUSES.includes(status)) {
      return NextResponse.json(
        { error: "Invalid application status." },
        { status: 400 }
      );
    }

    const result = getAdminCandidateDetail(id, status);
    if (!result) {
      return NextResponse.json(
        { error: "Candidate not found." },
        { status: 404 }
      );
    }

    return NextResponse.json(result);
  } catch {
    return NextResponse.json(
      { error: "Unable to load candidate." },
      { status: 500 }
    );
  }
}