import { ApprovedEvent } from 'models/codes.models';
import { IncomesBankModel, IncomeDb, IncomesWithImportDate, OutcomeDb, OutcomesWithFinanceMethod, InitAccountState } from 'models/income.models';
import { APIPerson, Registry } from 'models/registry.models';

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
  incomes: IncomeDb[];
  outcomes: OutcomeDb[];
};

export interface GetRegistry {
  type: ActionTypes.SET_REGISTRY_STATE;
  registry: Registry;
};

export interface GetImportDates {
  type: ActionTypes.SET_IMPORT_DATES;
  importDates: Date[];
};

export interface GetInitAccountState {
  type: ActionTypes.SET_INIT_ACCOUT_STATE;
  initAccountState: InitAccountState[];
};


export interface EditIncome {
  type: ActionTypes.EDIT_INCOME;
  income: IncomesBankModel[];
};

export interface EditDbIncome {
  type: ActionTypes.EDIT_DB_INCOME;
  income: IncomeDb;
};

export interface EditDbOutcome {
  type: ActionTypes.EDIT_DB_OUTCOME;
  outcome: OutcomeDb;
};

export interface AddDbIncome {
  type: ActionTypes.ADD_DB_INCOME;
  income: IncomeDb;
};

export interface AddDbOutcome {
  type: ActionTypes.ADD_DB_OUTCOME;
  outcome: OutcomeDb;
};

export interface DeleteDbIncome {
  type: ActionTypes.DELETE_DB_INCOME;
  id: string;
};

export interface DeleteDbOutcome {
  type: ActionTypes.DELETE_DB_OUTCOME;
  id: string;
};

export interface AssignIncomesToAccount {
  type: ActionTypes.ASSIGN_INCOME_TO_ACCOUNT;
  incomes: IncomesWithImportDate[];
};
export interface AssignOutcomesToAccount {
  type: ActionTypes.ASSIGN_OUTCOME_TO_ACCOUNT;
  outcomes: OutcomesWithFinanceMethod[];
};

export interface AddMember {
  type: ActionTypes.ADD_MEMBER;
  member: APIPerson;
}

export interface EditMember {
  type: ActionTypes.EDIT_MEMBER;
  member: APIPerson;
  team: string;
}

export interface DeleteMember {
  type: ActionTypes.DELETE_MEMBER;
  member: APIPerson;
}

export interface ChangeTeamMember {
  type: ActionTypes.CHANGE_TEAM_MEMBER;
  member: APIPerson;
}

export interface setAuthenticationState {
  type: ActionTypes.SET_AUTHENTICATION_STATE;
  isAuthenticated: boolean | null;
}

export interface SetRoles {
  type: ActionTypes.SET_ROLES;
  roles: string[];
}
export interface SetTeam {
  type: ActionTypes.SET_TEAM;
  team: string;
}

export type ActionType = 
| LoadingEnd
| LoadingStart
| SetIncome
| GetCodes
| GetCodesWithTeams 
| GetAccountState
| GetRegistry
| GetImportDates 
| GetInitAccountState
| EditIncome 
| EditDbIncome
| EditDbOutcome
| AddDbIncome
| AddDbOutcome
| DeleteDbIncome
| DeleteDbOutcome
| AssignIncomesToAccount 
| AssignOutcomesToAccount
| AddMember
| EditMember
| DeleteMember
| ChangeTeamMember
| setAuthenticationState
| SetRoles
| SetTeam
