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


  const quarterOfStart = Math.floor((new Date(dateOfAdd).getMonth() + 3) / 3);
  const quarterOfEnd = Math.floor((new Date(lastDate).getMonth() + 3) / 3);
  const quartersForCounting = quarterOfEnd - quarterOfStart + 1;
  const amountOfFeesInLastYear = quartersForCounting * feeByYear[lastDate.getFullYear()];
  
  const checkIfMemberComeInCurrentYear = dateOfAdd.getFullYear() === lastDate.getFullYear();
 
  if (checkIfMemberComeInCurrentYear) return amountOfFeesInLastYear;

  const numberOfYearsPassed = lastDate.getFullYear() - dateOfAdd.getFullYear();
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

  const feeIncomeByPerson = incomes.filter(i => i.name?.toLowerCase() === person?.name?.toLowerCase() 
    && i.surname?.toLowerCase() === person?.surname?.toLowerCase()  
    && i.event === 'SC');

  const initAccountStatePerPerson = store?.getState().income?.initAccount?.find(ia => (
      ia?.name?.toLowerCase() === person?.name?.toLowerCase() && 
      ia?.surname?.toLowerCase() === person?.surname?.toLowerCase() ));

  const allFeeIncomesValue = feeIncomeByPerson.reduce((sum, currentIncome) => sum + currentIncome.cash, 0);
  const neededFee = Math.abs(countAmountOfFee(person));

  const sum = initAccountStatePerPerson ?
    initAccountStatePerPerson.balance + allFeeIncomesValue - neededFee :
    allFeeIncomesValue - neededFee;

  return sum;
};