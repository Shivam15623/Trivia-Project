import { useState } from "react";
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
  const [open, setOpen] = useState(false); // 👈 track popover state

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant={"outline"}
          className={cn(
            "w-[240px] justify-between text-left font-normal transition-all",
            !value && "text-muted-foreground",
            open && "border-2 border-[#e34b4b] shadow-sm", // 👈 custom style when open
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
            caption_label: "hidden",
          }}
          selected={value}
          onSelect={onChange}
          initialFocus
          captionLayout="dropdown"
          fromYear={1910}
          toYear={new Date().getFullYear()}
        />
      </PopoverContent>
    </Popover>
  );
}
