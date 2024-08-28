import * as React from "react";
import * as DialogPrimitive from "@radix-ui/react-dialog";
import { cn } from "@shared/helpers/tailwind";
import { useTheme } from "@shared/context/ThemeProvider";
import Icon from "./Icon";
import Button from "./Button";

const ModalRoot = DialogPrimitive.Root;

const ModalTrigger = DialogPrimitive.Trigger;

const ModalPortal = DialogPrimitive.Portal;

const ModalClose = DialogPrimitive.Close;

const ModalDescription = DialogPrimitive.Description;

interface ModalOverlayProps extends React.ComponentPropsWithoutRef<typeof DialogPrimitive.Overlay> {
  overlay?: "dark" | "blur";
}

const ModalOverlay = React.forwardRef<React.ElementRef<typeof DialogPrimitive.Overlay>, ModalOverlayProps>(
  ({ overlay = "dark", className, ...props }, ref) => (
    <DialogPrimitive.Overlay
      ref={ref}
      className={cn(
        "data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 fixed inset-0 z-50",
        overlay === "dark" && " bg-[rgba(0,0,0,0.4)]",
        overlay === "blur" && "backdrop-blur-sm",
        className,
      )}
      {...props}
    />
  ),
);
ModalOverlay.displayName = DialogPrimitive.Overlay.displayName;

interface ModalContentProps extends React.ComponentPropsWithoutRef<typeof DialogPrimitive.Content> {
  overlay?: "dark" | "blur";
}

const ModalContent = React.forwardRef<React.ElementRef<typeof DialogPrimitive.Content>, ModalContentProps>(
  ({ overlay, className, children, ...props }, ref) => {
    const { portalContainer } = useTheme();
    return (
      <ModalPortal container={portalContainer}>
        <ModalOverlay overlay={overlay} />
        <DialogPrimitive.Content
          ref={ref}
          className={cn(
            "data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[state=closed]:slide-out-to-left-1/2 data-[state=closed]:slide-out-to-top-[48%] data-[state=open]:slide-in-from-left-1/2 data-[state=open]:slide-in-from-top-[48%] fixed left-[50%] top-[50%] z-50 grid w-full max-w-lg translate-x-[-50%] translate-y-[-50%] rounded-3 border border-gray-6 bg-panel shadow-4 duration-200",
            className,
          )}
          {...props}
        >
          {children}
        </DialogPrimitive.Content>
      </ModalPortal>
    );
  },
);
ModalContent.displayName = DialogPrimitive.Content.displayName;

const ModalHeader = ({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) => (
  <div className={cn("flex h-rx-8 w-full items-center justify-between border-b border-gray-6 pl-rx-4 pr-rx-3", className)} {...props} />
);
ModalHeader.displayName = "ModalHeader";

const ModalHeaderClose = ({ className }: React.HTMLAttributes<HTMLDivElement>) => (
  <DialogPrimitive.Close
    tabIndex={-1}
    className={cn(
      "data-[state=open]:bg-serial-palette-100 data-[state=open]:text-serial-palette-500 ring-offset-white h-rx-5 w-rx-5 rounded-5 opacity-50 transition-opacity hover:opacity-100 focus:opacity-100 focus:outline-none disabled:pointer-events-none",
      className,
    )}
    asChild
  >
    <Button size="icon" variant="ghost">
      <Icon icon="times" />
      <span className="sr-only">Close</span>
    </Button>
  </DialogPrimitive.Close>
);
ModalHeaderClose.displayName = "ModalHeaderClose";

const ModalFooter = ({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) => (
  <div
    className={cn("flex h-rx-8 w-full flex-row-reverse items-center justify-between border-t border-gray-6 px-rx-3", className)}
    {...props}
  />
);
ModalFooter.displayName = "ModalFooter";

const ModalMain = ({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) => (
  <div className={cn("flex flex-col px-rx-3 py-rx-2", className)} {...props} />
);
ModalMain.displayName = "ModalMain";

const ModalTitle = React.forwardRef<
  React.ElementRef<typeof DialogPrimitive.Title>,
  React.ComponentPropsWithoutRef<typeof DialogPrimitive.Title>
>(({ className, ...props }, ref) => <DialogPrimitive.Title ref={ref} className={cn("font-bold text-gray-12", className)} {...props} />);
ModalTitle.displayName = DialogPrimitive.Title.displayName;

const Modal = Object.assign(ModalRoot, {
  Root: ModalRoot,
  Portal: ModalPortal,
  Overlay: ModalOverlay,
  Close: ModalClose,
  HeaderClose: ModalHeaderClose,
  Trigger: ModalTrigger,
  Content: ModalContent,
  Main: ModalMain,
  Header: ModalHeader,
  Footer: ModalFooter,
  Title: ModalTitle,
  Description: ModalDescription,
});

export default Modal;
