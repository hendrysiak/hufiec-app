import store from '../../../store/store';
import axios from '../../../axios-income';
import { fetchAccountState, fetchRegistry, fetchCodes, fetchCodesWithTeams, fetchImportDates } from '../../../store/actions/income';

export const getTeamsWithAccountState = async () => {
  const incomes = await axios.get("/incomes.json");
  const outcomes = await axios.get("/outcomes.json");
  
  store.dispatch(fetchAccountState(incomes.data, outcomes.data))
}

export const getCodes = async () => {
  const codes = await axios.get("/codes.json");

  store.dispatch(fetchCodes(codes.data))
};

export const getRegistry = async () => {
  const registry = await axios.get("/registry.json");

  store.dispatch(fetchRegistry(registry.data))
};

export const getImportDates = async () => {
  const importDates = await axios.get("/importDates.json");

  store.dispatch(fetchImportDates(importDates.data))
};


