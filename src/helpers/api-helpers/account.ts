import { AxiosResponse } from 'axios';

import axios from 'axios-income';

export const getAccountsStates = async (): Promise<Record<string, number>[]> => {
    const accounts: AxiosResponse<Record<string, number>[]> = await axios.get('/account.json');
    return accounts.data;
  };

  export const saveAccountState = async (account: number, team: string): Promise<{ name: string }> => {
    const savedAccount = await axios.post(`/account/${team}.json`, account);
    return savedAccount.data;
};
  