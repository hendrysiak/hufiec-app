import store from '../../../store/store';

export const organizationStateVerification = () => {
  const incomes = store.getState().income.dbIncomes;
  const outcomes = store.getState().income.dbOutcomes;

  const incomesAccountState = incomes.map(i => i.cash);
  const outcomesAccountState = outcomes.map(o => o.cash);

  return {
    incomesAccountState: incomesAccountState.reduce((a, b) => a + b, 0),
    outcomesAccountState: outcomesAccountState.reduce((a, b) => a - b, 0)
  }

};