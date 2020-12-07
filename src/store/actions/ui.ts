import { ActionTypes } from './action.enum';

export const loadingEnd = () => {
  return {
    type: ActionTypes.LOADING_END,

  };
};

export const loadingStart = (): { type: ActionTypes } => {
  return {
    type: ActionTypes.LOADING_START
  };
};

export const setSendingTeam = (team: string) => {
  return {
    type: ActionTypes.FETCH_FILE,
    team
  };
};