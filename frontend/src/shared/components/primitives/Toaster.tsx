import Toast from "@shared/components/primitives/Toast";
import { useToast } from "@shared/context/ToastProvider";

export function Toaster() {
  const { toasts } = useToast();

  return (
    <Toast.LocalProvider>
      {toasts.map(function ({ id, title, description, action, ...props }) {
        return (
          <Toast.Root key={id} {...props} className="mt-rx-3">
            <div className="grid gap-rx-1">
              {title && <Toast.Title>{title}</Toast.Title>}
              {description && <Toast.Description>{description}</Toast.Description>}
            </div>
            {action}
            <Toast.Close />
          </Toast.Root>
        );
      })}
      <Toast.Viewport />
    </Toast.LocalProvider>
  );
}
