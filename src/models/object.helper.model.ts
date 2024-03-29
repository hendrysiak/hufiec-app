export interface IObjectKeys {
  [key: string]: string | number | null | undefined | Date | boolean | string[];
}

export const getKeyValue = <T extends object, U extends keyof T>(key: U) => (obj: T) => obj[key];
