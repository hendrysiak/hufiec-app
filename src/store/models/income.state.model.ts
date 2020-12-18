import { ApprovedEvent } from 'models/codes.models';

import { 
  IncomesBankModel, 
  IncomesWithImportDate,  
  OutcomesWithEvent,  
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
  dbOutcomes: OutcomesWithEvent[] | null,
  codes: ApprovedEvent[] | null,
  importDates: string[] | null;
};