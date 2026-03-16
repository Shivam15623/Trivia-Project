"use client";

import { GradientCard } from "@/Pages/Customer/CustomerHome/components/GradientBorderCard";
import React from "react";

interface TopCategory {
  categoryId: string;
  name: string;
  count: number;
}

interface TopCategoriesProps {
  topCategories: TopCategory[];
}

const TopCategories: React.FC<TopCategoriesProps> = ({ topCategories }) => {
  // Calculate the max count for scaling the progress bars
  const maxCount = Math.max(...topCategories.map((cat) => cat.count), 1);

  return (
    <GradientCard
      gradient="linear-gradient(180deg, #7BFDFD 38.94%, #2884C7 61.54%)"
      padding={3}
      className="w-full"
      radius={12}
    >
      <div className="flex flex-col gap-5 p-6">
        <p className="text-lg font-semibold leading-[100%] text-white">
          Top Categories
        </p>

        <div className="flex flex-col gap-6">
          {topCategories.map((category) => {
            const widthPercent = (category.count / maxCount) * 100;

            return (
              <div key={category.categoryId} className="flex flex-col gap-2.5">
                <div className="flex flex-row justify-between text-xs font-normal font-outfit leading-[100%] text-white">
                  <span>{category.name}</span>
                  <span>{category.count.toLocaleString()}</span>
                </div>
                <div className="h-3 w-full rounded-full bg-white/50">
                  <div
                    className="h-3 rounded-full bg-[#2884C7]"
                    style={{ width: `${widthPercent}%` }}
                  />
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </GradientCard>
  );
};

export default TopCategories;
