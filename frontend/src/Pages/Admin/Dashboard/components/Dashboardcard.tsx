import { Icon } from "@iconify/react";

type Props = {
  title: string;
  value: string | number;
  icon: string;
};

const DashboardCard = ({ title, value, icon }: Props) => {
  return (
    <div className="flex h-[140px] items-center justify-between rounded-[12px] bg-[#2884C7] p-[30px] text-white">
      <div className="flex flex-col gap-2">
        <div className="font-outfit text-2xl font-bold leading-[100%]">
          {value}
        </div>

        <div className="font-outfit text-sm font-semibold leading-[100%]">
          {title}
        </div>
      </div>

      <div
        className="relative z-10 flex h-[56px] w-[56px] items-center justify-center rounded-[12px]"
        style={{
          background: "rgba(255, 255, 255, 0.12)",
          border: "1px solid rgba(255, 255, 255, 0.22)",
          backdropFilter: "blur(8px)",
          boxShadow:
            "inset 0 1px 0 rgba(255,255,255,0.2), 0 4px 12px rgba(0,0,0,0.1)",
        }}
      >
        <Icon icon={icon} width="34" />
      </div>
    </div>
  );
};

export default DashboardCard;
