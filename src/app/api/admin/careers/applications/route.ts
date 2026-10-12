import { NextRequest, NextResponse } from "next/server";
import {
  getAdminApplicationsList,
  type ApplicationsSortOption,
} from "@/components/admin/admin-data";

const VALID_STATUSES = [
  "applied",
  "under_review",
  "interview",
  "selected",
  "rejected",
  "withdrawn",
];

const VALID_SORTS: ApplicationsSortOption[] = [
  "newest",
  "oldest",
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
    const sortParam = searchParams.get("sort") || "newest";
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

    if (!VALID_SORTS.includes(sortParam as ApplicationsSortOption)) {
      return NextResponse.json(
        { error: "Invalid sort value." },
        { status: 400 }
      );
    }

    const data = getAdminApplicationsList({
      search,
      status,
      jobId,
      sort: sortParam as ApplicationsSortOption,
      page,
      limit,
    });

    return NextResponse.json(data);
  } catch {
    return NextResponse.json(
      { error: "Unable to load applications." },
      { status: 500 }
    );
  }
}