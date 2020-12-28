import axios from 'axios-income';
import { IncomeDb, OutcomesWithEvent, OutcomeDb, IncomesWithImportDate } from 'models/income.models';
import { reduxAddDbIncome, reduxAddDbOutcome, reduxDeleteDbIncome, reduxDeleteDbOutcome, reduxEditDbIncome, reduxEditDbOutcome } from 'store/actions/income';
import store from 'store/store';

export const editOutcome = async (data: OutcomeDb): Promise<void> => {
  const { id, ...rest } = data;
  await axios.put(`/outcomes/${id}`, rest);
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
  await axios.put(`/incomes/${id}`, rest);
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


