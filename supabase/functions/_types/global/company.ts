/**
 * Auto generated types. DO NOT MODIFY THIS FILE
 * To update this interface, modify the equivalent file in the types folder in the root of the project
 * then run `python .husky/auto_update_supabase_functions_global_types.py`
 * or commit your changes and the file will be updated automatically
 */

import { TimestampTz } from "./timestamp.ts";
import { UUIDv4 } from "./uuid.ts";

export interface Company {
  id: UUIDv4;
  name: string;
  created_at: TimestampTz;
  logo_light_storage_object_id: UUIDv4 | null;
  logo_dark_storage_object_id: UUIDv4 | null;
  theme: CompanyTheme;
  // Storage
  logo_light_url?: string;
  logo_dark_url?: string;
}

export type CompanyTheme = {
  accent_color:
    | "tomato"
    | "red"
    | "ruby"
    | "crimson"
    | "pink"
    | "plum"
    | "purple"
    | "violet"
    | "iris"
    | "indigo"
    | "blue"
    | "cyan"
    | "teal"
    | "jade"
    | "green"
    | "grass"
    | "brown"
    | "orange"
    | "sky"
    | "mint"
    | "lime"
    | "yellow"
    | "amber"
    | "gold"
    | "bronze"
    | "gray";
  gray_color: "gray" | "mauve" | "slate" | "sage" | "olive" | "sand" | "auto";
  radius: "none" | "small" | "medium" | "large" | "full";
  scaling: "90%" | "95%" | "100%" | "105%" | "110%";
  dark_mode: "light" | "dark" | "choice";
  colored_header: boolean;
  icon_weight: "solid" | "regular" | "light";
  icon_sharpness: "sharp" | "rounded";
};
