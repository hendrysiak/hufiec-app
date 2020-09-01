import store from '../../../store/store';
import axios from '../../../axios-income';
import { fetchAccountState } from '../../../store/actions/income';

export const getTeamsWithAccountState = async () => {
  const accounts = await axios.get("/teams.json");
  store.dispatch(fetchAccountState(accounts.data))
}