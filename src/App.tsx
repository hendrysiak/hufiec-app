import './App.css';
import DateFnsUtils from '@date-io/date-fns';
import CircularProgress from '@material-ui/core/CircularProgress';

import {
  MuiPickersUtilsProvider,
} from '@material-ui/pickers';

import React, { Suspense, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { BrowserRouter, Redirect, Route, Switch } from 'react-router-dom';
import { useHistory } from 'react-router';
import { reduxIsAuthenticated } from 'store/actions/authorization';

import { 
  getAccountState, 
  getCodes, 
  getRegistry, 
  getImportDates 
} from './pages/DashBoard/api-handlers/account.handler';

import { Authorization } from './store/actions/action.types';
import * as actions from './store/actions/index';
import store from './store/store';


const App = (): JSX.Element => {
//TODO temporary "any" fix
  const loadingStatus = useSelector((state: any) => state.ui.loading);
  const isAuth = useSelector((state: any) => state.authorization);
  const dispatch = useDispatch();
  const history = useHistory();

  useEffect(() => {
    // store.dispatch(actions.loadingStart);
    const downloadData = async () => {
      await getAccountState();
      await getCodes();
      await getRegistry();
      await getImportDates();
    };
    downloadData();
    store.dispatch(actions.reduxLoadingEnd());
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
  const Login = React.lazy(() => import('./pages/Login/Login'));
  // const EditTeam = React.lazy(() => import( './pages/EditTeam/EditTeam'));
  const routes = isAuth.isAuthorization ? 
    <BrowserRouter>
      <Switch>
        Route exact path="/" render={() => <DashBoard/>} /> {moderator}
        <Route exact path="/transfers" render={() => <ImportIncome />} />
        <Route exact path="/transfers/imported" render={() => <UnAssignedIncome />} />
        <Route exact path="/transfers/sorted" render={() => <SortedIncome />} />
        {/* <Route exact path="/transfers/sorted/:teamId" render={() => <SortedIncome />} /> */}
        <Route exact path="/codes" render={() => <Codes />} />
        <Route exact path="/add-code" render={() => <AddCode/>} />
        {/* <Route exact path="/:teamId" render={() => <Team />} /> */}
        <Route exact path="/add-approval" render={() => <EventApproval />} />
        <Route exact path="/add-billing" render={() => <EventBilling />} /> {moderator}
        <Route exact path="/for-coders" render={() => <ForCoders/>} /> {admin}
        <Route exact path="/editor" render={() => <Edit />} /> {admin}
        <Route exact path={`/info/:teamId`} render={() => <Team />}/> {lider}
        {/* <Route exact path={`/edit-team`} render={() => <EditTeam />}/> */}
      </Switch>
    </BrowserRouter> : 
    <BrowserRouter>
      <Switch>
        <Route exact path="/login" render={() => <Login />} />
      </Switch>
      <Redirect to="/login"/>
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
