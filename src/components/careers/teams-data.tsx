import { prisma } from "@/lib/prisma";

export interface Team {
  id: string;
  slug: string;
  name: string;
  description: string;
  longDescription: string;
  icon: string;
  departments: string[];
  roles: string[];
  skills: string[];
}

async function getAllTeams(): Promise<Team[]> {
  try {
    return await prisma.team.findMany({ orderBy: { name: "asc" } });
  } catch (error) {
    console.error("[teams-data] Failed to load teams:", error);
    return [];
  }
}

async function getOpenJobs() {
  try {
    return await prisma.job.findMany({ where: { status: "Open" } });
  } catch (error) {
    console.error("[teams-data] Failed to load jobs:", error);
    return [];
  }
}

export async function getTeamBySlug(slug: string): Promise<Team | undefined> {
  try {
    const team = await prisma.team.findUnique({ where: { slug } });
    return team ?? undefined;
  } catch (error) {
    console.error(`[teams-data] Failed to load team ${slug}:`, error);
    return undefined;
  }
}

export async function getJobCountForTeam(team: Team): Promise<number> {
  try {
    return await prisma.job.count({
      where: {
        status: "Open",
        department: { in: team.departments },
      },
    });
  } catch (error) {
    console.error(`[teams-data] Failed to count jobs for team ${team.slug}:`, error);
    return 0;
  }
}

export async function getTeamsWithJobCounts(): Promise<Array<Team & { jobCount: number }>> {
  try {
    const teams = await getAllTeams();
    const jobs = await getOpenJobs();
    return teams.map((team) => ({
      ...team,
      jobCount: jobs.filter(
        (job) =>
          team.departments.includes(job.department) && job.status === "Open"
      ).length,
    }));
  } catch (error) {
    console.error("[teams-data] Failed to compute team job counts:", error);
    return [];
  }
}

export async function searchTeams(
  query: string
): Promise<Array<Team & { jobCount: number }>> {
  try {
    const q = query.toLowerCase().trim();
    const withCounts = await getTeamsWithJobCounts();
    if (!q) return withCounts;

    return withCounts.filter(
      (team) =>
        team.name.toLowerCase().includes(q) ||
        team.description.toLowerCase().includes(q) ||
        team.roles.some((role) => role.toLowerCase().includes(q)) ||
        team.skills.some((skill) => skill.toLowerCase().includes(q)) ||
        team.departments.some((dept) => dept.toLowerCase().includes(q))
    );
  } catch (error) {
    console.error("[teams-data] Failed to search teams:", error);
    return [];
  }
}
