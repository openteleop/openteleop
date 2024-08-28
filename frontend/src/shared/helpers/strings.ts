export const V4_UUID_REGEX = "\\b[a-fA-F0-9]{8}\\-[a-fA-F0-9]{4}\\-4[a-fA-F0-9]{3}\\-[89aAbB][a-fA-F0-9]{3}\\-[a-fA-F0-9]{12}\\b";

export const toCamelCase = (str: string) => {
  return str.toLowerCase().replace(/[^a-zA-Z0-9]+(.)/g, (_m, chr) => chr.toUpperCase());
};

export const toSnakeCase = (str: string) => {
  return str
    .toLowerCase()
    .replace(/\W+/g, " ")
    .trim()
    .replace(/[^a-zA-Z0-9]+/g, "_");
};

export const toKebabCase = (str: string) => {
  return str
    .toLowerCase()
    .replace(/\W+/g, " ")
    .trim()
    .replace(/[^a-zA-Z0-9]+/g, "-");
};

export const toPascalCase = (str: string) => {
  return str.replace(/\W+(.)/g, (_m, chr) => chr.toUpperCase()).replace(/^./, (chr) => chr.toUpperCase());
};

export const toTitleCase = (str: string) => {
  return str.replace(/\w\S*/g, (txt) => txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase());
};

export const validEmail = (email: string): boolean => {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
};
