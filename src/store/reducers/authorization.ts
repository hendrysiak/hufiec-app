
import { ActionTypes } from 'store/actions/action.enum';
import { ActionType } from 'store/actions/action.types';
import { IAuthorization } from 'store/models/authorization.model.state';

const initialState: IAuthorization = {
  isAuthorization: null,
};

const reducer = (state = initialState, action: ActionType): IAuthorization => {
  switch (action.type) {
    case ActionTypes.AUTHORIZATION:
      return {
        ...state,
        isAuthorization: action.isAuthentication
      };
    default:
      return state;

  }
};

export default reducer;