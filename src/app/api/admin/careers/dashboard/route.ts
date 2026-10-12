import { NextResponse } from "next/server";
import { getDashboardData } from "@/components/admin/admin-data";

export async function GET() {
  try {
    const data = getDashboardData();
    return NextResponse.json(data);
  } catch {
    return NextResponse.json(
      { error: "Unable to load careers data." },
      { status: 500 }
    );
  }
}
