import './App.css';
import DateFnsUtils from '@date-io/date-fns';
import CircularProgress from '@material-ui/core/CircularProgress';
import {
  MuiPickersUtilsProvider,
} from '@material-ui/pickers';

import React, { Suspense, useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useHistory } from 'react-router';
import { BrowserRouter, 
  Redirect, 
  Route, 
  Switch } from 'react-router-dom';

import Cookies from 'universal-cookie';

import { Decrypt, DecryptCookie, EncryptCookie, getAccount } from 'helpers/password.helper';
// import Login from 'pages/Login/Login';
import { reduxSetRoles } from 'store/actions/user';

import { 
  getAccountState, 
  getCodes, 
  getRegistry, 
  getImportDates 
} from './pages/DashBoard/api-handlers/account.handler';

import * as actions from './store/actions/index';
import store from './store/store';


const App = (): JSX.Element => {
//TODO temporary "any" fix
  const loadingStatus = useSelector((state: any) => state.ui.loading);
  const isAuth = useSelector((state: any) => state.user);
  const dispatch = useDispatch();
  const cookies = new Cookies();
  const [roles, setRoles] = useState<string[] | null>(null);
  const [redirectToLogin, setRedirectToLogin] = useState<boolean>(false);
  console.log(isAuth);
  const history = useHistory();

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
      if (Decrypt(password) === Decrypt(accountData.password)) {
        dispatch(reduxSetRoles(accountData.roles));
        setRoles(accountData.roles);
        setRedirectToLogin(true);
        return;
      }
      return 0;
    };
    dataLogin && checkLogin(Decrypt(dataLogin.login), dataLogin.password);
    !dataLogin && setRedirectToLogin(true);

  },[]);


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
  const routes = 
    <BrowserRouter>
      <Switch>
        <Route exact path="/" render={() => <DashBoard />} />
        {isAuth.roles && isAuth.roles.includes('admin') && <Route exact path="/addpercent" render={() => <AddPercent />}/>}
        {isAuth.roles && isAuth.roles.includes('admin') && <Route exact path="/transfers" render={() => <ImportIncome />} />}
        {isAuth.roles && isAuth.roles.includes('admin') && <Route exact path="/transfers/imported" render={() => <UnAssignedIncome />} />}
        {isAuth.roles && isAuth.roles.includes('admin') && <Route exact path="/transfers/sorted" render={() => <SortedIncome />} />}
        {/* <Route exact path="/transfers/sorted/:teamId" render={() => <SortedIncome />} /> */}
        {isAuth.roles && isAuth.roles.includes('admin') && <Route exact path="/codes" render={() => <Codes />} />}
        {isAuth.roles && isAuth.roles.includes('admin') && <Route exact path="/add-code" render={() => <AddCode/>} />}
        {isAuth.roles && isAuth.roles.includes('admin') && <Route exact path="/add-approval" render={() => <EventApproval />} />}
        {isAuth.roles && isAuth.roles.includes('admin') && <Route exact path="/add-billing" render={() => <EventBilling />} />}
        {isAuth.roles && isAuth.roles.includes('admin') && <Route exact path="/for-coders" render={() => <ForCoders/>} />}
        {isAuth.roles && isAuth.roles.includes('admin') && <Route exact path="/editor" render={() => <Edit />} />}
        {isAuth.roles && isAuth.roles.includes('admin') && <Route exact path="/info/:teamId" render={() => <Team />}/>}
        {isAuth.roles && isAuth.roles.includes('admin') && <Route exact path="/editor-team" render={() => <EditorTeam />} />}
        <Route exact path="/login" render={() => <Login />} />
      </Switch>
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
