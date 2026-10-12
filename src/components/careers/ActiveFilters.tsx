interface ActiveFilter {
  category: string;
  value: string;
}

interface ActiveFiltersProps {
  filters: ActiveFilter[];
  onRemove: (category: string, value: string) => void;
  onClearAll: () => void;
}

export default function ActiveFilters({ filters, onRemove, onClearAll }: ActiveFiltersProps) {
  if (filters.length === 0) return null;

  return (
    <div className="flex flex-wrap items-center gap-2">
      <span className="text-sm font-medium text-gray-600">Active filters:</span>
      {filters.map((filter) => (
        <span
          key={`${filter.category}-${filter.value}`}
          className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-sm font-medium bg-green-50 text-green-primary border border-green-primary/20"
        >
          {filter.value}
          <button
            type="button"
            onClick={() => onRemove(filter.category, filter.value)}
            className="ml-0.5 p-0.5 rounded-full hover:bg-green-primary/10 transition-colors focus:outline-none focus:ring-1 focus:ring-green-primary"
            aria-label={`Remove ${filter.value} filter`}
          >
            <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor" aria-hidden="true">
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </span>
      ))}
      <button
        type="button"
        onClick={onClearAll}
        className="text-sm font-medium text-gray-500 hover:text-gray-700 underline transition-colors ml-1"
      >
        Clear all
      </button>
    </div>
  );
}
