import { ApprovedEvent } from 'models/codes.models';
import { IncomesBankModel, IncomeDb, IncomesWithImportDate, OutcomeDb, OutcomesWithFinanceMethod } from 'models/income.models';
import { APIPerson, Registry } from 'models/registry.models';

import { ActionTypes } from './action.enum';
import { SetIncome, GetCodes, GetCodesWithTeams, GetAccountState, GetRegistry, GetImportDates, EditIncome, AssignIncomesToAccount, AssignOutcomesToAccount, EditDbOutcome, EditDbIncome, AddDbIncome, AddDbOutcome, DeleteDbIncome, DeleteDbOutcome, AddMember, EditMember, DeleteMember } from './action.types';


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
  incomes: IncomeDb[], 
  outcomes: OutcomeDb[]
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

export const reduxGetImportDates = (importDates: Date[]): GetImportDates => {
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

export const reduxEditDbIncome = (income: IncomeDb): EditDbIncome => {
  return {
    type: ActionTypes.EDIT_DB_INCOME,
    income
  };
};

export const reduxEditDbOutcome = (outcome: OutcomeDb): EditDbOutcome => {
  return {
    type: ActionTypes.EDIT_DB_OUTCOME,
    outcome
  };
};

export const reduxAddDbIncome = (income: IncomeDb): AddDbIncome => {
  return {
    type: ActionTypes.ADD_DB_INCOME,
    income
  };
};

export const reduxAddDbOutcome = (outcome: OutcomeDb): AddDbOutcome => {
  return {
    type: ActionTypes.ADD_DB_OUTCOME,
    outcome
  };
};

export const reduxDeleteDbIncome = (id: string): DeleteDbIncome => {
  return {
    type: ActionTypes.DELETE_DB_INCOME,
    id
  };
};

export const reduxDeleteDbOutcome = (id: string): DeleteDbOutcome => {
  return {
    type: ActionTypes.DELETE_DB_OUTCOME,
    id
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
export const reduxAddMember = (member: APIPerson): AddMember => {
  return {
    type: ActionTypes.ADD_MEMBER,
    member
  };
};
export const reduxEditMember = (member: APIPerson, team: string): EditMember => {
  return {
    type: ActionTypes.EDIT_MEMBER,
    member,
    team
  };
};
export const reduxDeleteMember = (member: APIPerson): DeleteMember => {
  return {
    type: ActionTypes.DELETE_MEMBER,
    member
  };
};
