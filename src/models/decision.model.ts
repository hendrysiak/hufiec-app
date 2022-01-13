import { DecisionArea } from './global.enum';

export interface ReAccoutingInfo {
  letterNumber: number;
  cash: number;
  targetCode: string;
}

export interface ReturnInfo {
  title: string;
  cash: string;
  amountInWords: string;
  date: Date | string;
}

export interface DecisionData {
  id?: string;
  area: DecisionArea;
  decisionId: string;
  decisionDate: Date | string;
}

export interface DecisionReAccouting extends DecisionData {
  reAccountingInfo: ReAccoutingInfo[];
}

export interface DecisionReturn extends DecisionData {
  reason: string;
  returnInfo: ReturnInfo[];
}

export interface DecisionCode extends DecisionData {
  target: string;
  targetTeam?: string;
  amount: number;
  eventStartDate: Date | string;
  eventEndDate?: Date | string;
}

export type Decision = DecisionReAccouting | DecisionReturn | DecisionCode;