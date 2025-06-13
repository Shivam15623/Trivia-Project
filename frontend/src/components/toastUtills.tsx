import { toast } from "sonner";
import { CheckCircle, AlertTriangle, XCircle, Info } from "lucide-react";

const defaultPosition = "top-right";

export const showSuccess = (message: string) => {
  toast.success(message, {
    position: defaultPosition,
    icon: <CheckCircle />,  
    style: {
      backgroundColor: "oklch(0.7 0.177 142.5)",
      color: "oklch(0.985 0 0)",
      padding: "12px 16px",
      borderRadius: "8px",
    },
  });
};

export const showWarning = (message: string) => {
  toast(message, {
    position: defaultPosition,
    icon: <AlertTriangle />,  
    style: {
      backgroundColor: "oklch(0.85 0.144 80.1)",
      color: "oklch(0.141 0.005 285.823)",
      padding: "12px 16px",
      borderRadius: "8px",
    },
  });
};

export const showError = (message: string) => {
  toast.error(message, {
    position: defaultPosition,
    icon: <XCircle />, 
    style: {
      backgroundColor: "oklch(0.65 0.22 25.5)",
      color: "oklch(0.985 0 0)",
      padding: "12px 16px",
      borderRadius: "8px",
    },
  });
};

export const showInfo = (message: string) => {
  toast(message, {
    position: defaultPosition,
    icon: <Info />,  
    style: {
      backgroundColor: "oklch(0.65 0.156 196.5)",
      color: "oklch(0.985 0 0)",
      padding: "12px 16px",
      borderRadius: "8px",
    },
  });
};
