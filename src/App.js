import React, { useEffect } from "react";
import "./App.css";
import { BrowserRouter, Route, Switch } from "react-router-dom";
// import { Route } from "react-router-dom";

import { useSelector } from "react-redux";

import Navigation from "./components/Navigation/Navigation";
import Codes from "./components/Codes/Codes";
import AddCode from "./components/AddCode/AddCode";
import Teams from "./components/Teams/Teams";
import ForCoders from './components/ForCoders/ForCoders';
import EventBilling from './containers/EventBilling/containers/EventBilling';

import SortedIncome from "./containers/Transfers/components/SortedIncome/SortedIncome";
import UnAssignedIncome from "./containers/Transfers/components/UnAssignedIncome/UnAssignedIncome";
import ImportIncome from "./containers/Transfers/components/ImportIncome/ImportIncome";

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
            <Route exact path="/transfers/imported" render={() => <UnAssignedIncome />} />
            <Route exact path="/transfers/sorted" render={() => <SortedIncome />} />
            {/* <Route exact path="/transfers/sorted/:teamId" render={() => <SortedIncome />} /> */}
            <Route exact path="/codes" render={() => <Codes />} />
            <Route exact path="/add-code" render={() => <AddCode/>} />
            <Route exact path="/teams" render={() => <Teams />} />
            <Route exact path="/add-billing" render={() => <EventBilling />} />
            <Route exact path="/for-coders" render={() => <ForCoders/>} />
            {/* <Route exact path={`/transfers/sorted/:teamId`} render={(rp) => <Team teamNum={rp.match.params.title} />}/> */}
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
