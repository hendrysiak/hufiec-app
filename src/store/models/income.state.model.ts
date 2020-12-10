import { ApprovedEvent } from 'models/codes.models';

import { 
  IncomesBankModel, 
  IncomesWithImportDate,  
  OutcomesWithFinanceMethod 
} from 'models/income.models';

import { Registry } from 'models/registry.models';

export interface IncomeState {
  error: boolean | null,
  initIncome: IncomesBankModel[] | null,
  registry: Registry | null,
  assignedIncome: null,
  sortedIncomes: IncomesWithImportDate[] | null,
  sortedOutcomes: OutcomesWithFinanceMethod[] | null,
  dbIncomes: IncomesWithImportDate[] | null,
  dbOutcomes: OutcomesWithFinanceMethod[] | null,
  codes: ApprovedEvent[] | null,
  importDates: string[] | null;
};