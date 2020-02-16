import React, { Component } from "react";
import { Route } from "react-router-dom";
import { connect } from "react-redux";
import axios from "../../axios-income";

import * as actions from "../../store/actions/index";

import Navigation from "../Navigation/Navigation";
import Team from "../Team/Team";

import classes from "./SortedIncome.module.css";

class SortedIncome extends Component {
  state = {
    income: null,
    codes: null,
    sortedIncome: null
  };
  componentDidMount = async () => {
    try {
      const response = await axios.get("/codes.json");
      const response2 = await axios.get("/teams.json");
      await this.setState({ codes: response.data, income: this.props.teams });
      console.log(response2.data[12427].SC);
    } catch (err) {
      console.log(err);
    }
  };

  sortedIncomeByAccount = (account, array) => {
    const pattern = new RegExp(`(${account})`, "m");
    const assignedIncomeToAccount = array.filter(income =>
      pattern.test(income.title)
    );
    const obj = {
      code: account,
      incomeByCode: assignedIncomeToAccount
    };
    return obj;
  };

  assignIncome = () => {
    const incomeToSort = [...this.props.teams];
    const codes = this.state.codes;
    const sortedIncome = incomeToSort.map(team => ({
      id: team.id,
      accounts: [
        ...codes.general.map(code =>
          this.sortedIncomeByAccount(code, team.income)
        ),
        ...(codes[team.id]
          ? codes[team.id].map(code =>
              this.sortedIncomeByAccount(code, team.income)
            )
          : [])
      ]
    }));
    this.props.onAssignIncome(sortedIncome);
  };

  render() {
    let sortedIncome;
    if (this.props.teams) {
      sortedIncome = this.props.teams.map(team => {
        return { link: `/transfers/sorted/${team.id}`, title: `${team.id}` };
      });
    }
    if (this.state.codes) {
      this.assignIncome();
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
    onEditIncome: income => dispatch(actions.editingIncome(income)),
    onAssignIncome: income => dispatch(actions.assignIncome(income))
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(SortedIncome);
