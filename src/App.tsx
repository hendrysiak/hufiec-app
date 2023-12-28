import './App.css';
import CircularProgress from '@mui/material/CircularProgress';
import {
  LocalizationProvider,
} from '@mui/x-date-pickers/';

import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';

import React, { Suspense, useEffect } from 'react';
import {
  QueryClient,
  QueryClientProvider,
} from 'react-query';
import { ReactQueryDevtools } from 'react-query/devtools';
import { useSelector } from 'react-redux';
import {
  BrowserRouter,
  Route,
  Switch,
} from 'react-router-dom';

import NavigationContainer from 'containers/NavigationContainer/NavigationContainer';

import { AuthUserProvider, useAuth } from 'providers/AuthUserProvider/AuthUserProvider';
import { PermissionsProvider } from 'providers/PermissionsProvider/PermissionsProvider';
import SnackbarProvider from 'providers/SnackbarProvider/SnackbarProvider';
import TeamsProvider from 'providers/TeamsProvider/TeamsProvider';

import { RootState } from 'store/models/rootstate.model';

import {
  getAccountState,
  getCodes,
  getRegistry,
  getImportDates,
  getInitAccountState,
} from './pages/DashBoard/api-handlers/account.handler';

import * as actions from './store/actions/index';
import store from './store/store';

function App(): JSX.Element {
  const loadingStatus = useSelector((state: RootState) => state.ui.loading);
  const user = useSelector((state: RootState) => state.user);
  const team = useSelector((state: RootState) => state.user.team);
  const { authUser } = useAuth();

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

    console.log(authUser);
    if (authUser) {
      downloadData();
    }
    store.dispatch(actions.reduxLoadingEnd());
    // const dataLogin = DecryptCookie(cookies.get('token'));
    // const checkLogin = async (login: string, password: string) => {
    //   const accountData = await getAccount(login);
    //   if (password === accountData?.password) {
    //     store.dispatch(reduxSetRoles([accountData.role]));
    //     store.dispatch(reduxSetTeam(accountData?.team));
    //     store.dispatch(reduxIsAuthentication(true));
    //     store.dispatch(reduxSetEvidenceNumber(login));

    //     // setRoles(accountData.roles);
    //     setRedirectToLogin(true);
    //     // setTeam(accountData.team);
    //     return;
    //   } else setRedirectToLogin(true);
    //   return;
    // };
    // dataLogin ? checkLogin(Decrypt(dataLogin.login), dataLogin.password) : setRedirectToLogin(true);
  }, [authUser?.uid]);

  const Account = React.lazy(() => import('./pages/account'));
  const DashBoard = React.lazy(() => import('./pages/DashBoard/Dashboard'));
  const Decision = React.lazy(() => import('./pages/Decision/Decision'));
  const Team = React.lazy(() => import('./pages/Team/Team'));
  const ForCoders = React.lazy(() => import('./pages/ForCoders/ForCoders'));
  const EventBilling = React.lazy(() => import('./pages/EventBilling/EventBilling'));
  const EventApproval = React.lazy(() => import('./pages/EventApproval/EventApproval'));
  const Import = React.lazy(() => import('./pages/Import/Import'));
  const Edit = React.lazy(() => import('./pages/Edit/Edit'));
  const EditorTeam = React.lazy(() => import('./pages/EditorTeam/EditorTeam'));
  const AddPercent = React.lazy(() => import('./pages/AddPercent/AddPercent'));
  const Login = React.lazy(() => import('./pages/Login/Login'));
  const AddCode = React.lazy(() => import('./pages/AddCode/AddCode'));
  const Role = React.lazy(() => import('./pages/Role/Role'));
  const Proposals = React.lazy(() => import('./pages/Proposals/Proposals'));
  const TeamsEditor = React.lazy(() => import('./pages/TeamsEditor/TeamsEditor'));

  const routes = (
    <BrowserRouter>
      <PermissionsProvider>
        <NavigationContainer isAdmin={user?.roles?.includes('admin')}>
          <Switch>
            <Route exact path="/" render={() => <Login />} />
            <Route exact path="/account" render={() => <Account />} />
            <Route exact path="/dashboard" render={() => <DashBoard />} />
            <Route exact path="/addpercent" render={() => <AddPercent />} />
            <Route exact path="/transfers" render={() => <Import />} />
            <Route exact path="/proposals" render={() => <Proposals isAdmin height="90vh" />} />
            <Route exact path="/decisions" render={() => <Decision />} />
            <Route exact path="/add-code" render={() => <AddCode isAdmin />} />
            <Route exact path="/add-approval" render={() => <EventApproval />} />
            <Route exact path="/add-billing" render={() => <EventBilling />} />
            <Route exact path="/for-coders" render={() => <ForCoders />} />
            <Route exact path="/editor" render={() => <Edit />} />
            <Route exact path="/editor-team" render={() => <EditorTeam isAdmin={user?.roles?.includes('admin')} />} />
            <Route exact path="/users" render={() => <Role />} />
            <Route exact path="/teams" render={() => <TeamsEditor />} />
            <Route exact path="/:teamId" render={() => <Team />} />
          </Switch>
        </NavigationContainer>
      </PermissionsProvider>
    </BrowserRouter>
  );

  return (
    <SnackbarProvider>
      <QueryClientProvider client={queryClient}>
        <AuthUserProvider>
          <TeamsProvider>
            <LocalizationProvider dateAdapter={AdapterDateFns}>
              <div className="app">
                {loadingStatus
                  ? <div className="loader"><CircularProgress /></div>
                  : (
                    <div>
                      <Suspense fallback={<div className="loader"><CircularProgress /></div>}>
                        {routes}
                      </Suspense>
                    </div>
                  )}
              </div>
            </LocalizationProvider>
          </TeamsProvider>
        </AuthUserProvider>
        <ReactQueryDevtools initialIsOpen={false} />
      </QueryClientProvider>
    </SnackbarProvider>
  );
}

export default App;
