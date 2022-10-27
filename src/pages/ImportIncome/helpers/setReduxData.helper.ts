import convert, { ElementCompact, Element } from 'xml-js';

import { reduxSetIncome } from 'store/actions/income';
import store from 'store/store';

import { sortBilingFromING } from './bank.helper';

// export const setIncomeInRedux = async (url: string): Promise<void> => {
export const setIncomeInRedux = async (file: File): Promise<void> => {
  const reader = new FileReader();
  const onload = () => {
    const result = reader.result;
    
    if (typeof result === 'string') {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const convertedJson: any = convert.xml2js(result, { compact: true });
      const sortedJSON = sortBilingFromING(convertedJson.Document);
      store.dispatch(reduxSetIncome(sortedJSON));
    }
  };

  reader.onload = onload;
  reader.readAsText(file, 'windows-1250');
};