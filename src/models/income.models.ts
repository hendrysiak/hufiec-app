import { FinanceMethod } from './global.enum';

export interface IncomesBankModel {
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
export interface OutcomesBankModel {
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


