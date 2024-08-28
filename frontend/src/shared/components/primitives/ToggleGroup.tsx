import { ButtonHTMLAttributes, useMemo } from "react";
import { useTheme } from "../../context/ThemeProvider";
import { SizeProp } from "@shared/types/size";
import * as ToggleGroupRadix from "@radix-ui/react-toggle-group";
import { cn } from "@shared/helpers/tailwind";
import Tooltip from "./Tooltip";
import Icon from "./Icon";

interface ToggleGroupProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  value: string;
  onValueChange: (value: string) => void;
  size: SizeProp;
  selectedAppearance: "flat" | "primary" | "secondary" | "plain";
  defaultAppearance: "flat" | "primary" | "secondary" | "plain";
  options: {
    value: string;
    icon: string;
    label?: string;
    tooltip?: string | React.ReactNode;
  }[];
  className?: string;
}

const sizeClasses = {
  xs: "px-rx-3 h-rx-5 !text-1",
  sm: "px-rx-4 h-rx-6 !text-2",
  md: "px-rx-4 h-rx-6 !text-3",
  lg: "px-rx-5 h-rx-7 !text-4",
  xl: "px-rx-6 h-rx-8 !text-5",
};

const appearanceClasses = {
  flat: "bg-transparent hover:bg-gray-3 hover:text-gray-11",
  primary: "bg-accent-11 hover:bg-accent-10",
  secondary: "bg-accent-2 text-accent-9 border border-accent-7 hover:bg-accent-3 hover:border-accent-8",
  plain: "bg-white text-gray-11 border border-gray-6 hover:bg-gray-3",
};

const getAppearanceClasses = (appearance: "flat" | "primary" | "secondary" | "plain", darkTextOnPrimary: boolean) => {
  if (appearance === "primary") return `${appearanceClasses[appearance]} ${darkTextOnPrimary ? "text-blackA-12" : "text-whiteA-12"}`;
  return appearanceClasses[appearance];
};

const ToggleGroup = ({ value, onValueChange, size, selectedAppearance, defaultAppearance, options, className = "" }: ToggleGroupProps) => {
  const { theme } = useTheme();
  // Per https://www.radix-ui.com/colors/docs/palette-composition/understanding-the-scale#steps-910-solid-backgrounds
  // The following colors require dark text on a primary background to meet accessibility standards
  const darkTextOnPrimary = useMemo(() => {
    return ["sky", "mint", "lime", "yellow", "amber"].includes(theme.accent_color);
  }, [theme.accent_color]);
  return (
    <ToggleGroupRadix.Root className="flex" type="single" value={value} onValueChange={onValueChange} aria-label="Text alignment">
      {options.map((option, index) => (
        <ToggleGroupRadix.Item
          key={index}
          value={option.value}
          className={cn(
            "flex items-center justify-center gap-rx-2 font-medium transition duration-150 ease-in-out first:rounded-l-item last:rounded-r-item",
            sizeClasses[size],
            getAppearanceClasses(value === option.value ? selectedAppearance : defaultAppearance, darkTextOnPrimary),
            className,
          )}
          aria-label={option.label}
        >
          {option.tooltip ? (
            <Tooltip.Root>
              <Tooltip.Trigger asChild>
                <Icon icon={option.icon} />
              </Tooltip.Trigger>
              <Tooltip.Content>{option.tooltip}</Tooltip.Content>
            </Tooltip.Root>
          ) : (
            <Icon icon={option.icon} />
          )}
        </ToggleGroupRadix.Item>
      ))}
    </ToggleGroupRadix.Root>
  );
};

export default ToggleGroup;
