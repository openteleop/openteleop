export interface ConnectionResponse<T> {
  data: T | null;
  error: string | null;
}
