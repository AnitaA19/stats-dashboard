interface StatCardProps {
  field: "visits" | "uniqueUsers" | "conversionRate";
  value: number;
  isOptimistic?: boolean;
}

export function StatCard({
  field,
  value,
  isOptimistic = false,
}: StatCardProps) {
  const config = {
    visits: {
      label: "Total Visits",
      accent: "bg-blue-300",
      text: "text-blue-800",
    },
    uniqueUsers: {
      label: "Unique Users",
      accent: "bg-purple-300",
      text: "text-purple-800",
    },
    conversionRate: {
      label: "Conversion Rate",
      accent: "bg-green-300",
      text: "text-green-800",
    },
  }[field];

  const displayValue =
    field === "conversionRate"
      ? `${value.toFixed(1)}%`
      : value.toLocaleString();

  return (
    <div
      className={`relative border border-gray-200 rounded-xl p-5 shadow-sm bg-white
                  ${isOptimistic ? "opacity-90" : ""}`}
    >
      {isOptimistic && (
        <span
          className="absolute top-3 right-3 w-3 h-3 rounded-full bg-blue-400 animate-pulse"
        />
      )}

      <div className="flex items-center gap-3">
        <div
          className={`w-3 h-3 rounded-full ${config.accent} animate-pulse-slow`}
        />
        <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide">
          {config.label}
        </p>
      </div>

      <p
        className={`mt-2 text-3xl md:text-2xl font-bold ${config.text} 
                    transition-colors duration-300`}
      >
        {displayValue}
      </p>
    </div>
  );
}
