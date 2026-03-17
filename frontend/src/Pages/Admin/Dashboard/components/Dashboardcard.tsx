import { Icon } from "@iconify/react";

type Props = {
  title: string;
  value: string | number;
  icon: string;
};

const DashboardCard = ({ title, value, icon }: Props) => {
  return (
    <div className="flex h-[110px] items-center justify-between rounded-[12px] bg-[#2884C7] p-4 text-white sm:h-[120px] sm:p-5 lg:h-[140px] lg:p-[30px]">
      <div className="flex flex-col gap-1.5 sm:gap-2">
        {/* ✅ Value scales from xl on mobile to 2xl on desktop */}
        <div className="font-outfit text-xl font-bold leading-[100%] sm:text-2xl">
          {value}
        </div>
        {/* ✅ Title slightly smaller on mobile */}
        <div className="font-outfit text-xs font-semibold leading-[100%] sm:text-sm">
          {title}
        </div>
      </div>

      {/* ✅ Icon box scales down on mobile */}
      <div
        className="relative z-10 flex h-[44px] w-[44px] shrink-0 items-center justify-center rounded-[10px] sm:h-[50px] sm:w-[50px] lg:h-[56px] lg:w-[56px] lg:rounded-[12px]"
        style={{
          background: "rgba(255, 255, 255, 0.12)",
          border: "1px solid rgba(255, 255, 255, 0.22)",
          backdropFilter: "blur(8px)",
          boxShadow:
            "inset 0 1px 0 rgba(255,255,255,0.2), 0 4px 12px rgba(0,0,0,0.1)",
        }}
      >
        {/* ✅ Icon size scales */}
        <Icon icon={icon} className="h-6 w-6 sm:h-7 sm:w-7 lg:h-8 lg:w-8" />
      </div>
    </div>
  );
};

export default DashboardCard;
