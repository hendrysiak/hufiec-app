
import { AxiosResponse } from 'axios';

import axios from 'axios-income';
import { ICode } from 'models/codes.models';
import { Decision } from 'models/decision.model';

export const getCodes = async (): Promise<ICode[]> => {
  const codes: AxiosResponse<Record<string, Omit<ICode, 'id'>>> = await axios.get('/codes.json');

  const mappedCodes = Object
    .entries(codes.data)
    .map(([id, code]: [string, Omit<ICode, 'id'>]) => ({ id: id, ...code }));
    
  return mappedCodes;
};

export const saveCode = async (code: Omit<ICode, 'id'>): Promise<{ name: string }> => {
  const savedCodes = await axios.post('/codes.json', code);
  return savedCodes.data;
};

export const editCode = async (code: ICode): Promise<ICode> => {
  const savedCodes = await axios.patch(`/codes/${code.id}.json`, code);
  return savedCodes.data;
};

export const deleteCode = async (codeId: string): Promise<void> => {
  await axios.delete(`/codes/${codeId}.json`);
};