import { AxiosResponse } from 'axios';

import axios from 'axios-income';
import { ITeam, Team } from 'models/team';

export const getTeams = async (): Promise<Team[]> => {
  const teams: AxiosResponse<ITeam> = await axios.get('/teams.json');

  const mappedTeams = Object
    .entries(teams.data)
    .map(([id, team]: [string, Team]) => ({ ...team, id }));

  return mappedTeams;
};

export const saveTeam = async (
  team: Team,
): Promise<void> => {
  const newTeam = await axios.post('/teams.json', { name: team.name, nameToUse: team.nameToUse, teamId: team.teamId });
  return newTeam.data;
};

export const editTeam = async (team: Team): Promise<Team> => {
  const updatedTeam = await axios.patch(`/teams/${team.id}/.json`, team);

  return updatedTeam.data;
};

export const deleteTeam = async (teamId: string): Promise<void> => {
  await axios.delete(`/teams/${teamId}/.json`);
};
