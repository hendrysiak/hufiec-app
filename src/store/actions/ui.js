import * as actionTypes from './actionTypes';

export const loadingEnd = () => {
  return {
      type: actionTypes.LOADING_END,

  }
}

export const loadingStart = () => {
  return {
      type: actionTypes.LOADING_START
  }
}

export const setSendingTeam = (team) => {
  return {
    type: actionTypes.FETCH_FILE,
    team
  }
}