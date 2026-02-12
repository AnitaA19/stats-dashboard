export function StatCardSkeleton() {
  return (
    <div
      className="relative border border-gray-200 rounded-xl p-5 bg-gray-100 shadow-sm animate-pulse
                   transition-transform duration-300"
    >
      <div className="flex flex-col gap-3">
        <div className="h-4 bg-gray-300 rounded w-24" />
        <div className="h-10 bg-gray-300 rounded w-32" />
      </div>
      <span className="absolute top-3 right-3 w-3 h-3 rounded-full bg-gray-300 opacity-70 animate-pulse" />
    </div>
  );
}
