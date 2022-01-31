import { useQuery } from 'react-query';

import { getTeams } from 'helpers/api-helpers/team';
import { Team } from 'models/team';

export const useTeams = (): Team[] => {
  const query = useQuery<Team[], Error>('teams', () => getTeams());

  return query
    .data?.map((team) => ({ ...team, teamId: Number(team.teamId) }))
        .sort((a, b) => a.teamId - b.teamId) || [];
};