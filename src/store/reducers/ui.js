import * as actionTypes from '../actions/actionTypes';


const initialState = {
  loading: true,
  sendingTeam: null,
}

const reducer = (state = initialState, action) => {
  switch (action.type) {
    case actionTypes.LOADING_START:
      return {
          ...state,
          loading: true
      }
  case actionTypes.LOADING_END:
      return {
          ...state,
          loading: false
      }
  case actionTypes.SENDING_TEAM:
      return {
          ...state,
          sendingTeam: action.sendingTeam
      }
    default:
      return state;

  }
}

export default reducer;