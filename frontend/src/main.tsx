import { StrictMode } from "react";
import { BrowserRouter as Router } from "react-router-dom";
import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import { ThemeProvider } from "@shared/context/ThemeProvider.tsx";
import { AuthProvider } from "@shared/context/AuthProvider.tsx";
import { ToastProvider } from "@radix-ui/react-toast";
import { Toaster } from "@shared/components/primitives/Toaster.tsx";
import { ConfirmationProvider } from "@shared/context/ConfirmationProvider.tsx";
import { ObservabilityProvider } from "@shared/context/ObservabilityProvider.tsx";
import "./index.css";
import "@radix-ui/themes/styles.css";
import "@shared/internationalization/config";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <Router>
      <AuthProvider>
        <ObservabilityProvider>
          <ThemeProvider>
            <ConfirmationProvider>
              <ToastProvider>
                <App />
                <Toaster />
              </ToastProvider>
            </ConfirmationProvider>
          </ThemeProvider>
        </ObservabilityProvider>
      </AuthProvider>
    </Router>
  </StrictMode>,
);
