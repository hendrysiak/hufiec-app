import React, { Suspense, useEffect } from "react";
import "./App.css";
import { BrowserRouter, Route, Switch } from "react-router-dom";
// import { Route } from "react-router-dom";

import { useSelector } from "react-redux";

import Navigation from "./components/Navigation/Navigation";
import Spinner from "./components/UI/Spinner/Spinner";
import Container from '@material-ui/core/Container';
import Grid from '@material-ui/core/Grid';

import * as actions from './store/actions/index';
import store from './store/store';

import CircularProgress from '@material-ui/core/CircularProgress';

import { getTeamsWithAccountState, getCodes, getRegistry } from '../src/containers/DashBoard/api-handlers/account.handler';

const App = () => {
//TODO registry, dbincomes and outcomes dependency
  const loadingStatus = useSelector(state => state.ui.loading);

  useEffect(() => {
    // store.dispatch(actions.loadingStart);
    const downloadData = async () => {
      await getTeamsWithAccountState();
      await getCodes();
      await getRegistry();
    }
    downloadData();
    store.dispatch(actions.loadingEnd());
  },[]);

  const Codes = React.lazy(() => import( "./components/Codes/Codes"));
  const AddCode = React.lazy(() => import( "./components/AddCode/AddCode"));
  const Teams = React.lazy(() => import( "./components/Teams/Teams"));
  const Team = React.lazy(() => import( "./components/Team/Team"));
  const ForCoders = React.lazy(() => import( './components/ForCoders/ForCoders'));
  const EventBilling = React.lazy(() => import( './containers/EventBilling/EventBilling'));
  const EventApproval = React.lazy(() => import( './containers/EventApproval/EventApproval'));
  const SortedIncome = React.lazy(() => import( "./containers/Transfers/components/SortedIncome/SortedIncome"));
  const UnAssignedIncome = React.lazy(() => import( "./containers/Transfers/components/UnAssignedIncome/UnAssignedIncome"));
  const ImportIncome = React.lazy(() => import( "./containers/Transfers/components/ImportIncome/ImportIncome"));

  const  navigation = [
    { link: "/transfers", title: "PRZELEWY - OBSŁUGA" },
    { link: "/codes", title: "FILTRUJ PO KODZIE" },
    { link: "/teams", title: "FILTRUJ PO DRUŻYNIE" },
    { link: "/add-code", title: "DODAJ KOD" },
    { link: "/add-approval", title: "DODAJ ZATWIERDZENIE" },
    { link: "/add-billing", title: "DODAJ ROZLICZENIE" },
    { link: "/income-editor", title: "EDYTUJ PRZYCHODY" },
    { link: "/outcome-editor", title: "EDYTUJ KOSZTY" },
    { link: "/show-base", title: "POKAŻ BAZĘ" }
  ]

  const routes = (
    <BrowserRouter>
        <Container maxWidth="xl" style={{height: "100vh"}}>
          <Grid container spacing={3} alignItems="stretch" alignContent="stretch" style={{height: "100%"}}>
            <Grid item xs={12} md={8} lg={2} style={{maxHeight: "100vh"}}>
          <nav className="Nav">
            <Navigation list={navigation} navigation="main" alignItems="stretch"  alignContent="stretch"/>
          </nav>
          </Grid>
          <Grid item xs={12} md={8} lg={10} style={{maxHeight: "100vh", overflowY:"scroll"}}> 
        <div>
         
          <Switch>
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
            {/* <Route exact path={`/transfers/sorted/:teamId`} render={(rp) => <Team teamNum={rp.match.params.title} />}/> */}
          </Switch>
          
      </div>
      </Grid>
      </Grid>
      </Container>
    </BrowserRouter>
  );

  return (
    <div className="App">
          {loadingStatus 
          ? <div className="loader"><CircularProgress/></div>
          : (<div>
              <Suspense fallback={<div className="loader"><CircularProgress/></div>}>{routes}</Suspense>
            </div>)}
    </div>
    );

}

export default App;
