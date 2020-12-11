import { createStore, applyMiddleware, combineReducers } from 'redux';

import { composeWithDevTools } from 'redux-devtools-extension';
import thunk from 'redux-thunk';


import incomeReducer from './reducers/income';
import uiReducer from './reducers/ui';

const rootReducer = combineReducers({
  income: incomeReducer,
  ui: uiReducer
});

const store = createStore(
  rootReducer,
  composeWithDevTools(applyMiddleware(thunk))
);

export default store;