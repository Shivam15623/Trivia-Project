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
  Cell,
} from "recharts";

interface ModeBarCardProps {
  modeUsage: {
    solo: number;
    timed_solo: number;
    team: number;
  };
  maxValue?: number;
}

// ─── Custom bar shape ──────────────────────────────────────────────────────────
// Draws the grey background at full height, then the blue fill on top.
// This avoids two-bar overlap hacks entirely.
const BackgroundBar = (props: any) => {
  const { x, y, width, height, maxBarHeight } = props;
  if (!width || !height) return null;


  const bgY = y - (maxBarHeight - height); // top of full-height background

  return (
    <g>
      {/* Grey background — full height */}
      <rect
        x={x}
        y={bgY}
        width={width}
        height={maxBarHeight}
        fill="rgba(255,255,255,0.15)"
        rx={0}
      />
      {/* Blue fill — proportional to value */}
      <rect x={x} y={y} width={width} height={height} fill="#2884C7" rx={0} />
      {/* Bright top edge on fill */}
      <rect x={x} y={y} width={width} height={2} fill="#7BFDFD" rx={0} />
    </g>
  );
};

const chartConfig = {
  users: {
    label: "Games",
    color: "#2884C7",
  },
};

const ModeBarCard: React.FC<ModeBarCardProps> = ({ modeUsage, maxValue }) => {
  const chartData = [
    { mode: "Solo", users: modeUsage.solo },
    { mode: "Team", users: modeUsage.team },
    { mode: "Timed", users: modeUsage.timed_solo },
  ];

  const MAX_VALUE =
    maxValue ?? Math.ceil(Math.max(...chartData.map((d) => d.users)) * 1.25);

  return (
    <GradientCard
      className="w-full max-w-none max-h-[400px] lg:max-h-none lg:max-w-[39.7%]" // ← removed fixed max-w
      gradient="linear-gradient(180deg, #7BFDFD 38.94%, #2884C7 61.54%)"
      padding={3}
      radius={12}
    >
      <div className="flex h-full flex-1 flex-col gap-4 rounded-xl bg-[#FFFFFF0D] p-4 sm:gap-5 sm:p-6">
        <p className="text-base font-semibold leading-tight text-white sm:text-lg">
          Mode Usage Comparison
        </p>

        {/* 
          aspect-[1/1] on mobile (squarish), aspect-[4/3] on sm+
          Gives ChartContainer a real height to fill
        */}
        <div className="aspect-square flex-1 w-full max-h-[88%]">
          <ChartContainer config={chartConfig} className="h-full w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={chartData}
                margin={{ top: 16, right: 8, left: 0, bottom: 0 }}
                barCategoryGap="25%"
              >
                <CartesianGrid
                  vertical={true}
                  horizontal={true}
                  stroke="rgba(255,255,255,0.08)"
                  strokeDasharray="4 5"
                />
                <XAxis
                  dataKey="mode"
                  tick={{ fill: "#fff", fontSize: 13 }}
                  tickLine={false}
                  axisLine={{ stroke: "rgba(255,255,255,0.15)" }}
                />
                <YAxis
                  domain={[0, MAX_VALUE]}
                  tick={{ fill: "rgba(255,255,255,0.5)", fontSize: 11 }}
                  tickLine={false}
                  axisLine={false}
                  width={36}
                />
                <ChartTooltip
                  content={<ChartTooltipContent />}
                  cursor={false}
                />
                <Bar
                  dataKey="users"
                  shape={(props: any) => (
                    <BackgroundBar {...props} maxBarHeight={MAX_VALUE} />
                  )}
                  isAnimationActive={true}
                >
                  {chartData.map((_, index) => (
                    <Cell key={index} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </ChartContainer>
        </div>
      </div>
    </GradientCard>
  );
};

export default ModeBarCard;
