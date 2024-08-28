import { SizeProp } from "../../types/size";
import { cn } from "../../helpers/tailwind";
import React from "react";

const sizeClasses: Record<SizeProp, string> = {
  xs: "px-rx-2 h-rx-3 !text-1",
  sm: "px-rx-3 h-rx-4 !text-2",
  md: "px-rx-3 h-rx-5 !text-2",
  lg: "px-rx-4 h-rx-6 !text-3",
  xl: "px-rx-5 h-rx-7 !text-4",
};

const badgeVariants = {
  default: "bg-gray-12 text-panel",
  outline: "bg-panel text-gray-11 border border-gray-6",
  info: "bg-blue-9 text-panel",
  success: "bg-green-9 text-panel",
  warning: "bg-amber-9 text-panel",
  danger: "bg-red-9 text-panel",
};

export type BadgeVariant = keyof typeof badgeVariants;

interface BadgeProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: keyof typeof badgeVariants;
  size?: SizeProp;
}

const Badge = React.forwardRef<HTMLDivElement, BadgeProps>(({ variant = "default", size = "md", className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn("flex w-fit items-center justify-center rounded-2", sizeClasses[size], badgeVariants[variant], className)}
    {...props}
  />
));

export default Badge;
