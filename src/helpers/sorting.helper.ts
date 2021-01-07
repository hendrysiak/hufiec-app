import { FinanceMethod } from 'models/global.enum';
import { 
  IncomesBankModel, 
  IncomesWithEvent, 
  IncomesWithImportDate, 
  IncomesWithPerson, 
  IncomesWithTeam, 
  IncomesWithYear, 
  OutcomesBankModel, 
  OutcomesWithFinanceMethod, 
  OutcomesWithImportDate
} from 'models/income.models';
import { Registry } from 'models/registry.models';


export const sortingTransferToIncomesAndOutcomes = (
  incomes: IncomesBankModel[]
): { incomes: IncomesBankModel[], outcomes: OutcomesBankModel[] } => {

  const sortedIncomes = incomes.filter(income => Number(income.cash) > 0);
  const sortedOutcomes = incomes.filter(income => Number(income.cash) < 0);

  return {
    incomes: sortedIncomes.map(income => {
      return {
        cash: Number(income.cash),
        title: income.title,
        dateOfBook: new Date(income.dateOfBook).toLocaleString().split(',')[0]
      };
    }),
    outcomes: sortedOutcomes.map(outcome => {
      return {
        cash: Number(outcome.cash),
        title: outcome.title,
        dateOfBook: new Date(outcome.dateOfBook).toLocaleString().split(',')[0]
      };
    })
  };
};

export const sortingIncomesByTeams = (teams: Registry, incomes: IncomesBankModel[]): IncomesWithTeam[] => {

  const updatedIncomes: IncomesWithTeam[] = incomes.map(income => {
    let updatedIncome = income as IncomesWithTeam;

    Object.keys(teams).forEach(teamCode => {
      const regex = new RegExp(`${teamCode}`, 'm'); // team code as regex pattern
      if (regex.test(income.title)) updatedIncome = { ...income, team: teamCode };
      else return;
    });
    return updatedIncome;
  });

  return updatedIncomes.map(income => {
    if (!income.hasOwnProperty('team')) return { ...income, team: null };
    else return { ...income };
  });
};


export const sortingIncomesByCode = (codes: string[], incomes: IncomesWithTeam[]): IncomesWithEvent[] => {
  const sortedIncomesByCode = incomes.map(income => {
    let updatedIncome = income as IncomesWithEvent;

    codes.forEach(code => {
      const regex = new RegExp(`${code}`, 'mi'); 
      if (regex.test(income.title)) updatedIncome = { ...income, event: code };
    });
    return updatedIncome;
  });

  return sortedIncomesByCode.map(income => {
    if (!income.hasOwnProperty('event')) return { ...income, event: null };
    else return { ...income };
  });
};

export const matchingIncomesToTeamMember = (teams: Registry, incomes: IncomesWithEvent[]): IncomesWithPerson[] => {
  const matchedIncomesToMember = incomes.map(income => {
    let updatedIncome = income as IncomesWithPerson;
    if (income.team === null) updatedIncome = { ...income, name: null, surname: null };
    else {

      const currentTeamMembers = [...teams[income.team]];
      const findedMember = currentTeamMembers.find(member => {

        const nameRegex = new RegExp(member.name, 'mi');
        const surnameRegex = new RegExp(member.surname, 'mi');

        if (nameRegex.test(income.title) && surnameRegex.test(income.title)) return true;
      });

      if (findedMember) updatedIncome = { ...income, name: findedMember.name, surname: findedMember.surname };

    }
    return updatedIncome;
  });

  return matchedIncomesToMember;

};

export const matchingIncomeByYear = (incomes: IncomesWithPerson[]): IncomesWithYear[] => {
  const currentYear = new Date().getFullYear();
  const yearRegex = new RegExp(String(currentYear), 'mi');
  const matchedIncomesByYear = incomes.map(income => {
    let updatedIncome = income as IncomesWithYear;

    if (yearRegex.test(updatedIncome.title)) updatedIncome = { ...updatedIncome, year: Number(currentYear) };
    return updatedIncome;
  });
  return matchedIncomesByYear;
};

const setDateOfImport = (data: any) => {
  const date = new Date();
  const updatedDate = date.toLocaleString().split(',')[0];
  const updatedData = data.map((d: OutcomesBankModel | IncomesWithYear) => {
    return { ...d, importDate: updatedDate };
  });
    
  return updatedData;
};

const setInfoAboutSourceOfOutcome = (outomes: OutcomesWithImportDate[]) => {
  const updatedData = outomes.map(o => {
    return { ...o, financeMethod: FinanceMethod.Transfer };
  });

  return updatedData;
};

export const sortingIncome = (
  incomesToSort: IncomesBankModel[], 
  teams: Registry, 
  codes: string[]): {
  sortedIncomes: IncomesWithImportDate[];
  sortedOutcomes: OutcomesWithFinanceMethod[];
} => {
  const updatedCodes = Object.values(codes).flat();

  const { incomes, outcomes } = sortingTransferToIncomesAndOutcomes(incomesToSort);

  const byTeam = sortingIncomesByTeams(teams, incomes);
  const byCode = sortingIncomesByCode(updatedCodes, byTeam);
  const byMembers = matchingIncomesToTeamMember(teams, byCode);
  const byYear = matchingIncomeByYear(byMembers);

  const outcomesWithDate = setDateOfImport(outcomes);

  return {
    sortedIncomes: setDateOfImport(byYear),
    sortedOutcomes: setInfoAboutSourceOfOutcome(outcomesWithDate)
  };
};