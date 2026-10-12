"use client";

import { useEffect, useRef } from "react";
import type { JobFilters } from "./types";
import {
  DEPARTMENTS,
  LOCATIONS,
  EXPERIENCE_LEVELS,
  EMPLOYMENT_TYPES,
  WORK_MODES,
  ALL_SKILLS,
} from "./mock-jobs";

interface MobileFilterDrawerProps {
  isOpen: boolean;
  filters: JobFilters;
  onFilterChange: (filters: JobFilters) => void;
  onClose: () => void;
  onClearAll: () => void;
}

export default function MobileFilterDrawer({
  isOpen,
  filters,
  onFilterChange,
  onClose,
  onClearAll,
}: MobileFilterDrawerProps) {
  const drawerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isOpen) onClose();
    };
    document.addEventListener("keydown", handleEscape);
    return () => document.removeEventListener("keydown", handleEscape);
  }, [isOpen, onClose]);

  const updateFilter = (key: keyof JobFilters, value: string, checked: boolean) => {
    const currentValues = filters[key] as string[];
    const newValues = checked
      ? [...currentValues, value]
      : currentValues.filter((v) => v !== value);
    onFilterChange({ ...filters, [key]: newValues });
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 lg:hidden">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/50"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Drawer */}
      <div
        ref={drawerRef}
        className="absolute inset-y-0 right-0 w-full max-w-sm bg-white shadow-xl flex flex-col"
        role="dialog"
        aria-modal="true"
        aria-label="Filter jobs"
      >
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-gray-900">Filter jobs</h2>
          <button
            type="button"
            onClick={onClose}
            className="p-2 rounded-lg hover:bg-gray-100 transition-colors focus:outline-none focus:ring-2 focus:ring-green-primary"
            aria-label="Close filters"
          >
            <svg className="w-5 h-5 text-gray-500" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" aria-hidden="true">
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Filter content */}
        <div className="flex-1 overflow-y-auto px-5 py-4 space-y-6">
          <fieldset>
            <legend className="text-sm font-semibold text-gray-900 mb-3">Department</legend>
            <div className="space-y-2">
              {DEPARTMENTS.map((dept) => (
                <label key={dept} className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={filters.department.includes(dept)}
                    onChange={(e) => updateFilter("department", dept, e.target.checked)}
                    className="w-4 h-4 rounded border-gray-300 text-green-primary focus:ring-green-primary"
                  />
                  <span className="text-sm text-gray-600">{dept}</span>
                </label>
              ))}
            </div>
          </fieldset>

          <fieldset>
            <legend className="text-sm font-semibold text-gray-900 mb-3">Location</legend>
            <div className="space-y-2">
              {LOCATIONS.map((loc) => (
                <label key={loc} className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={filters.location.includes(loc)}
                    onChange={(e) => updateFilter("location", loc, e.target.checked)}
                    className="w-4 h-4 rounded border-gray-300 text-green-primary focus:ring-green-primary"
                  />
                  <span className="text-sm text-gray-600">{loc}</span>
                </label>
              ))}
            </div>
          </fieldset>

          <fieldset>
            <legend className="text-sm font-semibold text-gray-900 mb-3">Experience</legend>
            <div className="space-y-2">
              {EXPERIENCE_LEVELS.map((exp) => (
                <label key={exp} className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={filters.experience.includes(exp)}
                    onChange={(e) => updateFilter("experience", exp, e.target.checked)}
                    className="w-4 h-4 rounded border-gray-300 text-green-primary focus:ring-green-primary"
                  />
                  <span className="text-sm text-gray-600">{exp}</span>
                </label>
              ))}
            </div>
          </fieldset>

          <fieldset>
            <legend className="text-sm font-semibold text-gray-900 mb-3">Employment Type</legend>
            <div className="space-y-2">
              {EMPLOYMENT_TYPES.map((type) => (
                <label key={type} className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={filters.employmentType.includes(type)}
                    onChange={(e) => updateFilter("employmentType", type, e.target.checked)}
                    className="w-4 h-4 rounded border-gray-300 text-green-primary focus:ring-green-primary"
                  />
                  <span className="text-sm text-gray-600">{type}</span>
                </label>
              ))}
            </div>
          </fieldset>

          <fieldset>
            <legend className="text-sm font-semibold text-gray-900 mb-3">Work Mode</legend>
            <div className="space-y-2">
              {WORK_MODES.map((mode) => (
                <label key={mode} className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={filters.workMode.includes(mode)}
                    onChange={(e) => updateFilter("workMode", mode, e.target.checked)}
                    className="w-4 h-4 rounded border-gray-300 text-green-primary focus:ring-green-primary"
                  />
                  <span className="text-sm text-gray-600">{mode}</span>
                </label>
              ))}
            </div>
          </fieldset>

          <fieldset>
            <legend className="text-sm font-semibold text-gray-900 mb-3">Skills</legend>
            <div className="space-y-2">
              {ALL_SKILLS.map((skill) => (
                <label key={skill} className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={filters.skills.includes(skill)}
                    onChange={(e) => updateFilter("skills", skill, e.target.checked)}
                    className="w-4 h-4 rounded border-gray-300 text-green-primary focus:ring-green-primary"
                  />
                  <span className="text-sm text-gray-600">{skill}</span>
                </label>
              ))}
            </div>
          </fieldset>
        </div>

        {/* Footer */}
        <div className="px-5 py-4 border-t border-gray-200 flex gap-3">
          <button
            type="button"
            onClick={onClearAll}
            className="flex-1 inline-flex items-center justify-center px-4 py-2.5 text-sm font-medium text-gray-700 border border-gray-300 hover:bg-gray-50 rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-green-primary"
          >
            Clear All
          </button>
          <button
            type="button"
            onClick={onClose}
            className="flex-1 inline-flex items-center justify-center px-4 py-2.5 text-sm font-medium text-white bg-green-primary hover:bg-green-dark rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-green-primary focus:ring-offset-2"
          >
            Apply Filters
          </button>
        </div>
      </div>
    </div>
  );
}
