import * as RadioGroupPrimitive from "@radix-ui/react-radio-group";
import { cn } from "@/lib/utils";

export type Option = {
  label: string;
  value: string;
  disabled?: boolean;
};

interface RadioGroupProps {
  options: Option[];
  value: string;
  onChange: (value: string) => void;
  name?: string;
  className?: string;
  orientation?: "horizontal" | "vertical";
}

export const RadioGroup = ({
  options,
  value,
  onChange,
  name,
  className,
  orientation = "horizontal",
}: RadioGroupProps) => {
  return (
    <RadioGroupPrimitive.Root
      className={cn(
        "flex gap-4",
        orientation === "vertical" ? "flex-col" : "flex-row",
        className
      )}
      value={value}
      onValueChange={onChange}
      name={name}
    >
      {options.map((opt) => (
        <label key={opt.value} className="flex items-center gap-2 cursor-pointer">
          <RadioGroupPrimitive.Item
            id={opt.value}
            value={opt.value}
            disabled={opt.disabled}
            className={cn(
              "w-4 h-4 rounded-full border border-gray-400",
              "data-[state=checked]:bg-blue-600 data-[state=checked]:border-blue-600",
              "flex items-center justify-center",
              "disabled:opacity-50"
            )}
          >
            <div className="w-2 h-2 rounded-full bg-white" />
          </RadioGroupPrimitive.Item>
          <span>{opt.label}</span>
        </label>
      ))}
    </RadioGroupPrimitive.Root>
  );
};
