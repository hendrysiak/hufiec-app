export type Code = {
  code: string;
  teams?: string[];
};

export interface Codes {
  [key: string]: Code[];
}