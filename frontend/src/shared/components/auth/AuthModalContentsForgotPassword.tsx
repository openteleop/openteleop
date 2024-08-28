import { supabase, useAuth } from "@shared/context/AuthProvider";
import { useEffect, useState } from "react";
import TextField from "../primitives/TextField";
import Button from "../primitives/Button";
import Icon from "../primitives/Icon";
import { useToast } from "@shared/context/ToastProvider";
import { validEmail } from "@shared/helpers/strings";
import { useTranslation } from "react-i18next";

const AuthModalContentsForgotPassword = () => {
  const { setAuthState } = useAuth();
  const { toast } = useToast();
  const { t } = useTranslation();

  const [email, setEmail] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [wrongCredentials, setWrongCredentials] = useState<boolean>(false);
  const [emailSent, setEmailSent] = useState<boolean>(false);

  const handleForgotPassword = async () => {
    const emailValid = validEmail(email);
    if (!emailValid) {
      setWrongCredentials(true);
      return;
    }
    const currentUrl: URL = new URL(window.location.href);
    currentUrl.pathname = "/auth/resetpassword";
    const redirectUrl: string = currentUrl.toString();
    setIsLoading(true);
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: redirectUrl,
    });
    if (error) {
      toast({ title: t("features.auth.errorSendingPasswordResetEmail"), description: error.message, variant: "danger" });
      console.error("Error sending email", error);
    }
    setIsLoading(false);
    setEmailSent(true);
  };

  // handle forgot pw if enter key is pressed
  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      if (e.key === "Enter") {
        handleForgotPassword();
      }
    };
    window.addEventListener("keypress", handleKeyPress);
    return () => window.removeEventListener("keypress", handleKeyPress);
  }, [email]);

  return (
    <>
      <div className="text-6 font-bold">{emailSent ? t("features.auth.checkYourEmail") : t("features.auth.forgotYourPassword")}</div>
      <div className="max-w-72 pb-rx-1 text-center">
        {emailSent ? t("features.auth.pleaseCheckTheEmail", { email: email }) : t("features.auth.enterYourEmailToResetYourPassword")}
      </div>
      {!emailSent && (
        <>
          <TextField
            inputSize="lg"
            type="email"
            placeholder={t("common.email")}
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            validationState={wrongCredentials ? "invalid" : undefined}
            className="w-72"
          />
          {wrongCredentials && (
            <div className="flex w-full items-center space-x-2 pb-rx-2 text-left text-2">
              <Icon icon="exclamation-circle" className="text-red-11" />
              <div className="text-red-11">{t("features.auth.invalidEmailAddress")}</div>
            </div>
          )}
          <Button className="w-72" size="lg" onClick={() => handleForgotPassword()} isLoading={isLoading}>
            {t("features.auth.continue")}
          </Button>
        </>
      )}
      {emailSent && (
        <Button className="w-72 py-rx-2" size="lg" onClick={() => handleForgotPassword()} isLoading={isLoading}>
          {t("features.auth.resendEmail")}
        </Button>
      )}
      <Button variant="ghost" className="w-72 !text-2" size="lg" onClick={() => setAuthState("login")}>
        {t("features.auth.backToSignIn")}
      </Button>
    </>
  );
};

export default AuthModalContentsForgotPassword;
