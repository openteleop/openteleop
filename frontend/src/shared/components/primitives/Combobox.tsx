import * as React from "react";
import Popover from "./Popover";
import Button from "./Button";
import { Command } from "./Command";
import { isValidUUIDv4 } from "@shared/helpers/uuid";
import { cn } from "@shared/helpers/tailwind";
import Icon from "./Icon";

interface ComboboxContextProps {
  open: boolean;
  setOpen: (open: boolean) => void;
  values: string[];
  onSelect: (value: string) => void;
  keepOpen?: boolean;
}

const defaultContext: ComboboxContextProps = {
  open: false,
  setOpen: () => {},
  values: [],
  onSelect: () => {},
  keepOpen: false,
};

export const ComboboxContext = React.createContext<ComboboxContextProps>(defaultContext);

const ComboboxTrigger = React.forwardRef<React.ElementRef<typeof Button>, React.ComponentPropsWithoutRef<typeof Button>>(
  ({ className, children, ...props }, ref) => {
    const { values: selectedValues } = React.useContext(ComboboxContext);
    const selectedValueText = selectedValues?.length > 0 ? `${selectedValues.length} selected` : null;
    return (
      <Popover.Trigger asChild>
        {children ? (
          children
        ) : (
          <Button
            className={cn("justify-between", selectedValues.length === 0 && "font-light text-gray-11", className)}
            ref={ref}
            {...props}
          >
            <span className="truncate">{selectedValueText ?? "Select..."}</span>
            <Icon icon="chevron-down" />
          </Button>
        )}
      </Popover.Trigger>
    );
  },
);
ComboboxTrigger.displayName = Button.displayName;

const ComboboxContent = React.forwardRef<React.ElementRef<typeof Popover.Content>, React.ComponentPropsWithoutRef<typeof Popover.Content>>(
  ({ className, children, ...props }, ref) => {
    return (
      <Popover.Content className={cn("w-full p-0", className)} ref={ref} {...props}>
        <Command.Root
          filter={(value, search, keywords) => {
            const extendValue = (isValidUUIDv4(value) ? "" : value) + " " + keywords?.join(" ");
            if (extendValue.trim().toLocaleLowerCase().includes(search.trim().toLowerCase())) return 1;
            return 0;
          }}
        >
          <Command.Input placeholder="Search..." className="!h-rx-7 text-2" />
          <Command.List className="py-[2px]">
            <Command.Empty>
              <span className="text-2 italic text-gray-11">No Results found.</span>
            </Command.Empty>
            {children}
          </Command.List>
        </Command.Root>
      </Popover.Content>
    );
  },
);
ComboboxContent.displayName = Popover.Content.displayName;

const ComboboxItem = React.forwardRef<React.ElementRef<typeof Command.Item>, React.ComponentPropsWithoutRef<typeof Command.Item>>(
  ({ className, value, onSelect, children, ...props }, ref) => {
    const { values: selectedValues, onSelect: onSelectContext, keepOpen, setOpen } = React.useContext(ComboboxContext);
    return (
      <Command.Item
        ref={ref}
        value={value}
        onSelect={(currentValue) => {
          onSelectContext(currentValue);
          onSelect?.(currentValue);
          if (!keepOpen) setOpen(false);
        }}
        className={cn("h-8", className)}
        {...props}
      >
        <span className="truncate">{children}</span>
        {value && selectedValues.includes(value) && <Icon icon="check" className="ml-auto pr-1" />}
      </Command.Item>
    );
  },
);
ComboboxItem.displayName = Command.Item.displayName;

const ComboboxRoot = ({
  children,
  values,
  onSelect,
  keepOpen,
}: {
  children: React.ReactNode;
  values: string[];
  onSelect: (value: string) => void;
  keepOpen?: boolean;
}) => {
  const [open, setOpen] = React.useState<boolean>(false);

  return (
    <ComboboxContext.Provider value={{ open, setOpen, values, onSelect, keepOpen: keepOpen ?? false }}>
      <Popover.Root open={open} onOpenChange={setOpen}>
        {children}
      </Popover.Root>
    </ComboboxContext.Provider>
  );
};
ComboboxRoot.displayName = Popover.Root.displayName;

const Combobox = Object.assign(ComboboxRoot, {
  Root: ComboboxRoot,
  Trigger: ComboboxTrigger,
  Content: ComboboxContent,
  Item: ComboboxItem,
});

export default Combobox;
