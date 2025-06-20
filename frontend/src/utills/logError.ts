import { showError } from "@/components/toastUtills";


const logError = (error:string) => {
  if (import.meta.env.DEV) {
    console.error(error);
  } else {
    showError(error||"An unexpected error occurred. Please try again later.");
  }
};

export default logError;
