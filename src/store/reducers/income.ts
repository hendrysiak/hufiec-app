import { ActionTypes } from 'store/actions/action.enum';
import { ActionType } from 'store/actions/action.types';

import { IncomeState } from 'store/models/income.state.model';

const initialState: IncomeState = {
  error: null,
  initIncome: null,
  registry: null,
  assignedIncome: null,
  sortedIncomes: null,
  sortedOutcomes: null,
  dbIncomes: null,
  dbOutcomes: null,
  codes: null,
  importDates: null
};

const reducer = (state = initialState, action: ActionType): IncomeState => {
  switch (action.type) {
    case ActionTypes.FETCH_FILE:
      return {
        ...state,
        initIncome: action.income
      };
    case ActionTypes.FETCH_CODES:
      return {
        ...state,
        codes: action.codes
      };

    case ActionTypes.SET_ACCOUNT_STATE: {
      return {
        ...state,
        dbIncomes: action.incomes,
        dbOutcomes: action.outcomes
      };
    }
    case ActionTypes.SET_REGISTRY_STATE: {
      return {
        ...state,
        registry: action.registry
      };
    }
    case ActionTypes.EDIT_INCOME:
      const editingIncomes = action.income;
      return {
        ...state,
        initIncome: [...editingIncomes]
      };
    case ActionTypes.ASSIGN_INCOME_TO_ACCOUNT:
      const updatedIncomes = action.incomes;
      return {
        ...state,
        sortedIncomes: { ...updatedIncomes } 
      };
    case ActionTypes.ASSIGN_OUTCOME_TO_ACCOUNT:
      const updatedOutcomes = action.outcomes;
      return {
        ...state,
        sortedOutcomes: { ...updatedOutcomes } 
      };
    case ActionTypes.SET_IMPORT_DATES:
      return {
        ...state,
        importDates: action.importDates
      };
    default:
      return state;
  }

};

export default reducer;