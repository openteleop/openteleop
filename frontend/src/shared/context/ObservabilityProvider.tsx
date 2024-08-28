import React, { createContext, useRef, useEffect } from "react";
import { H } from "highlight.run";
import { useAuth } from "./AuthProvider";
import { version } from "../../../package.json";

const env = import.meta.env.VITE_APP_ENV_NAME as string;
const highlightProjectId = import.meta.env.VITE_APP_HIGHLIGHT_PROJECT_ID as string;

interface ObservabilityContextProps {
  track: (eventName: string, metaData?: Record<string, any>) => Promise<void>;
}

// Create a default context value for ObservabilityContext to avoid having to initialize the context with undefined
const defaultContext: ObservabilityContextProps = {
  track: () => Promise.resolve(),
};

export const ObservabilityContext = createContext<ObservabilityContextProps>(defaultContext);

export const ObservabilityProvider: React.FunctionComponent<React.PropsWithChildren<{}>> = ({ children }) => {
  const { company, user } = useAuth(); 

  const initializedRef = useRef(false);
  const identifiedRef = useRef(false);

  useEffect(() => {
    if (!initializedRef.current) {
      init();
    }
    if (initializedRef.current && !identifiedRef.current) {
      identify();
    }
  }, [company, user]);

  const init = async () => {
    if (location.hostname !== "localhost" && env !== "development") {
      H.init(highlightProjectId, {
        environment: env,
        reportConsoleErrors: true,
        networkRecording: {
          enabled: true,
          recordHeadersAndBody: true,
        },
        version: version,
      });
      initializedRef.current = true;
    }
  }

  const identify = async () => {
    if (!user || !company) {
      return;
    }
    H.identify(user.email, {
      company: company.name,
      company_id: company.id,
      email: user.email,
      name: `${user.first_name ?? ""} ${user.last_name ?? ""}`,
      role: user.role,
    });
    identifiedRef.current = true;
  };

  const track = async (eventName: string, metaData?: Record<string, any>) => {
    if (!initializedRef.current || !identifiedRef.current) {
      return;
    }
    if (location.hostname === "localhost" && env !== "development") {
      H.track(eventName, metaData);
    }
  };

  return (
    <ObservabilityContext.Provider value={{ track }}>
      {children}
    </ObservabilityContext.Provider>
  );
};
