import { NextResponse } from "next/server";
import { getPublicOpenJobs } from "@/components/admin/admin-data";

export async function GET() {
  try {
    const jobs = await getPublicOpenJobs();
    return NextResponse.json({ jobs });
  } catch (error) {
    console.error("[api/careers/jobs] Failed to load jobs:", error);
    return NextResponse.json(
      { error: "Unable to load jobs." },
      { status: 500 }
    );
  }
}
