import { ActionTypes } from './action.enum';
import { Authorization, SetRoles, SetTeam } from './action.types';


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
export const reduxSetTeam = (team: string): SetTeam => {
  return {
    type: ActionTypes.SET_TEAM,
    team
  };
};