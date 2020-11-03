import store from '../../../store/store';
import axios from '../../../axios-income';
import { fetchAccountState, fetchRegistry, fetchCodes, fetchCodesWithTeams } from '../../../store/actions/income';

export const getTeamsWithAccountState = async () => {
  const incomes = await axios.get("/incomes.json");
  const outcomes = await axios.get("/outcomes.json");
  
  store.dispatch(fetchAccountState(incomes.data, outcomes.data))
}

export const getCodes = async () => {
  const codes = await axios.get("/codes.json");

  store.dispatch(fetchCodes(codes.data))
};

// export const getCodesWithTeams = async () => {
//   const codes = await axios.get("/codes.json");
//   let codesList = [];
//   for (let code in codes.data) {
//     await codes.data[code].forEach(code => codesList.push(code));
//   }
//   store.dispatch(fetchCodesWithTeams(codesList))
// };

export const getRegistry = async () => {
  const registry = await axios.get("/registry.json");

  store.dispatch(fetchRegistry(registry.data))
};


