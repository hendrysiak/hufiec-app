import { IncomesBankModel } from 'models/income.models';

import { INGBiling, INGDocument, INGOperationType } from '../models/ing.biling.model';

export const sortBilingFromING = (jsonBiling: INGBiling): IncomesBankModel[] => {
  const resultInfo: IncomesBankModel[] = [];
  const resultArray = jsonBiling.Document.BkToCstmrAcctRpt.Rpt.Ntry;
  resultArray.forEach((result: INGDocument) => {
    resultInfo.push({
      cash: Number(result.CdtDbtInd === INGOperationType.Debit ?
        `-${result.Amt.__text}` : result.Amt.__text),
      title: result.NtryDtls.TxDtls.RmtInf.Ustrd,
      dateOfBook: result.BookgDt.DtTm
    });
  });

  return resultInfo;
};