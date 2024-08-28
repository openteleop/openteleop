import * as React from "react";
import { Command as CommandPrimitive } from "cmdk";
import { cn } from "@shared/helpers/tailwind";
import Icon from "./Icon";

const CommandRoot = React.forwardRef<React.ElementRef<typeof CommandPrimitive>, React.ComponentPropsWithoutRef<typeof CommandPrimitive>>(
  ({ className, ...props }, ref) => (
    <CommandPrimitive
      ref={ref}
      className={cn("rounded-3 bg-panel-solid text-gray-12 flex h-full w-full flex-col overflow-hidden ", className)}
      {...props}
    />
  ),
);
CommandRoot.displayName = CommandPrimitive.displayName;

const CommandInput = React.forwardRef<
  React.ElementRef<typeof CommandPrimitive.Input>,
  React.ComponentPropsWithoutRef<typeof CommandPrimitive.Input>
>(({ className, ...props }, ref) => (
  <div className="flex w-full items-center gap-3 px-3" cmdk-input-wrapper="">
    <Icon icon="search" className="text-gray-10" />
    <CommandPrimitive.Input
      ref={ref}
      className={cn(
        "h-rx-8 py-rx-2 placeholder:text-gray-10 text-3 flex w-full rounded-md bg-transparent text-sm outline-none disabled:cursor-not-allowed disabled:opacity-50 ",
        className,
      )}
      {...props}
    />
  </div>
));

CommandInput.displayName = CommandPrimitive.Input.displayName;

const CommandList = React.forwardRef<
  React.ElementRef<typeof CommandPrimitive.List>,
  React.ComponentPropsWithoutRef<typeof CommandPrimitive.List>
>(({ className, ...props }, ref) => (
  <CommandPrimitive.List
    ref={ref}
    className={cn("border-gray-6 px-rx-1 max-h-[400px] overflow-y-auto overflow-x-hidden border-t", className)}
    {...props}
  />
));

CommandList.displayName = CommandPrimitive.List.displayName;

const CommandEmpty = React.forwardRef<
  React.ElementRef<typeof CommandPrimitive.Empty>,
  React.ComponentPropsWithoutRef<typeof CommandPrimitive.Empty>
>((props, ref) => <CommandPrimitive.Empty ref={ref} className="py-rx-4 text-3 text-center" {...props} />);

CommandEmpty.displayName = CommandPrimitive.Empty.displayName;

const CommandGroup = React.forwardRef<
  React.ElementRef<typeof CommandPrimitive.Group>,
  React.ComponentPropsWithoutRef<typeof CommandPrimitive.Group>
>(({ className, ...props }, ref) => (
  <CommandPrimitive.Group ref={ref} className={cn("text-gray-12 text-1 p-rx-1 py-rx-2 overflow-hidden", className)} {...props} />
));

CommandGroup.displayName = CommandPrimitive.Group.displayName;

const CommandSeparator = React.forwardRef<
  React.ElementRef<typeof CommandPrimitive.Separator>,
  React.ComponentPropsWithoutRef<typeof CommandPrimitive.Separator>
>(({ className, ...props }, ref) => <CommandPrimitive.Separator ref={ref} className={cn("bg-gray-3 -mx-1 h-px ", className)} {...props} />);
CommandSeparator.displayName = CommandPrimitive.Separator.displayName;

const CommandItem = React.forwardRef<
  React.ElementRef<typeof CommandPrimitive.Item>,
  React.ComponentPropsWithoutRef<typeof CommandPrimitive.Item>
>(({ className, ...props }, ref) => (
  <CommandPrimitive.Item
    ref={ref}
    className={cn(
      "gap-rx-2 text-2 aria-selected:bg-gray-3 aria-selected:text-gray-12 rounded-1 relative my-0.5 flex cursor-default select-none items-center px-2 py-1.5 outline-none data-[disabled=true]:pointer-events-none data-[disabled=true]:opacity-50 ",
      className,
    )}
    {...props}
  />
));

CommandItem.displayName = CommandPrimitive.Item.displayName;

const CommandShortcut = ({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) => {
  return <span className={cn("text-gray-11 ml-auto text-xs tracking-widest", className)} {...props} />;
};
CommandShortcut.displayName = "CommandShortcut";

export const Command = Object.assign(CommandRoot, {
  Root: CommandRoot,
  Input: CommandInput,
  List: CommandList,
  Empty: CommandEmpty,
  Group: CommandGroup,
  Item: CommandItem,
  Shortcut: CommandShortcut,
  Separator: CommandSeparator,
});
