import { showError } from "@/CustomComponent/toastUtills";

const logError = (error: unknown) => {
  if (import.meta.env.DEV) {
    console.error(error);
  } else {
    showError("An unexpected error occurred. Please try again later.");
  }
};

export default logError;
