
import PasswordRequirementItem from "./PasswordRequirementItem";
import { usePasswordChecklist } from "@/hooks/usePasswordChecklist";
type Props = {
  password: string;
};
const PasswordRequirementSection = ({ password }: Props) => {
  const checklist = usePasswordChecklist(password);
  return (
    <div className="bg-[#fff0e5] rounded-md p-3 border border-orange-100">
      <h3 className="text-sm font-medium text-gray-700 mb-2">
        Password Requirements:
      </h3>
      <ul className="space-y-1 text-xs">
        <PasswordRequirementItem
          label="At least 8 characters"
          met={checklist.length}
        />
        <PasswordRequirementItem
          label="At least one uppercase letter"
          met={checklist.uppercase}
        />
        <PasswordRequirementItem
          label="At least one lowercase letter"
          met={checklist.lowercase}
        />
        <PasswordRequirementItem
          label="At least one number"
          met={checklist.number}
        />
        <PasswordRequirementItem
          label="At least one special character"
          met={checklist.special}
        />
      </ul>
    </div>
  );
};

export default PasswordRequirementSection;
