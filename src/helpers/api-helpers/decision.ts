import { AxiosResponse } from 'axios';

import axios from 'axios-income';
import { Decision } from 'models/decision.model';

export const getDecisions = async (): Promise<Decision[]> => {
  const decisions: AxiosResponse<Record<string, Decision>> = await axios.get('/decision.json');

  const mappedDecision = Object
    .entries(decisions.data)
    .map(([id, decision]: [string, Decision]) => ({ id: id, ...decision }));
    
  return mappedDecision;
};

export const editDecision = async (decision: Decision): Promise<Decision> => {
  const { id, ...rest } = decision;
  const editedDecision = await axios.put(`/decision/${id}.json`, rest);
  return editedDecision.data;
};
  

export const saveDecision = async (decision: Decision): Promise<Decision> => {
  const newDecision = await axios.post('/decision.json', decision);
  return newDecision.data;
};