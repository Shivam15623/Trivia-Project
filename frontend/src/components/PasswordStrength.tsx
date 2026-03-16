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

  const colorMap: Record<string, { bar: string; text: string; glow: string }> =
    {
      red: {
        bar: "bg-red-500",
        text: "text-red-400",
        glow: "shadow-[0_0_8px_rgba(239,68,68,0.7)]",
      },
      orange: {
        bar: "bg-orange-400",
        text: "text-orange-400",
        glow: "shadow-[0_0_8px_rgba(251,146,60,0.7)]",
      },
      yellow: {
        bar: "bg-yellow-400",
        text: "text-yellow-400",
        glow: "shadow-[0_0_8px_rgba(250,204,21,0.7)]",
      },
      green: {
        bar: "bg-green-400",
        text: "text-green-400",
        glow: "shadow-[0_0_8px_rgba(74,222,128,0.7)]",
      },
    };

  const { bar, text, glow } = colorMap[color];

  return (
    <div className="mt-2 space-y-1.5">
      {/* Track */}
      <div className="h-1 w-full overflow-hidden rounded-full bg-white/10">
        <div
          style={{ width: `${percent}%` }}
          className={`h-full rounded-full transition-all duration-500 ${bar} ${glow}`}
        />
      </div>

      {/* Labels */}
      <div className="flex justify-between text-xs">
        <span className="text-white/40">Password strength</span>
        <span className={`font-semibold ${text}`}>{label}</span>
      </div>
    </div>
  );
};

export default PasswordStrength;
