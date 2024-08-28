/**
 * Auto generated types. DO NOT MODIFY THIS FILE
 * To update this interface, modify the equivalent file in the types folder in the root of the project
 * then run `python .husky/auto_update_supabase_functions_global_types.py`
 * or commit your changes and the file will be updated automatically
 */

import { Company } from "./company.ts";
import { TimestampTz } from "./timestamp.ts";
import { UUIDv4 } from "./uuid.ts";

export interface User {
  id: string;
  company_id: UUIDv4;
  created_at: TimestampTz;
  first_name: string;
  last_name: string;
  email: string;
  role: UserRole;
  avatar_storage_object_id: UUIDv4 | null;
  // Foreign keys
  company?: Company;
  // storage
  avatar_url?: string;
}

export type UserRole = "admin" | "editor" | "viewer";
export const userRoles: UserRole[] = ["admin", "editor", "viewer"];

export const generateBlankUser = (user?: Partial<User>): User => {
  const now = new Date().toISOString();
  return {
    id: "",
    company_id: "",
    created_at: now,
    first_name: "",
    last_name: "",
    email: "",
    role: "viewer",
    avatar_storage_object_id: null,
    ...user,
  };
};
