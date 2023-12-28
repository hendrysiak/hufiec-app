import { ErrorType } from './error.types.model';
import { FinanceMethod, FoundingSources, IncomeCategory, OutcomeCategory } from './global.enum';
import { IObjectKeys } from './object.helper.model';

export interface IncomesBankModel extends IObjectKeys {
  cash: number;
  title: string;
  dateOfBook: Date | string;
  errors?: ErrorType[];
}

export interface IncomesWithTeam extends IncomesBankModel {
  team: string | null;
}

export interface IncomesWithEvent extends IncomesWithTeam {
  event: string | null;
}

export interface IncomesWithPerson extends IncomesWithEvent {
  name: string | null;
  surname: string | null;
}

export interface IncomesWithYear extends IncomesWithPerson {
  year: number | null;
}

export interface IncomesWithImportDate extends IncomesWithYear {
  importDate: Date | string;
  orgNumber?: string;
}

export interface IncomeDb extends IncomesWithImportDate {
  id: string;
  letterReceived?: boolean;
  dateOfLetter?: Date | string;
  comment?: string;
  incomeCategory?: IncomeCategory | string;
}

export interface OutcomesBankModel extends IObjectKeys {
  cash: number;
  title: string;
  dateOfBook: Date | string;
  errors?: ErrorType[];
}

export interface OutcomesWithEvent extends OutcomesBankModel {
  event: string | null;
}

export interface OutcomesWithImportDate extends OutcomesWithEvent {
  importDate: Date | string;
}

export interface OutcomesWithFinanceMethod extends OutcomesWithImportDate {
  financeMethod: FinanceMethod
}

export interface OutcomesWithData extends OutcomesWithFinanceMethod {
  outcomeCategory: OutcomeCategory;
  foundingSource: FoundingSources;
  team: string;
}

export interface OutcomeWithBilingNr extends OutcomesWithData {
  bilingNr: string | null;
}

export interface OutcomeDb extends OutcomeWithBilingNr {
  id: string;
  orgNumber?: string;
}

export interface IncomePurpose {
  cash: string;
  source: string;
}

export interface IncomePurposeDB {
  cash: number;
  purpose: string;
}
export interface OutcomePurpose {
  cash: string;
  purpose: string;
}
export interface OutcomePurposeDB {
  cash: number;
  purpose: string;
}

export interface Amount {
  [key: string]: number
}

export interface InitAccountState {
  name: string;
  surname: string;
  team: string;
  year: number;
  balance: number
}
