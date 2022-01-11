import { ProposalArea, ProposalKind } from './global.enum';

export interface Proposal {
  id?: string;
  team?: string | null;
  elementId: string;
  author: string; 
  area: ProposalArea; 
  kind: ProposalKind; 
  oldValues?: unknown; 
  newValues?: unknown;
  dateOfCreation?: Date | string;
  letterNumber?: number; 
  letterDate?: Date | string; 
  letterAuthor?: string;
}