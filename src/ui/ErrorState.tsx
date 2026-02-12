import type { AppError } from "../types/types";
import { Button } from "./Button";

interface ErrorStateProps {
  error: AppError;
  onRetry: () => void;
}

export function ErrorState({ error, onRetry }: ErrorStateProps) {
  return (
    <div className="bg-white/10 border border-red-400/30 rounded-xl p-8 text-center shadow-md">
      <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-red-400/10 flex items-center justify-center animate-pulse-slow">
        <svg
          className="w-7 h-7 text-red-400"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
          />
        </svg>
      </div>

      <h3 className="text-2xl font-semibold text-gray-100 mb-2">
        Unable to Load Data
      </h3>

      <p className="text-gray-400 mb-4">{error.message}</p>

      {error.code && (
        <span className="block w-max mx-auto px-3 py-1 bg-red-400/10 text-red-400 text-sm rounded-full mb-6">
          Error {error.code}
        </span>
      )}

      <Button
        variant="secondary"
        onClick={onRetry}
        size="sm"
        className="hover:scale-105 transition-transform"
      >
        Try Again
      </Button>
    </div>
  );
}
