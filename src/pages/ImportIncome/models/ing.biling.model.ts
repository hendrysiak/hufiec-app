export enum INGOperationType {
  Debit = 'DBIT',
  Credit = 'CRDT'
}

export interface INGDocument {
  CdtDbtInd: INGOperationType; 
  Amt: { __text: string; }; 
  BookgDt: { DtTm: string; }; 
  NtryDtls: { 
    TxDtls: { 
      RmtInf: { 
        Ustrd: string; 
      }; 
    }; 
  }
}


export interface INGBiling {
  Document: { 
    BkToCstmrAcctRpt: {
      Rpt: {
        Ntry: INGDocument[]
      }
    } 
  }
}