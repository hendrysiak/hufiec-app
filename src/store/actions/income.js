import * as actionTypes from './actionTypes';
import axios from 'axios';

export const setIncome = income => {
    return {
        type: actionTypes.FETCH_FILE,
        income
    }
}

export const fetchCodes = codes => {
    return {
        type: actionTypes.FETCH_CODES,
        codes
    }
}

export const fetchCodesWithTeams = codes => {
    return {
        type: actionTypes.FETCH_CODES_TEAMS,
        codes
    }
}

export const fetchAccountState = (incomes, outcomes) => {
    return {
        type: actionTypes.SET_ACCOUNT_STATE,
        incomes,
        outcomes
    }
}

export const fetchRegistry = registry => {
    return {
        type: actionTypes.SET_REGISTRY_STATE,
        registry
    }
}

export const fetchImportDates = importDates => {
    return {
        type: actionTypes.SET_IMPORT_DATES,
        importDates
    }
}

export const fetchIncomeFailed = error => {
    return {
        type: actionTypes.FETCH_FILE_FAILED,
        error
    }
}

export const fetchIncome = (url) => {
    return async dispatch => {
        try {
            const result = await axios.get(url);
            const resultArray = result.data.Document.BkToCstmrAcctRpt.Rpt.Ntry;
            const resultInfo = [];
            resultArray.forEach(result => {
                resultInfo.push({
                    cash: result.CdtDbtInd === "DBIT" ?
                        `-${result.Amt.__text}` : result.Amt.__text,
                    title: result.NtryDtls.TxDtls.RmtInf.Ustrd
                });
            });
            dispatch(setIncome(resultInfo));
        } catch (err) {
            dispatch(fetchIncomeFailed(err));
        }
    };
};

export const sortedIncome = sortedIncome => {
    return {
        type: actionTypes.SORT_INCOME,
        sortedIncome
    }
}

export const editingIncome = (income) => {
    return {
        type: actionTypes.EDIT_INCOME,
        income
    }
}

export const assignIncome = (income) => {
    return {
        type: actionTypes.ASSIGN_INCOME_BY_CODE,
        income
    }
}

export const assignIncomesToAccount = (incomes) => {
    return {
        type: actionTypes.ASSIGN_INCOME_TO_ACCOUNT,
        incomes
    }
}
export const assignOutcomesToAccount = (outcomes) => {
    return {
        type: actionTypes.ASSIGN_OUTCOME_TO_ACCOUNT,
        outcomes
    }
}