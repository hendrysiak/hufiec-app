export type Person = {
  name: string;
  surname: string;
};

export interface Registry {
  [key: string]: Person[]
};