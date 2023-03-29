import { ActionTypes } from 'store/actions/action.enum';
import { ActionType } from 'store/actions/action.types';
import { UIState } from 'store/models/ui.state.model';

const initialState: UIState = {
  loading: true,
  sendingTeam: null,
};

const reducer = (state = initialState, action: ActionType): UIState => {
  switch (action.type) {
    case ActionTypes.LOADING_START:
      return {
        ...state,
        loading: true,
      };
    case ActionTypes.LOADING_END:
      return {
        ...state,
        loading: false,
      };
    default:
      return state;
  }
};

export default reducer;
