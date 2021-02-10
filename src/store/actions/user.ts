import { ActionTypes } from './action.enum';
import { Authentication, SetRoles, SetTeam } from './action.types';


export const reduxIsAuthentication = (isAuthentication: boolean): Authentication => {
  return {
    type: ActionTypes.AUTHENTICATION,
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