import React, { Component } from "react";
import { Route, Redirect, Switch } from "react-router-dom";

import SortedIncome from "../components/SortedIncome/SortedIncome";
import unAssignedIncome from "../components/unAssignedIncome/unAssignedIncome";
import ImportIncome from "../components/ImportIncome/ImportIncome";
import Navigation from "../../../components/Navigation/Navigation";

import classes from "./Transfers.module.css";

const Transfers = () => {
  console.log('Mounted');

    const navigation = [
      { link: "/transfers/import", title: "IMPORTUJ PRZELEWY" },
      { link: "/transfers/imported", title: "PRZELEWY POBRANE" },
      { link: "/transfers/sorted", title: "PRZELEWY POSORTOWANE" }
    ]
  
    return (
      <section className="Section">
        <header className={classes.Header}>
          <Navigation list={navigation} />
        </header>
        <main>
            {/* <Route path="/transfers" ><Redirect to="/transfers/import"/></Route>
            <Route path="/transfers/import" render={() => <ImportIncome />} />
            <Route path="/transfers/imported" render={() => <unAssignedIncome />} />
            <Route path="/transfers/sorted" render={() => <SortedIncome />} /> */}
        </main>
      </section>
    );
  
}


export default Transfers;
