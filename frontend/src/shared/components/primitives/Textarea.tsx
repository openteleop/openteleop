import * as React from "react";
import { cn } from "@shared/helpers/tailwind";

export interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  onValueChange?: (value: string) => void;
  validationState?: "valid" | "invalid" | "warning" | undefined;
}

const validationStateClasses = {
  valid: "border-green-8",
  invalid: "border-red-8",
  warning: "border-amber-8",
};

const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(({ className, onValueChange, validationState, ...props }, ref) => {
  return (
    <textarea
      className={cn(
        "rounded-3 border-gray-6 bg-panel px-rx-2 py-rx-2 text-2 placeholder:text-gray-8 focus-visible:border-gray-8 hover:border-gray-8 flex min-h-[90px] w-full border focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-50",
        className,
        validationState && `border ${validationStateClasses[validationState]}`,
      )}
      ref={ref}
      onChange={(e) => {
        if (onValueChange) onValueChange(e.target.value);
        if (props.onChange) props.onChange(e);
      }}
      {...props}
    />
  );
});
Textarea.displayName = "Textarea";

export { Textarea };
