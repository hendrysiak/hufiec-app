import React from 'react';

import { useHistory, useLocation } from 'react-router-dom';

import { useUserData } from 'helpers/hooks/useUserData';
import {
  getInitAccountState, getAccountState, getRegistry, getImportDates, getCodes,
} from 'pages/DashBoard/api-handlers/account.handler';
import { reduxSetRoles, reduxIsAuthentication, reduxSetTeam } from 'store/actions';
import { reduxSetEvidenceNumber } from 'store/actions/user';
import store from 'store/store';

import { useAuth } from '../AuthUserProvider/AuthUserProvider';

const downloadData = async (team: number) => {
  await getInitAccountState();
  await getAccountState();
  await getCodes(team);
  await getRegistry();
  await getImportDates();
};

export function PermissionsProvider({ children } : { children: React.ReactElement }) {
  const { authUser } = useAuth();
  const history = useHistory();
  const location = useLocation();

  const user = useUserData(authUser?.uid);

  // THere we want to provide check function to make sure that the user with correct role has access to correct data

  React.useEffect(() => {
    if (user) {
      store.dispatch(reduxSetRoles([user.role]));
      store.dispatch(reduxIsAuthentication(true));
      store.dispatch(reduxSetEvidenceNumber(user.evidenceNumber ?? ''));
      store.dispatch(reduxSetTeam(user?.team ? Number(user.team) : 1111));
      downloadData(user?.team ? Number(user.team) : 1111);
    }

    if (user && user?.role === 'leader') {
      location.pathname !== `/${user.team}` ? history?.push(`/${user.team}`) : null;
    }

    if (user && user?.role === 'admin' && location.pathname === '/login') {
      history?.push('/dashboard');
    }

    if (!user) {
      history?.push('/login');
    }
  }, [location.pathname, user]);

  return <>{children}</>;
}
