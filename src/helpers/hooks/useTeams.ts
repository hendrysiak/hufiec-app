import { useQuery } from "react-query";

import { getTeams } from "helpers/api-helpers/team";
import { Team } from "models/team";
//change this import and implementation to next-friendly
import { useSession } from "next-auth/react";

export const useTeams = (): Team[] => {
  const session = useSession();

  const query = useQuery<Team[], Error>("teams", () => getTeams(), {
    enabled: !!session.data?.user?.email,
  });

  return (
    query.data
      ?.map((team) => ({ ...team, teamId: Number(team.teamId) }))
      .sort((a, b) => a.teamId - b.teamId) || []
  );
};
