"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import type { Job } from "@/components/careers/types";
import JobForm, {
  valuesFromJob,
  validateJobForm,
  type JobFormErrors,
  type JobFormValues,
} from "@/components/admin/JobForm";

type LoadState = "loading" | "ready" | "error" | "notfound";

interface AdminEditJobClientProps {
  id: string;
}

function EditJobSkeleton() {
  return (
    <div className="p-4 sm:p-6 lg:p-8">
      <div className="max-w-4xl mx-auto animate-pulse space-y-6">
        <div className="h-3 bg-gray-200 rounded w-56" />
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div className="space-y-2">
            <div className="h-8 bg-gray-200 rounded w-40" />
            <div className="h-4 bg-gray-200 rounded w-72" />
          </div>
          <div className="flex items-center gap-3">
            <div className="h-10 bg-gray-200 rounded-lg w-28" />
            <div className="h-10 bg-gray-200 rounded-lg w-36" />
          </div>
        </div>
        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <div className="h-5 bg-gray-200 rounded w-36 mb-5" />
          <div className="space-y-4">
            <div className="h-10 bg-gray-200 rounded w-full" />
            <div className="grid grid-cols-2 gap-4">
              <div className="h-10 bg-gray-200 rounded" />
              <div className="h-10 bg-gray-200 rounded" />
            </div>
            <div className="h-10 bg-gray-200 rounded" />
          </div>
        </div>
        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <div className="h-5 bg-gray-200 rounded w-36 mb-6" />
          <div className="h-32 bg-gray-200 rounded" />
        </div>
      </div>
    </div>
  );
}

export default function AdminEditJobClient({ id }: AdminEditJobClientProps) {
  const router = useRouter();

  const [loadState, setLoadState] = useState<LoadState>("loading");
  const [job, setJob] = useState<Job | null>(null);
  const [values, setValues] = useState<JobFormValues | null>(null);
  const [errors, setErrors] = useState<JobFormErrors>({});
  const [submitting, setSubmitting] = useState(false);
  const [reloadKey, setReloadKey] = useState(0);

  useEffect(() => {
    let cancelled = false;
    async function load() {
      setLoadState("loading");
      try {
        const res = await fetch(
          `/api/admin/careers/jobs/${encodeURIComponent(id)}`
        );
        if (cancelled) return;
        if (!res.ok) {
          setLoadState(res.status === 404 ? "notfound" : "error");
          return;
        }
        const json = (await res.json()) as { job: Job };
        if (cancelled) return;
        setJob(json.job);
        setValues(valuesFromJob(json.job));
        setLoadState("ready");
      } catch {
        if (!cancelled) setLoadState("error");
      }
    }
    void load();
    return () => {
      cancelled = true;
    };
  }, [id, reloadKey]);

  function handleRetry() {
    setReloadKey((k) => k + 1);
  }

  async function handleSubmit(publishStatus: string) {
    if (!values) return;

    const e = validateJobForm(values);
    setErrors(e);
    if (Object.keys(e).length > 0) return;

    setSubmitting(true);
    setErrors({});

    try {
      const res = await fetch(
        `/api/admin/careers/jobs/${encodeURIComponent(id)}`,
        {
          method: "PATCH",
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
            preferredQualifications: values.preferredQualifications.filter(
              (q) => q.trim()
            ),
            benefits: values.benefits.filter((b) => b.trim()),
            status: publishStatus,
          }),
        }
      );

      if (!res.ok) {
        const data = await res.json();
        setErrors({
          submit:
            data.error ||
            (res.status === 404
              ? "This job may have been removed or no longer exists."
              : "Unable to save changes. Please try again."),
        });
        return;
      }

      router.push(`/admin/careers/jobs/${encodeURIComponent(id)}`);
    } catch {
      setErrors({ submit: "A network error occurred. Please try again." });
    } finally {
      setSubmitting(false);
    }
  }

  function renderCancelLink(className: string) {
    return (
      <Link
        href={`/admin/careers/jobs/${encodeURIComponent(id)}`}
        className={className}
      >
        Cancel
      </Link>
    );
  }

  function renderSaveButton() {
    return (
      <button
        type="button"
        onClick={() => values && handleSubmit(values.status)}
        disabled={submitting || loadState !== "ready"}
        className="inline-flex items-center justify-center gap-2 px-5 py-2.5 text-sm font-medium text-white bg-green-primary hover:bg-green-dark rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-green-primary focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {submitting ? (
          <>
            <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24" aria-hidden="true">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
            </svg>
            Saving...
          </>
        ) : (
          <>
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor" aria-hidden="true">
              <path strokeLinecap="round" strokeLinejoin="round" d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0115.75 21H5.25A2.25 2.25 0 013 18.75V8.25A2.25 2.25 0 015.25 6H10" />
            </svg>
            Save Changes
          </>
        )}
      </button>
    );
  }

  const secondaryButtonClass =
    "inline-flex items-center justify-center px-4 py-2.5 text-sm font-medium text-gray-700 bg-white border border-gray-300 hover:border-gray-400 hover:bg-gray-50 rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-green-primary focus:ring-offset-2";

  if (loadState === "loading") {
    return <EditJobSkeleton />;
  }

  if (loadState === "error") {
    return (
      <div className="p-4 sm:p-6 lg:p-8">
        <div className="max-w-4xl mx-auto">
          <div className="text-center py-16">
            <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-red-50 flex items-center justify-center">
              <svg
                className="w-8 h-8 text-red-500"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth="1.5"
                stroke="currentColor"
                aria-hidden="true"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M12 9v3.75m9-.75a9 9 0 11-18 0 9 9 0 0118 0zm-9 3.75h.008v.008H12v-.008z"
                />
              </svg>
            </div>
            <h1 className="text-xl font-semibold text-gray-900 mb-2">
              Unable to load job
            </h1>
            <p className="text-gray-500 mb-6">Please try again.</p>
            <div className="flex items-center justify-center gap-3">
              <button
                type="button"
                onClick={handleRetry}
                className="inline-flex items-center justify-center px-5 py-2.5 text-sm font-medium text-white bg-green-primary hover:bg-green-dark rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-green-primary focus:ring-offset-2"
              >
                Retry
              </button>
              <Link
                href="/admin/careers/jobs"
                className="inline-flex items-center justify-center px-5 py-2.5 text-sm font-medium text-gray-700 bg-white border border-gray-300 hover:border-gray-400 hover:bg-gray-50 rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-green-primary focus:ring-offset-2"
              >
                Back to Jobs
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (loadState === "notfound" || !job || !values) {
    return (
      <div className="p-4 sm:p-6 lg:p-8">
        <div className="max-w-4xl mx-auto">
          <div className="text-center py-16">
            <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-gray-100 flex items-center justify-center">
              <svg
                className="w-8 h-8 text-gray-400"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth="1.5"
                stroke="currentColor"
                aria-hidden="true"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z"
                />
              </svg>
            </div>
            <h1 className="text-xl font-semibold text-gray-900 mb-2">
              Job not found
            </h1>
            <p className="text-gray-500 mb-6">
              This job may have been removed or the link may be incorrect.
            </p>
            <Link
              href="/admin/careers/jobs"
              className="inline-flex items-center justify-center px-5 py-2.5 text-sm font-medium text-white bg-green-primary hover:bg-green-dark rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-green-primary focus:ring-offset-2"
            >
              Back to Jobs
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-4 sm:p-6 lg:p-8">
      <div className="max-w-4xl mx-auto">
        {/* Breadcrumb */}
        <nav aria-label="Breadcrumb" className="mb-4">
          <ol className="flex items-center gap-1.5 text-sm text-gray-400">
            <li>
              <Link href="/admin/careers" className="hover:text-gray-600 transition-colors">
                Careers
              </Link>
            </li>
            <li aria-hidden="true">/</li>
            <li>
              <Link href="/admin/careers/jobs" className="hover:text-gray-600 transition-colors">
                Jobs
              </Link>
            </li>
            <li aria-hidden="true">/</li>
            <li>
              <Link
                href={`/admin/careers/jobs/${job.id}`}
                className="hover:text-gray-600 transition-colors truncate max-w-[200px]"
              >
                {job.title}
              </Link>
            </li>
            <li aria-hidden="true">/</li>
            <li className="text-gray-600 font-medium">Edit</li>
          </ol>
        </nav>

        {/* Page Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
          <div className="min-w-0">
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">Edit Job</h1>
            <p className="text-sm text-gray-500 mt-1">
              Update job information and publication details for {job.title}.
            </p>
          </div>
          <div className="flex items-center gap-3 flex-shrink-0">
            {renderCancelLink(secondaryButtonClass)}
            {renderSaveButton()}
          </div>
        </div>

        {/* Submit Error */}
        {errors.submit && (
          <div role="alert" className="mb-6 p-4 bg-red-50 border border-red-200 rounded-xl flex items-start gap-3">
            <svg
              className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth="1.5"
              stroke="currentColor"
              aria-hidden="true"
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m9-.75a9 9 0 11-18 0 9 9 0 0118 0zm-9 3.75h.008v.008H12v-.008z" />
            </svg>
            <p className="text-sm text-red-700">{errors.submit}</p>
          </div>
        )}

        <JobForm values={values} errors={errors} onChange={setValues} disabled={submitting} />

        {/* Bottom Actions */}
        <div className="flex items-center justify-end gap-3 pb-8">
          {renderCancelLink(secondaryButtonClass)}
          {renderSaveButton()}
        </div>
      </div>
    </div>
  );
}