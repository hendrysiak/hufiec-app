import './App.css';
import CircularProgress from '@mui/material/CircularProgress';
import {
  LocalizationProvider,
} from '@mui/x-date-pickers/';

import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';

import React, { Suspense, useEffect, useState } from 'react';
import {
  QueryClient,
  QueryClientProvider,
} from 'react-query';
import { ReactQueryDevtools } from 'react-query/devtools';
import { useSelector } from 'react-redux';
import {
  BrowserRouter,
  Redirect,
  Route,
  Switch
} from 'react-router-dom';

import Cookies from 'universal-cookie';

import NavigationContainer from 'containers/NavigationContainer/NavigationContainer';
import { getAccount } from 'helpers/account.helper';
import { Decrypt, DecryptCookie } from 'helpers/password.helper';

import { AuthUserProvider } from 'providers/AuthUserProvider/AuthUserProvider';
import { PermissionsProvider } from 'providers/PermissionsProvider/PermissionsProvider';
import SnackbarProvider from 'providers/SnackbarProvider/SnackbarProvider';
import TeamsProvider from 'providers/TeamsProvider/TeamsProvider';
import { reduxIsAuthentication, reduxSetEvidenceNumber, reduxSetRoles, reduxSetTeam } from 'store/actions/user';


import { RootState } from 'store/models/rootstate.model';

import {
  getAccountState,
  getCodes,
  getRegistry,
  getImportDates,
  getInitAccountState
} from './pages/DashBoard/api-handlers/account.handler';

import * as actions from './store/actions/index';
import store from './store/store';


const App = (): JSX.Element => {
  const loadingStatus = useSelector((state: RootState) => state.ui.loading);
  const user = useSelector((state: RootState) => state.user);
  const cookies = new Cookies();
  const roles = useSelector((state: RootState) => state.user.roles);
  const team = useSelector((state: RootState) => state.user.team);
  // const [roles, setRoles] = useState<string[] | null>(null);
  // const [team, setTeam] = useState<string | null>(null);
  const [redirectToLogin, setRedirectToLogin] = useState<boolean>(false);

  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        refetchOnWindowFocus: false,
        staleTime: 30000,
      },
    },
  });


  useEffect(() => {
    const downloadData = async () => {
      await getInitAccountState();
      await getAccountState();
      await getCodes(team);
      await getRegistry();
      await getImportDates();
    };
    downloadData();
    store.dispatch(actions.reduxLoadingEnd());
    const dataLogin = DecryptCookie(cookies.get('token'));
    const checkLogin = async (login: string, password: string) => {
      const accountData = await getAccount(login);
      if (password === accountData.password) {
        store.dispatch(reduxSetRoles(accountData.roles));
        store.dispatch(reduxSetTeam(accountData.team));
        store.dispatch(reduxIsAuthentication(true));
        store.dispatch(reduxSetEvidenceNumber(login));

        // setRoles(accountData.roles);
        setRedirectToLogin(true);
        // setTeam(accountData.team);
        return;
      } else setRedirectToLogin(true);
      return;
    };
    dataLogin ? checkLogin(Decrypt(dataLogin.login), dataLogin.password) : setRedirectToLogin(true);
  }, []);

  const DashBoard = React.lazy(() => import('./pages/DashBoard/Dashboard'));
  // const Codes = React.lazy(() => import( './pages/Codes/Codes'));
  const Decision = React.lazy(() => import('./pages/Decision/Decision'));
  const Team = React.lazy(() => import('./pages/Team/Team'));
  const ForCoders = React.lazy(() => import('./pages/ForCoders/ForCoders'));
  const EventBilling = React.lazy(() => import('./pages/EventBilling/EventBilling'));
  const EventApproval = React.lazy(() => import('./pages/EventApproval/EventApproval'));
  const SortedIncome = React.lazy(() => import('./pages/SortedIncome/SortedIncome'));
  const UnAssignedIncome = React.lazy(() => import('./pages/UnAssignedIncome/UnAssignedIncome'));
  const ImportIncome = React.lazy(() => import('./pages/ImportIncome/ImportIncome'));
  const Edit = React.lazy(() => import('./pages/Edit/Edit'));
  const EditorTeam = React.lazy(() => import('./pages/EditorTeam/EditorTeam'));
  const AddPercent = React.lazy(() => import('./pages/AddPercent/AddPercent'));
  const Login = React.lazy(() => import('./pages/Login/Login'));
  const AddCode = React.lazy(() => import('./pages/AddCode/AddCode'));
  const Role = React.lazy(() => import('./pages/Role/Role'));
  const Proposals = React.lazy(() => import('./pages/Proposals/Proposals'));
  const TeamsEditor = React.lazy(() => import('./pages/TeamsEditor/TeamsEditor'));

  const routes =
    <BrowserRouter>
      <PermissionsProvider>
        <NavigationContainer isAdmin={user?.roles?.includes('admin')}>
          <Switch>
            <Route exact path="/dashboard" render={() => <DashBoard />} />
            <Route exact path="/addpercent" render={() => <AddPercent />} />
            <Route exact path="/transfers" render={() => <ImportIncome />} />
            <Route exact path="/proposals" render={() => <Proposals isAdmin height="90vh" />} />
            <Route exact path="/decisions" render={() => <Decision />} />
            <Route exact path="/transfers/imported" render={() => <UnAssignedIncome />} />
            <Route exact path="/transfers/sorted" render={() => <SortedIncome />} />
            {/* <Route exact path="/transfers/sorted/:teamId" render={() => <SortedIncome />} /> */}
            {/* <Route exact path="/codes" render={() => <Codes />} />} */}
            <Route exact path="/add-code" render={() => <AddCode isAdmin />} />
            <Route exact path="/add-approval" render={() => <EventApproval />} />
            <Route exact path="/add-billing" render={() => <EventBilling />} />
            <Route exact path="/for-coders" render={() => <ForCoders />} />
            <Route exact path="/editor" render={() => <Edit />} />
            <Route exact path="/editor-team" render={() => <EditorTeam isAdmin={user?.roles?.includes('admin')} />} />
            <Route exact path="/users" render={() => <Role />} />
            <Route exact path="/teams" render={() => <TeamsEditor />} />
            <Route exact path="/login" render={() => <Login />} />
            <Route exact path="/:teamId" render={() => <Team />} />
          </Switch>
        </NavigationContainer>
      </PermissionsProvider>
    </BrowserRouter>;

  return (
    <>
      <SnackbarProvider>
        <QueryClientProvider client={queryClient}>
          <TeamsProvider>
            <AuthUserProvider>
              <LocalizationProvider dateAdapter={AdapterDateFns}>
                <div className="app">
                  {loadingStatus
                    ? <div className="loader"><CircularProgress /></div>
                    : (<div>
                      <Suspense fallback={<div className="loader"><CircularProgress /></div>}>
                        {routes}
                      </Suspense>
                    </div>)}
                </div>
              </LocalizationProvider>
            </AuthUserProvider>
            <ReactQueryDevtools initialIsOpen={false} />
          </TeamsProvider>
        </QueryClientProvider>
      </SnackbarProvider>
    </>
  );

};

export default App;
