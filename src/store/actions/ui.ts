import { ActionTypes } from './action.enum';
import { LoadingEnd, LoadingStart } from './action.types';

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
