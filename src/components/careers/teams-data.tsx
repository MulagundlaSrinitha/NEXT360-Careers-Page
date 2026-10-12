import type { ReactNode } from "react";
import { mockJobs } from "./mock-jobs";

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

export const teams: Team[] = [
  {
    id: "technology",
    slug: "technology",
    name: "Technology",
    description:
      "Build software, platforms, and digital experiences that power Next360.",
    longDescription:
      "Our Technology team builds the products, platforms, and digital experiences that power Next360. We work across engineering, infrastructure, and data to create reliable systems that serve customers and internal teams.",
    icon: "code",
    departments: ["Technology"],
    roles: [
      "Software Engineer",
      "Frontend Developer",
      "Backend Engineer",
      "Cloud Engineer",
      "Data Analyst",
    ],
    skills: [
      "React",
      "TypeScript",
      "Node.js",
      "Python",
      "AWS",
      "SQL",
      "Cloud",
    ],
  },
  {
    id: "product",
    slug: "product",
    name: "Product",
    description:
      "Turn customer needs into useful products and meaningful experiences.",
    longDescription:
      "The Product team shapes the direction of Next360 products. We combine user empathy with data analysis to build experiences that customers love, working closely with design, engineering, and business teams.",
    icon: "lightbulb",
    departments: ["Product"],
    roles: ["Product Manager", "UX Designer"],
    skills: ["Product Strategy", "Research", "Figma", "Design", "Analytics"],
  },
  {
    id: "operations",
    slug: "operations",
    name: "Operations",
    description:
      "Help our products and teams run efficiently from source to customer.",
    longDescription:
      "The Operations team ensures our products reach customers reliably and our teams run efficiently. We manage supply chains, quality processes, and procurement to keep everything moving smoothly.",
    icon: "settings",
    departments: ["Operations"],
    roles: [
      "Operations Manager",
      "Supply Chain Analyst",
      "Quality Assurance Engineer",
      "Procurement Specialist",
    ],
    skills: [
      "Operations",
      "Supply Chain",
      "Quality",
      "QA",
      "Testing",
      "Procurement",
    ],
  },
  {
    id: "marketing",
    slug: "marketing",
    name: "Marketing",
    description:
      "Build awareness, engagement, and customer relationships.",
    longDescription:
      "The Marketing team tells the Next360 story and connects our products with the right audiences. We work across content, digital marketing, and brand to drive growth and engagement.",
    icon: "megaphone",
    departments: ["Marketing"],
    roles: ["Marketing Specialist", "Content Writer"],
    skills: ["Marketing", "Content", "SEO", "Analytics", "Writing"],
  },
  {
    id: "sales",
    slug: "sales",
    name: "Sales",
    description:
      "Drive revenue growth by connecting customers with Next360 products.",
    longDescription:
      "The Sales team builds relationships with customers and partners, identifying opportunities to grow our customer base and deliver value through Next360 products.",
    icon: "trending-up",
    departments: ["Sales"],
    roles: ["Sales Executive", "Business Development Associate"],
    skills: [
      "Sales",
      "Business Development",
      "Communication",
      "CRM",
      "Negotiation",
    ],
  },
  {
    id: "finance",
    slug: "finance",
    name: "Finance",
    description:
      "Support responsible financial planning and operations.",
    longDescription:
      "The Finance team provides the financial insight and discipline that support Next360 growth. We manage planning, budgeting, reporting, and compliance to help the company make informed decisions.",
    icon: "calculator",
    departments: ["Finance"],
    roles: ["Finance Analyst"],
    skills: ["Finance", "Excel", "Analytics", "Reporting"],
  },
  {
    id: "human-resources",
    slug: "human-resources",
    name: "Human Resources",
    description:
      "Help people and teams grow at Next360.",
    longDescription:
      "The Human Resources team builds and supports the culture at Next360. We manage recruitment, employee engagement, learning programs, and people operations to help every team member thrive.",
    icon: "users",
    departments: ["Human Resources"],
    roles: ["HR Generalist"],
    skills: ["HR", "Recruitment", "Employee Relations", "People Operations"],
  },
];

export function getTeamBySlug(slug: string): Team | undefined {
  return teams.find((t) => t.slug === slug);
}

export function getJobCountForTeam(team: Team): number {
  return mockJobs.filter(
    (job) =>
      team.departments.includes(job.department) && job.status === "Open"
  ).length;
}

export function getTeamsWithJobCounts(): Array<Team & { jobCount: number }> {
  return teams.map((team) => ({
    ...team,
    jobCount: getJobCountForTeam(team),
  }));
}

export function searchTeams(
  query: string
): Array<Team & { jobCount: number }> {
  const q = query.toLowerCase().trim();
  if (!q) return getTeamsWithJobCounts();

  return getTeamsWithJobCounts().filter(
    (team) =>
      team.name.toLowerCase().includes(q) ||
      team.description.toLowerCase().includes(q) ||
      team.roles.some((role) => role.toLowerCase().includes(q)) ||
      team.skills.some((skill) => skill.toLowerCase().includes(q)) ||
      team.departments.some((dept) => dept.toLowerCase().includes(q))
  );
}

export const careerAreas = [
  { label: "Engineering", department: "Technology" },
  { label: "Design", department: "Product" },
  { label: "Data", department: "Technology" },
  { label: "Product", department: "Product" },
  { label: "Operations", department: "Operations" },
  { label: "Sales", department: "Sales" },
  { label: "Marketing", department: "Marketing" },
  { label: "Finance", department: "Finance" },
  { label: "HR", department: "Human Resources" },
] as const;

export function getIcon(iconName: string): ReactNode {
  const icons: Record<string, ReactNode> = {
    code: (
      <svg
        className="w-6 h-6"
        fill="none"
        viewBox="0 0 24 24"
        strokeWidth="1.5"
        stroke="currentColor"
        aria-hidden="true"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M17.25 6.75L22.5 12l-5.25 5.25m-10.5 0L1.5 12l5.25-5.25m7.5-3l-4.5 16.5"
        />
      </svg>
    ),
    lightbulb: (
      <svg
        className="w-6 h-6"
        fill="none"
        viewBox="0 0 24 24"
        strokeWidth="1.5"
        stroke="currentColor"
        aria-hidden="true"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M12 18v-5.25m0 0a6.01 6.01 0 001.5-.189m-1.5.189a6.01 6.01 0 01-1.5-.189m3.75 7.478a12.06 12.06 0 01-4.5 0m3.75 2.383a14.406 14.406 0 01-3 0M14.25 18v-.192c0-.983.658-1.823 1.508-2.316a7.5 7.5 0 10-7.517 0c.85.493 1.509 1.333 1.509 2.316V18"
        />
      </svg>
    ),
    settings: (
      <svg
        className="w-6 h-6"
        fill="none"
        viewBox="0 0 24 24"
        strokeWidth="1.5"
        stroke="currentColor"
        aria-hidden="true"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M9.594 3.94c.09-.542.56-.94 1.11-.94h2.593c.55 0 1.02.398 1.11.94l.213 1.281c.063.374.313.686.645.87.074.04.147.083.22.127.324.196.72.257 1.075.124l1.217-.456a1.125 1.125 0 011.37.49l1.296 2.247a1.125 1.125 0 01-.26 1.431l-1.003.827c-.293.24-.438.613-.431.992a6.759 6.759 0 010 .255c-.007.378.138.75.43.99l1.005.828c.424.35.534.954.26 1.43l-1.298 2.247a1.125 1.125 0 01-1.369.491l-1.217-.456c-.355-.133-.75-.072-1.076.124a6.57 6.57 0 01-.22.128c-.331.183-.581.495-.644.869l-.213 1.28c-.09.543-.56.941-1.11.941h-2.594c-.55 0-1.02-.398-1.11-.94l-.213-1.281c-.062-.374-.312-.686-.644-.87a6.52 6.52 0 01-.22-.127c-.325-.196-.72-.257-1.076-.124l-1.217.456a1.125 1.125 0 01-1.369-.49l-1.297-2.247a1.125 1.125 0 01.26-1.431l1.004-.827c.292-.24.437-.613.43-.992a6.932 6.932 0 010-.255c.007-.378-.138-.75-.43-.99l-1.004-.828a1.125 1.125 0 01-.26-1.43l1.297-2.247a1.125 1.125 0 011.37-.491l1.216.456c.356.133.751.072 1.076-.124.072-.044.146-.087.22-.128.332-.183.582-.495.644-.869l.214-1.281z"
        />
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
        />
      </svg>
    ),
    "trending-up": (
      <svg
        className="w-6 h-6"
        fill="none"
        viewBox="0 0 24 24"
        strokeWidth="1.5"
        stroke="currentColor"
        aria-hidden="true"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M2.25 18L9 11.25l4.306 4.307a11.95 11.95 0 015.814-5.519l2.74-1.22m0 0l-5.94-2.28m5.94 2.28l-2.28 5.941"
        />
      </svg>
    ),
    megaphone: (
      <svg
        className="w-6 h-6"
        fill="none"
        viewBox="0 0 24 24"
        strokeWidth="1.5"
        stroke="currentColor"
        aria-hidden="true"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M10.34 15.84c-.688-.06-1.386-.09-2.09-.09H7.5a4.5 4.5 0 110-9h.75c.704 0 1.402-.03 2.09-.09m0 9.18c.253.962.584 1.892.985 2.783.247.55.06 1.21-.463 1.511l-.657.38c-.551.318-1.26.117-1.527-.461a20.845 20.845 0 01-1.44-4.282m3.102.069a18.03 18.03 0 01-.59-4.59c0-1.586.205-3.124.59-4.59m0 9.18a23.848 23.848 0 018.835 2.535M10.34 6.66a23.847 23.847 0 008.835-2.535m0 0A23.74 23.74 0 0018.795 3m.38 1.125a23.91 23.91 0 011.014 5.395m-1.014 8.855c-.111.413-.239.821-.38 1.226a24.002 24.002 0 01-3.968 0c-.141-.405-.27-.813-.38-1.226m0 0A23.909 23.909 0 0013.07 3.07"
        />
      </svg>
    ),
    calculator: (
      <svg
        className="w-6 h-6"
        fill="none"
        viewBox="0 0 24 24"
        strokeWidth="1.5"
        stroke="currentColor"
        aria-hidden="true"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M15.75 15.75V18m-7.5-6.75h.008v.008H8.25v-.008zm0 2.25h.008v.008H8.25v-.008zm0 2.25h.008v.008H8.25v-.008zm0 2.25h.008v.008H8.25v-.008zm2.498-6.75h.007v.008h-.007v-.008zm0 2.25h.007v.008h-.007v-.008zm0 2.25h.007v.008h-.007v-.008zm0 2.25h.007v.008h-.007v-.008zm2.504-6.75h.008v.008h-.008v-.008zm0 2.25h.008v.008h-.008v-.008zm0 2.25h.008v.008h-.008v-.008zm0 2.25h.008v.008h-.008v-.008zm2.498-6.75h.008v.008h-.008v-.008zm0 2.25h.008v.008h-.008v-.008zM8.25 6h7.5v2.25h-7.5V6zM12 2.25c-1.892 0-3.758.11-5.593.322C5.307 2.7 4.5 3.65 4.5 4.757V19.5a2.25 2.25 0 002.25 2.25h10.5a2.25 2.25 0 002.25-2.25V4.757c0-1.108-.806-2.057-1.907-2.185A48.507 48.507 0 0012 2.25z"
        />
      </svg>
    ),
    users: (
      <svg
        className="w-6 h-6"
        fill="none"
        viewBox="0 0 24 24"
        strokeWidth="1.5"
        stroke="currentColor"
        aria-hidden="true"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M15 19.128a9.38 9.38 0 002.625.372 9.337 9.337 0 004.121-.952 4.125 4.125 0 00-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.106A12.318 12.318 0 018.624 21c-2.331 0-4.512-.645-6.374-1.766l-.001-.109a6.375 6.375 0 0111.964-3.07M12 6.375a3.375 3.375 0 11-6.75 0 3.375 3.375 0 016.75 0zm8.25 2.25a2.625 2.625 0 11-5.25 0 2.625 2.625 0 015.25 0z"
        />
      </svg>
    ),
  };

  return icons[iconName] || icons.code;
}
