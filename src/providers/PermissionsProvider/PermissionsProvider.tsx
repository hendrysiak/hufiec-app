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
      let team = null;

      if (history.location.pathname !== '/') {
        const url = Number(history.location.pathname.slice(1));
        team = !Number.isNaN(url) ? url : null;
      }

      if (user?.team && !team) {
        if (user?.team.length > 1) {
        const choosenTeam = window.prompt(`Wybierz zespół spośród dostępnych opcji: ${user.team.map(team => team)}`, user.team[1]);
        team = choosenTeam ? Number(choosenTeam) : 1111;
        } else {
          team = Number(user.team[0]);
        }
      }

        store.dispatch(reduxSetRoles([user.role]));
        store.dispatch(reduxIsAuthentication(true));
        store.dispatch(reduxSetEvidenceNumber(user.evidenceNumber ?? ''));
        store.dispatch(reduxSetTeam(team ?? 1111));
        downloadData(team ?? 1111);

      
      if (user?.role === 'leader') {
        location.pathname !== `/${team}` ? history?.push(`/${team}`) : null;
      }
  
      if (user?.role === 'admin' && location.pathname === '/') {
        history?.push('/dashboard');
      }
    }

    if (!user) {
      history?.push('/');
    }
  }, [location.pathname, user]);

  return <>{children}</>;
}
