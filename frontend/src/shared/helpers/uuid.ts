import { validate, version } from "uuid";

export const isValidUUIDv4 = (uuid: string): boolean => {
  return validate(uuid) && version(uuid) === 4;
};
