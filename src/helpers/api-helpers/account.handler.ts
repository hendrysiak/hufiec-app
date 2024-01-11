import axios from 'axios-income';
import { ApprovedEvent, CodesMap } from 'models/codes.models';
import { IncomeDb, OutcomeDb } from 'models/income.models';
import { APIPerson, Person } from 'models/registry.models';
import {
  reduxGetAccountState,
  reduxGetCodes,
  reduxGetRegistry,
  reduxGetImportDates,
  reduxGetInitAccountState,
  reduxSetFilteredCodes,
} from 'store/actions/income';

import store from 'store/store';

import { mappingDbEntriesToRedux, mappingDbMembersToRedux } from '../mapping.helper';

export const getAccountState = async (): Promise<void> => {
  const incomes = await axios.get('/incomes.json');
  const outcomes = await axios.get('/outcomes.json');

  const incomesToHandler = mappingDbEntriesToRedux(incomes.data);
  const outcomesToHandler = mappingDbEntriesToRedux(outcomes.data);

  store.dispatch(reduxGetAccountState(
    incomesToHandler as IncomeDb[],
    outcomesToHandler as OutcomeDb[],
  ));
};

export const getCodes = async (team: number | null): Promise<void> => {
  const codes = await axios.get<CodesMap>('/codes.json');
  const codesMap = codes.data;

  const codesToFilter: ApprovedEvent[] = [];
  // you have to map db entries
  if (team === null) {
    for (const code in codesMap) {
      const fullCode = codesMap[code].suffix ? `${codesMap[code].prefix}-${codesMap[code].suffix}` : codesMap[code].prefix;
      codesToFilter.push({ code: fullCode });
    }
  } else {
    for (const code in codesMap) {
      if (codesMap[code]?.teams?.includes(Number(team)) || codesMap[code]?.wholeOrganization) {
        const prefix = codesMap[code].prefix;
        const suffix = codesMap[code].suffix ? `-${codesMap[code].suffix}` : '';
        const fullCode = prefix + suffix;
        codesToFilter.push({ code: fullCode });
      }
    }
  }

  store.dispatch(reduxGetCodes(codesMap));
  store.dispatch(reduxSetFilteredCodes(codesToFilter));
};

export const getRegistry = async (): Promise<void> => {
  const registry = await axios.get('/registry.json');
  const mappedRegistry: Record<string, Record<string, APIPerson>> = {};

  for (const id in registry.data) {
    const { team, ...currentPerson } = registry.data[id];
    currentPerson.id = id;
    currentPerson.team = Number(team);

    if (mappedRegistry[team]) mappedRegistry[team][id] = { ...registry.data[id], id };
    else if (!team) {
      mappedRegistry.errorTeam = { ...mappedRegistry.errorTeam };
      mappedRegistry.errorTeam[id] = { ...registry.data[id], id };
    } else {
      mappedRegistry[team] = {};
      mappedRegistry[team][id] = { ...registry.data[id], id: currentPerson.id };
    }
  }
  store.dispatch(reduxGetRegistry(mappedRegistry));
};

export const getPlainRegistry = async (): Promise<Record<string, Person>> => {
  const registry = await axios.get('/registry.json');

  return registry.data;
}

export const getImportDates = async (): Promise<void> => {
  const importDates = await axios.get('/importDates.json');

  store.dispatch(reduxGetImportDates(importDates.data));
};

export const getInitAccountState = async (): Promise<void> => {
  const initAccountState = await axios.get('/initAccountState.json');

  store.dispatch(reduxGetInitAccountState(initAccountState.data));
};

export const setInitAccountState = async (accountStates: any[]): Promise<void> => {
  const initAccountState = await axios.put('/initAccountState.json', accountStates);

  store.dispatch(reduxGetInitAccountState(initAccountState.data));
};
