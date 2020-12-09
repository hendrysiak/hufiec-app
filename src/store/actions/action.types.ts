import { ActionTypes } from './action.enum';

export interface LoadingEnd {
  type: ActionTypes.LOADING_END;
};

export interface LoadingStart {
  type: ActionTypes.LOADING_START;
};

export interface SetIncome {
  type: ActionTypes
}

export type ActionType = 
| LoadingEnd
| LoadingStart
| SetIncome