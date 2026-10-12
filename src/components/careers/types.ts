export interface Job {
  id: string;
  title: string;
  department: string;
  location: string;
  experience: string;
  employmentType: string;
  workMode: string;
  skills: string[];
  description: string;
  postedAt: string;
  status: string;
  responsibilities?: string[];
  qualifications?: string[];
  preferredQualifications?: string[];
  teamDescription?: string;
  benefits?: string[];
  team?: string;
}

export type SortOption = "relevance" | "newest" | "oldest" | "title-az";

export interface JobFilters {
  search: string;
  department: string[];
  location: string[];
  experience: string[];
  employmentType: string[];
  workMode: string[];
  skills: string[];
}
