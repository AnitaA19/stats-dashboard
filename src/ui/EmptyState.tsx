interface EmptyStateProps {
  type: "initial" | "empty";
}

export function EmptyState({ type }: EmptyStateProps) {
  const title =
    type === "initial" ? "No Data Loaded" : "No Statistics Available";
  const message =
    type === "initial"
      ? "Click refresh to load analytics data."
      : "Start tracking to see analytics here.";

  return (
    <div className="bg-white/10 border border-gray-300 rounded-xl p-8 text-center shadow-md">
      <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-gray-200/20 flex items-center justify-center animate-bounce-slow">
        <svg
          className="w-7 h-7 text-gray-400"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
          />
        </svg>
      </div>
      <h3 className="text-2xl font-semibold text-gray-500 mb-2">{title}</h3>
      <p className="text-gray-400 text-sm">{message}</p>
    </div>
  );
}
