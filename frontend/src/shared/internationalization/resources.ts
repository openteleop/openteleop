import en from "./en/translation.json";
import fr from "./fr/translation.json";

const resources = {
  en: { translation: en },
  fr: { translation: fr },
} as const;

export default resources;
