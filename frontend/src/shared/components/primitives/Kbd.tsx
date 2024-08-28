import { cn } from "@shared/helpers/tailwind";
import { ComponentPropsWithoutRef, forwardRef } from "react";

interface KbdProps extends ComponentPropsWithoutRef<"div"> {
  variant?: "dark" | "light";
}

const Kbd = forwardRef<HTMLDivElement, KbdProps>(({ variant = "light", className, ...props }, ref) => {
  return (
    <div
      ref={ref}
      className={cn(
        "gap-rx-1 rounded-2 px-rx-1 flex items-center whitespace-nowrap border pt-[1px] font-medium not-italic drop-shadow-sm",
        variant === "dark" ? "border-gray-10 bg-gray-11 text-gray-6" : "border-gray-3 bg-panel-solid text-gray-11",
        className,
      )}
      {...props}
    />
  );
});

export default Kbd;
