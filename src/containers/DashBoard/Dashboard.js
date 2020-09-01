import React, { Component, useEffect, useState } from "react";
import { Route, Switch } from "react-router-dom";

import { connect, useSelector } from "react-redux";

import classes from "./Dashboard.module.css";

import Navigation from "../../components/Navigation/Navigation";
import Transfers from "../Transfers/containers/Transfers";
import Codes from "../../components/Codes/Codes";
import AddCode from "../../components/AddCode/AddCode";
import Teams from "../../components/Teams/Teams";
import ForCoders from '../../components/ForCoders/ForCoders';

import * as actions from "../../store/actions/index";

import { getTeamsWithAccountState } from './api-handlers/account.handler'

const Dashboard = () => {

const  navigation = [
      { link: "/transfers", title: "PRZELEWY - OBSŁUGA" },
      { link: "/codes", title: "FILTRUJ PO KODZIE" },
      { link: "/teams", title: "FILTRUJ PO DRUŻYNIE" },
      { link: "/add-code", title: "DODAJ KOD" },
      { link: "/add-summary", title: "DODAJ ROZLICZENIE" },
      { link: "/show-base", title: "POKAŻ BAZĘ" }
    ]
  
    useEffect(() => {
      getTeamsWithAccountState();
    },[])

 
    return (
      <div className={classes.GridArea}>
        <nav className={classes.Nav}>
          <Navigation list={navigation} navigation="main" />
        </nav>
        <div>
          <Switch>
            <Route path="/transfers" component={Transfers} />
            <Route path="/codes" component={Codes} />
            <Route path="/add-code" component={AddCode} />
            <Route path="/teams" component={Teams} />
            <Route path="/for-coders" component={ForCoders} />
          </Switch>
          <div className={classes.Background}></div>
        </div>
        <footer className={classes.Footer}>
          <h3>
            Projekt i wykonanie: <strong>Łukasz Hendrysiak</strong>
          </h3>
        </footer>
      </div>
    );
  
};

const mapStateToProps = state => {
  return {
    init: state.income.initIncome,
    teams: state.income.teams
  };
};

const mapDispatchToProps = dispatch => {
  return {
    onFetchIncome: url => dispatch(actions.fetchIncome(url)),
    onSortIncome: (actualTeams, actualIncome) =>
      dispatch(actions.sortingIncome(actualTeams, actualIncome))
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(Dashboard);
