
import { ActionTypes } from 'store/actions/action.enum';
import { ActionType } from 'store/actions/action.types';
import { UserState } from 'store/models/user.state.model';

const initialState: UserState = {
  isAuthentication: null,
  roles: null,
  team: null,
};

const reducer = (state = initialState, action: ActionType): UserState => {
  switch (action.type) {
    case ActionTypes.AUTHENTICATION:
      return {
        ...state,
        isAuthentication: action.isAuthentication
        // isAuthorization: action.isAuthentication
      };
    case ActionTypes.SET_ROLES:
      return {
        ...state,
        roles: action.roles
      };
    case ActionTypes.SET_TEAM:
      return {
        ...state,
        team: action.team
      };
    default:
      return state;

  }
};

export default reducer;