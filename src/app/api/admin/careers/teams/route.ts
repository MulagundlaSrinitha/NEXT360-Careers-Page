import { NextRequest, NextResponse } from "next/server";
import {
  getAdminTeamsList,
  type TeamSortOption,
} from "@/components/admin/admin-data";

const VALID_SORTS: TeamSortOption[] = [
  "name-az",
  "name-za",
  "jobs-desc",
  "jobs-asc",
];

const VALID_JOBS_FILTERS = ["with", "without"];

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);

    const search = searchParams.get("search") || "";
    const jobs = searchParams.get("jobs") || "";
    const sortParam = searchParams.get("sort") || "name-az";
    const page = Math.max(1, parseInt(searchParams.get("page") || "1", 10) || 1);
    const limit = Math.min(
      100,
      Math.max(1, parseInt(searchParams.get("limit") || "20", 10) || 20)
    );

    if (jobs && !VALID_JOBS_FILTERS.includes(jobs)) {
      return NextResponse.json(
        { error: "Invalid jobs filter value." },
        { status: 400 }
      );
    }

    if (!VALID_SORTS.includes(sortParam as TeamSortOption)) {
      return NextResponse.json({ error: "Invalid sort value." }, { status: 400 });
    }

    const data = getAdminTeamsList({
      search,
      jobs,
      sort: sortParam as TeamSortOption,
      page,
      limit,
    });

    return NextResponse.json(data);
  } catch {
    return NextResponse.json(
      { error: "Unable to load teams." },
      { status: 500 }
    );
  }
}
