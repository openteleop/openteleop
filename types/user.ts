import { Company } from "./company";
import { TimestampTz } from "./timestamp";
import { UUIDv4 } from "./uuid";

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
