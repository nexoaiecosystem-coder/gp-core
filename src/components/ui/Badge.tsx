import { cn } from "@/lib/utils";
import { HTMLAttributes } from "react";

export function Badge({ className, ...props }: HTMLAttributes<HTMLSpanElement>) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full bg-brand-soft px-2.5 py-1 text-xs font-medium text-brand-strong",
        className
      )}
      {...props}
    />
  );
}
