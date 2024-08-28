import { useAuth } from "@shared/context/AuthProvider";
import { useEffect, useState } from "react";
import TextField from "../primitives/TextField";
import Button from "../primitives/Button";
import Icon from "../primitives/Icon";
import { useTranslation } from "react-i18next";

const AuthModalContentsSignIn = () => {
  const { login, setAuthState } = useAuth();
  const { t } = useTranslation();

  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [wrongCredentials, setWrongCredentials] = useState<boolean>(false);

  const handleLogin = async (email: string, password: string) => {
    setIsLoading(true);
    const { error } = await login(email, password);
    if (error) {
      if (error !== "Invalid login credentials") console.error("Error logging in", error);
      setWrongCredentials(true);
    }
    setIsLoading(false);
  };

  // handle sign in if enter key is pressed
  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      if (e.key === "Enter") {
        handleLogin(email, password);
      }
    };
    window.addEventListener("keypress", handleKeyPress);
    return () => window.removeEventListener("keypress", handleKeyPress);
  }, [email, password]);

  return (
    <>
      <div className="text-6 font-bold">{t("features.auth.welcomeBack")}</div>
      <div className="max-w-72 pb-rx-1 text-center">{t("features.auth.pleaseSignInToContinue")}</div>
      <TextField
        inputSize="lg"
        type="email"
        placeholder={t("common.email")}
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        validationState={wrongCredentials ? "invalid" : undefined}
        className="w-72"
      />
      <TextField
        inputSize="lg"
        type="password"
        placeholder={t("features.auth.password")}
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        validationState={wrongCredentials ? "invalid" : undefined}
        className="w-72"
      />
      {wrongCredentials && (
        <div className="flex w-full items-center space-x-2 pb-rx-2 text-left text-2">
          <Icon icon="exclamation-circle" className="text-red-11" />
          <div className="text-red-11">{t("features.auth.invalidEmailOrPassword")}</div>
        </div>
      )}
      <Button className="w-72" size="lg" onClick={() => handleLogin(email, password)} isLoading={isLoading}>
        {t("features.auth.signIn")}
      </Button>
      <Button variant="ghost" className="w-72 !text-2" size="lg" onClick={() => setAuthState("forgotpassword")}>
        {t("features.auth.forgotPassword")}
      </Button>
      {/* Temporarily not allowing sign ups */}
      <Button variant="ghost" className="w-72 !text-2" size="lg" onClick={() => setAuthState("signup")}>
        {t("features.auth.dontHaveAnAccount")}
        <span className="font-bold">{t("features.auth.signUp")}</span>
      </Button>
    </>
  );
};

export default AuthModalContentsSignIn;
