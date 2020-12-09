import { setIncome } from 'store/actions/income';
import store from 'store/store';

import { sortBilingFromING } from './bank.helper';
import { getJsonFromServer } from './getData.helper';

export const setIncomeInRedux = async (url: string): Promise<void> => {
  const resultJSON = await getJsonFromServer(url);
  const sortedJSON = sortBilingFromING(resultJSON);

  store.dispatch(setIncome(sortedJSON));
};