/**
 * Auto generated types. DO NOT MODIFY THIS FILE
 * To update this interface, modify the equivalent file in the types folder in the root of the project
 * then run `python .husky/auto_update_supabase_functions_global_types.py`
 * or commit your changes and the file will be updated automatically
 */

import { Company } from "./company.ts";
import { TimestampTz } from "./timestamp.ts";
import { UUIDv4 } from "./uuid.ts";

export interface StorageObject {
  id: UUIDv4;
  company_id: UUIDv4;
  created_at: TimestampTz;
  mime_type: string | null;
  bucket_name: string;
  file_name: string;
  path_keys: string[];
  storage_object_id: UUIDv4;
  // Foreign keys
  company?: Company;
  // storage
  url?: string;
}
