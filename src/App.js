import React, { Suspense, useEffect, useRef, useState } from "react";
import "./App.css";
import { BrowserRouter, Route, Switch } from "react-router-dom";
// import { Route } from "react-router-dom";

import { useSelector } from "react-redux";

import Container from '@material-ui/core/Container';
import Grid from '@material-ui/core/Grid';

import * as actions from './store/actions/index';
import store from './store/store';

import CircularProgress from '@material-ui/core/CircularProgress';

import { 
  getTeamsWithAccountState, 
  getCodes, 
  getRegistry, 
  getImportDates 
} from '../src/containers/DashBoard/api-handlers/account.handler';

import DateFnsUtils from '@date-io/date-fns';

import {
  MuiPickersUtilsProvider,
} from '@material-ui/pickers';

const App = () => {
//TODO registry, dbincomes and outcomes dependency
  const loadingStatus = useSelector(state => state.ui.loading);

  useEffect(() => {
    // store.dispatch(actions.loadingStart);
    const downloadData = async () => {
      await getTeamsWithAccountState();
      await getCodes();
      await getRegistry();
      await getImportDates();
    }
    downloadData();
    store.dispatch(actions.loadingEnd());
  },[]);

  const DashBoard = React.lazy(() => import( "./containers/DashBoard/Dashboard"));
  const Codes = React.lazy(() => import( "./containers/Codes/Codes"));
  const AddCode = React.lazy(() => import( "./containers/AddCode/AddCode"));
  const Teams = React.lazy(() => import( "./containers/Teams/Teams"));
  const ForCoders = React.lazy(() => import( './containers/ForCoders/ForCoders'));
  const EventBilling = React.lazy(() => import( './containers/EventBilling/EventBilling'));
  const EventApproval = React.lazy(() => import( './containers/EventApproval/EventApproval'));
  const SortedIncome = React.lazy(() => import( "./containers/SortedIncome/SortedIncome"));
  const UnAssignedIncome = React.lazy(() => import( "./containers/UnAssignedIncome/UnAssignedIncome"));
  const ImportIncome = React.lazy(() => import( "./containers/ImportIncome/ImportIncome"));
  const Edit = React.lazy(() => import( "./containers/Edit/Edit"));

  const routes = (
    <BrowserRouter>
        <Container maxWidth="xl" style={{height: '100%'}}>
          <Grid container spacing={3} alignItems="stretch" alignContent="stretch">
          <Grid item xs={12} md={8} lg={12}> 
        <div>
          <Switch>
            <Route exact path="/" render={() => <DashBoard />} />
            <Route exact path="/transfers" render={() => <ImportIncome />} />
            <Route exact path="/transfers/imported" render={() => <UnAssignedIncome />} />
            <Route exact path="/transfers/sorted" render={() => <SortedIncome />} />
            {/* <Route exact path="/transfers/sorted/:teamId" render={() => <SortedIncome />} /> */}
            <Route exact path="/codes" render={() => <Codes />} />
            <Route exact path="/add-code" render={() => <AddCode/>} />
            <Route exact path="/teams" render={() => <Teams />} />
            {/* <Route exact path="/:teamId" render={() => <Team />} /> */}
            <Route exact path="/add-approval" render={() => <EventApproval />} />
            <Route exact path="/add-billing" render={() => <EventBilling />} />
            <Route exact path="/for-coders" render={() => <ForCoders/>} />
            <Route exact path="/editor" render={() => <Edit />} />
            {/* <Route exact path={`/transfers/sorted/:teamId`} render={(rp) => <Team teamNum={rp.match.params.title} />}/> */}
          </Switch>
      </div>
      </Grid>
      </Grid>
      </Container>
    </BrowserRouter>
  );

  return (
    <MuiPickersUtilsProvider utils={DateFnsUtils}>
    <div className="App">
          {loadingStatus 
          ? <div className="loader"><CircularProgress/></div>
          : (<div>
              <Suspense fallback={<div className="loader"><CircularProgress/></div>}>{routes}</Suspense>
            </div>)}
    </div>
    </MuiPickersUtilsProvider>
    );

}

export default App;
