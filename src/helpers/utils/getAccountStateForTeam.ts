import { IncomeCategory, FoundingSources } from "models/global.enum";
import { IncomeDb, OutcomeDb } from "models/income.models";
import { APIPerson } from "models/registry.models";
import { countingMemberFee } from "helpers/member-fee.helper";
import store from "store/store";

const getOnePercentState = (team: string, incomes: IncomeDb[]) => {
    return incomes.filter((income) => income.incomeCategory === IncomeCategory.OnePercent).reduce((acc, curr) => acc + curr.cash, 0);
};

const getOnePercentOutcomes = (team: string, outcomes: OutcomeDb[]) => {
    return outcomes.filter((outcome) => outcome.foundingSource === FoundingSources.OneProcent).reduce((acc, curr) => acc + curr.cash, 0);
};

const getPublicCollectionsState = (team: string, incomes: IncomeDb[]) => {
    return incomes.filter((income) => income.incomeCategory === IncomeCategory.PublicCollection).reduce((acc, curr) => acc + curr.cash, 0);
};

const getPublicCollectionsOutcome = (team: string, outcomes: OutcomeDb[]) => {
    return outcomes.filter((outcome) => outcome.foundingSource === FoundingSources.PublicCollection).reduce((acc, curr) => acc + curr.cash, 0);
};

const getTeamAccountOutcome = (team: string, outcomes: OutcomeDb[]) => {
    return outcomes.filter((outcome) => outcome.foundingSource === FoundingSources.OwnResources).reduce((acc, curr) => acc + curr.cash, 0);
};

const getSumOfFeesForTeam = (team: string, incomes: IncomeDb[]) => {
    return incomes
    .filter((income) => income.event === 'SC')
    .reduce((sum: number, income) => {
      if (income.year === 2023) {
        return sum + income.cash * 0.2
      } else if (income.year === 2024) {
        return sum + income.cash * 0.2174
      } else return sum + income.cash * 0.16
    }, 0);
};

export const getAccountStateForTeam = (team: string) => {
    const dbIncomes = store.getState().income.dbIncomes;
    const dbOutcomes = store.getState().income.dbOutcomes;
    const teamAccountState = store.getState().income.teamAccounts?.[team] ?? 0;
    const registry = store.getState().income.registry;

    const teamRegistry = Object.values(registry[team] ?? {});

    const incomes = dbIncomes.filter((income) => income.team === `${team}`);
    const outcomes = dbOutcomes.filter((outcome) => outcome.team === `${team}`);

    const sumOfNeededFees = () => {
        // const currentYear = new Date().getFullYear();
        // const lastDayOfPreviousYear = new Date(currentYear - 1, 11, 31);
    
        return teamRegistry
          .reduce((sum: number, person: APIPerson) => {
            const fees = countingMemberFee(person, new Date());
    
            if (Number(fees) < 0) return sum + Number(fees);
    
            return sum + 0;
          }, 0);
      };

      return {
        onePercentState: getOnePercentState(team, incomes),
        onePercentOutcomes: getOnePercentOutcomes(team, outcomes),
        publicCollectionsState: getPublicCollectionsState(team, incomes),
        publicCollectionsOutcome: getPublicCollectionsOutcome(team, outcomes),
        teamAccountState: teamAccountState,
        teamAccountOutcome: getTeamAccountOutcome(team, outcomes),
        sumOfFeesForTeam: getSumOfFeesForTeam(team, incomes),
        sumOfNeededFees: sumOfNeededFees(),
      }

};