import * as React from "react";
import { format } from "date-fns";
import { CalendarIcon } from "lucide-react";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverAnchor,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

type Props = {
  value?: Date;
  onChange: (date: Date | undefined) => void;
  className?: string;
};

// ✅ forwardRef to allow ref forwarding
export const DatePickerDemo = React.forwardRef<HTMLButtonElement, Props>(
  ({ value, onChange, className }, ref) => {
    const [open, setOpen] = React.useState(false);

    return (
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            ref={ref}
            variant={"outline"}
            className={cn(
              "w-[240px] justify-between text-left font-normal transition-all",
              !value && "text-muted-foreground",
              open && "border-2 border-[#e34b4b] shadow-sm",
              className,
            )}
          >
            {value ? format(value, "PPP") : <span>Pick a date</span>}
            <CalendarIcon className="mr-2 h-4 w-4" />
          </Button>
        </PopoverTrigger>
        <PopoverAnchor />
        <PopoverContent
          align="start"
          className={cn(
            "w-auto border-0 p-0",
            "rounded-[16px]",
            "bg-[#0d0d0d]/20 backdrop-blur-md",
            "shadow-[0_0_0_1px_rgba(123,253,253,0.25),0_8px_32px_rgba(0,0,0,0.6)]",
          )}
        >
          <Calendar
            mode="single"
            selected={value}
            onSelect={(date) => {
              onChange(date);
              setOpen(false);
            }}
            initialFocus
            captionLayout="dropdown"
            fromYear={1910}
            toYear={new Date().getFullYear()}
            classNames={{
              // outer shell
              months: "p-4",

              // header row (Month / Year dropdowns)
              caption:
                "flex items-center text-[#ffffffb3]  justify-center mb-3",
              caption_label: "hidden",
              caption_dropdowns: "flex gap-2 w-full",

              // dropdowns — pill style matching inputs
              dropdown_month: "flex-1",
              dropdown_year: "flex-1",
              dropdown:
                "w-full rounded-[100px] border-0 bg-[#FFFFFF1A] px-4 py-1.5 text-sm text-white shadow-[inset_1px_1px_0_0_rgba(255,255,255,0.15)] focus:outline-none appearance-none cursor-pointer",

              // nav arrows
              nav: "hidden",

              // day grid
              table: "w-full border-collapse",
              head_row: "flex mb-1",
              head_cell:
                "flex-1 text-center text-[11px] font-medium text-white/30 uppercase",
              row: "flex w-full mt-1",
              cell: "flex-1 text-center",

              // individual day buttons
              day: cn(
                "mx-auto flex h-8 w-8 items-center justify-center rounded-full",
                "text-sm text-white/70 transition-all duration-150",
                "hover:bg-[#FFFFFF1A] hover:text-white",
                "focus:outline-none",
              ),
              day_selected:
                "bg-[linear-gradient(180deg,_#7BFDFD_38.94%,_#2884C7_61.54%)] text-white font-medium hover:opacity-90",
              day_today: "ring-1 ring-[#7BFDFD]/50 text-[#7BFDFD] font-medium",
              day_outside: "text-white/20 hover:bg-transparent",
              day_disabled:
                "text-white/15 cursor-not-allowed hover:bg-transparent",
              day_range_middle: "rounded-none",
              day_hidden: "invisible",
            }}
          />
        </PopoverContent>
      </Popover>
    );
  },
);
