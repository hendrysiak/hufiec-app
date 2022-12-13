import { ProposalKind } from 'models/global.enum';

export const kindNameConverter = (kindOfAction: ProposalKind): string => {
  switch (kindOfAction) {
    case ProposalKind.Add:
      return 'dodawanie';
    case ProposalKind.Delete:
      return 'usuwanie';
    case ProposalKind.Edit:
      return 'edytowanie';
    case ProposalKind.Move:
      return 'przenoszenie';
    case ProposalKind.Debt:
      return 'dług';
  }
};
