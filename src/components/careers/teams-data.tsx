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
  return prisma.team.findMany({ orderBy: { name: "asc" } });
}

async function getOpenJobs() {
  return prisma.job.findMany({ where: { status: "Open" } });
}

export async function getTeamBySlug(slug: string): Promise<Team | undefined> {
  const team = await prisma.team.findUnique({ where: { slug } });
  return team ?? undefined;
}

export async function getJobCountForTeam(team: Team): Promise<number> {
  return prisma.job.count({
    where: {
      status: "Open",
      department: { in: team.departments },
    },
  });
}

export async function getTeamsWithJobCounts(): Promise<Array<Team & { jobCount: number }>> {
  const teams = await getAllTeams();
  const jobs = await getOpenJobs();
  return teams.map((team) => ({
    ...team,
    jobCount: jobs.filter(
      (job) =>
        team.departments.includes(job.department) && job.status === "Open"
    ).length,
  }));
}

export async function searchTeams(
  query: string
): Promise<Array<Team & { jobCount: number }>> {
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
}
