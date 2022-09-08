import { IObjectKeys } from './object.helper.model';

export interface Person extends IObjectKeys {
  name: string;
  surname: string;
  dateOfAdd: Date | null;
  dateOfDelete?: Date | null;
  team?: number;
  evidenceNumber?: string;
  disability?: boolean;
  instructor?: boolean;
};

export interface APIPerson extends Person {
  id: string;
}

export interface Registry {
  [key: string]: Record<string, APIPerson>
};