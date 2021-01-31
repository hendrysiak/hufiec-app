
import { ActionTypes } from 'store/actions/action.enum';
import { ActionType } from 'store/actions/action.types';
import { IUser } from 'store/models/user.model.state';

const initialState: IUser = {
  isAuthorization: null,
  roles: null,
};

const reducer = (state = initialState, action: ActionType): IUser => {
  switch (action.type) {
    case ActionTypes.AUTHORIZATION:
      return {
        ...state,
        isAuthorization: action.isAuthentication
      };
    case ActionTypes.SET_ROLES:
      return {
        ...state,
        roles: action.roles
      };
    default:
      return state;

  }
};

export default reducer;