import { ActionTypes } from './action.enum';
import { setAuthenticationState, SetEvidenceNumber, SetRoles, SetTeam } from './action.types';


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
export const reduxSetEvidenceNumber = (evidenceNumber: string): SetEvidenceNumber => {
  return {
    type: ActionTypes.SET_EVIDENCE_NUMBER,
    evidenceNumber
  };
};