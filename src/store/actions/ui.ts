import { ActionTypes } from './action.enum';
import { LoadingEnd, LoadingStart, SetSendingTeam } from './action.types';

export const reduxLoadingEnd = (): LoadingEnd => {
  return {
    type: ActionTypes.LOADING_END,

  };
};

export const reduxLoadingStart = (): LoadingStart => {
  return {
    type: ActionTypes.LOADING_START
  };
};

export const reduxSetSendingTeam = (team: string): SetSendingTeam => {
  return {
    type: ActionTypes.FETCH_FILE,
    team
  };
};