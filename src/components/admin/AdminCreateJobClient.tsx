"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import JobForm, {
  createEmptyJobValues,
  validateJobForm,
  type JobFormErrors,
  type JobFormValues,
} from "@/components/admin/JobForm";

export default function AdminCreateJobClient() {
  const router = useRouter();

  const [values, setValues] = useState<JobFormValues>(createEmptyJobValues());
  const [errors, setErrors] = useState<JobFormErrors>({});
  const [submitting, setSubmitting] = useState(false);

  function validate(): boolean {
    const e = validateJobForm(values);
    setErrors(e);
    return Object.keys(e).length === 0;
  }

  async function handleSubmit(publishStatus: string) {
    if (!validate()) return;

    setSubmitting(true);
    setErrors({});

    try {
      const res = await fetch("/api/admin/careers/jobs", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: values.title.trim(),
          department: values.department,
          team: values.team.trim(),
          location: values.location,
          experience: values.experience,
          employmentType: values.employmentType,
          workMode: values.workMode,
          description: values.description.trim(),
          skills: values.skills,
          responsibilities: values.responsibilities.filter((r) => r.trim()),
          qualifications: values.qualifications.filter((q) => q.trim()),
          preferredQualifications: values.preferredQualifications.filter((q) => q.trim()),
          benefits: values.benefits.filter((b) => b.trim()),
          status: publishStatus,
        }),
      });

      if (!res.ok) {
        const data = await res.json();
        setErrors({ submit: data.error || "Unable to create job. Please try again." });
        return;
      }

      router.push("/admin/careers/jobs");
    } catch {
      setErrors({ submit: "A network error occurred. Please try again." });
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="p-4 sm:p-6 lg:p-8">
      <div className="max-w-4xl mx-auto">
        {/* Breadcrumb */}
        <nav aria-label="Breadcrumb" className="mb-4">
          <ol className="flex items-center gap-1.5 text-sm text-gray-400">
            <li>
              <Link href="/admin/careers" className="hover:text-gray-600 transition-colors">Careers</Link>
            </li>
            <li aria-hidden="true">/</li>
            <li>
              <Link href="/admin/careers/jobs" className="hover:text-gray-600 transition-colors">Jobs</Link>
            </li>
            <li aria-hidden="true">/</li>
            <li className="text-gray-600 font-medium">Create Job</li>
          </ol>
        </nav>

        {/* Page Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">Create Job</h1>
            <p className="text-sm text-gray-500 mt-1">Create a new job posting for Next360.</p>
          </div>
          <div className="flex items-center gap-3 flex-shrink-0">
            <Link
              href="/admin/careers/jobs"
              className="inline-flex items-center justify-center px-4 py-2.5 text-sm font-medium text-gray-700 bg-white border border-gray-300 hover:border-gray-400 hover:bg-gray-50 rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-green-primary focus:ring-offset-2"
            >
              Cancel
            </Link>
            <button
              type="button"
              onClick={() => handleSubmit(values.status)}
              disabled={submitting}
              className="inline-flex items-center justify-center gap-2 px-5 py-2.5 text-sm font-medium text-white bg-green-primary hover:bg-green-dark rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-green-primary focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {submitting ? (
                <>
                  <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24" aria-hidden="true">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                  </svg>
                  Creating...
                </>
              ) : (
                <>
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor" aria-hidden="true">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
                  </svg>
                  Create Job
                </>
              )}
            </button>
          </div>
        </div>

        {/* Submit Error */}
        {errors.submit && (
          <div role="alert" className="mb-6 p-4 bg-red-50 border border-red-200 rounded-xl flex items-start gap-3">
            <svg className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" aria-hidden="true">
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m9-.75a9 9 0 11-18 0 9 9 0 0118 0zm-9 3.75h.008v.008H12v-.008z" />
            </svg>
            <p className="text-sm text-red-700">{errors.submit}</p>
          </div>
        )}

        <JobForm values={values} errors={errors} onChange={setValues} disabled={submitting} />

        {/* Bottom Actions */}
        <div className="flex items-center justify-end gap-3 pb-8">
          <Link
            href="/admin/careers/jobs"
            className="inline-flex items-center justify-center px-4 py-2.5 text-sm font-medium text-gray-700 bg-white border border-gray-300 hover:border-gray-400 hover:bg-gray-50 rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-green-primary focus:ring-offset-2"
          >
            Cancel
          </Link>
          <button
            type="button"
            onClick={() => handleSubmit(values.status)}
            disabled={submitting}
            className="inline-flex items-center justify-center gap-2 px-5 py-2.5 text-sm font-medium text-white bg-green-primary hover:bg-green-dark rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-green-primary focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {submitting ? (
              <>
                <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24" aria-hidden="true">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                </svg>
                Creating...
              </>
            ) : (
              <>
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor" aria-hidden="true">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
                </svg>
                Create Job
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}