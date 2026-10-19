import * as React from "react";
import { cn } from "@/lib/utils";

const Badge = ({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) => (
  <div
    className={cn(
      "inline-flex w-fit items-center rounded-full border border-primary/30 px-2.5 py-0.5 text-xs font-semibold text-primary",
      className,
    )}
    {...props}
  />
);

export { Badge };
