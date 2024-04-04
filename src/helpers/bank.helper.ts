import { IncomesBankModel } from 'models/income.models';

import { INGBilingDocument, INGDocument, INGOperationType } from '../pages/ImportIncome/models/ing.biling.model';

export const sortBilingFromING = (jsonBiling: INGBilingDocument): IncomesBankModel[] => {
  const resultInfo: IncomesBankModel[] = [];
  const resultArray = jsonBiling.BkToCstmrAcctRpt.Rpt.Ntry;
  resultArray.forEach((result: INGDocument) => {
    resultInfo.push({
      cash: Number(result.CdtDbtInd._text === INGOperationType.Debit
        ? `-${result.Amt._text}` : result.Amt._text),
      title: result.NtryDtls.TxDtls.RmtInf.Ustrd._text,
      dateOfBook: new Date(result.BookgDt.DtTm._text),
      bank: 'ING',
    });
  });

  return resultInfo;
};
