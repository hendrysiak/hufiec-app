import React, { Component } from "react";
import { Route, Switch } from "react-router-dom";

import { connect } from "react-redux";

import classes from "./Dashboard.module.css";
import NonAssignedIncome from "../NonAssignedIncome/NonAssignedIncome";
import ImportIncome from "../../components/ImportIncome/ImportIncome";
import Navigation from "../../components/Navigation/Navigation";
import SortedIncome from "../../components/SortedIncome/SortedIncome";

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
        </aside>
        <Switch>
          <Route path="/sorted" component={SortedIncome} />
          <Route path="/imported" component={NonAssignedIncome} />
          <Route path="/" component={ImportIncome} />
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
