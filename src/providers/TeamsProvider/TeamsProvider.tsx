"use client"

import { useQuery } from 'react-query';

import { getTeams } from 'helpers/api-helpers/team';
import { useUserData } from 'helpers/hooks/useUserData';
import { Team } from 'models/team';
import { ReactElement, createContext } from 'react';

interface TeamsValues {
  teams: Team[] | null;
}

const TeamContextValues: TeamsValues = {
  teams: null,
};

const TeamContext = createContext<TeamsValues>(TeamContextValues);

type TeamsProviderProps = {
  children: ReactElement | ReactElement[];
};

function TeamsProvider(props: TeamsProviderProps): JSX.Element {
  const user = useUserData();

  const query = useQuery<Team[], Error>('teams', () => getTeams(), {
    enabled: !!user,
  });

  return (
    <TeamContext.Provider
      value={{
        teams: query.data?.map((team) => ({ ...team, teamId: Number(team.teamId) })).sort((a, b) => a.teamId - b.teamId) || [],
      }}
    >
      {props.children}
    </TeamContext.Provider>
  );
}

// export const useTeams = (): TeamsValues => React.useContext(TeamContext);

export default TeamsProvider;
