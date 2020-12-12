import { ApprovedEvent } from 'models/codes.models';
import { IncomesBankModel, IncomesWithImportDate, OutcomesWithFinanceMethod } from 'models/income.models';
import { Registry } from 'models/registry.models';

import { ActionTypes } from './action.enum';
import { SetIncome, GetCodes, GetCodesWithTeams, GetAccountState, GetRegistry, GetImportDates, EditIncome, AssignIncomesToAccount, AssignOutcomesToAccount } from './action.types';


export const reduxSetIncome = (income: IncomesBankModel[]): SetIncome => {
  return {
    type: ActionTypes.FETCH_FILE,
    income,
  };
};

export const reduxGetCodes = (codes: ApprovedEvent[]): GetCodes => {
  return {
    type: ActionTypes.FETCH_CODES,
    codes
  };
};

export const reduxGetCodesWithTeams = (codes: ApprovedEvent[]): GetCodesWithTeams => {
  return {
    type: ActionTypes.FETCH_CODES_TEAMS,
    codes
  };
};

export const reduxGetAccountState = (
  incomes: IncomesWithImportDate[], 
  outcomes: OutcomesWithFinanceMethod[]
): GetAccountState => {

  return {
    type: ActionTypes.SET_ACCOUNT_STATE,
    incomes,
    outcomes
  };
};

export const reduxGetRegistry = (registry: Registry): GetRegistry => {
  return {
    type: ActionTypes.SET_REGISTRY_STATE,
    registry
  };
};

export const reduxGetImportDates = (importDates: string[]): GetImportDates => {
  return {
    type: ActionTypes.SET_IMPORT_DATES,
    importDates
  };
};

export const reduxEditIncome = (income: IncomesBankModel[]): EditIncome => {
  return {
    type: ActionTypes.EDIT_INCOME,
    income
  };
};

export const reduxAssignIncomesToAccount = (incomes: IncomesWithImportDate[]): AssignIncomesToAccount => {
  return {
    type: ActionTypes.ASSIGN_INCOME_TO_ACCOUNT,
    incomes
  };
};
export const reduxAssignOutcomesToAccount = (outcomes: OutcomesWithFinanceMethod[]): AssignOutcomesToAccount => {
  return {
    type: ActionTypes.ASSIGN_OUTCOME_TO_ACCOUNT,
    outcomes
  };
};