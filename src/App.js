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

import { getTeamsWithAccountState, getCodes } from '../src/containers/DashBoard/api-handlers/account.handler'

const App = () => {
  const accounts = useSelector(state => state.income.accountList);
  const codes = useSelector(state => state.income.codes);

  useEffect(() => {
    const downloadData = async () => {
      await getTeamsWithAccountState();
      await getCodes();
    }
    downloadData();
  },[])

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
  let routingForCodes;
  let routingForEvents;
  
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


  return (
      <div className="App">
          <div className="GridArea">
       <BrowserRouter>
          <nav className="Nav">
            <Navigation list={navigation} navigation="main" />
          </nav>
        <div>
        
          <Switch>
            <Route path="/transfers" render={() => <ImportIncome />} />
            <Route path="/transfers/imported" render={() => <NonAssignedIncome />} />
            <Route path="/transfers/sorted" render={() => <SortedIncome />} />
            <Route exact path="/codes" render={() => <Codes codesMenu={codesMenuForCodes} routing={routingForCodes} />} />
            <Route exact path="/add-code" render={() => <AddCode/>} />
            <Route exact path="/teams" render={() => <Teams />} />
            <Route exact path="/add-billing" render={() => <EventBilling codesMenu={codesMenuForEvent} routing={routingForEvents}/>} />
            <Route exact path="/for-coders" render={() => <ForCoders/>} />
            {routingForCodes}
            {routingForEvents}
          </Switch>
          
      </div>
    </BrowserRouter>
          <div className="Background"></div>
      <footer className="Footer">
        <h3>
          Projekt i wykonanie: <strong>Łukasz Hendrysiak</strong>
        </h3>
      </footer>
    </div>
    </div>

    );

}

export default App;
