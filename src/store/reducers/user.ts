
import { ActionTypes } from 'store/actions/action.enum';
import { ActionType } from 'store/actions/action.types';
import { UserState } from 'store/models/user.state.model';

const initialState: UserState = {
  isAuthenticated: null,
  roles: null,
  team: null,
};

const reducer = (state = initialState, action: ActionType): UserState => {
  switch (action.type) {
    case ActionTypes.SET_AUTHENTICATION_STATE:
      return {
        ...state,
        isAuthenticated: action.isAuthenticated
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