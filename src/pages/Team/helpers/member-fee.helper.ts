import { APIPerson } from 'models/registry.models';
import store from 'store/store';

const feeByYear: Record<number, number> = {
  2019: 30,
  2020: 30,
  2021: 36,
};

const countAmountOfFee = (person: APIPerson): number => {
  const lastDate = person.dateOfDelete ? new Date(person.dateOfDelete) : new Date();
  const dateOfAdd = person.dateOfAdd ? new Date(person.dateOfAdd) : new Date();
  const quarterOfEnd = Math.floor((new Date(lastDate).getMonth() + 3) / 3);
  const amountOfFeesInLastYear = quarterOfEnd * feeByYear[lastDate.getFullYear()];
  
  const checkIfMemberComeInCurrentYear = dateOfAdd.getFullYear() === lastDate.getFullYear();
  
  if (checkIfMemberComeInCurrentYear) return amountOfFeesInLastYear;

  const numberOfYearsPassed = lastDate.getFullYear() - dateOfAdd.getFullYear();
  const quarterOfStart = Math.floor((dateOfAdd.getMonth() + 3) / 3);
  const numberOfQuartersInStartYear = 4 - quarterOfStart === 0 ? 1 : 4 - quarterOfStart + 1;
  const feeValueInStartYear = feeByYear[dateOfAdd.getFullYear()];

  if (numberOfYearsPassed === 1) {
    return numberOfQuartersInStartYear * feeValueInStartYear + amountOfFeesInLastYear;
  } else {
    const startAndEndYearFeeValue = numberOfQuartersInStartYear * feeValueInStartYear + amountOfFeesInLastYear;
    let allFees = 0;
    for (let i = 1; i < numberOfYearsPassed; i++) {

      allFees = allFees + (feeByYear[dateOfAdd.getFullYear() + i] * 4);
    }
    return startAndEndYearFeeValue + allFees;
  }

};

export const countingMemberFee = (person: APIPerson): number => {
  const incomes = store.getState().income.dbIncomes;
  const feeIncomeByPerson = incomes.filter(i => i.name === person.name 
    && i.surname === person.surname 
    && i.event === 'SC');

  const allFeeIncomesValue = feeIncomeByPerson.reduce((sum, currentIncome) => sum + currentIncome.cash, 0);
  const neededFee = countAmountOfFee(person);

  return allFeeIncomesValue - neededFee;
};