import axios from 'axios-income';
import { 
  reduxGetAccountState, 
  reduxGetCodes, 
  reduxGetRegistry, 
  reduxGetImportDates 
} from 'store/actions/income';

import store from 'store/store';

export const getTeamsWithAccountState = async (): Promise<void> => {
  const incomes = await axios.get('/incomes.json');
  const outcomes = await axios.get('/outcomes.json');
  
  store.dispatch(reduxGetAccountState(incomes.data, outcomes.data));
};

export const getCodes = async (): Promise<void> => {
  const codes = await axios.get('/codes.json');

  store.dispatch(reduxGetCodes(codes.data));
};

export const getRegistry = async (): Promise<void> => {
  const registry = await axios.get('/registry.json');

  store.dispatch(reduxGetRegistry(registry.data));
};

export const getImportDates = async (): Promise<void> => {
  const importDates = await axios.get('/importDates.json');

  store.dispatch(reduxGetImportDates(importDates.data));
};


