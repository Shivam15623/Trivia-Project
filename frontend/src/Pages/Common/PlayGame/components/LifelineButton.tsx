import { Button } from "@/components/ui/button";
import { JSX } from "react";

type LifelineProps = {
  label: string;
  icon: JSX.Element;
  isActive: boolean;
  isAvailable: boolean;
  onClick: () => void;
  activeClasses: string;
  hoverColor: string;
};

const LifelineButton = ({
  label,
  icon,
  isActive,
  isAvailable,
  onClick,
  activeClasses,
  hoverColor,
}: LifelineProps) => (
  <Button
    disabled={!isAvailable}
    onClick={onClick}
    className={`w-full sm:w-auto flex-1 p-3 rounded-lg flex justify-center items-center gap-2 text-sm font-medium transition-all duration-300
    ${
      isActive
        ? activeClasses
        : isAvailable
        ? `bg-gray-100 text-gray-800 hover:${hoverColor}`
        : "bg-gray-200 text-gray-400 cursor-not-allowed"
    }`}
  >
    {icon}
    {label}
  </Button>
);
export default LifelineButton;
