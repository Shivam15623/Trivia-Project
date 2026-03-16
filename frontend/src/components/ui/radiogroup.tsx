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
        className,
      )}
      value={value}
      onValueChange={onChange}
      name={name}
    >
      {options.map((opt) => (
        <label
          key={opt.value}
          className="flex cursor-pointer items-center gap-2"
        >
          <RadioGroupPrimitive.Item
            id={opt.value}
            value={opt.value}
            disabled={opt.disabled}
            className={cn(
              "group h-5 w-5 rounded-full border border-white",
              "flex items-center justify-center",
              "disabled:opacity-50",
            )}
          >
            <div
              className={cn(
                "h-3 w-3 rounded-full transition-all",
                "bg-transparent",
                "group-data-[state=checked]:bg-white",
              )}
            />
          </RadioGroupPrimitive.Item>
          <span className="font-poppins text-sm sm:text-xl  leading-[100%] text-white">
            {opt.label}
          </span>
        </label>
      ))}
    </RadioGroupPrimitive.Root>
  );
};
