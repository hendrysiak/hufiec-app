import React, { useEffect } from "react";
import "./App.css";
import { BrowserRouter, Route, Switch } from "react-router-dom";
// import { Route } from "react-router-dom";

import { useSelector } from "react-redux";

import Dashboard from "./containers/DashBoard/Dashboard";
import Navigation from "./components/Navigation/Navigation";
import Transfers from "./containers/Transfers/containers/Transfers";
import Codes from "./components/Codes/Codes";
import AddCode from "./components/AddCode/AddCode";
import Teams from "./components/Teams/Teams";
import ForCoders from './components/ForCoders/ForCoders';
import EventBilling from './containers/EventBilling/containers/EventBilling';
import Event from './containers/EventBilling/components/Event/Event';
import Code from "./components/Codes/Code/Code";

import SortedIncome from "./containers/Transfers/components/SortedIncome/SortedIncome";
import NonAssignedIncome from "./containers/Transfers/components/NonAssignedIncome/NonAssignedIncome";
import ImportIncome from "./containers/Transfers/components/ImportIncome/ImportIncome";
import Team from './components/Team/Team';

import * as actions from './store/actions/index';
import store from './store/store';

import CircularProgress from '@material-ui/core/CircularProgress';

import { getTeamsWithAccountState, getCodes, getRegistry } from '../src/containers/DashBoard/api-handlers/account.handler';

const App = () => {
  const accounts = useSelector(state => state.income.accountList);
  const codes = useSelector(state => state.income.codes);
  const dbIncomes = useSelector(state => state.income.dbIncomes)
  const teams = useSelector(state => state.income.teams)
//TODO registry, dbincomes and outcomes dependency
  const loadingStatus = useSelector(state => state.ui.loading);

  useEffect(() => {
    // store.dispatch(actions.loadingStart);
    const downloadData = async () => {
      await getTeamsWithAccountState();
      await getCodes();
      await getRegistry()
    }
    downloadData();
    store.dispatch(actions.loadingEnd());
  },[]);

  const  navigation = [
    { link: "/transfers", title: "PRZELEWY - OBSŁUGA" },
    { link: "/codes", title: "FILTRUJ PO KODZIE" },
    { link: "/teams", title: "FILTRUJ PO DRUŻYNIE" },
    { link: "/add-code", title: "DODAJ KOD" },
    { link: "/add-billing", title: "DODAJ ROZLICZENIE" },
    { link: "/show-base", title: "POKAŻ BAZĘ" }
  ]

  let codesMenuForCodes = [];
  let codesMenuForEvent = [];
  let teamMenuForSortedIncome = [];
  let routingForCodes;
  let routingForEvents;
  let routingForSortedTeam;
  
  
if (codes) {
  codesMenuForEvent = codes.map(code => {
    return { link: `/add-billing/${code}`, title: `${code}` };
  });
  routingForEvents = codes.map((item, index) => {
    return (
      <Route
        key={index}
        path={`/add-billing/${item}`}
        render={() => <Event code={item} codesMenu={codesMenuForEvent} />}
      />
    );
  });
}

if (codes) {
  codesMenuForCodes = codes.map(code => {
    return { link: `/codes/${code}`, title: `${code}` };
  });
  routingForCodes = codes.map((item, index) => {
    return (
      <Route
        key={index}
        path={`/codes/${item}`}
        render={() => <Code code={item} codesMenu={codesMenuForCodes} />}
      />
    );
  });
}

if (dbIncomes) {
  if (teams) {
    teamMenuForSortedIncome = teams.map(team => {
      return { link: `/transfers/sorted/${team.id}`, title: `${team.id}` };
    });

    routingForSortedTeam = teams.map((team, index) => {
      return (
      <Route
        key={index}
        path={`/transfers/sorted/${team.id}`}
        render={() => <Team teamNum={team.id} teamMenuForSortedIncome={teamMenuForSortedIncome}/>}
      />);
    });
  }
}


  return (
      <div className="App">
          {loadingStatus 
          ? <div className="loader"><CircularProgress/></div>
          : <div className="GridArea">
       <BrowserRouter>
          <nav className="Nav">
            <Navigation list={navigation} navigation="main" />
          </nav>
        <div>
         
          <Switch>
            <Route exact path="/transfers" render={() => <ImportIncome />} />
            <Route exact path="/transfers/imported" render={() => <NonAssignedIncome />} />
            <Route exact path="/transfers/sorted" render={() => <SortedIncome routingForSortedTeam={routingForSortedTeam} />} />
            {/* <Route exact path="/transfers/sorted/:teamId" render={() => <SortedIncome />} /> */}
            <Route exact path="/codes" render={() => <Codes codesMenu={codesMenuForCodes} routing={routingForCodes} />} />
            <Route exact path="/add-code" render={() => <AddCode/>} />
            <Route exact path="/teams" render={() => <Teams />} />
            <Route exact path="/add-billing" render={() => <EventBilling codesMenu={codesMenuForEvent} routing={routingForEvents}/>} />
            <Route exact path="/for-coders" render={() => <ForCoders/>} />
            {/* <Route exact path={`/transfers/sorted/:teamId`} render={(rp) => <Team teamNum={rp.match.params.title} />}/> */}
            {routingForCodes}
            {routingForEvents}
            {routingForSortedTeam}
          </Switch>
          
      </div>
    </BrowserRouter>
          <div className="Background"></div>
      <footer className="Footer">
        <h3>
          Projekt i wykonanie: <strong>Łukasz Hendrysiak</strong>
        </h3>
      </footer>
    </div>}
    </div>

    );

}

export default App;
