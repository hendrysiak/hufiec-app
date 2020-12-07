import { ActionTypes } from 'store/actions/action.enum';

const initialState = {
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

const reducer = (state = initialState, action: { type: any; income: any; codes: any; error: any; incomes: any; outcomes: any; registry: any; editIncome: any; importDates: any; }) => {
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
    case ActionTypes.FETCH_FILE_FAILED:
      return {
        ...state,
        error: action.error
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
      const editingIncomes = action.editIncome;
      return {
        ...state,
        initIncome: [...editingIncomes]
      };
    case ActionTypes.ASSIGN_INCOME_BY_CODE:
      const assignedIncome = action.income;
      return {
        ...state,
        assignedIncome
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