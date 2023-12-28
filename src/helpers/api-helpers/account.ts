import { AxiosResponse } from 'axios';

import axios from 'axios-income';
import { reduxEditAccountState, reduxSetAccountsState } from 'store/actions/income';
import store from 'store/store';

export const getAccountsStates = async () => {
    const accounts: AxiosResponse<Record<string, number>> = await axios.get('/teamAccounts.json');

    store.dispatch(reduxSetAccountsState(accounts.data ?? {}));
  };

  export const saveAccountState = async (account: number, team: string): Promise<{ name: string }> => {
    const savedAccount = await axios.put(`/teamAccounts/${team}.json`, account);

    store.dispatch(reduxEditAccountState(Number(team), account));
    return savedAccount.data;
};
  