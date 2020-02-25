import React, { Component } from "react";
import { Route } from "react-router-dom";
import { connect } from "react-redux";
import axios from "../../axios-income";

import * as actions from "../../store/actions/index";

import Navigation from "../Navigation/Navigation";
import Team from "../Team/Team";
import StatusInfo from "../UI/StatusInfo/StatusInfo";

import classes from "./SortedIncome.module.css";

class SortedIncome extends Component {
  state = {
    income: null,
    codes: null,
    sortedIncome: null,
    sendingTeam: null
  };
  componentDidMount = async () => {
    try {
      const response = await axios.get("/codes.json");
      // const response2 = await axios.get("/teams.json");
      if (!this.state.codes) {
        await this.setState({ codes: response.data, income: this.props.teams });
      }
    } catch (err) {
      console.log(err);
    }
  };

  sortedIncomeByAccount = (account, array, patterns) => {
    const patternsToSortIncome = [...patterns].map(
      pattern => new RegExp(`(${pattern})`, "m")
    );
    patternsToSortIncome.splice(patternsToSortIncome.length - 1, 1);
    let assignedIncomeToAccount;
    if (account !== "nonAssigned") {
      const pattern = new RegExp(`(${account})`, "m");
      assignedIncomeToAccount = array.filter(income =>
        pattern.test(income.title)
      );
    } else {
      assignedIncomeToAccount = array.filter(income =>
        patternsToSortIncome.every(item => !item.test(income.title))
      );
    }
    const obj = {
      code: account,
      incomeByCode: assignedIncomeToAccount
    };
    return obj;
  };

  assignIncome = () => {
    const incomeToSort = [...this.props.teams];
    const sortedIncome = incomeToSort.map(team => {
      const codesPatern = [
        ...this.state.codes.general,
        ...(this.state.codes[team.id] ? this.state.codes[team.id] : [])
      ];
      return {
        id: team.id,
        accounts: [
          ...codesPatern.map((code, index, array) =>
            this.sortedIncomeByAccount(code, team.income, array)
          )
        ]
      };
    });
    this.props.onAssignIncome(sortedIncome);
  };

  sendingDataHandler = async id => {
    if (id !== "pozostałe") {
      this.setState({ sendingTeam: id });
      const response = await axios.get(`/teams/${id}.json`);
      const accounts = await response.data;
      const patterns = await response.data.members;
      const incomes = await [
        ...this.props.incomes.find(item => item.id === Number(id)).accounts
      ];
      const nonAssigned = await [
        ...incomes.find(item => item.code === "nonAssigned").incomeByCode
      ];
      accounts["nonAssigned"] = [...nonAssigned];
      for (let i of incomes) {
        if (!accounts.hasOwnProperty(i.code)) {
          accounts[i.code] = [];
          i.incomeByCode.forEach((income, index, array) => {
            for (let pattern of patterns) {
              const namePattern = new RegExp(`(${pattern.name})`, "i");
              const surnamePattern = new RegExp(`(${pattern.surname})`, "i");
              const matchInfo =
                income.title.match(namePattern) &&
                income.title.match(surnamePattern);
              const someVerify = accounts[i.code].some(
                (insertedTitle, index) =>
                  namePattern.test(insertedTitle.name) &&
                  surnamePattern.test(insertedTitle.surname)
              );
              if (matchInfo) {
                accounts[i.code].push({
                  name: pattern.name,
                  surname: pattern.surname,
                  value: Number(income.cash)
                });
              }
              // else if (matchInfo && someVerify) {
              //   console.log("Działa");
              //   const index = accounts[i.code].findIndex(
              //     insertedTitle =>
              //       namePattern.test(insertedTitle.name) &&
              //       surnamePattern.test(insertedTitle.surname)
              //   );
              //   console.log(index);
              //   accounts[i.code][index].value += Number(income.cash);
              // }
              else if (matchInfo && !someVerify) {
                accounts["nonAssigned"].push(income);
              }
            }
          });
        } else if (accounts.hasOwnProperty(i.code)) {
          accounts[i.code].forEach(person => {
            const namePattern = new RegExp(`(${person.name})`, "i");
            const surnamePattern = new RegExp(`(${person.surname})`, "i");
            i.incomeByCode.forEach((income, index) => {
              const matchInfo =
                income.title.match(namePattern) &&
                income.title.match(surnamePattern);
              if (matchInfo) {
                person.value += Number(income.cash);
              } else {
                accounts["nonAssigned"].push(income);
                // i.incomeByCode.splice(index, 1);
              }
            });
          });
        }
      }
      const responseInfo = await axios.put(`/teams/${id}.json`);
      this.setState({ sendingTeam: null });
      // console.log(accounts);
      // console.log(patterns);
      // console.log(incomes);
      // console.log(nonAssigned);}
    }
  };

  getInfo = () => {
    console.log(this.props.incomes);
    const value = document.querySelector("#input").value;
    this.sendingDataHandler(value);
  };

  render() {
    let sortedIncome;
    if (this.props.teams) {
      sortedIncome = this.props.teams.map(team => {
        return { link: `/transfers/sorted/${team.id}`, title: `${team.id}` };
      });
    }
    let statusInfo;
    if (this.state.sendingTeam) {
      statusInfo = (
        <StatusInfo info={`Wysyłam dane dla ${this.state.sendingTeam}`} />
      );
    }
    return (
      <section className="Section">
        {statusInfo}
        <button onClick={this.getInfo}>Udziel info w konsoli o propsach</button>
        <button onClick={this.assignIncome}>
          Sortuj przelewy kodami do drużyn
        </button>
        <button
          onClick={this.props.incomes.forEach(team =>
            this.sendingDataHandler(team.id)
          )}
        >
          Wyślij dane na serwer
        </button>

        <input type="text" placeholder="Podaj ID drużyny" id="input" />

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
    teams: state.income.teams,
    incomes: state.income.assignedIncome
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
