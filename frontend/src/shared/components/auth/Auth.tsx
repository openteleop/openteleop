import { useAuth } from "@shared/context/AuthProvider";
import Modal from "../primitives/Modal";
import AuthModalContentsSignIn from "./AuthModalContentsSignIn";
import AuthModalContentsSignUp from "./AuthModalContentsSignUp";
import AuthModalContentsForgotPassword from "./AuthModalContentsForgotPassword";
import AuthModalContentsResetPassword from "./AuthModalContentsResetPassword";
import { useTranslation } from "react-i18next";

const Auth = () => {
  const { authState } = useAuth();
  const { t } = useTranslation();

  return (
    <div className="h-screen w-screen bg-accent-9">
      <Modal.Root open={authState !== null}>
        <Modal.Content overlay="dark" className="w-fit">
          <Modal.Title hidden>{t("features.auth.authentication")}</Modal.Title>
          <Modal.Description hidden>{t("features.auth.authenticationDescription")}</Modal.Description>
          <Modal.Main className="relative">
            <div className="flex h-full w-full flex-col items-center gap-rx-2 bg-panel p-rx-6">
              {authState === "login" && <AuthModalContentsSignIn />}
              {authState === "signup" && <AuthModalContentsSignUp />}
              {authState === "forgotpassword" && <AuthModalContentsForgotPassword />}
              {authState === "resetpassword" && <AuthModalContentsResetPassword />}
            </div>
          </Modal.Main>
        </Modal.Content>
      </Modal.Root>
    </div>
  );
};

export default Auth;
