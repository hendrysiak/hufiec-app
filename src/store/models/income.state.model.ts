import { ApprovedEvent ,CodesMap } from 'models/codes.models';

import { 
  IncomesBankModel, 
  IncomesWithImportDate,  
  IncomeDb,
  OutcomeDb,  
  OutcomesWithFinanceMethod, 
  InitAccountState
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
  codesMap: CodesMap | null,
  importDates: Date[] | null;
  initAccount: InitAccountState[]
};