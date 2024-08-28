import { useTheme } from "../context/ThemeProvider";
import { Theme, themePropDefs } from "@radix-ui/themes";
import { radixThemePreset } from "radix-themes-tw";
import * as Label from "@radix-ui/react-label";
import Button from "./primitives/Button";
import { toPascalCase } from "../helpers/strings";
import { useRef, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "@shared/context/AuthProvider";
import Loader from "./primitives/Loader";
import Icon from "./primitives/Icon";
import { cn } from "@shared/helpers/tailwind";

const darkModeOptions = ["light", "dark", "choice"] as ("light" | "dark" | "choice")[];

export const LogoUploadBox = ({
  appearance,
  logoUrl,
  handleUpload,
}: {
  appearance: "light" | "dark" | "email"; // email appearance is the background color of an email (white)
  logoUrl: string | undefined;
  handleUpload: (file: File | undefined) => Promise<void>;
}) => {
  const inputRef = useRef<HTMLInputElement>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const handleUploadLogo = async (file: File | undefined) => {
    setIsLoading(true);
    await handleUpload(file);
    setIsLoading(false);
  };

  return (
    <div className="relative flex w-1/2 flex-col items-center gap-rx-1">
      {!logoUrl && (
        <button
          className="group flex h-rx-9 w-full items-center justify-center rounded-4 border border-dashed border-gray-6 p-rx-3"
          onClick={() => inputRef.current?.click()}
        >
          {!isLoading && <div className="text-1 italic text-gray-11 group-hover:text-gray-12">Browse Files</div>}
        </button>
      )}
      {logoUrl && (
        <div
          className={cn(
            "group flex h-rx-9 w-full items-center justify-center rounded-4 border border-gray-6 p-rx-5",
            appearance !== "email" && (appearance === "light" ? "bg-whiteA-12" : "bg-blackA-12"),
            appearance === "email" && "bg-whiteA-12",
          )}
        >
          {!isLoading && <img src={logoUrl} alt="Uploaded logo" className="h-rx-9 w-full object-contain" />}
        </div>
      )}
      {logoUrl && (
        <Button
          disabled={isLoading}
          className={`absolute right-1 top-1 h-rx-5 w-rx-5 ${appearance === "dark" ? "text-gray-1 hover:text-gray-12" : "text-gray-12"}`}
          size="xs"
          variant="ghost"
          aria-label="Remove logo"
          onClick={() => handleUploadLogo(undefined)}
        >
          <Icon icon="times" />
        </Button>
      )}
      <input
        disabled={isLoading}
        hidden
        id="picture"
        type="file"
        ref={inputRef}
        onChange={(e) => handleUploadLogo(e.target.files?.[0] ?? undefined)}
      />
      {isLoading && (
        <div className="absolute z-20 flex h-rx-9 w-full items-center justify-center">
          <Loader size="sm" />
        </div>
      )}
      <Label.Root className="text-1 font-medium" htmlFor="picture">
        {toPascalCase(appearance)}
      </Label.Root>
    </div>
  );
};

const ThemePanel = () => {
  const { theme, setTheme, handleUploadLogo } = useTheme();

  const location = useLocation();
  const navigate = useNavigate();
  const { company } = useAuth();

  const handleClosePanel = () => {
    const searchParams = new URLSearchParams(location.search);
    searchParams.delete("theme-panel");
    navigate(`${location.pathname}?${searchParams}`);
  };

  return (
    <div
      className={`fixed bottom-rx-4 z-20 transition-all duration-500 ease-in-out ${location.search.includes("theme-panel=true") ? "right-rx-4 " : "-right-full"}`}
    >
      <div className="flex h-full w-96 flex-col gap-rx-4 rounded-4 border border-gray-3 bg-panel p-rx-5 text-2 shadow-3">
        <div className="flex items-center justify-between">
          <h3 className="text-4 font-bold">Edit Style & Branding</h3>
          <Button className="-mr-1 h-rx-5 w-rx-5" size="icon" variant="ghost" aria-label="Close panel" onClick={() => handleClosePanel()}>
            <Icon icon="times" />
          </Button>
        </div>
        <div className="flex flex-col gap-rx-2">
          <div className="font-bold">Accent Color</div>
          <div className="flex flex-wrap gap-rx-2">
            {themePropDefs.accentColor.values.map((color) => (
              <button
                key={color}
                onClick={() => setTheme({ accent_color: color })}
                style={{
                  backgroundColor: (
                    radixThemePreset.theme?.colors as {
                      [key: string]: { [key: string]: string };
                    }
                  )?.[color]?.[9],
                }}
                className={`h-rx-5 w-rx-5 rounded-6 ring-offset-1 ${theme.accent_color === color ? "ring-2 ring-gray-12" : "hover:ring-2 hover:ring-gray-6"}`}
              />
            ))}
          </div>
        </div>
        <div className="flex flex-col gap-rx-2">
          <div className="font-bold">Gray Color</div>
          <div className="flex flex-wrap gap-rx-2">
            {themePropDefs.grayColor.values.map((color) => (
              <button
                key={color}
                onClick={() => setTheme({ gray_color: color })}
                style={{
                  backgroundColor: (
                    radixThemePreset.theme?.colors as {
                      [key: string]: { [key: string]: string };
                    }
                  )?.[color]?.[9],
                }}
                className={`h-rx-5 w-rx-5 rounded-6 ring-offset-1 ${theme.gray_color === color ? "ring-2 ring-gray-12" : "hover:ring-2 hover:ring-gray-6"}`}
              />
            ))}
          </div>
        </div>
        <div className="flex flex-col gap-rx-2">
          <div className="font-bold">Appearance</div>
          <div className="flex items-center gap-rx-2">
            {darkModeOptions.map((darkModeOption) => (
              <Button
                key={darkModeOption}
                variant="outline"
                size="lg"
                className={`w-1/3 !text-1 ${theme.dark_mode === darkModeOption ? "border-gray-12 ring-1 ring-gray-12" : "border-gray-6"}`}
                onClick={() => setTheme({ dark_mode: darkModeOption })}
              >
                <Icon icon={darkModeOption === "light" ? "sun" : darkModeOption === "dark" ? "moon" : "user"} />
                {toPascalCase(darkModeOption)}
              </Button>
            ))}
          </div>
        </div>
        <div className="flex flex-col gap-rx-2">
          <div className="font-bold">Radius</div>
          <div className="flex items-center gap-rx-2">
            {themePropDefs.radius.values.map((radiusOption) => (
              <Button
                key={radiusOption}
                variant="outline"
                size="lg"
                className={`h-rx-8 w-1/6 flex-grow !text-1 ${theme.radius === radiusOption ? "border-gray-12 ring-1 ring-gray-12" : "border-gray-6"}`}
                onClick={() => setTheme({ radius: radiusOption })}
              >
                <div className="flex flex-col items-center">
                  <Theme radius={radiusOption}>
                    <div
                      className={`h-rx-5 w-rx-5 border-accent-7 bg-accent-3 ${radiusOption === "full" ? "rounded-tl-item" : "rounded-tl-5"} shrink-0 border-l-2 border-t-2`}
                    />
                  </Theme>
                </div>
              </Button>
            ))}
          </div>
        </div>
        <div className="flex flex-col gap-rx-2">
          <div className="font-bold">Scale</div>
          <div className="flex items-center gap-rx-2">
            {themePropDefs.scaling.values.map((scalingOption) => (
              <Button
                key={scalingOption}
                variant="outline"
                size="lg"
                className={`h-rx-8 w-1/6 flex-grow !text-1 ${theme.scaling === scalingOption ? "border-gray-12 ring-1 ring-gray-12" : "border-gray-6"}`}
                onClick={() => setTheme({ scaling: scalingOption })}
              >
                {scalingOption}
              </Button>
            ))}
          </div>
        </div>
        <div className="flex flex-col gap-rx-2">
          <div className="font-bold">Icon Weight</div>
          <div className="flex items-center gap-rx-2">
            {["solid", "regular", "light"].map((iconWeightOption) => (
              <Button
                key={iconWeightOption}
                variant="outline"
                size="lg"
                className={`w-1/3 !text-1 ${theme.icon_weight === iconWeightOption ? "border-gray-12 ring-1 ring-gray-12" : "border-gray-6"}`}
                onClick={() => setTheme({ icon_weight: iconWeightOption as "solid" | "regular" | "light" })}
              >
                <Icon weight={iconWeightOption as "solid" | "regular" | "light"} icon="icons" size="lg" />
                {toPascalCase(iconWeightOption)}
              </Button>
            ))}
          </div>
        </div>
        <div className="flex flex-col gap-rx-2">
          <div className="font-bold">Icon Sharpness</div>
          <div className="flex items-center gap-rx-2">
            {["rounded", "sharp"].map((iconSharpnessOption) => (
              <Button
                key={iconSharpnessOption}
                variant="outline"
                size="lg"
                className={`w-1/2 !text-1 ${theme.icon_sharpness === iconSharpnessOption ? "border-gray-12 ring-1 ring-gray-12" : "border-gray-6"}`}
                onClick={() => setTheme({ icon_sharpness: iconSharpnessOption as "rounded" | "sharp" })}
              >
                <Icon sharpness={iconSharpnessOption as "rounded" | "sharp"} icon="arrows-repeat" size="lg" />
                {toPascalCase(iconSharpnessOption)}
              </Button>
            ))}
          </div>
        </div>
        <div className="flex flex-col gap-rx-2">
          <div className="font-bold">Logo</div>
          <div className="flex items-center gap-rx-2">
            {(theme.dark_mode === "light" || theme.dark_mode === "choice") && (
              <LogoUploadBox
                appearance="light"
                logoUrl={company?.logo_light_url}
                handleUpload={(file) => handleUploadLogo(file, "light")}
              />
            )}
            {(theme.dark_mode === "dark" || theme.dark_mode === "choice") && (
              <LogoUploadBox
                appearance="dark"
                logoUrl={company?.logo_dark_url}
                handleUpload={async (file) => await handleUploadLogo(file, "dark")}
              />
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ThemePanel;
