import { IncomeDb, OutcomeDb } from 'models/income.models';
import { APIPerson } from 'models/registry.models';

export const mappingDbEntriesToRedux = (
  object: Record<string, IncomeDb | OutcomeDb>
): (IncomeDb | OutcomeDb)[] => {
  const output = [];
  
  if (object) {
    for (const [key, value] of Object.entries(object)) {
      const updatedValue = value;
      if (updatedValue) {
        updatedValue['id'] = key;
        output.push(updatedValue);
      };
    };
  }

  return output;
};

export const mappingDbMembersToRedux = (
  object: Record<string, APIPerson>
): APIPerson[] => {
  const output = [];

  if (object) {
    for (const [key, value] of Object.entries(object)) {
      const updatedValue = value;
      if (updatedValue) {
        updatedValue['id'] = key;
        output.push(updatedValue);
      };
    };
  }

  return output;
};