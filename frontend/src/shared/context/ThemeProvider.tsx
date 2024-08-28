import { createContext, useContext, ReactNode, useState, useRef, useEffect } from "react";
import { Theme } from "@radix-ui/themes";
import { useNavigate } from "react-router-dom";
import { useAuth } from "./AuthProvider";
import { updateCompany } from "@shared/connections/database";
import { useToast } from "./ToastProvider";
import { deleteStorageObject, insertStorageObject } from "@shared/connections/storage";
import { CompanyTheme } from "@shared/types/global/company";
import ThemePanel from "@shared/components/ThemePanel";
import { useDarkMode } from "@shared/hooks/useDarkMode";

interface ThemeInterface {
  theme: CompanyTheme;
  setTheme: (theme: Partial<CompanyTheme>) => Promise<void>;
  handleUploadLogo: (file: File | undefined, appearance: "light" | "dark" | "email") => Promise<void>;
  handleShowThemePanel: () => void;
  portalContainer: HTMLElement | undefined;
}

const defaultContext: ThemeInterface = {
  theme: {
    accent_color: "gray",
    gray_color: "sand",
    radius: "medium",
    scaling: "100%",
    dark_mode: "light",
    icon_weight: "regular",
    icon_sharpness: "rounded",
  },
  setTheme: () => Promise.resolve(),
  handleUploadLogo: () => Promise.resolve(),
  handleShowThemePanel: () => {},
  portalContainer: undefined,
};

const ThemeContext = createContext<ThemeInterface>(defaultContext);

export const ThemeProvider = ({ children }: { children: ReactNode }) => {
  const { isDarkMode, set: setIsDarkMode } = useDarkMode();
  const { company, refreshAuth } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();

  const portalContainerRef = useRef<HTMLElement>(null);

  const [portalContainer, setPortalContainer] = useState<HTMLElement | undefined>(undefined);
  const [optimisticUpdateTheme, setOptimisticUpdateTheme] = useState<CompanyTheme | null>(null);

  const theme = optimisticUpdateTheme ?? company?.theme ?? defaultContext.theme;

  const setTheme = async (theme: Partial<CompanyTheme>) => {
    if (!company) return;
    const updatedTheme: CompanyTheme = { ...company?.theme, ...theme };
    setOptimisticUpdateTheme(updatedTheme);
    const { error } = await updateCompany(company.id, {
      theme: updatedTheme,
    });
    if (error) {
      toast({
        title: "Error updating theme",
        description: error,
        variant: "danger",
      });
    }
    await refreshAuth();
    setOptimisticUpdateTheme(null);
  };

  useEffect(() => {
    setPortalContainer(portalContainerRef.current ?? undefined);
  }, [portalContainerRef]);

  useEffect(() => {
    switch (theme.dark_mode) {
      case "light":
        setIsDarkMode(false);
        break;
      case "dark":
        setIsDarkMode(true);
        break;
      default:
        break;
    }
  }, [theme.dark_mode, setIsDarkMode]);

  const handleUploadLogo = async (file: File | undefined, appearance: "light" | "dark" | "email") => {
    if (!company) return;
    // If no file is provided, delete the current logo
    if (!file) {
      let currentStorageObjectId;
      switch (appearance) {
        case "light":
          currentStorageObjectId = company.logo_light_storage_object_id;
          break;
        case "dark":
          currentStorageObjectId = company.logo_dark_storage_object_id;
          break;
      }
      if (currentStorageObjectId) {
        await deleteStorageObject(company.id, "company_branding", currentStorageObjectId);
      }
      refreshAuth();
      return;
    }
    // Upload the new logo
    const { data: insertedLogo, error: insertedLogoError } = await insertStorageObject(file, company.id, "company_branding");
    if (insertedLogoError || !insertedLogo) {
      toast({
        title: "Error uploading logo",
        description: insertedLogoError,
        variant: "danger",
      });
      return;
    }
    // Update the company with the new logo
    let updatedLogoPayload = {};
    switch (appearance) {
      case "light":
        updatedLogoPayload = { logo_light_storage_object_id: insertedLogo.id };
        break;
      case "dark":
        updatedLogoPayload = { logo_dark_storage_object_id: insertedLogo.id };
        break;
    }
    await updateCompany(company.id, updatedLogoPayload);
    await refreshAuth();
  };

  const handleShowThemePanel = () => {
    // add theme-panel=true to the URL
    const searchParams = new URLSearchParams(location.search);
    searchParams.set("theme-panel", "true");
    navigate(`${location.pathname}?${searchParams}`);
  };

  return (
    <ThemeContext.Provider
      value={{
        theme,
        setTheme,
        handleUploadLogo,
        handleShowThemePanel,
        portalContainer,
      }}
    >
      <Theme
        appearance={theme.dark_mode === "choice" ? (isDarkMode ? "dark" : "light") : theme.dark_mode}
        accentColor={theme.accent_color}
        grayColor={theme.gray_color}
        panelBackground="solid"
        radius={theme.radius}
        scaling={theme.scaling}
      >
        <main id="radix-portal-container" ref={portalContainerRef}>
          {children}
          <ThemePanel />
        </main>
      </Theme>
    </ThemeContext.Provider>
  );
};

// Hook for consuming context
export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error("useTheme must be used within a ThemeProvider");
  }
  return context;
};
