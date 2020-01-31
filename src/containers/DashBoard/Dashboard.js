import React, { Component } from "react";
import { Route, Switch } from "react-router-dom";

import { connect } from "react-redux";

import classes from "./Dashboard.module.css";
import StandardView from "../StandardView/StandardView";
import ImportIncome from "../ImportIncome/ImportIncome";
import Navigation from "../../components/Navigation/Navigation";

import * as actions from "../../store/actions/index";

class Dashboard extends Component {
  render() {
    return (
      <div className={classes.GridArea}>
        <header className={classes.Header}>
          <h1>Witamy w programie HRSL 0.1!</h1>
        </header>
        <aside className={classes.Aside}>
          <Navigation />
          {/* <ul className={classes.List}>
            <li className={classes.ListElement}>IMPORT PRZELEWÓW</li>
            <li className={classes.ListElement}>PRZELEWY ZAIMPORTOWANE</li>
            <li className={classes.ListElement}>PRZELEWY NIEPRZYPISANE</li>
            <li className={classes.ListElement}>FILTRUJ PO KODZIE</li>
            <li className={classes.ListElement}>FILTRUJ PO DRUŻYNE</li>
            <li className={classes.ListElement}>DODAJ KOD</li>
            <li className={classes.ListElement}>DODAJ ROZLICZENIE</li>
            <li className={classes.ListElement}>POKAŻ BAZĘ</li>
          </ul> */}
        </aside>
        {/* <StandardView class={classes.Main} /> */}
        <Switch>
          <Route path="/imported" component={StandardView} pro />
          <Route path="/" component={ImportIncome} />
        </Switch>
        <footer className={classes.Footer}></footer>
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
