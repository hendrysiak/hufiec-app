export type Person = {
  name: string;
  surname: string;
  dateOfAdd?: string;
  dateOfDelete?: string;
  team?: string;
};

export interface APIPerson extends Person {
  id: string;
}

export interface Registry {
  [key: string]: APIPerson[]
};