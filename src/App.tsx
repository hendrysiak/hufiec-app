import './App.css';
import DateFnsUtils from '@date-io/date-fns';
import CircularProgress from '@material-ui/core/CircularProgress';
import {
  MuiPickersUtilsProvider,
} from '@material-ui/pickers';

import React, { Suspense, useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { BrowserRouter, 
  Redirect, 
  Route, 
  Switch } from 'react-router-dom';

import Cookies from 'universal-cookie';

import { getAccount } from 'helpers/account.helper';
import { useHandlerLogout } from 'helpers/hooks/useHandlerLogout';
import { Decrypt, DecryptCookie } from 'helpers/password.helper';
import { reduxSetRoles } from 'store/actions/user';


import { RootState } from 'store/models/rootstate.model';

import { 
  getAccountState, 
  getCodes, 
  getRegistry, 
  getImportDates 
} from './pages/DashBoard/api-handlers/account.handler';

import * as actions from './store/actions/index';
import store from './store/store';


const App = (): JSX.Element => {
  //TODO temporary "any" fix`
  const loadingStatus = useSelector((state: RootState) => state.ui.loading);
  const user = useSelector((state: RootState) => state.user);
  const cookies = new Cookies();
  const [roles, setRoles] = useState<string[] | null>(null);
  const [team, setTeam] = useState<string | null>(null);
  const [redirectToLogin, setRedirectToLogin] = useState<boolean>(false);
  
  useEffect(() => {
    const downloadData = async () => {
      await getAccountState();
      await getCodes();
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
        setRoles(accountData.roles);
        setRedirectToLogin(true);
        setTeam(accountData.team);
        return;
      } else setRedirectToLogin(true);
      return;
    };
    dataLogin ? checkLogin(Decrypt(dataLogin.login), dataLogin.password) : setRedirectToLogin(true);
  },[]);
  useHandlerLogout();

  const DashBoard = React.lazy(() => import( './pages/DashBoard/Dashboard'));
  const Codes = React.lazy(() => import( './pages/Codes/Codes'));
  const AddCode = React.lazy(() => import( './pages/AddCode/AddCode'));
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

  //TODO jeśli jest lider, ma w api informacje z jakiej jednoski pochodzi - z bazy danych, przypisywane w redux i przekierowywanie tylko i wylacznie na jego TEAM.
  const routes = 
    <BrowserRouter>
      <Switch>
        {user.roles && user.roles.includes('admin') && <Route exact path="/" render={() => <DashBoard />} />}
        {user.roles && user.roles.includes('admin') && <Route exact path="/addpercent" render={() => <AddPercent />}/>}
        {user.roles && user.roles.includes('admin') && <Route exact path="/transfers" render={() => <ImportIncome />} />}
        {user.roles && user.roles.includes('admin') && <Route exact path="/transfers/imported" render={() => <UnAssignedIncome />} />}
        {user.roles && user.roles.includes('admin') && <Route exact path="/transfers/sorted" render={() => <SortedIncome />} />}
        {/* <Route exact path="/transfers/sorted/:teamId" render={() => <SortedIncome />} /> */}
        {user.roles && user.roles.includes('admin') && <Route exact path="/codes" render={() => <Codes />} />}
        {user.roles && user.roles.includes('admin') && <Route exact path="/add-code" render={() => <AddCode/>} />}
        {user.roles && user.roles.includes('admin') && <Route exact path="/add-approval" render={() => <EventApproval />} />}
        {user.roles && user.roles.includes('admin') && <Route exact path="/add-billing" render={() => <EventBilling />} />}
        {user.roles && user.roles.includes('admin') && <Route exact path="/for-coders" render={() => <ForCoders/>} />}
        {user.roles && user.roles.includes('admin') && <Route exact path="/editor" render={() => <Edit />} />}
        {user.roles && (user.roles.includes('admin') || user.roles.includes('leader')) && <Route exact path="/:teamId" render={() => <Team />}/>}
        {user.roles && user.roles.includes('admin') && <Route exact path="/editor-team" render={() => <EditorTeam />} />}
        <Route exact path="/login" render={() => <Login />} />
      </Switch>
      {user.roles && !user.roles.includes('admin') && team && <Redirect exact to={`/${team}`}/>}
      {redirectToLogin && !roles && <Redirect exact to="/login"/>}
    </BrowserRouter>;

  return (
    <>
      <MuiPickersUtilsProvider utils={DateFnsUtils}>
        <div className="app">
          {loadingStatus 
            ? <div className="loader"><CircularProgress/></div>
            : (<div>
              <Suspense fallback={<div className="loader"><CircularProgress/></div>}>{routes}</Suspense>
            </div>)}
        </div>
      </MuiPickersUtilsProvider>
    </>
  );

};

export default App;
