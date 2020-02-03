import React, { Component } from "react";
import { Route } from "react-router-dom";
import { connect } from "react-redux";

import * as actions from "../../store/actions/index";

import Navigation from "../Navigation/Navigation";

import Team from "../Team/Team";

import classes from "./SortedIncome.module.css";

class SortedIncome extends Component {
  state = {
    income: null
  };

  componentDidMount = () => {
    this.setState({ income: this.props.init });
  };

  verifyTeams = () => {
    this.props.onSortIncome(this.props.teams, this.props.init);
  };

  editIncome = (event, index) => {
    const incomeToEdit = [...this.props.init];
    incomeToEdit[index].title = event.target.value;
    this.setState({ income: incomeToEdit });
  };

  updateIncome = () => {
    this.props.onEditIncome(this.state.income);
  };

  render() {
    let sortedIncome;
    if (this.props.teams) {
      sortedIncome = this.props.teams.map(team => {
        return { link: `/transfers/sorted/${team.id}`, title: `${team.id}` };
      });
    }
    return (
      <section className="Section">
        <h2>Przelewy posortowane według kodów:</h2>
        <div className="GridArea">
          <nav className={classes.Nav}>
            <Navigation list={sortedIncome} navigation="main" />
          </nav>
          <main>
            {sortedIncome.map((team, index) => {
              return (
                <Route
                  key={index}
                  path={`/transfers/sorted/${team.title}`}
                  component={props => <Team teamNum={team.title} />}
                />
              );
            })}
          </main>
        </div>
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
      dispatch(actions.sortingIncome(actualTeams, actualIncome)),
    onEditIncome: income => dispatch(actions.editingIncome(income))
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(SortedIncome);
