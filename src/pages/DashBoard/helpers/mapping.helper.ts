import { IncomesDb, OutcomesDb } from 'models/income.models';

export const mappingDbEntriesToRedux = (
  object: Record<string, IncomesDb | OutcomesDb>
): (IncomesDb | OutcomesDb)[] => {

  const output = [];

  for (const [key, value] of Object.entries(object)) {
    const updatedValue = value;
    if (updatedValue) {
      updatedValue['id'] = key;
      output.push(updatedValue);
    };
  };

  return output;
};