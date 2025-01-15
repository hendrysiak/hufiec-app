import { useQuery } from "react-query";

import { getAccount } from "helpers/api-helpers/user";

export const useUserData = (uid?: string) => {
  const { data, error, isLoading } = useQuery(
    ["user", uid],
    () => getAccount(uid),
    {
      enabled: !!uid,
      staleTime: 5 * 60 * 1000, // Cache for 5 minutes
      retry: 2,
    }
  );

  return { user: data, error, isLoading };
};
