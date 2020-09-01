import React, { Component } from "react";
import { Route, Redirect } from "react-router-dom";
import { connect } from "react-redux";

import SortedIncome from "../components/SortedIncome/SortedIncome";
import NonAssignedIncome from "../components/NonAssignedIncome/NonAssignedIncome";
import ImportIncome from "../components/ImportIncome/ImportIncome";
import Navigation from "../../../components/Navigation/Navigation";

import * as actions from "../../../store/actions/index";

import classes from "./Transfers.module.css";

class Transfers extends Component {
  state = {
    navigation: [
      { link: "/transfers/import", title: "IMPORTUJ PRZELEWY" },
      { link: "/transfers/imported", title: "PRZELEWY POBRANE" },
      { link: "/transfers/sorted", title: "PRZELEWY POSORTOWANE" }
    ]
  };

  render() {
    return (
      <section className="Section">
        <header className={classes.Header}>
          <Navigation list={this.state.navigation} />
        </header>
        <main>
          <Route path="/transfers" ><Redirect to="/transfers/import"/></Route>
          <Route path="/transfers/import" component={ImportIncome} />
          <Route path="/transfers/imported" component={NonAssignedIncome} />
          <Route path="/transfers/sorted" component={SortedIncome} />
        </main>
      </section>
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

export default connect(mapStateToProps, mapDispatchToProps)(Transfers);
