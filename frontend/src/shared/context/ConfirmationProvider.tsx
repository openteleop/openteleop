import AlertDialog from "@shared/components/primitives/AlertDialog";
import { ButtonVariants } from "@shared/components/primitives/Button";
import React, { ReactElement, createContext, useContext, useEffect, useState } from "react";

interface ConfirmationState {
  title: string | ReactElement;
  description: string | ReactElement;
  onConfirm: () => void;
  onCancel?: () => void;
  confirmText?: string | ReactElement;
  cancelText?: string | ReactElement;
  hideCancel?: boolean;
  variant?: ButtonVariants;
}

const defaultConfirmationState: ConfirmationState = {
  title: "",
  description: "",
  onConfirm: () => console.log("onConfirm not set"),
  onCancel: () => console.log("onCancel not set"),
  confirmText: "",
  cancelText: "",
  hideCancel: false,
  variant: "danger",
};

interface ConfirmationContextProps {
  confirmation: ({ title, description, onConfirm, onCancel, confirmText, cancelText, hideCancel, variant }: ConfirmationState) => void;
}

// Create a default context value for ConfirmationContext to avoid having to initialize the context with undefined
const defaultContext: ConfirmationContextProps = {
  confirmation: () => {},
};

const ConfirmationContext = createContext<ConfirmationContextProps>(defaultContext);

export const ConfirmationProvider: React.FunctionComponent<React.PropsWithChildren<{}>> = ({ children }) => {
  const [confirmationOpen, setConfirmationOpen] = useState<boolean>(false);
  const [confirmationState, setConfirmationState] = useState<ConfirmationState>(defaultConfirmationState);

  const confirmation = (confirmationState: ConfirmationState) => {
    setConfirmationState(confirmationState);
    setConfirmationOpen(true);
  };

  useEffect(() => {
    if (!confirmationOpen) {
      setConfirmationState(defaultConfirmationState);
    }
  }, [confirmationOpen]);

  return (
    <ConfirmationContext.Provider value={{ confirmation }}>
      {children}
      <AlertDialog.Root open={confirmationOpen}>
        <AlertDialog.Content overlay="blur">
          <AlertDialog.Header>
            <AlertDialog.Title>{confirmationState.title}</AlertDialog.Title>
            <AlertDialog.Description>{confirmationState.description}</AlertDialog.Description>
          </AlertDialog.Header>
          <AlertDialog.Footer>
            {!confirmationState.hideCancel && (
              <AlertDialog.Cancel
                onClick={() => {
                  confirmationState.onCancel?.();
                  setConfirmationOpen(false);
                }}
              >
                {confirmationState.cancelText ?? "Cancel"}
              </AlertDialog.Cancel>
            )}
            <AlertDialog.Action
              variant={confirmationState.variant}
              onClick={() => {
                confirmationState.onConfirm();
                setConfirmationOpen(false);
              }}
            >
              {confirmationState.confirmText ?? "Confirm"}
            </AlertDialog.Action>
          </AlertDialog.Footer>
        </AlertDialog.Content>
      </AlertDialog.Root>
    </ConfirmationContext.Provider>
  );
};

export const useConfirmation = () => {
  const context = useContext(ConfirmationContext);
  if (!context) {
    throw new Error("useConfirmation must be used within a ConfirmationContext");
  }
  return context;
};
