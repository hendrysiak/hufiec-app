import React, { Component } from "react";
import { Route, Switch } from "react-router-dom";

import { connect } from "react-redux";

import classes from "./Dashboard.module.css";

import Navigation from "../../components/Navigation/Navigation";
import Transfers from "../Transfers/Transfers";

import * as actions from "../../store/actions/index";

class Dashboard extends Component {
  state = {
    navigation: [
      { link: "/transfers", title: "PRZELEWY - OBSŁUGA" },
      { link: "/codes", title: "FILTRUJ PO KODZIE" },
      { link: "/teams", title: "FILTRUJ PO DRUŻYNIE" },
      { link: "/add-code", title: "DODAJ KOD" },
      { link: "/add-summary", title: "DODAJ ROZLICZENIE" },
      { link: "/show-base", title: "POKAŻ BAZĘ" }
    ]
  };

  render() {
    return (
      <div className={classes.GridArea}>
        <nav className={classes.Nav}>
          <Navigation list={this.state.navigation} navigation="main" />
        </nav>

        <Switch>
          <Route path="/transfers" component={Transfers} />
        </Switch>

        <footer className={classes.Footer}>
          <h3>
            Projekt i wykonanie: <strong>Łukasz Hendrysiak</strong>
          </h3>
        </footer>
      </div>
    );
  }
}

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
