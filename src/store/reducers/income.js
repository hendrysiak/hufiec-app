import * as actionTypes from '../actions/actionTypes';


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

const reducer = (state = initialState, action) => {
    switch (action.type) {

        case actionTypes.FETCH_FILE:
            return {
                ...state,
                initIncome: action.income
            };
        case actionTypes.FETCH_CODES:
            return {
                ...state,
                codes: action.codes
            };
        case actionTypes.FETCH_FILE_FAILED:
            return {
                ...state,
                error: action.error
            }
        case actionTypes.SET_ACCOUNT_STATE: {
            return {
                ...state,
                dbIncomes: action.incomes,
                dbOutcomes: action.outcomes
            }
        }
        case actionTypes.SET_REGISTRY_STATE: {
            return {
                ...state,
                registry: action.registry
            }
        }
        case actionTypes.EDIT_INCOME:
            const editingIncomes = action.editIncome
            return {
                ...state,
                initIncome: [...editingIncomes]
            };
        case actionTypes.ASSIGN_INCOME_BY_CODE:
            const assignedIncome = action.income
            return {
                ...state,
                assignedIncome
            }
        case actionTypes.ASSIGN_INCOME_TO_ACCOUNT:
            const updatedIncomes = action.incomes
            return {
                ...state,
                sortedIncomes: { ...updatedIncomes } 
            }
        case actionTypes.ASSIGN_OUTCOME_TO_ACCOUNT:
            const updatedOutcomes = action.outcomes
            return {
                ...state,
                sortedOutcomes: { ...updatedOutcomes } 
            }
        case actionTypes.SET_IMPORT_DATES:
            return {
                ...state,
                importDates: action.importDates
            }
        default:
            return state;
    }

}

export default reducer;