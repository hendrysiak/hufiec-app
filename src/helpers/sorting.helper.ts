import { ErrorType } from 'models/error.types.model';
import { FinanceMethod, IncomeCategory } from 'models/global.enum';
import {
  IncomesBankModel,
  IncomesWithEvent,
  IncomesWithImportDate,
  IncomesWithPerson,
  IncomesWithTeam,
  IncomesWithYear,
  OutcomesBankModel,
  OutcomesWithFinanceMethod,
  OutcomesWithImportDate,
  OutcomesWithEvent,
} from 'models/income.models';
import { Registry } from 'models/registry.models';

export const sortingTransferToIncomesAndOutcomes = (
  incomes: IncomesBankModel[],
): { incomes: IncomesBankModel[], outcomes: OutcomesBankModel[] } => {
  const sortedIncomes = incomes.filter((income) => Number(income.cash) > 0);
  const sortedOutcomes = incomes.filter((income) => Number(income.cash) < 0);

  return {
    incomes: sortedIncomes.map((income) => ({
      cash: Number(income.cash),
      title: income.title,
      dateOfBook: new Date(income.dateOfBook),
    })),
    outcomes: sortedOutcomes.map((outcome) => ({
      cash: Number(outcome.cash),
      title: outcome.title,
      dateOfBook: new Date(outcome.dateOfBook),
    })),
  };
};

export const sortingIncomesByTeams = (teams: Registry, incomes: IncomesBankModel[]): IncomesWithTeam[] => {
  const updatedIncomes: IncomesWithTeam[] = incomes.map((income) => {
    let updatedIncome = income as IncomesWithTeam;

    Object.keys(teams).forEach((teamCode) => {
      const regex = new RegExp(`${teamCode}`, 'm'); // team code as regex pattern
      if (regex.test(income.title)) updatedIncome = { ...income, team: teamCode };
      else return;
    });
    return updatedIncome;
  });

  return updatedIncomes.map((income) => {
    if (!income.hasOwnProperty('team')) return { ...income, team: null, errors: income?.errors ? [...income.errors, ErrorType.TeamError] : [ErrorType.TeamError] };
    return { ...income };
  });
};

export const sortingIncomesByCode = (codes: string[], incomes: IncomesWithTeam[]): IncomesWithEvent[] => {
  const sortedIncomesByCode = incomes.map((income) => {
    let updatedIncome = income as IncomesWithEvent;

    codes.forEach((code) => {
      const regex = new RegExp(`${code}`, 'mi');
      const category = code === "SC" ? IncomeCategory.MembershipFee : "";
      if (regex.test(income.title)) updatedIncome = { ...income, event: code, incomeCategory: category };
    });
    return updatedIncome;
  });

  return sortedIncomesByCode.map((income) => {
    if (!income.hasOwnProperty('event')) return { ...income, event: null, errors: income?.errors ? [...income.errors, ErrorType.EventError] : [ErrorType.EventError] };
    return { ...income };
  });
};

export const sortingOutcomesByCode = (codes: string[], outcomes: OutcomesBankModel[]): OutcomesWithEvent[] => {
  const sortedIncomesByCode = outcomes.map((outcome) => {
    let updatedOutcome = outcome as OutcomesBankModel;

    codes.forEach((code) => {
      const regex = new RegExp(`${code}`, 'mi');
      if (regex.test(outcome.title)) updatedOutcome = { ...outcome, event: code };
    });
    return updatedOutcome;
  });

  return sortedIncomesByCode.map((outcome) => {
    if (!outcome.hasOwnProperty('event')) return { ...outcome, event: null };
    return { ...outcome };
  }) as OutcomesWithEvent[];
};

export const matchingIncomesToTeamMember = (teams: Registry, incomes: IncomesWithEvent[]): IncomesWithPerson[] => {
  const matchedIncomesToMember = incomes.map((income) => {
    let updatedIncome = income as IncomesWithPerson;
    if (income.team === null) {
      updatedIncome = {
        ...income, name: null, surname: null, errors: income?.errors ? [...income.errors, ErrorType.NameError] : [ErrorType.NameError],
      };
    } else {
      const currentTeamMembers = Object.values(teams[income.team]);
      const foundedMember = currentTeamMembers.find((member) => {
        const nameRegex = new RegExp(member.name, 'mi');
        const surnameRegex = new RegExp(member.surname, 'mi');

        if (nameRegex.test(income.title) && surnameRegex.test(income.title)) return true;
      });

      if (foundedMember) {
        updatedIncome = { ...income, name: foundedMember.name, surname: foundedMember.surname };
      } else {
        updatedIncome = {
          ...income, name: null, surname: null, errors: income?.errors ? [...income.errors, ErrorType.NameError] : [ErrorType.NameError],
        };
      }
    }
    return updatedIncome;
  });

  return matchedIncomesToMember;
};

export const matchingIncomeByYear = (incomes: IncomesWithPerson[]): IncomesWithYear[] => {
  const currentYear = new Date().getFullYear();
  const yearRegex = new RegExp(String(currentYear), 'mi');
  const matchedIncomesByYear = incomes.map((income) => {
    let updatedIncome = income as IncomesWithYear;

    if (yearRegex.test(updatedIncome.title)) updatedIncome = { ...updatedIncome, year: Number(currentYear) };
    return updatedIncome;
  });
  return matchedIncomesByYear;
};

const setOrgNumber = (data: (OutcomesWithImportDate | IncomesWithImportDate)[]) => {
  //! It's temporary - reploace this logic with real orgNumber after migration
  const orgNumber = "6671";
  const updatedData = data.map((d) => ({ ...d, orgNumber }));

  return updatedData;
};

const setDateOfImport = (
  data: (OutcomesWithEvent | IncomesWithYear)[],
): (OutcomesWithImportDate | IncomesWithImportDate)[] => {
  const date = new Date();
  const updatedData = data.map((d: OutcomesWithEvent | IncomesWithYear) => ({ ...d, importDate: date }));

  return setOrgNumber(updatedData);
};

const setInfoAboutSourceOfOutcome = (outomes: OutcomesWithImportDate[]) => {
  const updatedData = outomes.map((o) => ({ ...o, financeMethod: FinanceMethod.Transfer }));

  return updatedData;
};

export const sortingIncome = (
  incomesToSort: IncomesBankModel[],
  teams: Registry,
  codes: string[],
): {
  sortedIncomes: IncomesWithImportDate[];
  sortedOutcomes: OutcomesWithFinanceMethod[];
} => {
  const updatedCodes = Object.values(codes).flat();

  const { incomes, outcomes } = sortingTransferToIncomesAndOutcomes(incomesToSort);

  const byTeam = sortingIncomesByTeams(teams, incomes);
  const byCode = sortingIncomesByCode(updatedCodes, byTeam);
  const byMembers = matchingIncomesToTeamMember(teams, byCode);
  const byYear = matchingIncomeByYear(byMembers);

  const outcomesWithCode = sortingOutcomesByCode(updatedCodes, outcomes);
  const outcomesWithDate = setDateOfImport(outcomesWithCode);

  return {
    sortedIncomes: setDateOfImport(byYear) as IncomesWithImportDate[],
    sortedOutcomes: setInfoAboutSourceOfOutcome(outcomesWithDate),
  };
};

export const sortOfSurname = (array: { surname: string | undefined | null }[], ifUndefined: string) => {
  array.sort((a, b) => {
    const firstPerson = a.surname ? a.surname : ifUndefined;
    const secondPerson = b.surname ? b.surname : ifUndefined;
    return firstPerson.toLocaleLowerCase().localeCompare(secondPerson.toLocaleLowerCase());
  });
  return array;
};
