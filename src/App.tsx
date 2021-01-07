import './App.css';

import DateFnsUtils from '@date-io/date-fns';
import CircularProgress from '@material-ui/core/CircularProgress';

import {
  MuiPickersUtilsProvider,
} from '@material-ui/pickers';

import React, { Suspense, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { BrowserRouter, Route, Switch } from 'react-router-dom';

import { 
  getTeamsWithAccountState, 
  getCodes, 
  getRegistry, 
  getImportDates 
} from './pages/DashBoard/api-handlers/account.handler';

import * as actions from './store/actions/index';
import store from './store/store';


const App = (): JSX.Element => {
//TODO temporary "any" fix
  const loadingStatus = useSelector((state: any) => state.ui.loading);

  useEffect(() => {
    // store.dispatch(actions.loadingStart);
    const downloadData = async () => {
      await getTeamsWithAccountState();
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
  const EditorTeam = React.lazy(() => import('./pages/EditorTeam/EditorTeam'));

  const routes = <BrowserRouter>

    <Switch>
      <Route exact path="/" render={() => <DashBoard />} />
      <Route exact path="/transfers" render={() => <ImportIncome />} />
      <Route exact path="/transfers/imported" render={() => <UnAssignedIncome />} />
      <Route exact path="/transfers/sorted" render={() => <SortedIncome />} />
      {/* <Route exact path="/transfers/sorted/:teamId" render={() => <SortedIncome />} /> */}
      <Route exact path="/codes" render={() => <Codes />} />
      <Route exact path="/add-code" render={() => <AddCode/>} />
      {/* <Route exact path="/:teamId" render={() => <Team />} /> */}
      <Route exact path="/add-approval" render={() => <EventApproval />} />
      <Route exact path="/add-billing" render={() => <EventBilling />} />
      <Route exact path="/for-coders" render={() => <ForCoders/>} />
      <Route exact path="/editor" render={() => <Edit />} />
      <Route exact path={`/info/:teamId`} render={() => <Team />}/>
      <Route exact path="/editor-team" render={() => <EditorTeam />} />
    </Switch>
  </BrowserRouter>;

  return (
    <MuiPickersUtilsProvider utils={DateFnsUtils}>
      <div className="app">
        {loadingStatus 
          ? <div className="loader"><CircularProgress/></div>
          : (<div>
            <Suspense fallback={<div className="loader"><CircularProgress/></div>}>{routes}</Suspense>
          </div>)}
      </div>
    </MuiPickersUtilsProvider>
  );

};

export default App;
