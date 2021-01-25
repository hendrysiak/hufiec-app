import { ActionTypes } from './action.enum';
import { Authorization } from './action.types';


export const reduxIsAuthenticated = (isAuthentication: boolean): Authorization => {
  return {
    type: ActionTypes.AUTHORIZATION,
    isAuthentication
  };
};