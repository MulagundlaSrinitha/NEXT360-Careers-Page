import { NextRequest, NextResponse } from "next/server";
import { getAdminCandidatesList } from "@/components/admin/admin-data";
import type { CandidateSortOption } from "@/components/admin/admin-data";

const VALID_STATUSES = [
  "applied",
  "under_review",
  "interview",
  "selected",
  "rejected",
  "withdrawn",
];

const VALID_SORTS: CandidateSortOption[] = [
  "name-az",
  "name-za",
  "count-desc",
  "count-asc",
  "latest-desc",
  "latest-asc",
];

const VALID_APPLICATION_COUNTS = ["one", "multiple"];

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);

    const search = searchParams.get("search") || "";
    const status = searchParams.get("status") || "";
    const jobId = searchParams.get("jobId") || "";
    const applicationCount = searchParams.get("applicationCount") || "";
    const sortParam = searchParams.get("sort") || "latest-desc";
    const page = Math.max(1, parseInt(searchParams.get("page") || "1", 10) || 1);
    const limit = Math.min(
      100,
      Math.max(1, parseInt(searchParams.get("limit") || "20", 10) || 20)
    );

    if (status && !VALID_STATUSES.includes(status)) {
      return NextResponse.json(
        { error: "Invalid application status." },
        { status: 400 }
      );
    }

    if (applicationCount && !VALID_APPLICATION_COUNTS.includes(applicationCount)) {
      return NextResponse.json(
        { error: "Invalid application count filter." },
        { status: 400 }
      );
    }

    if (!VALID_SORTS.includes(sortParam as CandidateSortOption)) {
      return NextResponse.json(
        { error: "Invalid sort value." },
        { status: 400 }
      );
    }

    const data = getAdminCandidatesList({
      search,
      status,
      jobId,
      applicationCount,
      sort: sortParam as CandidateSortOption,
      page,
      limit,
    });

    return NextResponse.json(data);
  } catch {
    return NextResponse.json(
      { error: "Unable to load candidates." },
      { status: 500 }
    );
  }
}