import { toast } from "sonner";
import { CheckCircle, AlertTriangle, XCircle, Info } from "lucide-react";

const defaultPosition = "top-right";

const baseStyle = {
  padding: "12px 16px",
  borderRadius: "999px", // pill shape — matches your button/input style
  backdropFilter: "blur(12px)",
  border: "1px solid rgba(255,255,255,0.12)",
  color: "#ffffff",
  fontSize: "14px",
  fontWeight: "600",
};

export const showSuccess = (message: string) => {
  toast.success(message, {
    position: defaultPosition,
    icon: <CheckCircle className="h-4 w-4 text-green-400" />,
    style: {
      ...baseStyle,
      backgroundColor: "rgba(74, 222, 128, 0.12)",
      border: "1px solid rgba(74, 222, 128, 0.25)",
    },
  });
};

export const showWarning = (message: string) => {
  toast(message, {
    position: defaultPosition,
    icon: <AlertTriangle className="h-4 w-4 text-amber-400" />,
    style: {
      ...baseStyle,
      backgroundColor: "rgba(251, 191, 36, 0.12)",
      border: "1px solid rgba(251, 191, 36, 0.25)",
    },
  });
};

export const showError = (message: string) => {
  toast.error(message, {
    position: defaultPosition,
    icon: <XCircle className="h-4 w-4 text-red-400" />,
    style: {
      ...baseStyle,
      backgroundColor: "rgba(248, 113, 113, 0.12)",
      border: "1px solid rgba(248, 113, 113, 0.25)",
    },
  });
};

export const showInfo = (message: string) => {
  toast(message, {
    position: defaultPosition,
    icon: <Info className="h-4 w-4 text-cyan-400" />,
    style: {
      ...baseStyle,
      backgroundColor: "rgba(34, 211, 238, 0.12)",
      border: "1px solid rgba(34, 211, 238, 0.25)",
    },
  });
};
