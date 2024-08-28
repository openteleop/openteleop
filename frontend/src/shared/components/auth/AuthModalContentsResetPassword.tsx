import { supabase, useAuth } from "@shared/context/AuthProvider";
import { useEffect, useMemo, useState } from "react";
import TextField from "../primitives/TextField";
import Button from "../primitives/Button";
import AuthModalPasswordValidation from "./AuthModalPasswordValidation";
import { useToast } from "@shared/context/ToastProvider";
import { useLocation } from "react-router-dom";
import Icon from "../primitives/Icon";
import { useTranslation } from "react-i18next";

const AuthModalContentsResetPassword = () => {
  const { user, setAuthState } = useAuth();
  const { toast } = useToast();
  const location = useLocation();
  const { t } = useTranslation();

  const [password, setPassword] = useState<string>("");
  const [confirmPassword, setConfirmPassword] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [passwordIsValid, setPasswordIsValid] = useState<boolean>(false);

  const handleResetPassword = async () => {
    if (!passwordIsValid) return;
    if (!user) {
      toast({
        title: t("features.auth.notAuthenticated"),
        description: t("features.auth.youMustBeSignedInToChangeYourPassword"),
        variant: "danger",
      });
      console.error("No user found");
      return;
    }
    setIsLoading(true);
    const { error } = await supabase.auth.updateUser({
      password: password,
    });
    if (error) {
      console.error("Error updating password", error);
      toast({ title: t("features.auth.errorUpdatingPassword"), variant: "danger" });
    }
    setIsLoading(false);
    setAuthState(null);
    toast({ title: t("features.auth.passwordUpdated"), variant: "success" });
  };

  // handle reset pw if enter key is pressed
  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      if (e.key === "Enter") {
        handleResetPassword();
      }
    };
    window.addEventListener("keypress", handleKeyPress);
    return () => window.removeEventListener("keypress", handleKeyPress);
  }, [password]);

  const errorDescription = useMemo(() => {
    const hashParams = new URLSearchParams(location.hash.slice(1)); // slice(1) removes the '#'
    return hashParams.get("error_description");
  }, [location.hash]);

  return (
    <>
      <div className="text-6 font-bold">{t("features.auth.changeYourPassword")}</div>
      <div className="max-w-72 pb-rx-1 text-center">{t("features.auth.enterANewPasswordBelow")}</div>
      <TextField
        inputSize="lg"
        type="password"
        placeholder={t("features.auth.password")}
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        className="w-72"
        disabled={errorDescription !== null}
      />
      <TextField
        inputSize="lg"
        type="password"
        placeholder={t("features.auth.confirmPassword")}
        value={confirmPassword}
        onChange={(e) => setConfirmPassword(e.target.value)}
        className="w-72"
        disabled={errorDescription !== null}
      />
      {errorDescription ? (
        <div className="flex w-full max-w-72 items-center gap-rx-2 py-rx-2 text-left text-2 font-medium text-red-11">
          <Icon icon="exclamation-circle" />
          <div className="">{errorDescription}</div>
        </div>
      ) : (
        <AuthModalPasswordValidation password={password} confirmPassword={confirmPassword} onValidationChange={setPasswordIsValid} />
      )}
      <Button className="w-72" size="lg" onClick={() => handleResetPassword()} isLoading={isLoading}>
        {t("features.auth.resetPassword")}
      </Button>
      <Button variant="ghost" className="w-72 !text-2" size="lg" onClick={() => setAuthState("login")}>
        {t("features.auth.backToSignIn")}
      </Button>
    </>
  );
};

export default AuthModalContentsResetPassword;
