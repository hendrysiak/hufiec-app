import { ActionTypes } from './action.enum';
import { Authorization, SetRoles } from './action.types';


export const reduxIsAuthenticated = (isAuthentication: boolean): Authorization => {
  return {
    type: ActionTypes.AUTHORIZATION,
    isAuthentication
  };
};

export const reduxSetRoles = (roles: string[]): SetRoles => {
  return {
    type: ActionTypes.SET_ROLES,
    roles
  };
};