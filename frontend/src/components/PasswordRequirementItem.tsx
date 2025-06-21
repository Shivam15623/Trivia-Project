import { CheckCircle, Circle } from "lucide-react";

type Props = {
  label: string;
  met: boolean;
};

const PasswordRequirementItem = ({ label, met }: Props) => {
  const Icon = met ? CheckCircle : Circle;
  return (
    <li className={`flex items-center text-xs ${met ? "text-green-600" : "text-gray-600"}`}>
      <Icon className={`w-4 h-4 mr-2 ${met ? "text-green-600" : "text-gray-400"}`} />
      {label}
    </li>
  );
};

export default PasswordRequirementItem;
