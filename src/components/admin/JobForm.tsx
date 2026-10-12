"use client";

import { useState } from "react";
import {
  DEPARTMENTS,
  LOCATIONS,
  EXPERIENCE_LEVELS,
  EMPLOYMENT_TYPES,
  WORK_MODES,
  ALL_SKILLS,
} from "@/components/careers/mock-jobs";
import type { Job } from "@/components/careers/types";

export interface JobFormValues {
  title: string;
  department: string;
  team: string;
  location: string;
  employmentType: string;
  workMode: string;
  experience: string;
  description: string;
  skills: string[];
  responsibilities: string[];
  qualifications: string[];
  preferredQualifications: string[];
  benefits: string[];
  status: string;
}

export interface JobFormErrors {
  title?: string;
  department?: string;
  location?: string;
  experience?: string;
  employmentType?: string;
  workMode?: string;
  description?: string;
  submit?: string;
}

const STATUS_OPTIONS = ["Draft", "Open"] as const;

export function createEmptyJobValues(): JobFormValues {
  return {
    title: "",
    department: "",
    team: "",
    location: "",
    employmentType: "",
    workMode: "",
    experience: "",
    description: "",
    skills: [],
    responsibilities: [""],
    qualifications: [""],
    preferredQualifications: [""],
    benefits: [""],
    status: "Draft",
  };
}

export function valuesFromJob(job: Job): JobFormValues {
  return {
    title: job.title,
    department: job.department,
    team: job.team || "",
    location: job.location,
    employmentType: job.employmentType,
    workMode: job.workMode,
    experience: job.experience,
    description: job.description,
    skills: Array.isArray(job.skills) ? [...job.skills] : [],
    responsibilities:
      job.responsibilities && job.responsibilities.length > 0
        ? [...job.responsibilities]
        : [""],
    qualifications:
      job.qualifications && job.qualifications.length > 0
        ? [...job.qualifications]
        : [""],
    preferredQualifications:
      job.preferredQualifications && job.preferredQualifications.length > 0
        ? [...job.preferredQualifications]
        : [""],
    benefits:
      job.benefits && job.benefits.length > 0 ? [...job.benefits] : [""],
    status: job.status,
  };
}

export function validateJobForm(values: JobFormValues): JobFormErrors {
  const e: JobFormErrors = {};
  if (!values.title.trim()) e.title = "Job title is required.";
  if (!values.department) e.department = "Department is required.";
  if (!values.location) e.location = "Location is required.";
  if (!values.experience) e.experience = "Experience level is required.";
  if (!values.employmentType) e.employmentType = "Employment type is required.";
  if (!values.workMode) e.workMode = "Work mode is required.";
  if (!values.description.trim()) e.description = "Description is required.";
  return e;
}

interface JobFormProps {
  values: JobFormValues;
  errors: JobFormErrors;
  onChange: (next: JobFormValues) => void;
  disabled?: boolean;
}

type ListField =
  | "responsibilities"
  | "qualifications"
  | "preferredQualifications"
  | "benefits";

const LIST_FIELDS: Record<ListField, { label: string; placeholder: string }> = {
  responsibilities: {
    label: "Responsibilities",
    placeholder: "e.g. Design and build scalable systems",
  },
  qualifications: {
    label: "Qualifications",
    placeholder: "e.g. 3+ years of experience",
  },
  preferredQualifications: {
    label: "Preferred Qualifications",
    placeholder: "e.g. Experience with AWS",
  },
  benefits: {
    label: "Benefits",
    placeholder: "e.g. Health insurance",
  },
};

function singularize(label: string): string {
  if (/ies$/.test(label)) return label.replace(/ies$/, "y");
  if (/s$/.test(label)) return label.replace(/s$/, "");
  return label;
}

export default function JobForm({
  values,
  errors,
  onChange,
  disabled = false,
}: JobFormProps) {
  const [skillInput, setSkillInput] = useState("");
  const [skillDropdownOpen, setSkillDropdownOpen] = useState(false);

  function setField<K extends keyof JobFormValues>(
    field: K,
    value: JobFormValues[K]
  ) {
    onChange({ ...values, [field]: value });
  }

  function updateListItem(field: ListField, index: number, value: string) {
    setField(field, values[field].map((v, i) => (i === index ? value : v)));
  }

  function addListItem(field: ListField) {
    setField(field, [...values[field], ""]);
  }

  function removeListItem(field: ListField, index: number) {
    setField(
      field,
      values[field].filter((_, i) => i !== index)
    );
  }

  function addSkill(skill: string) {
    const s = skill.trim();
    if (s && !values.skills.includes(s)) {
      setField("skills", [...values.skills, s]);
    }
    setSkillInput("");
    setSkillDropdownOpen(false);
  }

  function removeSkill(skill: string) {
    setField(
      "skills",
      values.skills.filter((s) => s !== skill)
    );
  }

  const filteredSkills = ALL_SKILLS.filter(
    (s) => s.toLowerCase().includes(skillInput.toLowerCase()) && !values.skills.includes(s)
  );

  function renderListField(field: ListField) {
    const { label, placeholder } = LIST_FIELDS[field];
    const items = values[field];
    return (
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          {label}
        </label>
        <div className="space-y-2">
          {items.map((item, i) => (
            <div key={i} className="flex gap-2">
              <input
                type="text"
                value={item}
                onChange={(e) => updateListItem(field, i, e.target.value)}
                placeholder={placeholder}
                disabled={disabled}
                className="flex-1 px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-primary focus:border-transparent placeholder:text-gray-400 disabled:bg-gray-50 disabled:text-gray-500 disabled:cursor-not-allowed"
              />
              {items.length > 1 && (
                <button
                  type="button"
                  onClick={() => removeListItem(field, i)}
                  disabled={disabled}
                  className="inline-flex items-center justify-center w-9 h-9 rounded-lg text-gray-400 hover:text-red-500 hover:bg-red-50 transition-colors flex-shrink-0 disabled:opacity-50 disabled:cursor-not-allowed"
                  aria-label={`Remove ${label.toLowerCase()} item ${i + 1}`}
                >
                  <svg
                    className="w-4 h-4"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth="1.5"
                    stroke="currentColor"
                    aria-hidden="true"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              )}
            </div>
          ))}
        </div>
        <button
          type="button"
          onClick={() => addListItem(field)}
          disabled={disabled}
          className="mt-2 inline-flex items-center gap-1.5 text-sm font-medium text-green-primary hover:text-green-dark transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <svg
            className="w-4 h-4"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth="2"
            stroke="currentColor"
            aria-hidden="true"
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
          </svg>
          Add {singularize(label)}
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Section A: Basic Information */}
      <section className="bg-white rounded-xl border border-gray-200 p-6">
        <h2 className="text-base font-semibold text-gray-900 mb-5">Basic Information</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
          {/* Job Title */}
          <div className="sm:col-span-2">
            <label htmlFor="job-title" className="block text-sm font-medium text-gray-700 mb-1.5">
              Job Title <span className="text-red-500">*</span>
            </label>
            <input
              id="job-title"
              type="text"
              value={values.title}
              onChange={(e) => setField("title", e.target.value)}
              placeholder="e.g. Software Engineer"
              disabled={disabled}
              aria-invalid={errors.title ? true : undefined}
              aria-describedby={errors.title ? "job-title-error" : undefined}
              className={`w-full px-3 py-2.5 text-sm border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-primary focus:border-transparent placeholder:text-gray-400 disabled:bg-gray-50 disabled:text-gray-500 disabled:cursor-not-allowed ${errors.title ? "border-red-300" : "border-gray-300"}`}
            />
            {errors.title && (
              <p id="job-title-error" className="mt-1 text-xs text-red-600">{errors.title}</p>
            )}
          </div>

          {/* Department */}
          <div>
            <label htmlFor="department" className="block text-sm font-medium text-gray-700 mb-1.5">
              Department <span className="text-red-500">*</span>
            </label>
            <select
              id="department"
              value={values.department}
              onChange={(e) => setField("department", e.target.value)}
              disabled={disabled}
              aria-invalid={errors.department ? true : undefined}
              aria-describedby={errors.department ? "department-error" : undefined}
              className={`w-full px-3 py-2.5 text-sm border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-primary focus:border-transparent bg-white disabled:bg-gray-50 disabled:text-gray-500 disabled:cursor-not-allowed ${errors.department ? "border-red-300" : "border-gray-300"}`}
            >
              <option value="">Select department</option>
              {DEPARTMENTS.map((d) => (
                <option key={d} value={d}>{d}</option>
              ))}
            </select>
            {errors.department && (
              <p id="department-error" className="mt-1 text-xs text-red-600">{errors.department}</p>
            )}
          </div>

          {/* Team */}
          <div>
            <label htmlFor="team" className="block text-sm font-medium text-gray-700 mb-1.5">
              Team
            </label>
            <input
              id="team"
              type="text"
              value={values.team}
              onChange={(e) => setField("team", e.target.value)}
              placeholder="e.g. Engineering"
              disabled={disabled}
              className="w-full px-3 py-2.5 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-primary focus:border-transparent placeholder:text-gray-400 disabled:bg-gray-50 disabled:text-gray-500 disabled:cursor-not-allowed"
            />
          </div>

          {/* Location */}
          <div>
            <label htmlFor="location" className="block text-sm font-medium text-gray-700 mb-1.5">
              Location <span className="text-red-500">*</span>
            </label>
            <select
              id="location"
              value={values.location}
              onChange={(e) => setField("location", e.target.value)}
              disabled={disabled}
              aria-invalid={errors.location ? true : undefined}
              aria-describedby={errors.location ? "location-error" : undefined}
              className={`w-full px-3 py-2.5 text-sm border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-primary focus:border-transparent bg-white disabled:bg-gray-50 disabled:text-gray-500 disabled:cursor-not-allowed ${errors.location ? "border-red-300" : "border-gray-300"}`}
            >
              <option value="">Select location</option>
              {LOCATIONS.map((l) => (
                <option key={l} value={l}>{l}</option>
              ))}
            </select>
            {errors.location && (
              <p id="location-error" className="mt-1 text-xs text-red-600">{errors.location}</p>
            )}
          </div>

          {/* Employment Type */}
          <div>
            <label htmlFor="employment-type" className="block text-sm font-medium text-gray-700 mb-1.5">
              Employment Type <span className="text-red-500">*</span>
            </label>
            <select
              id="employment-type"
              value={values.employmentType}
              onChange={(e) => setField("employmentType", e.target.value)}
              disabled={disabled}
              aria-invalid={errors.employmentType ? true : undefined}
              aria-describedby={errors.employmentType ? "employment-type-error" : undefined}
              className={`w-full px-3 py-2.5 text-sm border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-primary focus:border-transparent bg-white disabled:bg-gray-50 disabled:text-gray-500 disabled:cursor-not-allowed ${errors.employmentType ? "border-red-300" : "border-gray-300"}`}
            >
              <option value="">Select type</option>
              {EMPLOYMENT_TYPES.map((t) => (
                <option key={t} value={t}>{t}</option>
              ))}
            </select>
            {errors.employmentType && (
              <p id="employment-type-error" className="mt-1 text-xs text-red-600">{errors.employmentType}</p>
            )}
          </div>

          {/* Work Mode */}
          <div>
            <label htmlFor="work-mode" className="block text-sm font-medium text-gray-700 mb-1.5">
              Work Mode <span className="text-red-500">*</span>
            </label>
            <select
              id="work-mode"
              value={values.workMode}
              onChange={(e) => setField("workMode", e.target.value)}
              disabled={disabled}
              aria-invalid={errors.workMode ? true : undefined}
              aria-describedby={errors.workMode ? "work-mode-error" : undefined}
              className={`w-full px-3 py-2.5 text-sm border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-primary focus:border-transparent bg-white disabled:bg-gray-50 disabled:text-gray-500 disabled:cursor-not-allowed ${errors.workMode ? "border-red-300" : "border-gray-300"}`}
            >
              <option value="">Select work mode</option>
              {WORK_MODES.map((m) => (
                <option key={m} value={m}>{m}</option>
              ))}
            </select>
            {errors.workMode && (
              <p id="work-mode-error" className="mt-1 text-xs text-red-600">{errors.workMode}</p>
            )}
          </div>

          {/* Experience */}
          <div>
            <label htmlFor="experience" className="block text-sm font-medium text-gray-700 mb-1.5">
              Experience Level <span className="text-red-500">*</span>
            </label>
            <select
              id="experience"
              value={values.experience}
              onChange={(e) => setField("experience", e.target.value)}
              disabled={disabled}
              aria-invalid={errors.experience ? true : undefined}
              aria-describedby={errors.experience ? "experience-error" : undefined}
              className={`w-full px-3 py-2.5 text-sm border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-primary focus:border-transparent bg-white disabled:bg-gray-50 disabled:text-gray-500 disabled:cursor-not-allowed ${errors.experience ? "border-red-300" : "border-gray-300"}`}
            >
              <option value="">Select experience</option>
              {EXPERIENCE_LEVELS.map((l) => (
                <option key={l} value={l}>{l}</option>
              ))}
            </select>
            {errors.experience && (
              <p id="experience-error" className="mt-1 text-xs text-red-600">{errors.experience}</p>
            )}
          </div>
        </div>
      </section>

      {/* Section B: Job Description */}
      <section className="bg-white rounded-xl border border-gray-200 p-6">
        <h2 className="text-base font-semibold text-gray-900 mb-5">Job Description</h2>
        <div>
          <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1.5">
            Description <span className="text-red-500">*</span>
          </label>
          <textarea
            id="description"
            value={values.description}
            onChange={(e) => setField("description", e.target.value)}
            rows={6}
            disabled={disabled}
            placeholder="Describe the role, what the candidate will do, and why they should join..."
            aria-invalid={errors.description ? true : undefined}
            aria-describedby={errors.description ? "description-error" : undefined}
            className={`w-full px-3 py-2.5 text-sm border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-primary focus:border-transparent placeholder:text-gray-400 resize-y disabled:bg-gray-50 disabled:text-gray-500 disabled:cursor-not-allowed ${errors.description ? "border-red-300" : "border-gray-300"}`}
          />
          {errors.description && (
            <p id="description-error" className="mt-1 text-xs text-red-600">{errors.description}</p>
          )}
        </div>
      </section>

      {/* Section C: Responsibilities */}
      <section className="bg-white rounded-xl border border-gray-200 p-6">
        <h2 className="text-base font-semibold text-gray-900 mb-5">Responsibilities</h2>
        {renderListField("responsibilities")}
      </section>

      {/* Section D: Qualifications */}
      <section className="bg-white rounded-xl border border-gray-200 p-6">
        <h2 className="text-base font-semibold text-gray-900 mb-5">Qualifications</h2>
        {renderListField("qualifications")}
      </section>

      {/* Section E: Preferred Qualifications */}
      <section className="bg-white rounded-xl border border-gray-200 p-6">
        <h2 className="text-base font-semibold text-gray-900 mb-5">Preferred Qualifications</h2>
        {renderListField("preferredQualifications")}
      </section>

      {/* Section F: Skills */}
      <section className="bg-white rounded-xl border border-gray-200 p-6">
        <h2 className="text-base font-semibold text-gray-900 mb-5">Skills</h2>
        <div className="relative">
          <label htmlFor="skill-search" className="block text-sm font-medium text-gray-700 mb-1.5">
            Search and add skills
          </label>
          <input
            id="skill-search"
            type="text"
            value={skillInput}
            onChange={(e) => {
              setSkillInput(e.target.value);
              setSkillDropdownOpen(true);
            }}
            onFocus={() => setSkillDropdownOpen(true)}
            onBlur={() => setTimeout(() => setSkillDropdownOpen(false), 150)}
            disabled={disabled}
            placeholder="Type to search skills..."
            className="w-full px-3 py-2.5 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-primary focus:border-transparent placeholder:text-gray-400 disabled:bg-gray-50 disabled:text-gray-500 disabled:cursor-not-allowed"
          />
          {skillDropdownOpen && skillInput && filteredSkills.length > 0 && (
            <div className="absolute z-10 mt-1 w-full bg-white border border-gray-200 rounded-lg shadow-lg max-h-48 overflow-y-auto">
              {filteredSkills.map((skill) => (
                <button
                  key={skill}
                  type="button"
                  onMouseDown={(e) => e.preventDefault()}
                  onClick={() => addSkill(skill)}
                  disabled={disabled}
                  className="w-full text-left px-3 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                >
                  {skill}
                </button>
              ))}
            </div>
          )}
        </div>
        {values.skills.length > 0 && (
          <div className="flex flex-wrap gap-2 mt-3">
            {values.skills.map((skill) => (
              <span
                key={skill}
                className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium bg-green-50 text-green-700"
              >
                {skill}
                <button
                  type="button"
                  onClick={() => removeSkill(skill)}
                  disabled={disabled}
                  className="ml-0.5 hover:text-green-900 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  aria-label={`Remove ${skill}`}
                >
                  <svg
                    className="w-3.5 h-3.5"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth="2"
                    stroke="currentColor"
                    aria-hidden="true"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </span>
            ))}
          </div>
        )}
      </section>

      {/* Section G: Benefits */}
      <section className="bg-white rounded-xl border border-gray-200 p-6">
        <h2 className="text-base font-semibold text-gray-900 mb-5">Benefits</h2>
        {renderListField("benefits")}
      </section>

      {/* Section H: Publishing */}
      <section className="bg-white rounded-xl border border-gray-200 p-6">
        <h2 className="text-base font-semibold text-gray-900 mb-5">Publishing</h2>
        <fieldset>
          <legend className="block text-sm font-medium text-gray-700 mb-3">
            Status
          </legend>
          <div className="flex gap-4">
            {STATUS_OPTIONS.map((option) => (
              <label key={option} className="flex items-center gap-2 cursor-pointer">
                <input
                  type="radio"
                  name="status"
                  value={option}
                  checked={values.status === option}
                  onChange={(e) => setField("status", e.target.value)}
                  disabled={disabled}
                  className="w-4 h-4 text-green-primary border-gray-300 focus:ring-green-primary"
                />
                <span className="text-sm text-gray-700">
                  {option === "Open" ? "Publish" : option}
                </span>
              </label>
            ))}
          </div>
          <p className="mt-2 text-xs text-gray-400">
            Draft jobs are not visible on the public careers page. Published jobs appear immediately.
          </p>
        </fieldset>
      </section>
    </div>
  );
}