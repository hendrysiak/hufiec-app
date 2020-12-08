import { ActionTypes } from './action.enum';

export interface LoadingEnd {
  type: ActionTypes.LOADING_END;
};

export interface LoadingStart {
  type: ActionTypes.LOADING_START;
};

export interface SetSendingTeam {
  type: ActionTypes.FETCH_FILE;
  team: string;
};

export interface SetIncome {
  type: ActionTypes
}