import * as React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { byPrefixAndName } from "@awesome.me/kit-e635c1781a/icons";
import { useTheme } from "@shared/context/ThemeProvider";

interface IconProps extends Omit<React.ComponentProps<typeof FontAwesomeIcon>, "icon"> {
  icon: string;
  weight?: "solid" | "regular" | "light" | "duotone" | "brands";
  sharpness?: "sharp" | "rounded";
}

const Icon = React.forwardRef<HTMLElement, IconProps>(({ icon, sharpness, weight, ...props }, _ref) => {
  const { theme } = useTheme();
  const iconProp = React.useMemo(() => {
    if ((sharpness ?? theme.icon_sharpness) === "sharp") {
      switch (weight ?? theme.icon_weight) {
        case "solid":
          return byPrefixAndName.fass[icon];
        case "regular":
          return byPrefixAndName.fasr[icon];
        case "light":
          return byPrefixAndName.fasl[icon];
        case "duotone":
          return byPrefixAndName.fad[icon]; // Coming soon to FontAwesome (updated 2024-05-06)
        case "brands":
          return byPrefixAndName.fab[icon]; // Coming soon to FontAwesome (updated 2024-05-06)
        default:
          return byPrefixAndName.fass[icon];
      }
    } else {
      switch (weight ?? theme.icon_weight) {
        case "solid":
          return byPrefixAndName.fas[icon];
        case "regular":
          return byPrefixAndName.far[icon];
        case "light":
          return byPrefixAndName.fal[icon];
        case "duotone":
          return byPrefixAndName.fad[icon];
        case "brands":
          return byPrefixAndName.fab[icon];
        default:
          return byPrefixAndName.fas[icon];
      }
    }
  }, [icon, weight, sharpness, theme]);
  if (!iconProp) return null;
  return <FontAwesomeIcon icon={iconProp} {...props} />;
});
Icon.displayName = "Icon";

export default Icon;
