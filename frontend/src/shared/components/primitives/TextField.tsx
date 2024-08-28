import { cn } from "@shared/helpers/tailwind";
import { SizeProp } from "@shared/types/size";
import React, { InputHTMLAttributes, createContext, forwardRef, useContext, useEffect, useRef, useState } from "react";

const sizeClasses = {
  xs: "px-rx-1 h-rx-4 !text-1",
  sm: "px-rx-1 h-rx-5 !text-1",
  md: "px-rx-2 h-rx-6 !text-2",
  lg: "px-rx-3 h-rx-7 !text-3",
  xl: "px-rx-3 h-rx-8 !text-4",
};

const TextFieldContext = createContext<{
  handleSetInputRef: (inputElement: HTMLInputElement) => void;
}>({
  handleSetInputRef: () => {},
});

interface TextFieldProps extends InputHTMLAttributes<HTMLInputElement> {
  className?: string;
  onValueChange?: (value: string) => void;
  validationState?: "valid" | "invalid" | "warning" | undefined;
  children?: React.ReactNode;
  inputSize?: SizeProp;
}

const validationStateClasses = {
  valid: "border-green-8",
  invalid: "border-red-8",
  warning: "border-amber-8",
};

const getBorderClasses = (validationState: "valid" | "invalid" | "warning" | undefined, isFocused: boolean, disabled?: boolean) => {
  if (isFocused) return "border border-gray-8";
  if (!validationState || disabled) return "border border-gray-6 hover:border-gray-8";
  return `border ${validationStateClasses[validationState]}`;
};

const TextFieldRoot = forwardRef<HTMLDivElement, TextFieldProps>(
  ({ children, className, onValueChange, validationState, inputSize = "md", disabled, ...props }, ref) => {
    const [inputRef, setInputRef] = useState<HTMLInputElement | null>(null);
    const [isFocused, setIsFocused] = useState(false); // Add this line to track focus state

    const handleSetInputRef = (inputElement: HTMLInputElement) => {
      setInputRef(inputElement);
      inputRef?.removeEventListener("focus", handleFocus);
      inputRef?.removeEventListener("blur", handleBlur);

      if (inputElement) {
        inputElement.addEventListener("focus", handleFocus);
        inputElement.addEventListener("blur", handleBlur);
      }
    };

    const handleFocus = () => setIsFocused(true);
    const handleBlur = () => setIsFocused(false);

    useEffect(() => {
      return () => {
        inputRef?.removeEventListener("focus", handleFocus);
        inputRef?.removeEventListener("blur", handleBlur);
      };
    }, [inputRef]);

    return (
      <TextFieldContext.Provider value={{ handleSetInputRef }}>
        <div
          ref={ref}
          className={cn(
            "bg-panel rounded-item py-rx-1 flex items-center",
            getBorderClasses(validationState, isFocused, disabled),
            sizeClasses[inputSize],
            disabled && "pointer-events-none opacity-50",
            !children && "!px-0",
            className,
          )}
          {...props}
          onClick={() => inputRef?.focus()}
        >
          {!children && <TextFieldInput inputSize={inputSize} onValueChange={onValueChange} validationState={validationState} {...props} />}
          {children}
        </div>
      </TextFieldContext.Provider>
    );
  },
);

interface TextFieldInputProps extends InputHTMLAttributes<HTMLInputElement> {
  validationState?: "valid" | "invalid" | "warning";
  className?: string;
  onValueChange?: (value: string) => void;
  inputSize?: SizeProp;
}

const TextFieldInput = forwardRef<HTMLInputElement, TextFieldInputProps>(
  ({ validationState, className, onValueChange, inputSize = "md", ...props }, ref) => {
    const { handleSetInputRef } = useContext(TextFieldContext);
    const internalRef = useRef<HTMLInputElement>(null);
    const ariaInvalid = validationState === "invalid" ? true : undefined;

    // Effect hook to update the context's input ref whenever the internal ref changes or the component re-renders
    useEffect(() => {
      if (typeof ref === "function") {
        ref(internalRef.current);
      } else if (ref && typeof ref === "object") {
        ref.current = internalRef.current;
      }

      if (internalRef.current) handleSetInputRef(internalRef.current);
    }, [ref]);

    return (
      <input
        ref={internalRef}
        {...props}
        aria-invalid={ariaInvalid}
        onChange={(e) => {
          if (onValueChange) onValueChange(e.target.value);
          if (props.onChange) props.onChange(e);
        }}
        className={cn("w-full border-none bg-transparent outline-none", sizeClasses[inputSize], className)}
      />
    );
  },
);

const TextFieldSlot = forwardRef<HTMLDivElement, React.HTMLProps<HTMLDivElement>>(({ children, className, ...props }, ref) => {
  return (
    <div ref={ref} className={cn("flex items-center", className)} {...props}>
      {children}
    </div>
  );
});

const TextField = Object.assign(TextFieldRoot, {
  Root: TextFieldRoot,
  Input: TextFieldInput,
  Slot: TextFieldSlot,
});

export default TextField;
