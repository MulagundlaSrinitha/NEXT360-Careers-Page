import type { Job } from "./types";

const INITIAL_JOBS: Job[] = [
  {
    id: "1",
    title: "Software Engineer",
    department: "Technology",
    location: "Hyderabad",
    experience: "2-5 years",
    employmentType: "Full Time",
    workMode: "Hybrid",
    team: "Engineering",
    skills: ["React", "TypeScript", "Node.js"],
    description:
      "We are looking for a Software Engineer to build and maintain scalable web applications for our product platform. You will work closely with product and design teams to deliver reliable features that serve thousands of users.",
    responsibilities: [
      "Design, develop, and maintain scalable web applications using modern frameworks.",
      "Collaborate with product managers, designers, and backend engineers to deliver features end-to-end.",
      "Write clean, testable, and well-documented code.",
      "Participate in code reviews and provide constructive feedback to peers.",
      "Investigate and resolve technical issues across the stack.",
      "Contribute to architectural decisions and improve development processes.",
    ],
    qualifications: [
      "2-5 years of professional software development experience.",
      "Strong proficiency in React, TypeScript, and Node.js.",
      "Experience with RESTful APIs and modern web architectures.",
      "Familiarity with version control systems (Git) and CI/CD pipelines.",
      "Good problem-solving skills and attention to detail.",
      "Effective communication and collaboration abilities.",
    ],
    preferredQualifications: [
      "Experience with cloud services such as AWS or GCP.",
      "Familiarity with containerization tools like Docker.",
      "Experience with automated testing frameworks.",
    ],
    teamDescription:
      "Our Engineering team builds the systems and digital experiences that power Next360. We work in small, focused squads and value craftsmanship, ownership, and continuous improvement.",
    benefits: [
      "Learning and development programs",
      "Flexible work arrangements",
      "Health and wellness benefits",
      "Paid time off",
      "Team events and celebrations",
    ],
    postedAt: "2026-09-10",
    status: "Open",
  },
  {
    id: "2",
    title: "Frontend Developer",
    department: "Technology",
    location: "Bengaluru",
    experience: "2-5 years",
    employmentType: "Full Time",
    workMode: "On-site",
    team: "Engineering",
    skills: ["React", "Next.js", "CSS", "TypeScript"],
    description:
      "Join our frontend team to develop responsive and performant user interfaces. You will build pixel-perfect components and ensure a seamless user experience across our digital products.",
    responsibilities: [
      "Build and maintain responsive user interfaces using React and Next.js.",
      "Translate design mockups into high-quality, accessible components.",
      "Optimize applications for performance, SEO, and cross-browser compatibility.",
      "Collaborate with backend engineers to integrate APIs and data layers.",
      "Write unit and integration tests for frontend code.",
      "Stay current with emerging frontend technologies and best practices.",
    ],
    qualifications: [
      "2-5 years of experience in frontend development.",
      "Proficiency in React, Next.js, TypeScript, and modern CSS.",
      "Strong understanding of HTML, accessibility, and responsive design.",
      "Experience with state management and API integration.",
      "Eye for detail and commitment to delivering polished user experiences.",
    ],
    teamDescription:
      "The Frontend team is responsible for building the interfaces that millions of users interact with daily. We focus on performance, accessibility, and delightful design.",
    postedAt: "2026-09-12",
    status: "Open",
  },
  {
    id: "3",
    title: "Backend Engineer",
    department: "Technology",
    location: "Hyderabad",
    experience: "2-5 years",
    employmentType: "Full Time",
    workMode: "Hybrid",
    team: "Engineering",
    skills: ["Node.js", "Python", "SQL", "AWS"],
    description:
      "Design and implement backend services and APIs that power our product platform. You will work on scalable systems that handle high volumes of data and traffic.",
    responsibilities: [
      "Design and develop RESTful APIs and microservices.",
      "Build and maintain database schemas and data pipelines.",
      "Ensure system reliability, scalability, and performance.",
      "Collaborate with frontend engineers to define API contracts.",
      "Implement security best practices and data protection measures.",
      "Monitor production systems and respond to incidents.",
    ],
    qualifications: [
      "2-5 years of backend development experience.",
      "Strong proficiency in Node.js or Python.",
      "Experience with SQL databases and data modeling.",
      "Familiarity with cloud services (AWS preferred).",
      "Understanding of API design principles and microservice architectures.",
    ],
    teamDescription:
      "Our Backend team designs the core services and infrastructure that support Next360 products. We prioritize reliability, scalability, and clean architecture.",
    postedAt: "2026-09-08",
    status: "Open",
  },
  {
    id: "4",
    title: "Data Analyst",
    department: "Technology",
    location: "Mumbai",
    experience: "0-2 years",
    employmentType: "Full Time",
    workMode: "On-site",
    team: "Data",
    skills: ["SQL", "Python", "Data"],
    description:
      "Analyze data to support business decisions and product development. You will work with stakeholders across teams to turn raw data into actionable insights.",
    responsibilities: [
      "Analyze datasets to identify trends, patterns, and insights.",
      "Build and maintain dashboards and reports for stakeholders.",
      "Support product and business teams with data-driven recommendations.",
      "Write SQL queries and Python scripts for data extraction and analysis.",
      "Ensure data quality and accuracy across reporting systems.",
    ],
    qualifications: [
      "0-2 years of experience in data analysis or a related role.",
      "Proficiency in SQL and Python for data analysis.",
      "Strong analytical and problem-solving skills.",
      "Ability to communicate findings clearly to non-technical audiences.",
      "Familiarity with data visualization tools.",
    ],
    teamDescription:
      "The Data team empowers Next360 with insights that drive smarter decisions. We work across the organization to make data accessible and actionable.",
    postedAt: "2026-09-14",
    status: "Open",
  },
  {
    id: "5",
    title: "Product Manager",
    department: "Product",
    location: "Bengaluru",
    experience: "5+ years",
    employmentType: "Full Time",
    workMode: "Hybrid",
    team: "Product",
    skills: ["Product Strategy", "Research", "Analytics"],
    description:
      "Lead product strategy and execution for key product lines at Next360. You will define the roadmap, work with cross-functional teams, and drive product outcomes that matter to customers.",
    responsibilities: [
      "Define product vision, strategy, and roadmap for your area.",
      "Conduct user research and analyze data to inform product decisions.",
      "Write detailed product requirements and user stories.",
      "Work closely with engineering, design, and marketing teams.",
      "Track key metrics and report on product performance.",
      "Prioritize features based on impact, feasibility, and business goals.",
    ],
    qualifications: [
      "5+ years of product management experience.",
      "Strong analytical and data-driven decision-making skills.",
      "Excellent communication and stakeholder management abilities.",
      "Experience working with cross-functional teams.",
      "Understanding of agile development methodologies.",
    ],
    preferredQualifications: [
      "Experience in organic products, FMCG, or related industries.",
      "Technical background or familiarity with software development.",
    ],
    teamDescription:
      "The Product team shapes the direction of Next360 products. We combine user empathy with data analysis to build experiences that customers love.",
    postedAt: "2026-09-11",
    status: "Open",
  },
  {
    id: "6",
    title: "UX Designer",
    department: "Product",
    location: "Hyderabad",
    experience: "2-5 years",
    employmentType: "Full Time",
    workMode: "On-site",
    team: "Design",
    skills: ["Figma", "Design", "Research"],
    description:
      "Design intuitive and delightful user experiences. You will conduct research, create wireframes and prototypes, and collaborate closely with product and engineering teams.",
    responsibilities: [
      "Conduct user research and usability testing to inform design decisions.",
      "Create wireframes, prototypes, and high-fidelity designs in Figma.",
      "Collaborate with product managers and engineers throughout the design process.",
      "Develop and maintain design systems and component libraries.",
      "Advocate for user-centered design principles across the team.",
    ],
    qualifications: [
      "2-5 years of experience in UX or product design.",
      "Proficiency with Figma and modern design tools.",
      "Experience conducting user research and synthesizing findings.",
      "Strong portfolio demonstrating design process and outcomes.",
      "Good communication and collaboration skills.",
    ],
    teamDescription:
      "The Design team crafts the experiences that define how users interact with Next360 products. We believe great design starts with deep user understanding.",
    postedAt: "2026-09-13",
    status: "Open",
  },
  {
    id: "7",
    title: "Operations Manager",
    department: "Operations",
    location: "Mumbai",
    experience: "5+ years",
    employmentType: "Full Time",
    workMode: "On-site",
    team: "Operations",
    skills: ["Operations", "Supply Chain", "Quality"],
    description:
      "Oversee daily operations and optimize supply chain processes. You will ensure efficiency, maintain quality standards, and drive operational improvements.",
    responsibilities: [
      "Manage day-to-day operations and ensure smooth workflow.",
      "Identify opportunities to improve operational efficiency.",
      "Oversee supply chain processes and vendor relationships.",
      "Ensure compliance with quality and safety standards.",
      "Analyze operational data and prepare reports for leadership.",
      "Lead and develop operations team members.",
    ],
    qualifications: [
      "5+ years of experience in operations or supply chain management.",
      "Strong analytical and problem-solving skills.",
      "Experience with process optimization and quality management.",
      "Leadership and team management abilities.",
      "Excellent organizational and communication skills.",
    ],
    teamDescription:
      "The Operations team ensures our products reach customers reliably and our teams run efficiently.",
    postedAt: "2026-09-09",
    status: "Open",
  },
  {
    id: "8",
    title: "Supply Chain Analyst",
    department: "Operations",
    location: "Chennai",
    experience: "0-2 years",
    employmentType: "Full Time",
    workMode: "On-site",
    team: "Supply Chain",
    skills: ["Supply Chain", "Data", "Excel"],
    description:
      "Support supply chain operations with data analysis and reporting. You will help optimize inventory, logistics, and procurement processes.",
    responsibilities: [
      "Analyze supply chain data to identify trends and improvement opportunities.",
      "Prepare reports and dashboards for supply chain performance.",
      "Support inventory planning and demand forecasting.",
      "Collaborate with procurement and logistics teams on data needs.",
      "Ensure data accuracy and consistency across supply chain systems.",
    ],
    qualifications: [
      "0-2 years of experience in supply chain, analytics, or a related field.",
      "Proficiency in Excel and data analysis tools.",
      "Strong analytical and attention-to-detail skills.",
      "Good communication and teamwork abilities.",
    ],
    teamDescription:
      "The Supply Chain team ensures our products move efficiently from source to customer.",
    postedAt: "2026-09-15",
    status: "Open",
  },
  {
    id: "9",
    title: "Marketing Specialist",
    department: "Marketing",
    location: "Bengaluru",
    experience: "2-5 years",
    employmentType: "Full Time",
    workMode: "Hybrid",
    team: "Marketing",
    skills: ["Marketing", "Content", "Analytics"],
    description:
      "Plan and execute marketing campaigns across digital channels. You will drive brand awareness, engagement, and growth through data-driven marketing strategies.",
    responsibilities: [
      "Plan and execute digital marketing campaigns across multiple channels.",
      "Create and manage content for social media, email, and web.",
      "Analyze campaign performance and optimize based on data.",
      "Collaborate with design and product teams on campaign assets.",
      "Manage SEO, SEM, and paid advertising efforts.",
      "Track industry trends and competitor activities.",
    ],
    qualifications: [
      "2-5 years of experience in digital marketing.",
      "Strong analytical skills and experience with marketing analytics tools.",
      "Proficiency in content creation and campaign management.",
      "Familiarity with SEO, SEM, and social media marketing.",
      "Excellent written and verbal communication skills.",
    ],
    teamDescription:
      "The Marketing team tells the Next360 story and connects our products with the right audiences.",
    postedAt: "2026-09-07",
    status: "Open",
  },
  {
    id: "10",
    title: "Sales Executive",
    department: "Sales",
    location: "Delhi",
    experience: "0-2 years",
    employmentType: "Full Time",
    workMode: "On-site",
    team: "Sales",
    skills: ["Sales", "Communication", "CRM"],
    description:
      "Drive sales and build relationships with key accounts. You will identify opportunities, manage the sales pipeline, and deliver on revenue targets.",
    responsibilities: [
      "Identify and pursue new business opportunities.",
      "Build and maintain relationships with key accounts.",
      "Manage the sales pipeline and track progress in CRM.",
      "Conduct product presentations and demonstrations.",
      "Negotiate contracts and close deals.",
      "Achieve or exceed monthly and quarterly sales targets.",
    ],
    qualifications: [
      "0-2 years of experience in sales or business development.",
      "Strong communication and interpersonal skills.",
      "Ability to manage multiple accounts and priorities.",
      "Familiarity with CRM tools and sales processes.",
      "Self-motivated with a results-oriented mindset.",
    ],
    teamDescription:
      "The Sales team drives revenue growth by connecting customers with Next360 products.",
    postedAt: "2026-09-06",
    status: "Open",
  },
  {
    id: "11",
    title: "Finance Analyst",
    department: "Finance",
    location: "Mumbai",
    experience: "2-5 years",
    employmentType: "Full Time",
    workMode: "On-site",
    team: "Finance",
    skills: ["Finance", "Excel", "Analytics"],
    description:
      "Support financial planning, budgeting, and reporting. You will provide accurate financial analysis to help leadership make informed decisions.",
    responsibilities: [
      "Prepare monthly, quarterly, and annual financial reports.",
      "Support budgeting and forecasting processes.",
      "Analyze financial data and identify variances.",
      "Assist with audits and compliance activities.",
      "Develop financial models and forecasts.",
    ],
    qualifications: [
      "2-5 years of experience in finance or accounting.",
      "Strong proficiency in Excel and financial modeling.",
      "Experience with financial reporting and analysis.",
      "Attention to detail and accuracy.",
    ],
    teamDescription:
      "The Finance team provides the financial insight and discipline that support Next360 growth.",
    postedAt: "2026-09-05",
    status: "Open",
  },
  {
    id: "12",
    title: "HR Generalist",
    department: "Human Resources",
    location: "Hyderabad",
    experience: "2-5 years",
    employmentType: "Full Time",
    workMode: "On-site",
    team: "People Operations",
    skills: ["HR", "Recruitment", "Employee Relations"],
    description:
      "Manage end-to-end HR processes and employee engagement. You will support hiring, onboarding, culture, and employee well-being.",
    responsibilities: [
      "Manage recruitment processes from sourcing to onboarding.",
      "Support employee engagement and retention initiatives.",
      "Handle employee relations and resolve workplace concerns.",
      "Maintain HR records and ensure compliance with policies.",
      "Assist with performance management and learning programs.",
    ],
    qualifications: [
      "2-5 years of experience in HR or people operations.",
      "Knowledge of HR best practices and employment regulations.",
      "Strong interpersonal and communication skills.",
      "Experience with HR information systems.",
    ],
    teamDescription:
      "The People Operations team builds and supports the culture at Next360.",
    postedAt: "2026-09-04",
    status: "Open",
  },
  {
    id: "13",
    title: "Software Engineering Intern",
    department: "Technology",
    location: "Hyderabad",
    experience: "Internship",
    employmentType: "Internship",
    workMode: "On-site",
    team: "Engineering",
    skills: ["Java", "Python", "SQL"],
    description:
      "Contribute to real projects while learning from experienced engineers. This internship gives you hands-on experience building software in a professional environment.",
    responsibilities: [
      "Work on real features and bug fixes under the guidance of a mentor.",
      "Participate in team meetings, code reviews, and planning sessions.",
      "Write code and tests for assigned tasks.",
      "Learn and apply engineering best practices and tools.",
      "Present your work to the team at the end of the internship.",
    ],
    qualifications: [
      "Currently pursuing or recently completed a degree in Computer Science or a related field.",
      "Basic knowledge of at least one programming language.",
      "Familiarity with data structures and algorithms.",
      "Eagerness to learn and willingness to ask questions.",
    ],
    teamDescription:
      "Our Engineering team builds the systems and digital experiences that power Next360. Interns are an important part of our team.",
    postedAt: "2026-09-14",
    status: "Open",
  },
  {
    id: "14",
    title: "Cloud Engineer",
    department: "Technology",
    location: "Bengaluru",
    experience: "2-5 years",
    employmentType: "Full Time",
    workMode: "Remote",
    team: "Infrastructure",
    skills: ["AWS", "Cloud", "DevOps"],
    description:
      "Design and manage cloud infrastructure and deployments. You will build reliable, secure, and scalable systems that support our product platform.",
    responsibilities: [
      "Design, deploy, and manage cloud infrastructure on AWS.",
      "Automate infrastructure provisioning using Infrastructure as Code.",
      "Monitor system health and respond to performance issues.",
      "Implement security best practices for cloud environments.",
      "Collaborate with development teams to optimize deployment pipelines.",
    ],
    qualifications: [
      "2-5 years of experience in cloud engineering or DevOps.",
      "Strong knowledge of AWS services and cloud architecture.",
      "Experience with Infrastructure as Code tools.",
      "Familiarity with CI/CD pipelines and containerization.",
    ],
    teamDescription:
      "The Infrastructure team builds and maintains the cloud foundation that powers Next360 products.",
    postedAt: "2026-09-12",
    status: "Open",
  },
  {
    id: "15",
    title: "Quality Assurance Engineer",
    department: "Operations",
    location: "Chennai",
    experience: "2-5 years",
    employmentType: "Full Time",
    workMode: "On-site",
    team: "Quality",
    skills: ["QA", "Testing", "Automation"],
    description:
      "Ensure product quality through systematic testing processes. You will design test plans, execute test cases, and help maintain quality standards.",
    responsibilities: [
      "Design and execute test plans, test cases, and test scripts.",
      "Identify, document, and track software defects.",
      "Perform functional, regression, and integration testing.",
      "Collaborate with engineering teams to resolve quality issues.",
      "Contribute to test automation frameworks and processes.",
    ],
    qualifications: [
      "2-5 years of experience in QA or software testing.",
      "Strong understanding of testing methodologies and tools.",
      "Experience with test automation frameworks.",
      "Attention to detail and strong analytical skills.",
    ],
    teamDescription:
      "The Quality team is committed to delivering reliable, high-quality products.",
    postedAt: "2026-09-11",
    status: "Open",
  },
  {
    id: "16",
    title: "Content Writer",
    department: "Marketing",
    location: "Remote",
    experience: "0-2 years",
    employmentType: "Full Time",
    workMode: "Remote",
    team: "Marketing",
    skills: ["Content", "Writing", "SEO"],
    description:
      "Create compelling content for digital marketing campaigns. You will write blog posts, social media content, email campaigns, and website copy.",
    responsibilities: [
      "Write blog posts, articles, and long-form content.",
      "Create social media copy and campaign content.",
      "Develop email marketing content and newsletters.",
      "Optimize content for SEO and user engagement.",
      "Collaborate with marketing and design teams on content strategy.",
    ],
    qualifications: [
      "0-2 years of experience in content writing or copywriting.",
      "Strong writing and editing skills.",
      "Familiarity with SEO best practices.",
      "Ability to adapt tone and style for different audiences.",
    ],
    teamDescription:
      "The Marketing team tells the Next360 story and connects our products with the right audiences.",
    postedAt: "2026-09-10",
    status: "Open",
  },
  {
    id: "17",
    title: "Product Design Intern",
    department: "Product",
    location: "Bengaluru",
    experience: "Internship",
    employmentType: "Internship",
    workMode: "On-site",
    team: "Design",
    skills: ["Figma", "Design"],
    description:
      "Assist the design team with research, wireframes, and prototypes. You will gain hands-on experience in product design while working on real projects.",
    responsibilities: [
      "Assist with user research and usability testing.",
      "Create wireframes and low-fidelity prototypes.",
      "Support the design team with daily design tasks.",
      "Contribute to design system documentation.",
      "Learn and apply design thinking methodologies.",
    ],
    qualifications: [
      "Currently pursuing or recently completed a degree in Design, HCI, or a related field.",
      "Basic familiarity with Figma or similar design tools.",
      "Interest in user experience and product design.",
      "Willingness to learn and take feedback.",
    ],
    teamDescription:
      "The Design team crafts the experiences that define how users interact with Next360 products.",
    postedAt: "2026-09-13",
    status: "Open",
  },
  {
    id: "18",
    title: "Senior Backend Engineer",
    department: "Technology",
    location: "Hyderabad",
    experience: "5+ years",
    employmentType: "Full Time",
    workMode: "Hybrid",
    team: "Engineering",
    skills: ["Node.js", "Python", "AWS", "SQL"],
    description:
      "Architect and lead backend development for core platform services. You will mentor engineers, drive technical decisions, and build systems that scale.",
    responsibilities: [
      "Architect and lead the development of backend services and APIs.",
      "Mentor junior and mid-level engineers through code reviews and guidance.",
      "Drive technical decisions and contribute to system design.",
      "Identify and resolve performance bottlenecks and scalability challenges.",
      "Define and enforce coding standards, testing practices, and documentation.",
      "Collaborate with product and infrastructure teams on technical roadmap.",
    ],
    qualifications: [
      "5+ years of backend engineering experience.",
      "Deep expertise in Node.js or Python and SQL databases.",
      "Experience designing and scaling distributed systems.",
      "Strong understanding of AWS cloud services.",
      "Proven ability to mentor and lead technical teams.",
      "Excellent problem-solving and communication skills.",
    ],
    preferredQualifications: [
      "Experience with event-driven architectures or message queues.",
      "Familiarity with DevOps practices and infrastructure as code.",
    ],
    teamDescription:
      "Our Engineering team builds the systems and digital experiences that power Next360. We work in small, focused squads.",
    benefits: [
      "Learning and development programs",
      "Flexible work arrangements",
      "Health and wellness benefits",
      "Paid time off",
      "Team events and celebrations",
    ],
    postedAt: "2026-09-09",
    status: "Open",
  },
  {
    id: "19",
    title: "Procurement Specialist",
    department: "Operations",
    location: "Mumbai",
    experience: "2-5 years",
    employmentType: "Full Time",
    workMode: "On-site",
    team: "Procurement",
    skills: ["Procurement", "Supply Chain", "Negotiation"],
    description:
      "Manage vendor relationships and procurement processes. You will source materials, negotiate contracts, and ensure cost-effective operations.",
    responsibilities: [
      "Identify and evaluate potential vendors and suppliers.",
      "Negotiate contracts and pricing agreements.",
      "Manage purchase orders and track deliveries.",
      "Monitor supplier performance and maintain relationships.",
      "Support cost reduction and process improvement initiatives.",
    ],
    qualifications: [
      "2-5 years of experience in procurement or supply chain.",
      "Strong negotiation and communication skills.",
      "Experience with vendor management and contract negotiation.",
      "Analytical skills for cost evaluation and comparison.",
    ],
    teamDescription:
      "The Procurement team ensures we source quality materials and services at the right value.",
    postedAt: "2026-09-08",
    status: "Open",
  },
  {
    id: "20",
    title: "Business Development Associate",
    department: "Sales",
    location: "Delhi",
    experience: "0-2 years",
    employmentType: "Full Time",
    workMode: "On-site",
    team: "Sales",
    skills: ["Sales", "Business Development", "Communication"],
    description:
      "Identify and develop new business opportunities. You will reach out to potential clients, build relationships, and support the growth of our customer base.",
    responsibilities: [
      "Research and identify new business opportunities.",
      "Reach out to potential clients through calls, emails, and meetings.",
      "Build and maintain a pipeline of qualified leads.",
      "Present product offerings to prospective customers.",
      "Collaborate with the sales team to close deals.",
    ],
    qualifications: [
      "0-2 years of experience in business development or sales.",
      "Strong communication and interpersonal skills.",
      "Proactive and self-motivated with a growth mindset.",
      "Ability to learn quickly and articulate product value.",
    ],
    teamDescription:
      "The Sales team drives revenue growth by connecting customers with Next360 products.",
    postedAt: "2026-09-07",
    status: "Open",
  },
];

const MOCK_JOBS_STORE_KEY = "__next360_mock_jobs_store__";

function cloneJob(job: Job): Job {
  return {
    ...job,
    skills: [...job.skills],
    responsibilities: job.responsibilities ? [...job.responsibilities] : undefined,
    qualifications: job.qualifications ? [...job.qualifications] : undefined,
    preferredQualifications: job.preferredQualifications
      ? [...job.preferredQualifications]
      : undefined,
    benefits: job.benefits ? [...job.benefits] : undefined,
  };
}

function getMockJobsStore(): Job[] {
  const g = globalThis as Record<string, unknown>;
  const existing = g[MOCK_JOBS_STORE_KEY] as Job[] | undefined;
  if (Array.isArray(existing)) {
    return existing;
  }
  const store: Job[] = INITIAL_JOBS.map(cloneJob);
  Object.defineProperty(g, MOCK_JOBS_STORE_KEY, {
    value: store,
    writable: false,
    enumerable: false,
    configurable: false,
  });
  return store;
}

export const mockJobs: Job[] = getMockJobsStore();

export function getJobById(id: string): Job | undefined {
  return mockJobs.find((job) => job.id === id);
}

export function getSimilarJobs(job: Job, limit = 4): Job[] {
  return mockJobs
    .filter((j) => j.id !== job.id)
    .sort((a, b) => {
      let scoreA = 0;
      let scoreB = 0;
      if (a.department === job.department) scoreA += 3;
      if (b.department === job.department) scoreB += 3;
      if (a.team === job.team) scoreA += 2;
      if (b.team === job.team) scoreB += 2;
      if (a.location === job.location) scoreA += 1;
      if (b.location === job.location) scoreB += 1;
      const sharedA = a.skills.filter((s) => job.skills.includes(s)).length;
      const sharedB = b.skills.filter((s) => job.skills.includes(s)).length;
      scoreA += sharedA;
      scoreB += sharedB;
      return scoreB - scoreA;
    })
    .slice(0, limit);
}

export const DEPARTMENTS = [
  "Technology",
  "Product",
  "Operations",
  "Marketing",
  "Sales",
  "Finance",
  "Human Resources",
];

export const LOCATIONS = [
  "Hyderabad",
  "Bengaluru",
  "Mumbai",
  "Chennai",
  "Delhi",
  "Remote",
];

export const EXPERIENCE_LEVELS = [
  "Internship",
  "Fresher",
  "0-2 years",
  "2-5 years",
  "5+ years",
];

export const EMPLOYMENT_TYPES = [
  "Full Time",
  "Part Time",
  "Internship",
  "Contract",
];

export const WORK_MODES = ["On-site", "Hybrid", "Remote"];

export const ALL_SKILLS = [
  "React",
  "Next.js",
  "TypeScript",
  "Node.js",
  "Python",
  "Java",
  "SQL",
  "AWS",
  "Cloud",
  "DevOps",
  "Data",
  "Design",
  "Figma",
  "Research",
  "Marketing",
  "Content",
  "SEO",
  "Sales",
  "HR",
  "Finance",
  "Operations",
  "Supply Chain",
  "Quality",
  "QA",
  "Testing",
  "Automation",
];
