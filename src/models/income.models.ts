import { FinanceMethod, FoundingSources, OutcomeCategory } from './global.enum';
import { IObjectKeys } from './object.helper.model';

export interface IncomesBankModel extends IObjectKeys {
  cash: number;
  title: string;
  dateOfBook: Date | string;
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
  importDate: Date | string;
}

export interface IncomeDb extends IncomesWithImportDate {
  id: string;
}

export interface OutcomesBankModel extends IObjectKeys{
  cash: number;
  title: string;
  dateOfBook: Date | string;
};

export interface OutcomesWithImportDate extends OutcomesBankModel{
  importDate: Date | string;
};

export interface OutcomesWithFinanceMethod extends OutcomesWithImportDate {
  financeMethod: FinanceMethod
};

export interface OutcomesWithData extends OutcomesWithFinanceMethod {
  outcomeCategory: OutcomeCategory | null; // i wrote null
  foundingSource: FoundingSources | null; // i wrote null
  team: string | null; // i wrote null
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