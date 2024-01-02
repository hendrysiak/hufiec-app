import { IObjectKeys } from './object.helper.model';

export interface AccountStateModel extends IObjectKeys {
  cash: number;
  title: string;
  dateOfBook: Date | string;
  // errors?: ErrorType[];
}