import axios from 'axios-income';
import { IncomeDb, OutcomeDb } from 'models/income.models';
import { APIPerson } from 'models/registry.models';
import { 
  reduxGetAccountState, 
  reduxGetCodes, 
  reduxGetRegistry, 
  reduxGetImportDates, 
  reduxGetInitAccountState
} from 'store/actions/income';

import store from 'store/store';

import { mappingDbEntriesToRedux, mappingDbMembersToRedux } from '../helpers/mapping.helper';

export const getAccountState = async (): Promise<void> => {
  const incomes = await axios.get('/incomes.json');
  const outcomes = await axios.get('/outcomes.json');

  const incomesToHandler = mappingDbEntriesToRedux(incomes.data);
  const outcomesToHandler = mappingDbEntriesToRedux(outcomes.data);
  
  
  store.dispatch(reduxGetAccountState(
    incomesToHandler as IncomeDb[], 
    outcomesToHandler as OutcomeDb[]
  ));
};

export const getCodes = async (): Promise<void> => {
  const codes = await axios.get('/codes.json');

  store.dispatch(reduxGetCodes(codes.data));
};

export const getRegistry = async (): Promise<void> => {
  const registry = await axios.get('/registry.json');
  const mappedRegistry: Record<string, Record<string, APIPerson>> = {};
  
  for (const id in registry.data ) {
    const { team, ...currentPerson } = registry.data[id];
    currentPerson['id'] = id;
    currentPerson['team'] = team; 


    if (mappedRegistry[team]) mappedRegistry[team][id] = {...registry.data[id], id:id };
    else {
      if (!team) {
        mappedRegistry['errorTeam'] = { ...mappedRegistry['errorTeam'] };
        mappedRegistry['errorTeam'][id] = {...registry.data[id], id: id};
      } else {
        mappedRegistry[team] = {};
        mappedRegistry[team][id] = {...registry.data[id], id: currentPerson.id};
      }
    }
  }
  store.dispatch(reduxGetRegistry(mappedRegistry));
};

export const getImportDates = async (): Promise<void> => {
  const importDates = await axios.get('/importDates.json');

  store.dispatch(reduxGetImportDates(importDates.data));
};

export const getInitAccountState = async (): Promise<void> => {
  const initAccountState = await axios.get('/initAccountState.json');
  
  store.dispatch(reduxGetInitAccountState(initAccountState.data));
};

