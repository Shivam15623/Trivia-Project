import { FallbackProps } from "react-error-boundary";

export function Fallback({ error, resetErrorBoundary }: FallbackProps) {
  return (
    <div
      role="alert"
      className="p-6 bg-red-100 text-red-800 rounded-md border border-red-400"
    >
      <h2 className="text-lg font-bold mb-2">Something went wrong:</h2>
      <pre className="whitespace-pre-wrap">{error.message}</pre>
      <button
        onClick={resetErrorBoundary}
        className="mt-4 px-4 py-2 bg-red-600 text-white rounded"
      >
        Try Again
      </button>
    </div>
  );
}
