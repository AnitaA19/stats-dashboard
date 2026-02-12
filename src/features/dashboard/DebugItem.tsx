interface DebugItemProps {
  label: string;
  value: string | number;
}

export default function DebugItem({ label, value }: DebugItemProps) {
  return (
    <div className="flex flex-col gap-1 px-3 py-2 rounded-lg bg-white shadow-sm transition-all duration-200 cursor-default">
      <span className="text-xs font-semibold text-indigo-400 uppercase">
        {label}
      </span>
      <span className="text-sm text-gray-800">{String(value)}</span>
    </div>
  );
}
