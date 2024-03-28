import { useQuery } from 'react-query';

import { getTeams } from 'helpers/api-helpers/team';
import { Team } from 'models/team';
//change this import and implementation to next-friendly
import { useUserData } from './useUserData';

export const useTeams = (): Team[] => {
  const user = useUserData();

  const query = useQuery<Team[], Error>('teams', () => getTeams(), {
    enabled: !!user
  });

  return query
    .data?.map((team) => ({ ...team, teamId: Number(team.teamId) }))
    .sort((a, b) => a.teamId - b.teamId) || [];
};
