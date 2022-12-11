import { useQuery } from 'react-query';

import { getAccount } from 'helpers/api-helpers/user';

export const useUserData = (uid?: string) => {
  console.log(uid);
  const { data } = useQuery(['user', uid], () => getAccount(uid), {
    enabled: !!uid
  });

  return data;
};