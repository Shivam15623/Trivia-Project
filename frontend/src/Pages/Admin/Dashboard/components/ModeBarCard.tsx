"use client";

import { GradientCard } from "@/Pages/Customer/CustomerHome/components/GradientBorderCard";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import {
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  XAxis,
  YAxis,
} from "recharts";

interface ModeBarCardProps {
  modeUsage: {
    solo: number;
    timed_solo: number;
    team: number;
  };
  maxValue?: number; // optional, will calculate if not provided
}

const ModeBarCard: React.FC<ModeBarCardProps> = ({ modeUsage, maxValue }) => {
  // Convert object into array for Recharts
  const chartData = [
    { mode: "Solo", users: modeUsage.solo },
    { mode: "Timed", users: modeUsage.timed_solo },
    { mode: "Team", users: modeUsage.team },
  ];

  // Calculate MAX_VALUE if not provided
  const MAX_VALUE =
    maxValue ?? Math.max(...chartData.map((item) => item.users)) * 1.2;

  const chartConfig = {
    users: {
      label: "Games",
      color: "#2884C7",
    },
  };

  return (
    <GradientCard
      className="h-full max-h-[564px] w-full max-w-[594px]"
      gradient="linear-gradient(180deg, #7BFDFD 38.94%, #2884C7 61.54%)"
      padding={3}
      radius={12}
    >
      <div className="flex h-full flex-col gap-5 rounded-xl bg-[#FFFFFF0D] p-6">
        <p className="text-lg font-semibold leading-[100%] text-white">
          Mode Usage Comparison
        </p>

        <ChartContainer
          config={chartConfig}
          className="h-full w-full px-4 pb-4 pt-8"
        >
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={chartData} barCategoryGap="20%" barGap={-80}>
              <CartesianGrid
                vertical={true}
                horizontal={true}
                stroke="rgba(255,255,255,0.1)"
                strokeDasharray="4 5"
              />
              <XAxis
                dataKey="mode"
                tick={{ fill: "#fff", fontSize: 13 }}
                tickLine={false}
                axisLine={{ stroke: "rgba(255,255,255,0.2)" }}
              />
              <YAxis
                domain={[0, MAX_VALUE]}
                tick={{ fill: "rgba(255,255,255,0.6)", fontSize: 12 }}
                tickLine={false}
                axisLine={false}
              />

              <ChartTooltip content={<ChartTooltipContent />} cursor={false} />

              {/* Grey background full height - disable tooltip */}
              <Bar
                dataKey={() => MAX_VALUE}
                fill="rgba(255,255,255,0.25)"
                radius={[0, 0, 0, 0]}
                barSize={80}
                isAnimationActive={false}
                tooltipType="none" // ⚡ disable tooltip for this bar
              />

              {/* Actual value */}
              <Bar
                dataKey="users"
                fill="#3E82C4"
                radius={[0, 0, 0, 0]}
                barSize={80}
              />
            </BarChart>
          </ResponsiveContainer>
        </ChartContainer>
      </div>
    </GradientCard>
  );
};

export default ModeBarCard;
