import { APIPerson } from 'models/registry.models';
import store from 'store/store';

const feeByYear: Record<number, number> = {
  2019: 30,
  2020: 30,
  2021: 36,
  2022: 36,
};

export const countAmountOfFee = (person: APIPerson, endOfPeriod = new Date()): number => {
  if (person.disability) return 0;
  
  const lastDate = person.dateOfDelete ? new Date(person.dateOfDelete) : endOfPeriod;
  const dateOfAdd = person.dateOfAdd ? new Date(person.dateOfAdd) : new Date();

  if (dateOfAdd > lastDate) return 0;

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

export const countingMemberFee = (person: APIPerson, endOfPeriod?: Date): number => {
  const incomes = store.getState().income.dbIncomes;

  const feeIncomeByPerson = incomes.filter(i => i.name?.toLowerCase() === person?.name?.toLowerCase() 
    && i.surname?.toLowerCase() === person?.surname?.toLowerCase()  
    && i.event === 'SC');

  // console.log(feeIncomeByPerson);
  // console.log(endOfPeriod);

  let preparedFees;

  if (endOfPeriod) {
    const year = endOfPeriod.getFullYear();
    preparedFees = feeIncomeByPerson.filter(income => Number(income.year) === Number(year));
  } else {
    preparedFees = feeIncomeByPerson;
  };

  const initAccountStatePerPerson = store?.getState().income?.initAccount?.find(ia => (
      ia?.name?.toLowerCase() === person?.name?.toLowerCase() && 
      ia?.surname?.toLowerCase() === person?.surname?.toLowerCase() ));

  const allFeeIncomesValue = preparedFees.reduce((sum, currentIncome) => sum + Number(currentIncome.cash), 0);
  const neededFee = Math.abs(countAmountOfFee(person, endOfPeriod));

  const sum = initAccountStatePerPerson ?
    initAccountStatePerPerson.balance + allFeeIncomesValue - neededFee :
    allFeeIncomesValue - neededFee;

  return sum;
};
