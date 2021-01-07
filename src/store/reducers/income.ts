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
  dbIncomes: [],
  dbOutcomes: [],
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

    case ActionTypes.SET_ACCOUNT_STATE: 
      return {
        ...state,
        dbIncomes: action.incomes,
        dbOutcomes: action.outcomes
      };
    
    case ActionTypes.SET_REGISTRY_STATE: 
      return {
        ...state,
        registry: action.registry
      };
    
    case ActionTypes.EDIT_INCOME:
      const editingIncomes = action.income;
      return {
        ...state,
        initIncome: [...editingIncomes]
      };

    case ActionTypes.EDIT_DB_INCOME:
      const updatedIncomes = state.dbIncomes.map(di => {
        if (di.id === action.income.id) return { ...action.income };
        else return { ...di };
      });
      return {
        ...state,
        dbIncomes: updatedIncomes
      };

    case ActionTypes.EDIT_DB_OUTCOME:
      const updatedOutcomes = state.dbOutcomes.map(di => {
        if (di.id === action.outcome.id) return { ...action.outcome };
        else return { ...di };
      });;
      return {
        ...state,
        dbOutcomes: updatedOutcomes
      };

    case ActionTypes.ADD_DB_INCOME:
      return {
        ...state,
        dbIncomes: [...state.dbIncomes, action.income]
      };

    case ActionTypes.ADD_DB_OUTCOME:
      console.log('Dodaję');
      return {
        ...state,
        dbOutcomes: [...state.dbOutcomes, action.outcome]
      };

    case ActionTypes.DELETE_DB_INCOME:
      const indexOfIncomeToDelete = state.dbIncomes.findIndex(i => i.id === action.id);
      const updatedDbIncomes = [...state.dbIncomes];
      updatedDbIncomes.splice(indexOfIncomeToDelete, 1);
      return {
        ...state,
        dbIncomes: updatedDbIncomes
      };

    case ActionTypes.DELETE_DB_OUTCOME:
      const indexOfOutcomeToDelete = state.dbOutcomes.findIndex(o => o.id === action.id);
      const updatedDbOutcomes = [...state.dbOutcomes];
      updatedDbOutcomes.splice(indexOfOutcomeToDelete, 1);
      return {
        ...state,
        dbOutcomes: updatedDbOutcomes
      };

    case ActionTypes.ASSIGN_INCOME_TO_ACCOUNT:
      const incomesAfterSortingByAccount = action.incomes;
      return {
        ...state,
        sortedIncomes: { ...incomesAfterSortingByAccount } 
      };

    case ActionTypes.ASSIGN_OUTCOME_TO_ACCOUNT:
      const outcomesAfterSortingByAccount = action.outcomes;
      return {
        ...state,
        sortedOutcomes: { ...outcomesAfterSortingByAccount } 
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