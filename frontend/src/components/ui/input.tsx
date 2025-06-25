import * as React from "react";
import { cn } from "@/lib/utils";

type InputProps = React.ComponentProps<"input"> & {
  variant?: "default" | "underline" | "ghost" | "solid" | "solidred"; // extend as needed
};

const variantClasses = {
  default: "border bg-transparent",
  underline: "border-0 border-b rounded-none bg-transparent",
  ghost: "border-transparent bg-transparent shadow-none",
  solid: "bg-muted border border-border",
  solidred:
    "w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none  focus-visible:border-0 focus-visible:ring-[#e34b4b] focus-visible:ring-[2px] focus:border-transparent",
};

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, type = "text", variant = "default", ...props }, ref) => {
    return (
      <input
        ref={ref}
        type={type}
        data-slot="input"
        className={cn(
          // base styles
          "file:text-foreground placeholder:text-muted-foreground selection:bg-primary selection:text-primary-foreground dark:bg-input/30 border-input flex h-9 w-full min-w-0 rounded-md px-3 py-1 text-base shadow-xs transition-[color,box-shadow] outline-none file:inline-flex file:h-7 file:border-0 file:bg-transparent file:text-sm file:font-medium disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50 md:text-sm",
          // focus & invalid states
          "focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px]",
          "aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive",
          // variant
          variantClasses[variant],
          // user custom class
          className
        )}
        {...props}
      />
    );
  }
);
export { Input };
