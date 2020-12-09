import axios from 'axios';

import { ActionTypes } from './action.enum';

export const setIncome = (income: any[]) => {
  return {
    type: ActionTypes.FETCH_FILE,
    income
  };
};

export const fetchCodes = (codes: any) => {
  return {
    type: ActionTypes.FETCH_CODES,
    codes
  };
};

export const fetchCodesWithTeams = (codes: any) => {
  return {
    type: ActionTypes.FETCH_CODES_TEAMS,
    codes
  };
};

export const fetchAccountState = (incomes: any, outcomes: any) => {
  return {
    type: ActionTypes.SET_ACCOUNT_STATE,
    incomes,
    outcomes
  };
};

export const fetchRegistry = (registry: any) => {
  return {
    type: ActionTypes.SET_REGISTRY_STATE,
    registry
  };
};

export const fetchImportDates = (importDates: any) => {
  return {
    type: ActionTypes.SET_IMPORT_DATES,
    importDates
  };
};

export const fetchIncomeFailed = (error: any) => {
  return {
    type: ActionTypes.FETCH_FILE_FAILED,
    error
  };
};

export const fetchIncome = (url: string) => {
  return async (dispatch: (arg0: { type: ActionTypes; income?: any[]; error?: any; }) => void) => {
    try {
      const result = await axios.get(url);
      const resultArray = result.data.Document.BkToCstmrAcctRpt.Rpt.Ntry;
      const resultInfo: any[] = [];
      resultArray.forEach((result: { CdtDbtInd: string; Amt: { __text: any; }; BookgDt: {DtTm: string; }; NtryDtls: { TxDtls: { RmtInf: { Ustrd: any; }; }; }; }) => {
        resultInfo.push({
          cash: result.CdtDbtInd === 'DBIT' ?
            `-${result.Amt.__text}` : result.Amt.__text,
          title: result.NtryDtls.TxDtls.RmtInf.Ustrd,
          dateOfBook: result.BookgDt.DtTm
        });
      });
      dispatch(setIncome(resultInfo));
    } catch (err) {
      dispatch(fetchIncomeFailed(err));
    }
  };
};

export const sortedIncome = (sortedIncome: any) => {
  return {
    type: ActionTypes.SORT_INCOME,
    sortedIncome
  };
};

export const editingIncome = (income: never[]) => {
  return {
    type: ActionTypes.EDIT_INCOME,
    income
  };
};

export const assignIncome = (income: any) => {
  return {
    type: ActionTypes.ASSIGN_INCOME_BY_CODE,
    income
  };
};

export const assignIncomesToAccount = (incomes: any) => {
  return {
    type: ActionTypes.ASSIGN_INCOME_TO_ACCOUNT,
    incomes
  };
};
export const assignOutcomesToAccount = (outcomes: any) => {
  return {
    type: ActionTypes.ASSIGN_OUTCOME_TO_ACCOUNT,
    outcomes
  };
};