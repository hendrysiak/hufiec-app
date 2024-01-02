import { ApprovedEvent, CodesMap } from 'models/codes.models';
import {
  IncomesBankModel, IncomeDb, IncomesWithImportDate, OutcomeDb, OutcomesWithFinanceMethod, InitAccountState,
} from 'models/income.models';
import { APIPerson, Registry } from 'models/registry.models';

import { ActionTypes } from './action.enum';
import {
  SetIncome, GetCodes, GetCodesWithTeams, GetAccountState, GetRegistry, GetImportDates, EditIncome, AssignIncomesToAccount, AssignOutcomesToAccount, EditDbOutcome, EditDbIncome, AddDbIncome, AddDbOutcome, DeleteDbIncome, DeleteDbOutcome, AddMember, EditMember, DeleteMember, GetInitAccountState, SetFilteredCodes, SetAccountsState, EditAccountState,
} from './action.types';

export const reduxSetIncome = (income: IncomesBankModel[]): SetIncome => ({
  type: ActionTypes.FETCH_FILE,
  income,
});

export const reduxGetCodes = (codes: CodesMap): GetCodes => ({
  type: ActionTypes.FETCH_CODES,
  codes,
});

export const reduxGetCodesWithTeams = (codes: CodesMap): GetCodesWithTeams => ({
  type: ActionTypes.FETCH_CODES_TEAMS,
  codes,
});

export const reduxSetFilteredCodes = (codes: ApprovedEvent[]): SetFilteredCodes => ({
  type: ActionTypes.SET_FILTERED_CODES,
  codes,
});

export const reduxGetAccountState = (
  incomes: IncomeDb[],
  outcomes: OutcomeDb[],
): GetAccountState => ({
  type: ActionTypes.SET_ACCOUNT_STATE,
  incomes,
  outcomes,
});

export const reduxGetRegistry = (registry: Registry): GetRegistry => ({
  type: ActionTypes.SET_REGISTRY_STATE,
  registry,
});

export const reduxGetImportDates = (importDates: Date[]): GetImportDates => ({
  type: ActionTypes.SET_IMPORT_DATES,
  importDates,
});

export const reduxGetInitAccountState = (initAccountState: InitAccountState[]): GetInitAccountState => ({
  type: ActionTypes.SET_INIT_ACCOUT_STATE,
  initAccountState,
});

export const reduxEditIncome = (income: IncomesBankModel[]): EditIncome => ({
  type: ActionTypes.EDIT_INCOME,
  income,
});

export const reduxEditDbIncome = (income: IncomeDb): EditDbIncome => ({
  type: ActionTypes.EDIT_DB_INCOME,
  income,
});

export const reduxEditDbOutcome = (outcome: OutcomeDb): EditDbOutcome => ({
  type: ActionTypes.EDIT_DB_OUTCOME,
  outcome,
});

export const reduxAddDbIncome = (income: IncomeDb): AddDbIncome => ({
  type: ActionTypes.ADD_DB_INCOME,
  income,
});

export const reduxAddDbOutcome = (outcome: OutcomeDb): AddDbOutcome => ({
  type: ActionTypes.ADD_DB_OUTCOME,
  outcome,
});

export const reduxDeleteDbIncome = (id: string): DeleteDbIncome => ({
  type: ActionTypes.DELETE_DB_INCOME,
  id,
});

export const reduxDeleteDbOutcome = (id: string): DeleteDbOutcome => ({
  type: ActionTypes.DELETE_DB_OUTCOME,
  id,
});

export const reduxAssignIncomesToAccount = (incomes: IncomesWithImportDate[]): AssignIncomesToAccount => ({
  type: ActionTypes.ASSIGN_INCOME_TO_ACCOUNT,
  incomes,
});
export const reduxAssignOutcomesToAccount = (outcomes: OutcomesWithFinanceMethod[]): AssignOutcomesToAccount => ({
  type: ActionTypes.ASSIGN_OUTCOME_TO_ACCOUNT,
  outcomes,
});
export const reduxAddMember = (member: APIPerson): AddMember => ({
  type: ActionTypes.ADD_MEMBER,
  member,
});
export const reduxEditMember = (member: Partial<APIPerson>, team: number): EditMember => ({
  type: ActionTypes.EDIT_MEMBER,
  member,
  team,
});
export const reduxDeleteMember = (member: APIPerson): DeleteMember => ({
  type: ActionTypes.DELETE_MEMBER,
  member,
});
export const reduxSetAccountsState = (accounts: Record<string, number>): SetAccountsState => ({
  type: ActionTypes.SET_ACCOUNTS_STATE,
  accounts,
});
export const reduxEditAccountState = (team: number, cash: number): EditAccountState => ({
  type: ActionTypes.EDIT_ACCOUNT_STATE,
  team,
  cash,
});
