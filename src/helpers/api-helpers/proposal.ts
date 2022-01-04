import { AxiosResponse } from 'axios';

import axios from 'axios-income';
import { Proposal } from 'models/global.enum';

export const saveProposal = async(
  proposal: Proposal
): Promise<void> => {
  const newProposal = await axios.post('/proposal.json', proposal);
  return newProposal.data;
};

export const getProposals = async (team?: string, isAdmin?: boolean): Promise<Proposal[]> => {
    
  const proposals: AxiosResponse<Record<string, Proposal>> = await axios.get('/proposal.json');
    
  const mappedProposals = Object
    .entries(proposals.data)
    .map(([id, proposal]: [string, Proposal]) => ({ id: id, ...proposal }));

  if (isAdmin) return mappedProposals;

  return mappedProposals.filter((p: Proposal) => p.team === team);
};

export const deleteProposal = async (proposalId: string): Promise<void> => {
  await axios.delete(`/proposal/${proposalId}/.json`);
};

export const editProposal = async (proposal: Proposal): Promise<Proposal> => {
  const updatedProposal = await axios.patch(`/proposal/${proposal.id}/.json`, proposal);

  return updatedProposal.data;
};