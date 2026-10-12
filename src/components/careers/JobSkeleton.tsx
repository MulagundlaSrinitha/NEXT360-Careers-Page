export function JobSkeleton() {
  return (
    <div className="bg-white rounded-xl border border-gray-200 p-6 animate-pulse">
      <div className="flex items-start justify-between gap-4">
        <div className="flex-1">
          <div className="flex items-center gap-3 mb-2">
            <div className="h-5 bg-gray-200 rounded w-48" />
            <div className="h-5 bg-gray-100 rounded-full w-20" />
          </div>
          <div className="flex gap-4 mb-3">
            <div className="h-4 bg-gray-100 rounded w-24" />
            <div className="h-4 bg-gray-100 rounded w-20" />
            <div className="h-4 bg-gray-100 rounded w-16" />
          </div>
          <div className="h-4 bg-gray-100 rounded w-full max-w-md mb-3" />
          <div className="flex gap-1.5 mb-3">
            <div className="h-6 bg-gray-100 rounded w-14" />
            <div className="h-6 bg-gray-100 rounded w-16" />
            <div className="h-6 bg-gray-100 rounded w-12" />
          </div>
          <div className="h-3 bg-gray-100 rounded w-24" />
        </div>
        <div className="flex flex-col items-end gap-2">
          <div className="w-9 h-9 bg-gray-100 rounded-lg" />
          <div className="h-4 bg-gray-100 rounded w-16" />
        </div>
      </div>
    </div>
  );
}

export default function JobSkeletons() {
  return (
    <div className="space-y-4">
      {Array.from({ length: 6 }).map((_, i) => (
        <JobSkeleton key={i} />
      ))}
    </div>
  );
}
