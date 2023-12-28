import { IncomeDb, OutcomeDb } from "models/income.models";

export const calculateTeamAccount = (team: string, incomes: IncomeDb[], outcomes: OutcomeDb[]) => {
    const dbIncomes = incomes.filter((income) => income.team === team);
    const dbOutcomes = outcomes.filter((outcome) => outcome.team === team);

}