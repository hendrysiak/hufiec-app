import React, { Component } from "react";
import { Route } from "react-router-dom";
import { connect } from "react-redux";
import axios from "../../axios-income";

import * as actions from "../../store/actions/index";

import Navigation from "../../components/Navigation/Navigation";
import Team from "../../components/Team/Team";
import StatusInfo from "../../components/UI/StatusInfo/StatusInfo";

import classes from "./SortedIncome.module.css";

class SortedIncome extends Component {
  state = {
    income: null,
    codes: null,
    sortedIncome: null,
    sendingTeam: null,
    incomes: []
  };
  componentDidMount = async () => {
    // const incomes = [...this.props.incomes];
    // this.setState({ incomes });
    try {
      const response = await axios.get("/codes.json");
      // const response2 = await axios.get("/teams.json");
      if (!this.state.codes) {
        await this.setState({ codes: response.data, income: this.props.teams });
      }
    } catch (err) {
      console.log(err);
    }
    this.assignIncome();
  };
  // editIncome = (event, index) => {
  //   const incomeToEdit = [...this.props.init];
  //   incomeToEdit[index].title = event.target.value;
  //   this.setState({ income: incomeToEdit });
  // };

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
    this.setState({ sendingTeam: id });
    try {
      const response = await axios.get(`/teams/${id}.json`);
      const accounts = await response.data;
      const patterns = (await response.data.members)
        ? response.data.members
        : null;
      const incomes = await [
        ...this.props.incomes.find(item => item.id === Number(id)).accounts
      ];
      const nonAssigned = await [
        ...incomes.find(item => item.code === "nonAssigned").incomeByCode
      ];
      accounts["nonAssigned"] = [...nonAssigned];

      if (id !== "pozostałe") {
        for (let i of incomes) {
          if (!accounts.hasOwnProperty(i.code)) {
            accounts[i.code] = [];
            let passedIncome = i.incomeByCode.filter(income => {
              return patterns.some(pattern => {
                const namePattern = new RegExp(`(${pattern.name})`, "i");
                const surnamePattern = new RegExp(`(${pattern.surname})`, "i");
                return (
                  income.title.match(namePattern) &&
                  income.title.match(surnamePattern)
                );
              });
            });
            let notPassedIncome = i.incomeByCode.filter(income => {
              return patterns.every(pattern => {
                const namePattern = new RegExp(`(${pattern.name})`, "i");
                const surnamePattern = new RegExp(`(${pattern.surname})`, "i");
                return !(
                  income.title.match(namePattern) &&
                  income.title.match(surnamePattern)
                );
              });
            });

            let newValues = [];

            for (let i in passedIncome) {
              const index = patterns.findIndex(pattern => {
                const namePattern = new RegExp(`(${pattern.name})`, "i");
                const surnamePattern = new RegExp(`(${pattern.surname})`, "i");
                return (
                  passedIncome[i].title.match(namePattern) &&
                  passedIncome[i].title.match(surnamePattern)
                );
              });
              if (index > -1) {
                newValues.push({
                  value: Number(passedIncome[i].cash),
                  name: patterns[index].name,
                  surname: patterns[index].surname
                });
              } else {
                newValues.push(passedIncome[i]);
              }
            }

            accounts["nonAssigned"] = [
              ...accounts["nonAssigned"],
              ...notPassedIncome
            ];
            accounts[i.code] = [...newValues];

            // i.incomeByCode.forEach((income, index, array) => {
            //   for (let pattern of patterns) {
            //     const namePattern = new RegExp(`(${pattern.name})`, "i");
            //     const surnamePattern = new RegExp(`(${pattern.surname})`, "i");
            //     const matchInfo =
            //       income.title.match(namePattern) &&
            //       income.title.match(surnamePattern);
            //     const someVerify = accounts[i.code].some(
            //       (insertedTitle, index) =>
            //         namePattern.test(insertedTitle.name) &&
            //         surnamePattern.test(insertedTitle.surname)
            //     );
            //     if (matchInfo) {
            //       const index = accounts[i.code].findIndex(
            //         element =>
            //           namePattern.test(element.name) &&
            //           surnamePattern.test(element.surname)
            //       );
            //       console.log(index);
            //       index > 0
            //         ? (accounts[i.code][index].value += Number(income.cash))
            //         : accounts[i.code].push({
            //             name: pattern.name,
            //             surname: pattern.surname,
            //             value: Number(income.cash)
            //           });
            //     }
            //     // else if (matchInfo && someVerify) {
            //     //   console.log("Działa");
            //     //   const index = accounts[i.code].findIndex(
            //     //     insertedTitle =>
            //     //       namePattern.test(insertedTitle.name) &&
            //     //       surnamePattern.test(insertedTitle.surname)
            //     //   );
            //     //   console.log(index);
            //     //   accounts[i.code][index].value += Number(income.cash);
            //     // }
            //     else if (matchInfo && !someVerify) {
            //       accounts["nonAssigned"].push(income);
            //     }
            //   }
            // });
          } else if (accounts.hasOwnProperty(i.code)) {
            let passedIncome = i.incomeByCode.filter(income => {
              return patterns.some(pattern => {
                const namePattern = new RegExp(`(${pattern.name})`, "i");
                const surnamePattern = new RegExp(`(${pattern.surname})`, "i");
                return (
                  income.title.match(namePattern) &&
                  income.title.match(surnamePattern)
                );
              });
            });
            let notPassedIncome = i.incomeByCode.filter(income => {
              return patterns.every(pattern => {
                const namePattern = new RegExp(`(${pattern.name})`, "i");
                const surnamePattern = new RegExp(`(${pattern.surname})`, "i");
                return !(
                  income.title.match(namePattern) &&
                  income.title.match(surnamePattern)
                );
              });
            });

            accounts["nonAssigned"] = [
              ...accounts["nonAssigned"],
              ...notPassedIncome
            ];

            console.log(accounts["nonAssigned"]);
            console.log(notPassedIncome);
            let newValues = [];

            for (let i in passedIncome) {
              const index = patterns.findIndex(pattern => {
                const namePattern = new RegExp(`(${pattern.name})`, "i");
                const surnamePattern = new RegExp(`(${pattern.surname})`, "i");
                return (
                  passedIncome[i].title.match(namePattern) &&
                  passedIncome[i].title.match(surnamePattern)
                );
              });
              if (index > -1) {
                newValues.push({
                  value: Number(passedIncome[i].cash),
                  name: patterns[index].name,
                  surname: patterns[index].surname
                });
              } else {
                newValues.push(passedIncome[i]);
              }
            }

            accounts[i.code].forEach(person => {
              newValues.forEach(income => {
                if (
                  income.hasOwnProperty("name") &&
                  income.hasOwnProperty("surname")
                ) {
                  if (
                    person.name === income.name &&
                    person.surname === income.surname
                  ) {
                    person.value += Number(income.value);
                  } else {
                    if (
                      !accounts[i.code].some(
                        personExisted =>
                          personExisted.name === income.name &&
                          personExisted.surname === income.surname
                      )
                    )
                      accounts[i.code].push(income);
                  }
                }
              });
            });
          }
        }
        const responseInfo = await axios.put(`/teams/${id}.json`, accounts);
        console.log(responseInfo);
        this.setState({ sendingTeam: null });
        // console.log(accounts);
        // console.log(patterns);
        // console.log(incomes);
        // console.log(nonAssigned);}
      } else if (id === "pozostałe") {
        const responseInfo = await axios.patch(`/teams/other.json`, accounts);
        console.log(responseInfo);
        this.setState({ sendingTeam: null });
      }
    } catch (err) {
      console.log(err);
    }
  };

  getInfo = () => {
    console.log(this.props.incomes);
    const value = document.querySelector("#input").value;
    this.sendingDataHandler(value);
  };

  sendingHandler = () => {
    if (this.props.incomes) {
      // this.props.incomes.forEach(team => this.sendingDataHandler(team.id));
      this.sendingDataHandler(12427);
      // this.sendingDataHandler("pozostałe");
    } else {
      console.log("Incomes not ready yet!");
    }
  };

  render() {
    let sortedIncome;
    if (this.props.teams) {
      sortedIncome = this.props.teams.map(team => {
        return { link: `/transfers/sorted/${team.id}`, title: `${team.id}` };
      });
      console.log(sortedIncome);
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
        {/* <button onClick={this.getInfo}>Udziel info w konsoli o propsach</button> */}
        {/* <button onClick={this.assignIncome}>
          Sortuj przelewy kodami do drużyn
        </button> */}
        <button onClick={this.sendingHandler}>Wyślij dane na serwer</button>

        {/* <input type="text" placeholder="Podaj ID drużyny" id="input" /> */}

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
