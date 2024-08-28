import { Company } from "./company";
import { TimestampTz } from "./timestamp";
import { UUIDv4 } from "./uuid";

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
