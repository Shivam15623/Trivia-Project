import { format } from "date-fns";
import { CalendarIcon } from "lucide-react";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

type Props = {
  value?: Date;
  onChange: (date: Date | undefined) => void;
  className?: string;
};

export function DatePickerDemo({ value, onChange, className }: Props) {
  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          variant={"outline"}
          className={cn(
            "w-[240px] justify-between text-left font-normal",
            !value && "text-muted-foreground",
            className
          )}
        >
          
          {value ? format(value, "PPP") : <span>Pick a date</span>}
          <CalendarIcon className="mr-2 h-4 w-4" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0" align="start">
        <Calendar
          mode="single"
          classNames={{
            caption_dropdowns: "flex gap-2 justify-center mb-2",
            dropdown:
              "bg-white border border-gray-300 rounded px-2 py-1 text-sm focus:outline-none",
            caption_label: "hidden", // Hide the duplicated label above
          }}
          selected={value}
          onSelect={onChange}
          initialFocus
          captionLayout="dropdown" // ✅ enables dropdown for month & year
          fromYear={1910} // ✅ optional: controls earliest year
          toYear={new Date().getFullYear()} // ✅ optional: limit to current year
        />
      </PopoverContent>
    </Popover>
  );
}
