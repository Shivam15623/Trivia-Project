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
        <BulletContent className="w-4.5 h-4.5 text-[#e34b4b] mr-3 flex-shrink-0 mt-0.5" />
      ) : (
        <div className="bg-[#e34b4b] rounded-full w-6 h-6 flex items-center justify-center text-white font-bold mr-3 flex-shrink-0">
          {bullet}
        </div>
      )}
      <div>
        {" "}
        <p className="text-gray-700 font-medium">{title}</p>
        {description && <p className="text-sm text-gray-500">{description}</p>}
      </div>
    </div>
  );
};

export default StepBullet;
