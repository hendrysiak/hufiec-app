import { ApprovedEvent } from 'models/codes.models';

import { 
  IncomesBankModel, 
  IncomesWithImportDate,  
  IncomeDb,
  OutcomeDb,  
  OutcomesWithFinanceMethod 
} from 'models/income.models';

import { Registry } from 'models/registry.models';

export interface IncomeState {
  error: boolean | null,
  initIncome: IncomesBankModel[] | null,
  registry: Registry,
  assignedIncome: null,
  sortedIncomes: IncomesWithImportDate[] | null,
  sortedOutcomes: OutcomesWithFinanceMethod[] | null,
  dbIncomes: IncomeDb[],
  dbOutcomes: OutcomeDb[],
  codes: ApprovedEvent[] | null,
  importDates: string[] | null;
};