import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";
import Tooltip from "./Tooltip";
import { cn } from "@shared/helpers/tailwind";
import { useTheme } from "@shared/context/ThemeProvider";
import Loader from "./Loader";

export type ButtonVariants = "ghost" | "primary" | "secondary" | "outline" | "danger" | "success" | "warning" | "link";

export const buttonVariants = cva(
  "inline-flex items-center justify-center whitespace-nowrap rounded-item text-sm font-medium ring-offset-white transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-serial-palette-600 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 gap-rx-2",
  {
    variants: {
      variant: {
        ghost: "bg-transparent hover:bg-gray-3 hover:text-gray-11",
        primary: "bg-accent-9 hover:bg-accent-10",
        secondary: "bg-accent-3 text-accent-9 border border-accent-7 hover:bg-accent-4 hover:border-accent-8",
        outline: "bg-panel text-gray-11 border border-gray-6 hover:bg-gray-3",
        danger: "bg-red-9 hover:bg-red-10 text-whiteA-12",
        success: "bg-green-9 hover:bg-green-10 text-whiteA-12",
        warning: "bg-amber-9 hover:bg-amber-10",
        link: "text-gray-9 underline-offset-4 hover:underline",
      },
      size: {
        xs: "px-rx-2 h-rx-4 !text-1",
        sm: "px-rx-3 h-rx-5 !text-1",
        md: "px-rx-3 h-rx-6 !text-2",
        lg: "px-rx-4 h-rx-7 !text-3",
        xl: "px-rx-5 h-rx-8 !text-4",
        icon: "w-rx-6 h-rx-6 !text-3",
      },
    },
    defaultVariants: {
      variant: "primary",
      size: "md",
    },
  },
);

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement>, VariantProps<typeof buttonVariants> {
  tooltip?: string | React.ReactNode;
  asChild?: boolean;
  isLoading?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, tooltip, variant = "primary", size = "md", asChild = false, disabled, isLoading, ...props }, ref) => {
    const Comp = asChild ? Slot : "button";

    const { theme } = useTheme();
    // Per https://www.radix-ui.com/colors/docs/palette-composition/understanding-the-scale#steps-910-solid-backgrounds
    // The following colors require dark text on a primary background to meet accessibility standards
    const darkTextOnPrimary = React.useMemo(() => {
      return ["sky", "mint", "lime", "yellow", "amber"].includes(theme.accent_color);
    }, [theme.accent_color]);

    if (tooltip)
      return (
        <Tooltip.Root>
          <Tooltip.Trigger asChild>
            <Comp
              className={cn(
                variant === "primary" ? (darkTextOnPrimary ? "text-blackA-12" : "text-whiteA-12") : "",
                buttonVariants({ variant, size }),
                className,
              )}
              ref={ref}
              disabled={disabled || isLoading}
              {...props}
            >
              {isLoading ? <Loader size={size === "xl" ? "sm" : "xs"} /> : props.children}
            </Comp>
          </Tooltip.Trigger>
          <Tooltip.Content>{tooltip}</Tooltip.Content>
        </Tooltip.Root>
      );
    return (
      <Comp
        className={cn(
          variant === "primary" ? (darkTextOnPrimary ? "text-blackA-12" : "text-whiteA-12") : "",
          buttonVariants({ variant, size }),
          className,
        )}
        ref={ref}
        disabled={disabled || isLoading}
        {...props}
      >
        {isLoading ? <Loader size={size === "xl" ? "sm" : "xs"} /> : props.children}
      </Comp>
    );
  },
);
Button.displayName = "Button";

export default Button;
