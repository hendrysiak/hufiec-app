import axios from 'axios-income';
import { IncomeDb, OutcomesWithEvent, OutcomeDb, IncomesWithImportDate } from 'models/income.models';
import { APIPerson, Person } from 'models/registry.models';
import { reduxAddDbIncome, reduxAddDbOutcome, reduxAddMember, reduxDeleteDbIncome, reduxDeleteDbOutcome, reduxDeleteMember, reduxEditDbIncome, reduxEditDbOutcome, reduxEditMember } from 'store/actions/income';
import store from 'store/store';

export const editOutcome = async (data: OutcomeDb): Promise<void> => {
  const { id, ...rest } = data;
  await axios.put(`/outcomes/${id}.json`, rest);
  store.dispatch(reduxEditDbOutcome(data));
};

export const addOutcome = async (data: OutcomesWithEvent): Promise<void> => {

  const response = await axios.post(`/outcomes.json`, data);
  const name = response.data.name;

  const newOutcome = { ...data, id: name };
  store.dispatch(reduxAddDbOutcome(newOutcome));
};

export const deleteOutcome = async (id: string): Promise<void> => {
  store.dispatch(reduxDeleteDbOutcome(id));
  await axios.delete(`/outcomes/${id}.json`);
};

export const editIncome = async (data: IncomeDb): Promise<void> => {
  const { id, ...rest } = data;
  await axios.put(`/incomes/${id}.json`, rest);
  store.dispatch(reduxEditDbIncome(data));
};

export const addIncome = async (data: IncomesWithImportDate): Promise<void> => {

  const response = await axios.post(`/incomes.json`, data);
  const name = response.data.name;

  const newIncome = { ...data, id: name };
  store.dispatch(reduxAddDbIncome(newIncome));
};

export const deleteIncome = async (id: string): Promise<void> => {
  store.dispatch(reduxDeleteDbIncome(id));
  await axios.delete(`/incomes/${id}.json`);
};

export const addTeamMember = async (team: string, person: { name: string, surname: string}): Promise<void> => {
  const extendedPerson: Person = { ...person, dateOfAdd: new Date(), team };
  const response = await axios.post(`/registry/${team}.json`, extendedPerson); 

  store.dispatch(reduxAddMember({ ...extendedPerson, id: response.data.name }));
};

export const editTeamMember = async (team: string, person: APIPerson): Promise<void> => {
  const reducedMember = {
    name: person.name,
    surname: person.surname,
    dateOfAdd: person.dateOfAdd,
    dateOfDelete: person.dateOfDelete
  };
  await axios.put(`/registry/${team}/${person.id}.json`, { ...reducedMember }); 

  store.dispatch(reduxEditMember(person, team));
};

export const deleteTeamMember = async (team: string, person: APIPerson): Promise<void> => {

  const mappedPerson = { ...person, team };

  axios.delete(`/registry/${team}/${person.id}.json`); 

  store.dispatch(reduxDeleteMember(mappedPerson));
};


export const updateOnePercent = async (team : string, value: string) => {
  const newValue = await axios.put(`/onePercent/${team}.json` , value);
  return newValue.data * 1;
}