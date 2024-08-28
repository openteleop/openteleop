import { useMemo } from "react";
import Icon from "../primitives/Icon";
import { useTranslation } from "react-i18next";

const AuthModalPasswordValidation = ({
  password,
  confirmPassword,
  onValidationChange,
}: {
  password: string;
  confirmPassword: string;
  onValidationChange: (isValid: boolean) => void;
}) => {
  const { t } = useTranslation();

  const { isLongEnough, hasLowerCase, hasUpperCase, passwordsMatch } = useMemo(() => {
    const isLongEnough = password.length >= 8;
    const hasLowerCase = /[a-z]/.test(password);
    const hasUpperCase = /[A-Z]/.test(password);
    const passwordsMatch = password === confirmPassword && confirmPassword.length > 0;
    onValidationChange(isLongEnough && hasLowerCase && hasUpperCase && passwordsMatch);
    return { isLongEnough, hasLowerCase, hasUpperCase, passwordsMatch };
  }, [password, confirmPassword]);

  return (
    <div className="flex w-full max-w-72 flex-col gap-y-rx-1 rounded-2 border border-gray-6 p-rx-3 text-1">
      <div className="pb-rx-1 text-2 text-gray-11">{t("features.auth.yourPasswordMustContain")}</div>
      <div className={`ml-rx-2 flex items-center gap-rx-2 ${isLongEnough ? "text-green-11" : "text-red-11"}`}>
        <Icon icon="circle" weight="solid" className="text-[5px]" />
        <div>{t("features.auth.atLeast8Characters")}</div>
      </div>
      <div className={`ml-rx-2 flex items-center gap-rx-2 ${hasLowerCase ? "text-green-11" : "text-red-11"}`}>
        <Icon icon="circle" weight="solid" className="text-[5px]" />
        <div>{t("features.auth.atLeast1LowercaseLetter")}</div>
      </div>
      <div className={`ml-rx-2 flex items-center gap-rx-2 ${hasUpperCase ? "text-green-11" : "text-red-11"}`}>
        <Icon icon="circle" weight="solid" className="text-[5px]" />
        <div>{t("features.auth.atLeast1UppercaseLetter")}</div>
      </div>
      <div className={`ml-rx-2 flex items-center gap-rx-2 ${passwordsMatch ? "text-green-11" : "text-red-11"}`}>
        <Icon icon="circle" weight="solid" className="text-[5px]" />
        <div>{t("features.auth.passwordsMustMatch")}</div>
      </div>
    </div>
  );
};

export default AuthModalPasswordValidation;
