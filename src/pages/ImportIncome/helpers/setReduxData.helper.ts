import convert, { ElementCompact, Element } from 'xml-js';

import { reduxSetIncome } from 'store/actions/income';
import store from 'store/store';

import { INGBilingDocument } from '../models/ing.biling.model';

import { sortBilingFromING } from '../../Import/helpers/bank.helper';

// export const setIncomeInRedux = async (url: string): Promise<void> => {
export const setIncomeInRedux = async (file: File): Promise<void> => {
  const reader = new FileReader();
  const onload = () => {
    const { result } = reader;

    if (typeof result === 'string') {
      const convertedJson = convert.xml2js(result, { compact: true }) as Record<string, INGBilingDocument>;
      const sortedJSON = sortBilingFromING(convertedJson.Document);
      store.dispatch(reduxSetIncome(sortedJSON));
    }
  };

  reader.onload = onload;
  reader.readAsText(file, 'windows-1250');
};
