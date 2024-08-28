import * as React from "react";
import * as ToastPrimitives from "@radix-ui/react-toast";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@shared/helpers/tailwind";
import Button from "./Button";
import Icon from "./Icon";

const ToastLocalProvider = ToastPrimitives.Provider;

const ToastViewport = React.forwardRef<
  React.ElementRef<typeof ToastPrimitives.Viewport>,
  React.ComponentPropsWithoutRef<typeof ToastPrimitives.Viewport>
>(({ className, ...props }, ref) => (
  <ToastPrimitives.Viewport
    ref={ref}
    className={cn(
      "fixed top-0 z-[100] flex max-h-screen w-full flex-col-reverse p-4 sm:bottom-0 sm:right-0 sm:top-auto sm:flex-col md:max-w-[420px]",
      className,
    )}
    {...props}
  />
));
ToastViewport.displayName = ToastPrimitives.Viewport.displayName;

const toastVariants = cva(
  "group pointer-events-auto relative flex w-full items-end justify-between space-x-4 overflow-hidden rounded-3 border border-gray-6 p-rx-4 shadow-3 transition-all data-[swipe=cancel]:translate-x-0 data-[swipe=end]:translate-x-[var(--radix-toast-swipe-end-x)] data-[swipe=move]:translate-x-[var(--radix-toast-swipe-move-x)] data-[swipe=move]:transition-none data-[state=open]:animate-in data-[state=closed]:animate-out data-[swipe=end]:animate-out data-[state=closed]:fade-out-80 data-[state=closed]:slide-out-to-right-full data-[state=open]:slide-in-from-top-full data-[state=open]:sm:slide-in-from-bottom-full",
  {
    variants: {
      variant: {
        default: "border bg-panel text-gray-12",
        danger: "danger group border-red-7 bg-red-3 text-red-11",
        success: "success group border-green-7 bg-green-3 text-green-11",
        warning: "warning group border-amber-7 bg-amber-3 text-amber-11",
        info: "info group border-blue-7 bg-blue-3 text-blue-11",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  },
);

const ToastRoot = React.forwardRef<
  React.ElementRef<typeof ToastPrimitives.Root>,
  React.ComponentPropsWithoutRef<typeof ToastPrimitives.Root> & VariantProps<typeof toastVariants>
>(({ className, variant, ...props }, ref) => {
  return <ToastPrimitives.Root ref={ref} className={cn(toastVariants({ variant }), className)} {...props} />;
});
ToastRoot.displayName = ToastPrimitives.Root.displayName;

const ToastAction = React.forwardRef<
  React.ElementRef<typeof ToastPrimitives.Action>,
  React.ComponentPropsWithoutRef<typeof ToastPrimitives.Action>
>(({ className, ...props }, ref) => (
  <ToastPrimitives.Action
    ref={ref}
    className={cn(
      "ring-offset-white inline-flex h-rx-6 shrink-0 items-center justify-center rounded-item border border-gray-6 bg-transparent px-rx-2 text-2 font-medium transition-colors hover:bg-gray-3 focus:outline-none focus:ring-2 focus:ring-gray-8 focus:ring-offset-2 disabled:pointer-events-none disabled:opacity-50",
      "group-[.danger]:border-red-7 group-[.danger]:text-red-11 group-[.danger]:hover:border-red-8 group-[.danger]:hover:bg-red-4 group-[.danger]:focus:ring-red-6",
      "group-[.success]:border-green-7 group-[.success]:text-green-11 group-[.success]:hover:border-green-8 group-[.success]:hover:bg-green-4 group-[.success]:focus:ring-green-6",
      "group-[.warning]:border-amber-7 group-[.warning]:text-amber-11 group-[.warning]:hover:border-amber-8 group-[.warning]:hover:bg-amber-4 group-[.warning]:focus:ring-amber-6",
      "group-[.info]:border-blue-7 group-[.info]:text-blue-11 group-[.info]:hover:border-blue-8 group-[.info]:hover:bg-blue-4 group-[.info]:focus:ring-blue-6",
      className,
    )}
    {...props}
  />
));
ToastAction.displayName = ToastPrimitives.Action.displayName;

const ToastClose = React.forwardRef<
  React.ElementRef<typeof ToastPrimitives.Close>,
  React.ComponentPropsWithoutRef<typeof ToastPrimitives.Close>
>(({ className, ...props }, ref) => (
  <ToastPrimitives.Close ref={ref} asChild {...props} className="absolute right-rx-1 top-rx-1 opacity-0 group-hover:opacity-100">
    <Button
      size="sm"
      variant="ghost"
      className="h-rx-5 w-rx-5 group-[.danger]:hover:bg-red-4 group-[.info]:hover:bg-blue-4 group-[.success]:hover:bg-green-4 group-[.warning]:hover:bg-amber-4 group-[.danger]:hover:text-red-11 group-[.info]:hover:text-blue-11 group-[.success]:hover:text-green-11 group-[.warning]:hover:text-amber-11"
      aria-label="Close toast"
    >
      <Icon icon="times" />
    </Button>
  </ToastPrimitives.Close>
));
ToastClose.displayName = ToastPrimitives.Close.displayName;

const ToastTitle = React.forwardRef<
  React.ElementRef<typeof ToastPrimitives.Title>,
  React.ComponentPropsWithoutRef<typeof ToastPrimitives.Title>
>(({ className, ...props }, ref) => <ToastPrimitives.Title ref={ref} className={cn("text-3 font-bold", className)} {...props} />);
ToastTitle.displayName = ToastPrimitives.Title.displayName;

const ToastDescription = React.forwardRef<
  React.ElementRef<typeof ToastPrimitives.Description>,
  React.ComponentPropsWithoutRef<typeof ToastPrimitives.Description>
>(({ className, ...props }, ref) => <ToastPrimitives.Description ref={ref} className={cn("text-2 opacity-90", className)} {...props} />);
ToastDescription.displayName = ToastPrimitives.Description.displayName;

export type ToastProps = React.ComponentPropsWithoutRef<typeof Toast>;

export type ToastActionElement = React.ReactElement<typeof ToastAction>;

const Toast = Object.assign(ToastRoot, {
  Root: ToastRoot,
  Action: ToastAction,
  Close: ToastClose,
  Title: ToastTitle,
  Description: ToastDescription,
  LocalProvider: ToastLocalProvider,
  Viewport: ToastViewport,
});

export default Toast;
