import { ApprovedEvent } from 'models/codes.models';
import { IncomesBankModel, IncomesWithImportDate, OutcomesWithEvent, OutcomesWithFinanceMethod } from 'models/income.models';
import { Registry } from 'models/registry.models';

import { ActionTypes } from './action.enum';

export interface LoadingEnd {
  type: ActionTypes.LOADING_END;
};

export interface LoadingStart {
  type: ActionTypes.LOADING_START;
};

export interface SetIncome {
  type: ActionTypes.FETCH_FILE;
  income: IncomesBankModel[];
};

export interface GetCodes {
  type: ActionTypes.FETCH_CODES;
  codes: ApprovedEvent[];
};

export interface GetCodesWithTeams {
  type: ActionTypes.FETCH_CODES_TEAMS;
  codes: ApprovedEvent[];
};

export interface GetAccountState {
  type: ActionTypes.SET_ACCOUNT_STATE;
  incomes: IncomesWithImportDate[];
  outcomes: OutcomesWithEvent[];
};

export interface GetRegistry {
  type: ActionTypes.SET_REGISTRY_STATE;
  registry: Registry;
};

export interface GetImportDates {
  type: ActionTypes.SET_IMPORT_DATES;
  importDates: string[];
};


export interface EditIncome {
  type: ActionTypes.EDIT_INCOME;
  income: IncomesBankModel[];
};

export interface AssignIncomesToAccount {
  type: ActionTypes.ASSIGN_INCOME_TO_ACCOUNT;
  incomes: IncomesWithImportDate[];
};
export interface AssignOutcomesToAccount {
  type: ActionTypes.ASSIGN_OUTCOME_TO_ACCOUNT;
  outcomes: OutcomesWithFinanceMethod[];
};

export type ActionType = 
| LoadingEnd
| LoadingStart
| SetIncome
| GetCodes
| GetCodesWithTeams 
| GetAccountState
| GetRegistry
| GetImportDates 
| EditIncome 
| AssignIncomesToAccount 
| AssignOutcomesToAccount