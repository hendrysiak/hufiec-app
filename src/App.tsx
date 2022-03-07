/**
 * TODO:
 * zaimplementować budowanie initAccountState i kasowanie przelewów za składki
 * przepisać algorytm czyszzący zamknięty rok
 * powiększyć komunikaty ze snackbar
 * nie działa edycja daty pisma na widoku akcji kodów
 * dodać możliwość generacji ręcznej kodu lub dodatkowe opcje
 * edycja wartości newValues
 */

import './App.css';
import DateFnsUtils from '@date-io/date-fns';
import CircularProgress from '@material-ui/core/CircularProgress';
import {
  MuiPickersUtilsProvider,
} from '@material-ui/pickers';

import React, { Suspense, useEffect, useState } from 'react';
import {
  QueryClient,
  QueryClientProvider,
} from 'react-query';
import { ReactQueryDevtools } from 'react-query/devtools';
import { useSelector } from 'react-redux';
import { BrowserRouter, 
  Redirect, 
  Route, 
  Switch } from 'react-router-dom';

import Cookies from 'universal-cookie';

import NavigationContainer from 'containers/NavigationContainer/NavigationContainer';
import { getAccount } from 'helpers/account.helper';
import { Decrypt, DecryptCookie } from 'helpers/password.helper';
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
  },[]);

  const DashBoard = React.lazy(() => import( './pages/DashBoard/Dashboard'));
  // const Codes = React.lazy(() => import( './pages/Codes/Codes'));
  const Decision = React.lazy(() => import( './pages/Decision/Decision'));
  const Team = React.lazy(() => import( './pages/Team/Team'));
  const ForCoders = React.lazy(() => import( './pages/ForCoders/ForCoders'));
  const EventBilling = React.lazy(() => import( './pages/EventBilling/EventBilling'));
  const EventApproval = React.lazy(() => import( './pages/EventApproval/EventApproval'));
  const SortedIncome = React.lazy(() => import( './pages/SortedIncome/SortedIncome'));
  const UnAssignedIncome = React.lazy(() => import( './pages/UnAssignedIncome/UnAssignedIncome'));
  const ImportIncome = React.lazy(() => import( './pages/ImportIncome/ImportIncome'));
  const Edit = React.lazy(() => import( './pages/Edit/Edit'));
  const EditorTeam = React.lazy(() => import('./pages/EditorTeam/EditorTeam'));
  const AddPercent = React.lazy(() => import('./pages/AddPercent/AddPercent'));
  const Login = React.lazy(() => import('./pages/Login/Login'));
  const AddCode = React.lazy(() => import('./pages/AddCode/AddCode'));
  const Role = React.lazy(() => import('./pages/Role/Role'));
  const Proposals = React.lazy(() => import('./pages/Proposals/Proposals'));
  const TeamsEditor = React.lazy(() => import('./pages/TeamsEditor/TeamsEditor'));

  const routes = 
    <BrowserRouter>
      <NavigationContainer isAdmin={user?.roles?.includes('admin')}>
        <Switch>
          {user.roles && user.roles.includes('admin') && <Route exact path="/" render={() => <DashBoard />} />}
          {user.roles && user.roles.includes('admin') && <Route exact path="/addpercent" render={() => <AddPercent />}/>}
          {user.roles && user.roles.includes('admin') && <Route exact path="/transfers" render={() => <ImportIncome />} />}
          {user.roles && user.roles.includes('admin') && <Route exact path="/proposals" render={() => <Proposals isAdmin height="90vh"/>} />}
          {user.roles && user.roles.includes('admin') && <Route exact path="/decisions" render={() => <Decision />} />}
          {user.roles && user.roles.includes('admin') && <Route exact path="/transfers/imported" render={() => <UnAssignedIncome />} />}
          {user.roles && user.roles.includes('admin') && <Route exact path="/transfers/sorted" render={() => <SortedIncome />} />}
          {/* <Route exact path="/transfers/sorted/:teamId" render={() => <SortedIncome />} /> */}
          {/* {user.roles && user.roles.includes('admin') && <Route exact path="/codes" render={() => <Codes />} />} */}
          {user.roles && user.roles.includes('admin') && <Route exact path="/add-code" render={() => <AddCode isAdmin />} />}
          {user.roles && user.roles.includes('admin') && <Route exact path="/add-approval" render={() => <EventApproval />} />}
          {user.roles && user.roles.includes('admin') && <Route exact path="/add-billing" render={() => <EventBilling />} />}
          {user.roles && user.roles.includes('admin') && <Route exact path="/for-coders" render={() => <ForCoders/>} />}
          {user.roles && user.roles.includes('admin') && <Route exact path="/editor" render={() => <Edit />} />}
          {user.roles && user.roles.includes('admin') && <Route exact path="/editor-team" render={() => <EditorTeam isAdmin={user?.roles?.includes('admin')} />} />}
          {user.roles && user.roles.includes('admin') && <Route exact path="/users" render={() => <Role />} />}
          {user.roles && user.roles.includes('admin') && <Route exact path="/teams" render={() => <TeamsEditor />} />}
          {user.roles && (user.roles.includes('admin') || user.roles.includes('leader')) && <Route exact path="/:teamId" render={() => <Team />}/>}
          <Route exact path="/login" render={() => <Login />} />
        </Switch>
        {user.roles && !user.roles.includes('admin') && team ? <Redirect exact to={`/${team}`}/> : <></>}
        {redirectToLogin && !roles ? <Redirect exact to="/login"/> : <></>}
      </NavigationContainer>
    </BrowserRouter>;

  return (
    <>
      <SnackbarProvider>
        <QueryClientProvider client={queryClient}>
          <TeamsProvider>
            <MuiPickersUtilsProvider utils={DateFnsUtils}>
              <div className="app">
                {loadingStatus 
                  ? <div className="loader"><CircularProgress/></div>
                  : (<div>
                    <Suspense fallback={<div className="loader"><CircularProgress/></div>}>
                      {routes}
                    </Suspense>
                  </div>)}
              </div>
            </MuiPickersUtilsProvider>
            <ReactQueryDevtools initialIsOpen={false} />
          </TeamsProvider>
        </QueryClientProvider>
      </SnackbarProvider>
    </>
  );

};

export default App;
