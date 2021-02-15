import { ActionTypes } from './action.enum';
import { setAuthenticationState, SetRoles, SetTeam } from './action.types';


export const reduxIsAuthentication = (isAuthenticated: boolean): setAuthenticationState => {
  return {
    type: ActionTypes.SET_AUTHENTICATION_STATE,
    isAuthenticated
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