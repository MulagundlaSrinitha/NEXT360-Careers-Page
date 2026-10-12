"use client";

import type { StoredApplication, ApplicationStatus } from "./mock-applications";
import {
  APPLICATION_STATUS_LABELS,
  APPLICATION_STATUS_COLORS,
} from "./mock-applications";

function formatAppliedDate(dateStr: string): string {
  const date = new Date(dateStr);
  return date.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

interface ApplicationCardProps {
  application: StoredApplication;
}

export default function ApplicationCard({ application }: ApplicationCardProps) {
  const statusLabel =
    APPLICATION_STATUS_LABELS[application.status as ApplicationStatus] ||
    application.status;
  const statusColors =
    APPLICATION_STATUS_COLORS[application.status as ApplicationStatus] || {
      bg: "bg-gray-100",
      text: "text-gray-700",
      dot: "bg-gray-400",
    };

  const jobExists = !!application.jobId;

  return (
    <article className="bg-white rounded-xl border border-gray-200 p-5 sm:p-6 hover:border-green-primary/30 hover:shadow-sm transition-all duration-200">
      <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-3 mb-2">
            {jobExists ? (
              <a
                href={`/careers/jobs/${application.jobId}`}
                className="text-base font-semibold text-gray-900 hover:text-green-primary transition-colors truncate"
              >
                {application.jobTitle}
              </a>
            ) : (
              <span className="text-base font-semibold text-gray-900 truncate">
                {application.jobTitle}
              </span>
            )}
          </div>

          <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-sm text-gray-500 mb-3">
            <span>{application.department}</span>
            <span className="text-gray-300">·</span>
            <span>{application.location}</span>
            {application.employmentType && (
              <>
                <span className="text-gray-300">·</span>
                <span>{application.employmentType}</span>
              </>
            )}
            {application.workMode && (
              <>
                <span className="text-gray-300">·</span>
                <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-gray-100 text-gray-600">
                  {application.workMode}
                </span>
              </>
            )}
          </div>

          <div className="flex flex-wrap items-center gap-3">
            {/* Status badge */}
            <span
              className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium ${statusColors.bg} ${statusColors.text}`}
            >
              <span
                className={`w-1.5 h-1.5 rounded-full ${statusColors.dot}`}
                aria-hidden="true"
              />
              {statusLabel}
            </span>

            {/* Applied date */}
            <span className="text-xs text-gray-400">
              Applied on {formatAppliedDate(application.appliedAt)}
            </span>
          </div>
        </div>

        {/* Application ID */}
        <div className="flex-shrink-0 sm:text-right">
          <p className="text-xs text-gray-400">
            Application ID
          </p>
          <p className="text-xs font-mono text-gray-500">
            {application.id}
          </p>
        </div>
      </div>
    </article>
  );
}
