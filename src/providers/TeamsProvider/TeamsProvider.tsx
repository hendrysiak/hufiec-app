import React from 'react';

import { useQuery } from 'react-query';

import { getTeams } from 'helpers/api-helpers/team';
import { useUserData } from 'helpers/hooks/useUserData';
import { Team } from 'models/team';

interface TeamsValues {
  teams: Team[] | null;
}

const TeamContextValues: TeamsValues = {
  teams: null,
};

const TeamContext = React.createContext<TeamsValues>(TeamContextValues);
  

type TeamsProviderProps = {
  children: React.ReactElement | React.ReactElement[];
};

const TeamsProvider = (props: TeamsProviderProps): JSX.Element => {
  const user = useUserData();

  const query = useQuery<Team[], Error>('teams', () => getTeams(), {
    enabled: !!user
  });
    
  return <TeamContext.Provider
    value={{
      teams: query.data?.map((team) => ({ ...team, teamId: Number(team.teamId) })).sort((a, b) => a.teamId - b.teamId) || [],
    }}
  >
    {props.children}
  </TeamContext.Provider>;
};

// export const useTeams = (): TeamsValues => React.useContext(TeamContext);

export default TeamsProvider;


