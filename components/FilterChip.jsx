"use client";

export default function FilterChip({ label, onRemove }) {
  return (
    <div className="flex items-center bg-green-100 text-green-800 px-3 py-1 rounded-full">
      <span className="text-sm mr-2">{label}</span>
      <button
        onClick={onRemove}
        className="hover:bg-green-200 rounded-full p-1 focus:outline-none"
        aria-label={`Remove filter ${label}`}
      >
        <svg
          className="w-4 h-4 text-green-800"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          strokeWidth={3}
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M6 18L18 6M6 6l12 12"
          />
        </svg>
      </button>
    </div>
  );
}
