import { FinanceMethod, FoundingSources, OutcomeCategory } from './global.enum';

interface IObjectKeys {
  [key: string]: string | number | null;
}

export interface IncomesBankModel extends IObjectKeys {
  cash: number;
  title: string;
  dateOfBook: string;
};
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
  importDate: string | null;
}
//////////////////////////////////
export interface OutcomesBankModel extends IObjectKeys{
  cash: number;
  title: string;
  dateOfBook: string;
};
export interface OutcomesWithImportDate extends OutcomesBankModel{
  importDate: string | null;
};
export interface OutcomesWithFinanceMethod extends OutcomesWithImportDate {
  financeMethod: FinanceMethod
};

export interface OutcomesWithData extends OutcomesWithFinanceMethod {
  outcomeCategory: OutcomeCategory;
  foundingSources: FoundingSources;
  team: string;
}

export interface OutcomesWithEvent extends OutcomesWithData {
  event: string | null;
  bilingNr: string | null;
}

export interface IncomePurpose {
  cash: string;
  source: string;
};

export interface IncomePurposeDB {
  cash: number;
  purpose: string;
};
export interface OutcomePurpose {
  cash: string;
  purpose: string;
};
export interface OutcomePurposeDB {
  cash: number;
  purpose: string;
};
