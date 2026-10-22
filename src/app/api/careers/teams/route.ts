import { NextResponse } from "next/server";
import { getTeamsWithJobCounts } from "@/components/careers/teams-data";

export async function GET() {
  try {
    const teams = await getTeamsWithJobCounts();
    return NextResponse.json({ teams });
  } catch (error) {
    console.error("[api/careers/teams] Failed to load teams:", error);
    return NextResponse.json(
      { error: "Unable to load teams." },
      { status: 500 }
    );
  }
}
