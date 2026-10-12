import { NextRequest, NextResponse } from "next/server";
import { getAdminJobsList, createAdminJob, type JobSortOption, type CreateJobInput } from "@/components/admin/admin-data";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);

    const search = searchParams.get("search") || "";
    const status = searchParams.get("status") || "";
    const department = searchParams.get("department") || "";
    const location = searchParams.get("location") || "";
    const employmentType = searchParams.get("employmentType") || "";
    const workMode = searchParams.get("workMode") || "";
    const sort = (searchParams.get("sort") || "newest") as JobSortOption;
    const page = Math.max(1, parseInt(searchParams.get("page") || "1", 10) || 1);
    const limit = Math.min(100, Math.max(1, parseInt(searchParams.get("limit") || "20", 10) || 20));

    const data = getAdminJobsList({
      search,
      status,
      department,
      location,
      employmentType,
      workMode,
      sort,
      page,
      limit,
    });

    return NextResponse.json(data);
  } catch {
    return NextResponse.json(
      { error: "Unable to load jobs." },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    const requiredFields = ["title", "department", "location", "experience", "employmentType", "workMode", "description"];
    for (const field of requiredFields) {
      if (!body[field] || (typeof body[field] === "string" && !body[field].trim())) {
        return NextResponse.json(
          { error: `Field "${field}" is required.` },
          { status: 400 }
        );
      }
    }

    const input: CreateJobInput = {
      title: body.title.trim(),
      department: body.department,
      location: body.location,
      experience: body.experience,
      employmentType: body.employmentType,
      workMode: body.workMode,
      team: body.team || "",
      skills: Array.isArray(body.skills) ? body.skills : [],
      description: body.description.trim(),
      responsibilities: Array.isArray(body.responsibilities)
        ? body.responsibilities.filter((r: string) => r.trim())
        : [],
      qualifications: Array.isArray(body.qualifications)
        ? body.qualifications.filter((q: string) => q.trim())
        : [],
      preferredQualifications: Array.isArray(body.preferredQualifications)
        ? body.preferredQualifications.filter((q: string) => q.trim())
        : [],
      benefits: Array.isArray(body.benefits)
        ? body.benefits.filter((b: string) => b.trim())
        : [],
      status: body.status || "Draft",
    };

    const job = createAdminJob(input);
    return NextResponse.json(job, { status: 201 });
  } catch {
    return NextResponse.json(
      { error: "Unable to create job." },
      { status: 500 }
    );
  }
}
