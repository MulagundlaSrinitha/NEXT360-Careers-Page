import Link from "next/link";

interface JobsEmptyStateProps {
  onClearFilters: () => void;
}

export default function JobsEmptyState({ onClearFilters }: JobsEmptyStateProps) {
  return (
    <div className="text-center py-16">
      <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-gray-100 flex items-center justify-center">
        <svg className="w-8 h-8 text-gray-400" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" aria-hidden="true">
          <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" />
        </svg>
      </div>
      <h3 className="text-lg font-semibold text-gray-900 mb-2">No jobs found</h3>
      <p className="text-sm text-gray-500 mb-6 max-w-sm mx-auto">
        Try changing your search or removing some filters.
      </p>
      <div className="flex items-center justify-center gap-3">
        <button
          type="button"
          onClick={onClearFilters}
          className="inline-flex items-center justify-center px-4 py-2 text-sm font-medium text-green-primary border border-green-primary hover:bg-green-50 rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-green-primary focus:ring-offset-2"
        >
          Clear Filters
        </button>
        <Link
          href="/careers/jobs"
          className="inline-flex items-center justify-center px-4 py-2 text-sm font-medium text-white bg-green-primary hover:bg-green-dark rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-green-primary focus:ring-offset-2"
        >
          View All Jobs
        </Link>
      </div>
    </div>
  );
}
