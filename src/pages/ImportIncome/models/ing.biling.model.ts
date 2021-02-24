export enum INGOperationType {
  Debit = 'DBIT',
  Credit = 'CRDT'
}

export interface INGDocument {
  CdtDbtInd: { _text: INGOperationType }; 
  Amt: { _text: string; }; 
  BookgDt: { DtTm: { _text: string }; }; 
  NtryDtls: { 
    TxDtls: { 
      RmtInf: { 
        Ustrd: { _text: string }; 
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
export interface INGBilingDocument {

  BkToCstmrAcctRpt: {
    Rpt: {
      Ntry: INGDocument[]
    }
  } 

}