"use client";

import { useState } from "react";
import type { JobFilters } from "./types";
import {
  DEPARTMENTS,
  LOCATIONS,
  EXPERIENCE_LEVELS,
  EMPLOYMENT_TYPES,
  WORK_MODES,
  ALL_SKILLS,
} from "./mock-jobs";

interface FilterSectionProps {
  title: string;
  defaultOpen?: boolean;
  children: React.ReactNode;
}

function FilterSection({ title, defaultOpen = false, children }: FilterSectionProps) {
  const [isOpen, setIsOpen] = useState(defaultOpen);

  return (
    <div className="border-b border-gray-100 pb-4 mb-4 last:border-0 last:mb-0 last:pb-0">
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center justify-between w-full text-left"
        aria-expanded={isOpen}
      >
        <span className="text-sm font-semibold text-gray-900">{title}</span>
        <svg
          className={`w-4 h-4 text-gray-400 transition-transform duration-200 ${isOpen ? "rotate-180" : ""}`}
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth="2"
          stroke="currentColor"
          aria-hidden="true"
        >
          <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5" />
        </svg>
      </button>
      {isOpen && <div className="mt-3 space-y-2">{children}</div>}
    </div>
  );
}

interface CheckboxItemProps {
  label: string;
  checked: boolean;
  onChange: (checked: boolean) => void;
}

function CheckboxItem({ label, checked, onChange }: CheckboxItemProps) {
  return (
    <label className="flex items-center gap-2 cursor-pointer group">
      <input
        type="checkbox"
        checked={checked}
        onChange={(e) => onChange(e.target.checked)}
        className="w-4 h-4 rounded border-gray-300 text-green-primary focus:ring-green-primary cursor-pointer"
      />
      <span className="text-sm text-gray-600 group-hover:text-gray-900 transition-colors">
        {label}
      </span>
    </label>
  );
}

interface JobFiltersProps {
  filters: JobFilters;
  onFilterChange: (filters: JobFilters) => void;
}

export default function JobFiltersSidebar({ filters, onFilterChange }: JobFiltersProps) {
  const updateFilter = (key: keyof JobFilters, value: string, checked: boolean) => {
    const currentValues = filters[key] as string[];
    const newValues = checked
      ? [...currentValues, value]
      : currentValues.filter((v) => v !== value);
    onFilterChange({ ...filters, [key]: newValues });
  };

  return (
    <aside className="w-full lg:w-64 flex-shrink-0">
      <div className="bg-white rounded-xl border border-gray-200 p-5">
        <h2 className="text-base font-semibold text-gray-900 mb-4">Filter jobs</h2>

        <FilterSection title="Department" defaultOpen>
          {DEPARTMENTS.map((dept) => (
            <CheckboxItem
              key={dept}
              label={dept}
              checked={filters.department.includes(dept)}
              onChange={(checked) => updateFilter("department", dept, checked)}
            />
          ))}
        </FilterSection>

        <FilterSection title="Location">
          {LOCATIONS.map((loc) => (
            <CheckboxItem
              key={loc}
              label={loc}
              checked={filters.location.includes(loc)}
              onChange={(checked) => updateFilter("location", loc, checked)}
            />
          ))}
        </FilterSection>

        <FilterSection title="Experience">
          {EXPERIENCE_LEVELS.map((exp) => (
            <CheckboxItem
              key={exp}
              label={exp}
              checked={filters.experience.includes(exp)}
              onChange={(checked) => updateFilter("experience", exp, checked)}
            />
          ))}
        </FilterSection>

        <FilterSection title="Employment Type">
          {EMPLOYMENT_TYPES.map((type) => (
            <CheckboxItem
              key={type}
              label={type}
              checked={filters.employmentType.includes(type)}
              onChange={(checked) => updateFilter("employmentType", type, checked)}
            />
          ))}
        </FilterSection>

        <FilterSection title="Work Mode">
          {WORK_MODES.map((mode) => (
            <CheckboxItem
              key={mode}
              label={mode}
              checked={filters.workMode.includes(mode)}
              onChange={(checked) => updateFilter("workMode", mode, checked)}
            />
          ))}
        </FilterSection>

        <FilterSection title="Skills">
          {ALL_SKILLS.map((skill) => (
            <CheckboxItem
              key={skill}
              label={skill}
              checked={filters.skills.includes(skill)}
              onChange={(checked) => updateFilter("skills", skill, checked)}
            />
          ))}
        </FilterSection>
      </div>
    </aside>
  );
}
