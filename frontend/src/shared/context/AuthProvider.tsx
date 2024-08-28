import { createContext, useContext, ReactNode, useState, useEffect, Dispatch, SetStateAction, useMemo } from "react";
import { createClient, SupabaseClient } from "@supabase/supabase-js";
import { User } from "@shared/types/global/user";
import { AuthState } from "@shared/types/auth";
import { useNavigate } from "react-router-dom";
import { Company } from "@shared/types/global/company";
import { ConnectionResponse } from "@shared/types/response";
import { fetchStorageObject } from "@shared/connections/storage";

const supabaseUrl = import.meta.env.VITE_APP_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_APP_SUPABASE_ANON_KEY;

export let supabase: SupabaseClient;

interface AuthInterface {
  authenticated: boolean;
  user: User | null;
  company: Company | null;
  refreshAuth: (options?: { refreshSession?: boolean }) => Promise<void>;
  login: (email: string, password: string) => Promise<ConnectionResponse<string>>;
  logout: () => Promise<ConnectionResponse<null>>;
  authState: AuthState | null;
  setAuthState: (authState: AuthState | null) => void;
}

const defaultContext: AuthInterface = {
  authenticated: false,
  user: null,
  company: null,
  refreshAuth: () => Promise.resolve(),
  login: () => Promise.resolve({ data: null, error: null }),
  logout: () => Promise.resolve({ data: null, error: null }),
  authState: null,
  setAuthState: () => {},
};

const AuthContext = createContext<AuthInterface>(defaultContext);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [userId, setUserId] = useState<string | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [company, setCompany] = useState<Company | null>(null);

  const navigate = useNavigate();

  const refreshCompanyLogos = (company: Company, setCompany: Dispatch<SetStateAction<Company | null>>) => {
    if (company.logo_light_storage_object_id) {
      fetchStorageObject(company.id, "company_branding", company.logo_light_storage_object_id).then(({ data: companyLogoLightUrl }) => {
        setCompany((draft) => {
          if (!draft) return null;
          return { ...(draft ?? {}), logo_light_url: (companyLogoLightUrl as string) ?? undefined };
        });
      });
    }
    if (company.logo_dark_storage_object_id) {
      fetchStorageObject(company.id, "company_branding", company.logo_dark_storage_object_id).then(({ data: companyLogoDarkUrl }) => {
        setCompany((draft) => {
          if (!draft) return null;
          return { ...(draft ?? {}), logo_dark_url: (companyLogoDarkUrl as string) ?? undefined };
        });
      });
    }
  };

  const refreshUserAvatar = async (user: User) => {
    if (user.avatar_storage_object_id) {
      const { data: userAvatarUrl } = await fetchStorageObject(user?.company_id ?? "", "user_avatars", user.avatar_storage_object_id);
      setUser((draft) => {
        if (!draft) return null;
        return { ...(draft ?? {}), avatar_url: (userAvatarUrl as string) ?? undefined };
      });
    }
  };

  const refreshAuth = async (options?: { refreshSession?: boolean }) => {
    let currUserId = userId;
    if (options?.refreshSession) {
      const {
        data: { user },
        error,
      } = await supabase.auth.refreshSession();
      if (error || !user) {
        setUserId(null);
        console.error("Could not refresh session");
        return;
      }
      currUserId = user.id;
    }
    const { data: authenticatedUser } = await supabase.from("users").select("*").eq("id", currUserId).returns<User[]>().single();
    const { data: authenticatedCompany } = await supabase
      .from("companies")
      .select("*")
      .eq("id", authenticatedUser?.company_id)
      .returns<Company[]>()
      .single();
    setUser(authenticatedUser ?? null);
    setCompany(authenticatedCompany ?? null);
    // load company logo
    if (authenticatedCompany) refreshCompanyLogos(authenticatedCompany, setCompany);
    // load user avatar
    if (authenticatedUser) refreshUserAvatar(authenticatedUser);
  };

  const login = async (email: string, password: string): Promise<ConnectionResponse<string>> => {
    const { data: authentication, error: authenticationError } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    if (authenticationError || !authentication.user.id) {
      return { data: null, error: authenticationError?.message ?? "Could not authenticate user" };
    }
    setUserId(authentication.user.id);
    return { data: authentication.user.id, error: null };
  };

  const logout = async (): Promise<ConnectionResponse<null>> => {
    const { error } = await supabase.auth.signOut();
    if (error) {
      return { data: null, error: error.message };
    }
    setUserId(null);
    return { data: null, error: null };
  };

  const authState: AuthState | null = useMemo(() => {
    const pathParams = location.pathname.split("/");
    if (pathParams[1] !== "auth") return null;
    if (["login", "signup", "forgotpassword", "resetpassword"].includes(pathParams[2])) {
      return pathParams[2] as AuthState;
    }
    return null;
  }, [location.pathname]);

  const setAuthState = (authState: AuthState | null) => {
    if (!authState && location.pathname.includes("/auth")) {
      navigate("/");
    } else if (authState) {
      navigate(`/auth/${authState}`);
    }
  };

  useEffect(() => {
    if (!supabase) supabase = createClient(supabaseUrl, supabaseAnonKey);
    supabase.auth.onAuthStateChange(async (event, session) => {
      setUserId(session?.user?.id ?? null);
      switch (event) {
        case "SIGNED_OUT":
          navigate("/auth/login");
          window.location.reload();
          break;
        default:
          break;
      }
      // Deliberate logging for monitoring auth state
      console.log("Auth state change: ", event);
    });
  }, []);

  useEffect(() => {
    if (userId) {
      refreshAuth();
      if (authState !== "resetpassword") setAuthState(null);
    } else {
      setUser(null);
      setCompany(null);
      setAuthState("login");
    }
  }, [userId]);

  useEffect(() => {
    if (!userId && !location.pathname.includes("/auth")) {
      setAuthState("login");
    }
  }, [userId, location.pathname]);

  return (
    <AuthContext.Provider
      value={{
        authenticated: userId !== null,
        user,
        company: company,
        refreshAuth,
        login,
        logout,
        authState,
        setAuthState,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

// Hook for consuming context
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within a AuthProvider");
  }
  return context;
};
