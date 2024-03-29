export interface ICode {
  id: string;
  prefix: string;
  suffix?: string;
  responsiblePerson: {
    name: string;
    surname: string;
  },
  amount: number;
  startDate: Date;
  endDate: Date;
  wholeOrganization: boolean;
  teams: number[];
  firstAccept: boolean;
  secondAccept: boolean;
  letter: boolean;
  decision: string;
  locality: string;
  orgNumber?: string;
}

export type ICodeMap = Record<string, ICode>;

export interface Code {
  suffix?: string;
  responsiblePerson: {
    name: string;
    surname: string;
  },
  amount: number;
  startDate: Date;
  endDate: Date;
  decision: string;
  wholeOrganization: boolean;
  teams: string[]
  locality: string;
  orgNumber?: string;
}

export type CodesMap = Record<string, ICode>;

export type Event = {
  code: string;
  teams?: string[];
};
export interface ApprovedEvent extends Event {
  approvalInfo?: string;
}
