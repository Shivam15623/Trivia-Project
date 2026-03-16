import React from "react";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";

import { cn } from "@/lib/utils";
import { GradientCard } from "@/Pages/Customer/CustomerHome/components/GradientBorderCard";

interface Tab {
  value: string;
  label: string;
  content: React.ReactNode;
}

interface TabsWrapperProps {
  tabs: Tab[];
  defaultValue: string;

}

const TabsWrapper: React.FC<TabsWrapperProps> = ({
  tabs,
  defaultValue,

}) => {



  return (
    <Tabs defaultValue={defaultValue} className="w-full">
      <TabsList
        className={cn(
          "flex w-full justify-start gap-8 rounded-none border-none bg-transparent p-0",
        )}
      >
        {tabs.map((tab) => (
          <div
            key={tab.value}
            className="gradient-border flex-1 transition-all duration-200"
            style={
              {
                "--border-gradient":
                  "linear-gradient(93.58deg, #67C3FF 8.55%, #010A2A 47.56%, #67C3FF 94.76%)",
                "--radius": "20px",
                "--padding": "1px",
              } as React.CSSProperties
            }
          >
            <TabsTrigger
              value={tab.value}
              className={cn(
                "relative z-10 flex flex-1 h-[40px] items-center justify-center w-full rounded-[20px] px-6 font-outfit text-[16px] transition-all duration-200 sm:text-[18px]",

                "text-white hover:bg-[#2985C866]",

                "data-[state=active]:scale-105",
                "data-[state=active]:bg-[#2985C8]",
                "data-[state=active]:text-white",
                "data-[state=active]:shadow-lg",
              )}
            >
              {tab.label}
            </TabsTrigger>
          </div>
        ))}
      </TabsList>

      {tabs.map((tab) => (
        <TabsContent
          key={tab.value}
          value={tab.value}
          className="animate-tab-in mt-6"
        >
          <GradientCard>
            <div className="p-6">{tab.content}</div>
          </GradientCard>
        </TabsContent>
      ))}
    </Tabs>
  );
};

export default TabsWrapper;
