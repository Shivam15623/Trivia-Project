
import { usePasswordChecklist } from "@/hooks/usePasswordChecklist";

type Props = {
  password: string;
};

const PasswordStrength = ({ password }: Props) => {
  const checklist = usePasswordChecklist(password);

  const getPasswordStrength = () => {
    const keys = Object.keys(checklist) as (keyof typeof checklist)[];
    const passed = keys.filter((k) => checklist[k]).length;

    const percent = (passed / keys.length) * 100;

    let label = "Weak";
    let color = "red";
    if (percent >= 80) {
      label = "Strong";
      color = "green";
    } else if (percent >= 60) {
      label = "Good";
      color = "yellow";
    } else if (percent >= 40) {
      label = "Fair";
      color = "orange";
    }

    return { percent, label, color };
  };

  const { percent, label, color } = getPasswordStrength();

  const colorMap: Record<string, string> = {
    red: "bg-red-500 text-red-500",
    orange: "bg-orange-400 text-orange-400",
    yellow: "bg-yellow-400 text-yellow-500",
    green: "bg-green-500 text-green-500",
  };

  return (
    <div className="space-y-1 mt-1">
      <div className="w-full h-1 bg-gray-200 rounded-full overflow-hidden">
        <div
          style={{ width: `${percent}%` }}
          className={`transition-all duration-300 h-full rounded-full ${
            colorMap[color].split(" ")[0]
          }`}
        />
      </div>
      <div className="flex justify-between text-xs">
        <span className="text-gray-500">Password strength</span>
        <span className={`font-medium ${colorMap[color].split(" ")[1]}`}>
          {label}
        </span>
      </div>
    </div>
  );
};

export default PasswordStrength;
