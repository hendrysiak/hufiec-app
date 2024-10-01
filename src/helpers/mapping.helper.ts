import { IncomeDb, OutcomeDb } from 'models/income.models';
import { APIPerson } from 'models/registry.models';

export const mappingDbEntriesToRedux = (
  object: Record<string, IncomeDb | OutcomeDb>,
): (IncomeDb | OutcomeDb)[] => {
  const output = [];

  if (object) {
    for (const [key, value] of Object.entries(object)) {
      const updatedValue = value;
      if (updatedValue) {
        updatedValue.id = key;
        if ('name' in updatedValue) {
          const parsedName = updatedValue.name ? `${updatedValue.name}` : '';
          updatedValue.name = parsedName[0].toUpperCase() + parsedName.substring(1)?.toLowerCase();
        }

        if ('surname' in updatedValue) {
          const parsedSurname = updatedValue.surname ? `${updatedValue.surname}` : '';
          updatedValue.surname = parsedSurname[0]?.toUpperCase() + parsedSurname.substring(1)?.toLowerCase();
        }

        output.push(updatedValue);
      }
    }
  }

  return output;
};

export const mappingDbMembersToRedux = (
  object: Record<string, APIPerson>,
): APIPerson[] => {
  const output = [];

  if (object) {
    for (const [key, value] of Object.entries(object)) {
      const updatedValue = value;
      if (updatedValue) {
        updatedValue.id = key;



        if ('name' in updatedValue) {
          const parsedName = updatedValue.name ? `${updatedValue.name}` : '';
          updatedValue.name = parsedName[0].toUpperCase() + parsedName.substring(1).toLowerCase();
        }

        if ('surname' in updatedValue) {
          const parsedSurname = updatedValue.surname ? `${updatedValue.surname}` : '';
          updatedValue.surname = parsedSurname[0].toUpperCase() + parsedSurname.substring(1).toLowerCase();
        }

        output.push(updatedValue);
      }
    }
  }

  return output;
};
