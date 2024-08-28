import * as React from "react";
import * as SliderPrimitive from "@radix-ui/react-slider";
import { cn } from "@shared/helpers/tailwind";
import Tooltip from "./Tooltip";

type SliderProps = React.ComponentPropsWithoutRef<typeof SliderPrimitive.Root> & {
  tooltip?: string | React.ReactNode;
};

const Slider = React.forwardRef<React.ElementRef<typeof SliderPrimitive.Root>, SliderProps>(({ className, tooltip, ...props }, ref) => {
  const [tooltipOpen, setTooltipOpen] = React.useState(false);
  return (
    <SliderPrimitive.Root ref={ref} className={cn("relative flex w-full touch-none select-none items-center", className)} {...props}>
      <SliderPrimitive.Track className="bg-gray-6 rounded-item relative h-2 w-full grow overflow-hidden">
        <SliderPrimitive.Range className="bg-accent-8 absolute h-full" />
      </SliderPrimitive.Track>
      <Tooltip.Root open={tooltipOpen}>
        <Tooltip.Trigger asChild>
          <SliderPrimitive.Thumb
            onMouseEnter={() => setTooltipOpen(true)}
            onMouseLeave={() => setTooltipOpen(false)}
            className="bg-accent-9 ring-offset-background border-gray-1 focus-visible:ring-ring rounded-6 block h-5 w-5 border-2 transition-colors focus-visible:outline-none focus-visible:ring-2 disabled:pointer-events-none disabled:opacity-50"
          />
        </Tooltip.Trigger>
        {tooltip && <Tooltip.Content>{tooltip}</Tooltip.Content>}
      </Tooltip.Root>
    </SliderPrimitive.Root>
  );
});
Slider.displayName = SliderPrimitive.Root.displayName;

export { Slider };
