import { cn } from "@shared/helpers/tailwind";
import React from "react";

const SettingsTileRoot = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(({ className, ...props }, ref) => {
  return (
    <div ref={ref} className={cn("border-gray-6 rounded-3 bg-panel flex w-full flex-col overflow-clip border", className)} {...props} />
  );
});

interface SettingsTileSectionProps extends React.HTMLAttributes<HTMLDivElement> {
  heading: string;
}

const SettingsTileSection = React.forwardRef<HTMLDivElement, SettingsTileSectionProps>(
  ({ heading, className, children, ...props }, ref) => {
    return (
      <div ref={ref} className={cn("p-rx-5 border-gray-6 flex w-full border-b last:border-none", className)} {...props}>
        <div className="text-3 h-full w-64 shrink-0 font-medium">{heading}</div>
        <div className="gap-rx-5 flex min-h-0 min-w-0 flex-grow flex-col">{children}</div>
      </div>
    );
  },
);

const SettingsTile = Object.assign(SettingsTileRoot, {
  Root: SettingsTileRoot,
  Section: SettingsTileSection,
});

export default SettingsTile;
