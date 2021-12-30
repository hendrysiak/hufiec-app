export enum FinanceMethod {
  Transfer = 'transfer',
  Cash = 'cash'
};

export enum BudgetEntry {
  Income = 'income',
  Outcome = 'outcome'
}

export enum OutcomeCategory {
  Materials = 'materiały',
  Accomodation = 'zakwaterowanie',
  Program = 'program',
  Awards = 'nagrody',
  Tickets = 'bilety',
  Board = 'wyżywienie',
  Maintenance = 'konserwacja',
  Media = 'media',
  Fee = 'składki'
};

export enum FoundingSources {
  OneProcent = '1 %',
  Donation = 'dotacja',
  TeamAccount = 'konto drużyny',
  SelfPayment = 'wpłaty własne',
  OwnResources = 'własne środki',
  Other = 'inne'
};

// TODO: implement checking route

export enum Routing {
  Approval = 'approval.json',
  Codes = 'codes.json',
  FoundingSources = 'foundingSources.json',
  ImportDates = 'importDates.json',
  Incomes = 'incomes.json',
  OnePercen = 'onePercent.json',
  OutcomeCategory = 'outcomeCategory.json',
  Outcomes = 'outcomes.json',
  Registry = 'registry.json',
  Teams = 'teams.json',
  Tickes = 'ticket.json',
}

export enum Rows {
  Lp = 'lp',
  Name = 'name',
  Surname = 'surname',
  Team = 'team'
}

export enum ProposalArea {
  Registry = 'registry',
  Income = 'income'
}

export enum ProposalKind {
  Delete = 'delete',
  Edit = 'edit',
  Move = 'move',
}

export interface Proposal {
  id: string;
  author: string; 
  area: ProposalArea; 
  kind: ProposalKind; 
  oldValues?: unknown; 
  newValues?: unknown
}