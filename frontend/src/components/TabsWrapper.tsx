import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { cn } from "@/lib/utils";
import { ReactNode, useState } from "react";

type TabItem = {
  label: string;
  value: string;
  content: ReactNode;
};

type Variant = "default" | "userprofile" | "pill";
type Size = "sm" | "md" | "lg";

const variantClasses = {
  default: {
    list: "flex bg-white space-x-2 sm:space-x-4 mb-2 w-full sm:w-fit overflow-x-auto",
    trigger:
      "text-gray-500 py-2 px-2 sm:px-4 font-medium text-base rounded-none shadow-none focus:outline-none whitespace-nowrap",
    active:
      "py-2 px-2 sm:px-4 font-medium text-base focus:outline-none data-[state=active]:shadow-none border-0 border-b-2 border-[#e34b4b] text-[#e34b4b] whitespace-nowrap",
  },
  userprofile: {
    list: "flex p-1 bg-[#fff0e5] w-full h-auto gap-1 ",
    trigger:
      "flex-1 py-3 px-4 rounded-md h-auto font-medium text-center text-[#e34b4b]",
    active:
      "flex-1 py-3 px-4 rounded-md h-auto font-medium focus:outline-none data-[state=active]:shadow-none text-center tab-gradient text-white",
  },
  pill: {
    list: "flex gap-2",
    trigger: "bg-gray-100 text-gray-700 rounded-full",
    active: "bg-gradient-to-r from-red-500 to-orange-400 text-white",
  },
};

const sizeClasses = {
  sm: "px-2 py-1 text-sm",
  md: "px-3 py-2 text-base",
  lg: "px-4 py-3 text-lg",
};

type TabsWrapperProps = {
  defaultValue: string;
  tabs: TabItem[];
  variant?: Variant;
  size?: Size;
};

const TabsWrapper = ({
  defaultValue,
  tabs,
  variant = "default",
  size = "md",
}: TabsWrapperProps) => {
  const [activeTab, setActiveTab] = useState(defaultValue);
  const styles = variantClasses[variant];
  const sizeStyle = sizeClasses[size];

  return (
    <Tabs
      defaultValue={defaultValue}
      onValueChange={setActiveTab}
      className="bg-white rounded-lg  shadow-none  gap-0 space-y-0"
    >
      <div className="w-full overflow-x-auto">
        <TabsList
          className={cn(
            "rounded-t-md rounded-b-none inline-flex min-w-max",
            styles.list
          )}
        >
          {tabs.map((tab) => (
            <TabsTrigger
              key={tab.value}
              value={tab.value}
              className={cn(
                styles.trigger,
                sizeStyle,
                "min-w-max",
                activeTab === tab.value && styles.active
              )}
            >
              {tab.label}
            </TabsTrigger>
          ))}
        </TabsList>
      </div>

      {tabs.map((tab) => (
        <TabsContent
          key={tab.value}
          value={tab.value}
          className={cn("animate-fadeIn", activeTab === tab.value && "block")}
        >
          {tab.content}
        </TabsContent>
      ))}
    </Tabs>
  );
};

export default TabsWrapper;
