import axios from "axios-income";
import {
  IncomeDb,
  OutcomesWithEvent,
  OutcomeDb,
  IncomesWithImportDate,
  OutcomeWithBilingNr,
} from "models/income.models";
import { APIPerson, Person } from "models/registry.models";
import {
  reduxAddDbIncome,
  reduxAddDbOutcome,
  reduxAddMember,
  reduxDeleteDbIncome,
  reduxDeleteDbOutcome,
  reduxDeleteMember,
  reduxEditDbIncome,
  reduxEditDbOutcome,
  reduxEditMember,
  reduxGetAccountState,
} from "store/actions/income";
import store from "store/store";

export const editOutcome = async (data: OutcomeDb): Promise<void> => {
  const { id, ...rest } = data;
  await axios.put(`/outcomes/${id}.json`, rest);
  store.dispatch(reduxEditDbOutcome(data));
};

export const addOutcome = async (data: OutcomeWithBilingNr): Promise<void> => {
  const response = await axios.post("/outcomes.json", data);
  const { name } = response.data;

  const newOutcome = { ...data, id: name };
  store.dispatch(reduxAddDbOutcome(newOutcome));
};

export const deleteOutcome = async (id: string): Promise<void> => {
  store.dispatch(reduxDeleteDbOutcome(id));
  await axios.delete(`/outcomes/${id}.json`);
};

export const editIncome = async (data: IncomeDb): Promise<void> => {
  const { id, ...rest } = data;
  await axios.put(`/incomes/${id}.json`, rest);
  store.dispatch(reduxEditDbIncome(data));
};

export const addIncome = async (data: IncomesWithImportDate): Promise<void> => {
  const response = await axios.post("/incomes.json", data);
  const { name } = response.data;

  const newIncome = { ...data, id: name };
  store.dispatch(reduxAddDbIncome(newIncome));
};

export const deleteIncome = async (id: string): Promise<void> => {
  store.dispatch(reduxDeleteDbIncome(id));
  await axios.delete(`/incomes/${id}.json`);
};

export const deleteIncomesByCode = async (code: string): Promise<void> => {
  const filteredIncomes = store
    .getState()
    .income.dbIncomes.filter((income) => income.event !== code);
  const outcomes = store.getState().income.dbOutcomes;

  try {
    await axios.put("/incomes.json", filteredIncomes);

    store.dispatch(
      reduxGetAccountState(
        filteredIncomes as IncomeDb[],
        outcomes as OutcomeDb[]
      )
    );
  } catch (err) {
    console.log(err);
  }
};

export const deleteAllOutcomes = async (): Promise<void> => {
  const incomes = store.getState().income.dbIncomes;

  try {
    await axios.put("/outcomes.json", []);

    store.dispatch(
      reduxGetAccountState(incomes as IncomeDb[], [] as OutcomeDb[])
    );
  } catch (err) {
    console.log(err);
  }
};

export const addTeamMember = async (
  team: number,
  person: { name: string; surname: string; evidenceNumber?: string }
): Promise<void> => {
  const extendedPerson: Person = {
    ...person,
    dateOfAdd: new Date(),
    team: Number(team),
  };
  const response = await axios.post("/registry.json", extendedPerson);

  store.dispatch(reduxAddMember({ ...extendedPerson, id: response.data.name }));
};

export const editTeamMember = async (
  team: number,
  person: Partial<APIPerson> | null
): Promise<void> => {
  if (!person) return;

  await axios.patch(`/registry/${person.id}.json`, { ...person });
  store.dispatch(reduxEditMember(person, Number(team)));
};

export const deleteTeamMember = async (person: APIPerson): Promise<void> => {
  const { team, ...mappedPerson } = person;

  axios.patch(`/registry/${person.id}.json`, mappedPerson);
  team && store.dispatch(reduxEditMember(person, Number(team)));
};

export const permanentDeleteTeamMember = async (
  person: APIPerson
): Promise<void> => {
  axios.delete(`/registry/${person.id}.json`);
  store.dispatch(reduxDeleteMember(person));
};

export const updateOnePercent = async (
  team: string,
  value: string
): Promise<number> => {
  const newValue = await axios.put(`/onePercent/${team}.json`, value);
  return newValue.data * 1;
};

export const createBackup = async (): Promise<string> => {
  const codes = await axios.get("/codes.json");
  const decision = await axios.get("/decision.json");
  const foundingSources = await axios.get("/foundingSources.json");
  const importDates = await axios.get("/importDates.json");
  const incomes = await axios.get("/incomes.json");
  const initAccountState = await axios.get("/initAccountState.json");
  const onePercent = await axios.get("/onePercent.json");
  const outcomeCategory = await axios.get("/outcomeCategory.json");
  const outcomes = await axios.get("/outcomes.json");
  const proposal = await axios.get("/proposal.json");
  const registry = await axios.get("/registry.json");
  const teams = await axios.get("/teams.json");
  const teamAccounts = await axios.get("/teamAccounts.json");
  const users = await axios.get("/users.json");

  return JSON.stringify({
    codes: codes.data,
    decision: decision.data,
    foundingSources: foundingSources.data,
    importDates: importDates.data,
    initAccountState: initAccountState.data,
    teamAccounts: teamAccounts.data,
    onePercent: onePercent.data,
    outcomeCategory: outcomeCategory.data,
    proposal: proposal.data,
    registry: registry.data,
    teams: teams.data,
    users: users.data,
    incomes: incomes.data,
    outcomes: outcomes.data,
  });
};

export const getGlobalSettings = async (): Promise<{
  isMaintenanceMode?: boolean;
  endOfPeriodToCalc?: string;
}> => {
  const response = await axios.get("/globalSettings.json");
  return response.data;
};

export const setGlobalSettings = async (settings: {
  isMaintenanceMode?: boolean;
  endOfPeriodToCalc?: string | Date;
}): Promise<void> => {
  await axios.put(`/globalSettings.json`, settings);
};
