import logError from "./logError";

type ApiErrorShape = {
  status?: number;
  data?: {
    message?: string;
  };
};

export function handleApiError(error: unknown) {
  const err = error as ApiErrorShape;
  const status = err?.status;
  const message =
    err?.data?.message || "Something went wrong. Please try again.";

  switch (status) {
    case 400:
      logError(message);
      break;
    case 401:
      logError("You are not authorized. Please log in again.");
      break;
    case 403:
      logError("You don't have permission to do this.");
      break;
    case 404:
      logError(message);
      break;
    case 409:
      logError(message);
      break;
    case 429:
      logError("Too many requests. Please slow down.");
      break;
    case 500:
      logError("Server error. Please try again later.");
      break;
    default:
      logError(message);
      break;
  }
}
