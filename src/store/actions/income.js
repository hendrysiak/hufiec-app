import * as actionTypes from './actionTypes';
import axios from 'axios';

export const setIncome = income => {
    return {
        type: actionTypes.FETCH_FILE,
        income
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

export const sortingIncome = (actualTeams, actualIncome) => {
    return dispatch => {
        actualTeams.forEach(element => {
            if (element.id !== "pozostałe") {
                const regex = new RegExp(`(${element.id})`, "m");
                const valueInfo = actualIncome.filter(info => regex.test(info.title));

                element.income = [...valueInfo];
            } else if (element.id === "pozostałe") {
                const regexArr = actualTeams.map(
                    element => new RegExp(`(${element.id})`, "m")
                );
                regexArr.splice(regexArr.length - 1, 1);

                const notPassValue = actualIncome.filter(info =>
                    regexArr.every(item => !item.test(info.title))
                );
                element.income = [...notPassValue];
            }
        });
        dispatch(sortedIncome(actualTeams))
    }
}