import React from "react";
import { cn } from "@/lib/utils";

type GradientCardProps = {
  children: React.ReactNode;
  className?: string;
  gradient?: string;
  padding?: number;
  radius?: number;
};

export function GradientCard({
  children,
  className,
  gradient,
  radius = 20,
  padding = 4,
}: GradientCardProps) {
  return (
    <div
      className={cn("gradient-border", className)}
      style={
        {
          "--border-gradient": gradient,
          "--radius": `${radius}px`,
          "--padding": `${padding}px`,
        } as React.CSSProperties
      }
    >
      <div className="relative z-10 flex flex-col h-full ">{children}</div>
    </div>
  );
}
