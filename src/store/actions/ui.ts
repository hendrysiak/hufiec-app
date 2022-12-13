import { ActionTypes } from './action.enum';
import { LoadingEnd, LoadingStart } from './action.types';

export const reduxLoadingEnd = (): LoadingEnd => ({
  type: ActionTypes.LOADING_END,

});

export const reduxLoadingStart = (): LoadingStart => ({
  type: ActionTypes.LOADING_START,
});
