import { FallbackProps } from "react-error-boundary";
import { Button } from "./ui/button";

export function Fallback({ error, resetErrorBoundary }: FallbackProps) {
  const isDev = import.meta.env.DEV;

  return (
    <div
      role="alert"
      className="p-6 bg-red-100 text-red-800 rounded-md border border-red-400"
    >
      <h2 className="text-lg font-bold mb-2">Something went wrong:</h2>
      <pre className="whitespace-pre-wrap">{error.message}</pre>

      {isDev && (
        <details className="mt-2 text-sm text-red-600">
          <summary className="cursor-pointer underline">Stack Trace</summary>
          <pre>{error.stack}</pre>
        </details>
      )}

      <Button
        onClick={resetErrorBoundary}
        className="mt-4 px-4 py-2 bg-red-600  hover:bg-red-700 text-white rounded"
      >
        Try Again
      </Button>
    </div>
  );
}
