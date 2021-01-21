import { IObjectKeys } from './object.helper.model';

export interface Person extends IObjectKeys {
  name: string;
  surname: string;
  dateOfAdd: Date | null;
  dateOfDelete?: Date | null;
  team?: string;
};

export interface APIPerson extends Person {
  id: string;
}

export interface Registry {
  [key: string]: APIPerson[]
};