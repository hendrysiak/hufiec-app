import { APIPerson } from "models/registry.models";
import store from "store/store";

const feeByYear: Record<number, number> = {
  2019: 30,
  2020: 30,
  2021: 36,
  2022: 36,
  2023: 45,
  2024: 69,
  2025: 70,
};

const getQuarterForDate = (date: Date) =>
  Math.floor((new Date(date).getMonth() + 3) / 3);

// Because of change in the whole logic, we decide to store this logic if the new version won't work properly (please check it on the end of 2024)

// export const countAmountOfFee = (person: APIPerson, endOfPeriod = new Date()): number => {
//   if (person.disability) return 0;

//   const lastDate = person.dateOfDelete ? new Date(person.dateOfDelete) : endOfPeriod;
//   const dateOfAdd = person.dateOfAdd ? new Date(person.dateOfAdd) : new Date();

//   if (dateOfAdd > lastDate) return 0;

//   const quarterOfStart = getQuarterForDate(dateOfAdd);
//   const quarterOfEnd = getQuarterForDate(lastDate);

//   const checkIfMemberComeInCurrentYear = dateOfAdd.getFullYear() === lastDate.getFullYear();

//   const amountOfFeesInLastYear = quarterOfEnd * feeByYear[lastDate.getFullYear()];

//   if (checkIfMemberComeInCurrentYear) {
//     const quartersInCurrentYear = quarterOfEnd - quarterOfStart + 1;

//     return quartersInCurrentYear * feeByYear[lastDate.getFullYear()];
//   }

//   const numberOfYearsPassed = lastDate.getFullYear() - dateOfAdd.getFullYear();
//   const numberOfQuartersInStartYear = 4 - quarterOfStart === 0 ? 1 : 4 - quarterOfStart + 1;
//   const feeValueInStartYear = feeByYear[dateOfAdd.getFullYear()];

//   if (numberOfYearsPassed === 1) {
//     return numberOfQuartersInStartYear * feeValueInStartYear + amountOfFeesInLastYear;
//   }
//   const startAndEndYearFeeValue = numberOfQuartersInStartYear * feeValueInStartYear + amountOfFeesInLastYear;
//   let allFees = 0;
//   for (let i = 1; i < numberOfYearsPassed; i++) {
//     allFees += (feeByYear[dateOfAdd.getFullYear() + i] * 4);
//   }
//   return startAndEndYearFeeValue + allFees;
// };

const getDateOfAdd = (person: APIPerson, today: Date) => {
  if (!person?.dateOfAdd) return new Date(`01/01/${today.getFullYear()}`);

  const dateOfAdd = new Date(person.dateOfAdd);

  if (dateOfAdd.getFullYear() < today.getFullYear()) {
    return new Date(`01/01/${today.getFullYear()}`);
  }

  return dateOfAdd;
};

export const countAmountOfFee = (
  person: APIPerson,
  endOfPeriod = new Date()
): number => {
  if (person.disability) return 0;

  const lastDate = person.dateOfDelete
    ? new Date(person.dateOfDelete)
    : endOfPeriod;
  const today = new Date(endOfPeriod) || new Date();
  // const dateOfAdd = person?.dateOfAdd?.getFullYear() && person?.dateOfAdd?.getFullYear() < today.getFullYear() ? new Date(`01/01/${today.getFullYear()}`) : new Date(person.dateOfAdd);
  const dateOfAdd = getDateOfAdd(person, today);

  if (dateOfAdd > lastDate) return 0;

  const quarterOfStart = getQuarterForDate(dateOfAdd);
  const quarterOfEnd = getQuarterForDate(lastDate);

  const checkIfMemberComeInCurrentYear =
    dateOfAdd.getFullYear() === lastDate.getFullYear();

  const amountOfFeesInLastYear =
    quarterOfEnd * feeByYear[lastDate.getFullYear()];

  if (checkIfMemberComeInCurrentYear) {
    const quartersInCurrentYear = quarterOfEnd - quarterOfStart + 1;

    return quartersInCurrentYear * feeByYear[lastDate.getFullYear()];
  }

  const numberOfYearsPassed = lastDate.getFullYear() - dateOfAdd.getFullYear();
  const numberOfQuartersInStartYear =
    4 - quarterOfStart === 0 ? 1 : 4 - quarterOfStart + 1;
  const feeValueInStartYear = feeByYear[dateOfAdd.getFullYear()];

  if (numberOfYearsPassed === 1) {
    return (
      numberOfQuartersInStartYear * feeValueInStartYear + amountOfFeesInLastYear
    );
  }
  const startAndEndYearFeeValue =
    numberOfQuartersInStartYear * feeValueInStartYear + amountOfFeesInLastYear;
  let allFees = 0;
  for (let i = 1; i < numberOfYearsPassed; i++) {
    allFees += feeByYear[dateOfAdd.getFullYear() + i] * 4;
  }
  return startAndEndYearFeeValue + allFees;
};

export const countingMemberFee = (
  person: APIPerson,
  endOfPeriod?: Date
): number => {
  const incomes = store.getState().income.dbIncomes;

  const feeIncomeByPerson = incomes.filter(
    (i) =>
      i.name?.toLowerCase() === person?.name?.toLowerCase() &&
      i.surname?.toLowerCase() === person?.surname?.toLowerCase() &&
      i.event === "SC"
  );

  const initAccountStatePerPerson = store
    ?.getState()
    .income?.initAccount?.find(
      (ia) =>
        ia?.name?.toLowerCase() === person?.name?.toLowerCase() &&
        ia?.surname?.toLowerCase() === person?.surname?.toLowerCase()
    );

  const allFeeIncomesValue = feeIncomeByPerson.reduce(
    (sum, currentIncome) => sum + Number(currentIncome.cash),
    0
  );
  const neededFee = Math.abs(countAmountOfFee(person, endOfPeriod));

  const sum = initAccountStatePerPerson
    ? initAccountStatePerPerson.balance + allFeeIncomesValue - neededFee
    : allFeeIncomesValue - neededFee;

  return sum;
};
