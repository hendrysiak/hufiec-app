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
} from './helpers/api-helpers/account.handler';

import * as actions from './store/actions/index';
import store from './store/store';

function App(): JSX.Element {
  const loadingStatus = useSelector((state: RootState) => state.ui.loading);
  const user = useSelector((state: RootState) => state.user);
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
    // if (authUser) {
    //   downloadData();
    // }
    store.dispatch(actions.reduxLoadingEnd());

  }, [authUser?.uid]);

  const Account = React.lazy(() => import('./app/account/page'));
  const DashBoard = React.lazy(() => import('./app/dashboard/page'));
  const Decision = React.lazy(() => import('./legacy/Decision/Decision'));
  const Team = React.lazy(() => import('./legacy/Team/Team'));
  const ForCoders = React.lazy(() => import('./legacy/ForCoders/ForCoders'));
  // const EventBilling = React.lazy(() => import('./pages/EventBilling/EventBilling'));
  // const EventApproval = React.lazy(() => import('./pages/EventApproval/EventApproval'));
  const Import = React.lazy(() => import('./legacy/Import/Import'));
  const Edit = React.lazy(() => import('./legacy/Edit/Edit'));
  const EditorTeam = React.lazy(() => import('./legacy/EditorTeam/EditorTeam'));
  const Login = React.lazy(() => import('./legacy/Login/Login'));
  const AddCode = React.lazy(() => import('./legacy/AddCode/AddCode'));
  const Role = React.lazy(() => import('./legacy/Role/Role'));
  const Proposals = React.lazy(() => import('./legacy/Proposals/Proposals'));
  const TeamsEditor = React.lazy(() => import('./legacy/TeamsEditor/TeamsEditor'));

  const routes = (
    <BrowserRouter>
      <PermissionsProvider>
        <NavigationContainer isAdmin={user?.roles?.includes('admin')}>
          <Switch>
            <Route exact path="/" render={() => <Login />} />
            <Route exact path="/account" render={() => <Account />} />
            <Route exact path="/dashboard" render={() => <DashBoard />} />
            <Route exact path="/transfers" render={() => <Import />} />
            <Route exact path="/proposals" render={() => <Proposals isAdmin height="90vh" />} />
            <Route exact path="/decisions" render={() => <Decision />} />
            <Route exact path="/add-code" render={() => <AddCode isAdmin />} />
            {/* <Route exact path="/add-approval" render={() => <EventApproval />} /> */}
            {/* <Route exact path="/add-billing" render={() => <EventBilling />} /> */}
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
