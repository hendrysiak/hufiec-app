import { ActionTypes } from 'store/actions/action.enum';
import { UIState } from 'store/models/ui.state.model';


const initialState: UIState = {
  loading: true,
  sendingTeam: null,
};

const reducer = (state = initialState, action: any): UIState => {
  switch (action.type) {
    case ActionTypes.LOADING_START:
      return {
        ...state,
        loading: true
      };
    case ActionTypes.LOADING_END:
      return {
        ...state,
        loading: false
      };
    case ActionTypes.SENDING_TEAM:
      return {
        ...state,
        sendingTeam: action.sendingTeam
      };
    default:
      return state;

  }
};

export default reducer;