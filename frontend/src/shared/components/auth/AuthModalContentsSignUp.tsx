import { useAuth } from "@shared/context/AuthProvider";
import { useEffect, useState } from "react";
import TextField from "../primitives/TextField";
import Button from "../primitives/Button";
import Icon from "../primitives/Icon";
import AuthModalPasswordValidation from "./AuthModalPasswordValidation";
import { useToast } from "@shared/context/ToastProvider";
import { useTranslation } from "react-i18next";

const AuthModalContentsSignUp = () => {
  const { setAuthState } = useAuth();
  const { toast } = useToast();
  const { t } = useTranslation();

  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [confirmPassword, setConfirmPassword] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [wrongCredentials, setWrongCredentials] = useState<boolean>(false);
  const [passwordIsValid, setPasswordIsValid] = useState<boolean>(false);

  const handleSignUp = async () => {
    if (!passwordIsValid) return;
    setIsLoading(true);
    toast({
      title: t("error.comingSoon"),
      description: t("error.weHaventQuiteGotThereYet"),
      variant: "warning",
    });
    setIsLoading(false);
  };

  // handle sign up if enter key is pressed
  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      if (e.key === "Enter") {
        handleSignUp();
      }
    };
    window.addEventListener("keypress", handleKeyPress);
    return () => window.removeEventListener("keypress", handleKeyPress);
  }, [email, password]);

  // reset wrong credentials when email or password changes
  useEffect(() => {
    setWrongCredentials(false);
  }, [email, password]);

  return (
    <>
      <div className="text-6 font-bold">{t("features.auth.welcomeAbroad")}</div>
      <div className="max-w-72 pb-rx-1 text-center">{t("features.auth.pleaseFillInThisInformation")}</div>
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
      <TextField
        inputSize="lg"
        type="password"
        placeholder={t("features.auth.confirmPassword")}
        value={confirmPassword}
        onChange={(e) => setConfirmPassword(e.target.value)}
        validationState={wrongCredentials ? "invalid" : undefined}
        className="w-72"
      />
      {wrongCredentials && (
        <div className="flex w-full items-center space-x-2 pb-rx-2 text-left text-2">
          <Icon icon="exclamation-circle" className="text-red-11" />
          <div className="text-red-11">{t("features.auth.invalidEmailOrPassword")}</div>
        </div>
      )}{" "}
      <AuthModalPasswordValidation password={password} confirmPassword={confirmPassword} onValidationChange={setPasswordIsValid} />
      <Button className="w-72" size="lg" onClick={() => handleSignUp()} isLoading={isLoading}>
        {t("features.auth.createAccount")}
      </Button>
      <Button variant="ghost" className="flex w-72 gap-rx-2 !text-2" size="lg" onClick={() => setAuthState("login")}>
        {t("features.auth.alreadyHaveAnAccount")}
        <span className="font-bold">{t("features.auth.signIn")}</span>
      </Button>
    </>
  );
};

export default AuthModalContentsSignUp;
