import { Codes } from 'models/codes.models';

import { 
  IncomesBankModel, 
  IncomesWithImportDate, 
  OutcomesBankModel, 
  OutcomesWithFinanceMethod 
} from 'models/income.models';

import { Registry } from 'models/registry.models';

export interface IncomeState {
  error: boolean | null,
  initIncome: IncomesBankModel[] | null,
  registry: Registry | null,
  assignedIncome: null,
  sortedIncomes: IncomesBankModel[] | null,
  sortedOutcomes: OutcomesBankModel[] | null,
  dbIncomes: IncomesWithImportDate[] | null,
  dbOutcomes: OutcomesWithFinanceMethod[] | null,
  codes: Codes | null,
  importDates: string[] | null;
};