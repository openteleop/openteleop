import * as React from "react";
import * as SwitchPrimitives from "@radix-ui/react-switch";
import { cn } from "@shared/helpers/tailwind";

interface SwitchProps extends React.ComponentPropsWithoutRef<typeof SwitchPrimitives.Root> {
  size?: "sm" | "lg";
}

const sizeClasses = {
  sm: { root: "w-[30px] h-[14px]", thumb: "h-[14px] w-[14px] data-[state=checked]:translate-x-[16px]" },
  lg: { root: "w-[42px] h-[20px]", thumb: "h-[20px] w-[20px] data-[state=checked]:translate-x-[22px] " },
};

const Switch = React.forwardRef<React.ElementRef<typeof SwitchPrimitives.Root>, SwitchProps>(
  ({ className, size = "lg", ...props }, ref) => (
    <SwitchPrimitives.Root
      className={cn(
        "focus-visible:ring-gray-3 data-[state=checked]:bg-gray-12 data-[state=unchecked]:bg-gray-3 rounded-item focus-visible:ring-offset-panel data-[state=checked]:outline-gray-12 data-[state=unchecked]:outline-gray-3 peer inline-flex shrink-0 cursor-pointer items-center outline outline-[3px] transition-colors focus-visible:ring-2 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50",
        sizeClasses[size].root,
        className,
      )}
      {...props}
      ref={ref}
    >
      <SwitchPrimitives.Thumb
        className={cn(
          "rounded-item bg-panel pointer-events-none block translate-x-0 border-none shadow-lg ring-0 transition-transform data-[state=unchecked]:translate-x-0",
          sizeClasses[size].thumb,
        )}
      />
    </SwitchPrimitives.Root>
  ),
);
Switch.displayName = SwitchPrimitives.Root.displayName;

export default Switch;
