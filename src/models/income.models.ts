import { FinanceMethod, FoundingSources, OutcomeCategory } from './global.enum';
import { IObjectKeys } from './object.helper.model';

export interface IncomesBankModel extends IObjectKeys {
  cash: number;
  title: string;
  dateOfBook: Date;
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
  importDate: Date;
}

export interface IncomeDb extends IncomesWithImportDate {
  id: string;
}

export interface OutcomesBankModel extends IObjectKeys{
  cash: number;
  title: string;
  dateOfBook: Date;
};

export interface OutcomesWithImportDate extends OutcomesBankModel{
  importDate: Date;
};

export interface OutcomesWithFinanceMethod extends OutcomesWithImportDate {
  financeMethod: FinanceMethod
};

export interface OutcomesWithData extends OutcomesWithFinanceMethod {
  outcomeCategory: OutcomeCategory;
  foundingSource: FoundingSources;
  team: string;
}

export interface OutcomesWithEvent extends OutcomesWithData {
  event: string | null;
  bilingNr: string | null;
}

export interface OutcomeDb extends OutcomesWithEvent {
  id: string;
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
