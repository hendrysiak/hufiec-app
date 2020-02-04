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
      await this.setState({ codes: response.data, income: this.props.teams });
    } catch (err) {
      console.log(err);
    }
  };

  // assignToAccount = () => {
  //   const incomeToSort = [...this.props.teams];

  //   console.log(incomeToSort);
  //   this.assignIncome();
  // };

  sortedIncomeByAccount = (account, array) => {
    // const accountName = `${account}`;
    const pattern = new RegExp(`(${account})`, "m");
    // const codes = [...this.state.codes.general].map(item => new RegExp(`(${item})`, "m"));
    const assignedIncomeToAccount = array.filter(income =>
      pattern.test(income.title)
    );
    // const codes = [...this.state.codes.general];
    // codes.forEach(code => array.push({ code, incomes: [] }));
    const obj = {};
    obj[account] = assignedIncomeToAccount;
    return obj;
  };

  assignIncome = () => {
    const incomeToSort = [...this.props.teams];
    const codes = [...this.state.codes.general];

    const sortedIncome = incomeToSort.map(team => ({
      id: team.id,
      accounts: codes.map(code => this.sortedIncomeByAccount(code, team.income))
      // team.income.map(income => {
      //   codes.forEach(code => this.sortedIncomeByAccount(code, income));
      // })
    }));
    console.log(sortedIncome);
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
