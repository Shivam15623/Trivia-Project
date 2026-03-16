import { Check, LucideIcon } from "lucide-react";

const StepBullet = ({
  bullet,
  title,
  description,
}: {
  bullet: LucideIcon | number;
  title: string;
  description?: string;
}) => {
  const isIcon = typeof bullet !== "number";
  const BulletContent = isIcon ? (bullet as LucideIcon) : Check;

  return (
    <div className="flex items-start">
      {isIcon ? (
        <BulletContent className="mr-3 mt-0.5 h-4 w-4 flex-shrink-0 text-amber-400" />
      ) : (
        <div className="mr-3 flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-full border border-amber-400/30 bg-amber-400/20 text-xs font-bold text-amber-400">
          {bullet}
        </div>
      )}
      <div>
        <p className="text-sm font-medium text-white/80">{title}</p>
        {description && <p className="text-xs text-white/40">{description}</p>}
      </div>
    </div>
  );
};

export default StepBullet;
