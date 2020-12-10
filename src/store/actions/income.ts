import axios from 'axios';

import { ActionTypes } from './action.enum';

export const reduxSetIncome = (income: any[]) => {
  return {
    type: ActionTypes.FETCH_FILE,
    income
  };
};

export const reduxGetCodes = (codes: any) => {
  return {
    type: ActionTypes.FETCH_CODES,
    codes
  };
};

export const reduxGetCodesWithTeams = (codes: any) => {
  return {
    type: ActionTypes.FETCH_CODES_TEAMS,
    codes
  };
};

export const reduxGetAccountState = (incomes: any, outcomes: any) => {
  return {
    type: ActionTypes.SET_ACCOUNT_STATE,
    incomes,
    outcomes
  };
};

export const reduxGetRegistry = (registry: any) => {
  return {
    type: ActionTypes.SET_REGISTRY_STATE,
    registry
  };
};

export const reduxGetImportDates = (importDates: any) => {
  return {
    type: ActionTypes.SET_IMPORT_DATES,
    importDates
  };
};


export const reduxEditIncome = (income: any) => {
  return {
    type: ActionTypes.EDIT_INCOME,
    income
  };
};


export const reduxAssignIncomesToAccount = (incomes: any) => {
  return {
    type: ActionTypes.ASSIGN_INCOME_TO_ACCOUNT,
    incomes
  };
};
export const reduxAssignOutcomesToAccount = (outcomes: any) => {
  return {
    type: ActionTypes.ASSIGN_OUTCOME_TO_ACCOUNT,
    outcomes
  };
};