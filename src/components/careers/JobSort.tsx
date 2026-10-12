"use client";

import type { SortOption } from "./types";

interface JobSortProps {
  value: SortOption;
  onChange: (value: SortOption) => void;
}

const sortOptions: { value: SortOption; label: string }[] = [
  { value: "relevance", label: "Relevance" },
  { value: "newest", label: "Newest" },
  { value: "oldest", label: "Oldest" },
  { value: "title-az", label: "Title A-Z" },
];

export default function JobSort({ value, onChange }: JobSortProps) {
  return (
    <div className="flex items-center gap-2">
      <label htmlFor="job-sort" className="text-sm text-gray-500 whitespace-nowrap">
        Sort by
      </label>
      <select
        id="job-sort"
        value={value}
        onChange={(e) => onChange(e.target.value as SortOption)}
        className="text-sm font-medium text-gray-700 border border-gray-300 rounded-lg px-3 py-2 bg-white focus:outline-none focus:ring-2 focus:ring-green-primary focus:border-transparent appearance-none cursor-pointer pr-8"
      >
        {sortOptions.map((opt) => (
          <option key={opt.value} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </select>
    </div>
  );
}
