import React, { useEffect, useState } from "react";
import { Route } from "react-router-dom";
import { useSelector, connect } from "react-redux";
import axios from "../../../../axios-income";

import * as actions from "../../../../store/actions/index";
import store from "../../../../store/store";

import Navigation from "../../../../components/Navigation/Navigation";
import Team from "../../../../components/Team/Team";
import StatusInfo from "../../../../components/UI/StatusInfo/StatusInfo";

import classes from "./SortedIncome.module.css";

const SortedIncome = () => {
  
    const [income, setIncome] = useState(null);
    const [codes, setCodes] = useState(null);
    const [sortedIncome, setSortedIncome] = useState(null);
    const [sendingTeam, setSendingTeam] = useState(null);
    const [incomes, setIncomes] = useState([]);

    const teams  = useSelector(state => state.income.teams);
    const init  = useSelector(state => state.income.initIncome);
    const assignedIncome  = useSelector(state => state.income.assignedIncome);
    const accountState = useSelector(state => state.income.accountState);

    const mapDispatchToProps = dispatch => {
  return {
    onFetchIncome: url => dispatch(actions.fetchIncome(url)),
    onSortIncome: (actualTeams, actualIncome) =>
      dispatch(actions.sortingIncome(actualTeams, actualIncome)),
    onEditIncome: income => dispatch(actions.editingIncome(income)),
    // onAssignIncome: income => )
  };
};

  const getData = async () => {
    try {
      const response = await axios.get("/codes.json");
      if (!codes) {
        await setCodes(response.data)
        await setIncome(teams);
      }
    } catch (err) {
      console.log(err);
    }
    // if (codes) assignIncome();
  };

  useEffect(() => {
    getData();
  }, []) 



 const sortedIncomeByAccount = (account, array, patterns) => {
  
  // create pattern by code
    const patternsToSortIncome = [...patterns].map(
      pattern => new RegExp(`(${pattern})`, "m")
    );

// cut off 'unassigned'
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
  
  const assignIncome = () => {
    const sortedIncome = [...teams].map(team => {
      const codesPatern = [
        ...codes.general,
        ...(codes[team.id] ? codes[team.id] : [])
      ];
      return {
        id: team.id,
        accounts: [
          ...codesPatern.map((code, index, array) =>
            sortedIncomeByAccount(code, team.income, array)
          )
        ]
      };
    });
    store.dispatch(actions.assignIncome(sortedIncome));
  };

  useEffect(() => {
    if (codes) assignIncome();
  }, [codes]) 


  const sendingDataHandler = async id => {
    // const updatedState = [...accountState];

    // assignedIncome.forEach(team => {
    //   if (team.id !== 'pozostałe') {
    //     team.accounts.forEach(account => {



    //     })
        
    //   }
    // })


    setSendingTeam(id);
    try {
      const response = await axios.get(`/teams/${id}.json`);
      const accounts = await response.data;
      const patterns = (await response.data.members)
        ? response.data.members
        : null;
      const incomes = await [
        ...incomes.find(item => {
          if(id !== "pozostałe") return item.id === Number(id);
          else return item.id === id
        }
          ).accounts
      ];
      const nonAssigned = await [
        ...incomes.find(item => item.code === "nonAssigned").incomeByCode
      ];
      accounts["nonAssigned"] = [...nonAssigned];

      if (id !== "pozostałe") {
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
                  const index = accounts[i.code].findIndex(
                    element =>
                      namePattern.test(element.name) &&
                      surnamePattern.test(element.surname)
                  );
                  console.log(index);
                  index > 0
                    ? (accounts[i.code][index].value += Number(income.cash))
                    : accounts[i.code].push({
                        name: pattern.name,
                        surname: pattern.surname,
                        value: Number(income.cash)
                      });
                }
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
                } else if (
                  !matchInfo
                ) {
                  accounts["nonAssigned"].push(income);

                }
              });
            });
          }
        }
        const responseInfo = await axios.put(`/teams/${id}.json`, accounts);
        console.log(responseInfo);
        this.setState({ sendingTeam: null });
      } else if (id === "pozostałe") {
        const responseInfo = await axios.put(`/teams/pozostałe.json`, accounts);
        console.log(responseInfo);
        this.setState({ sendingTeam: null });
      }
    } catch (err) {
      console.log(err);
    }
  };

  const getInfo = () => {
    console.log(incomes);
    const value = document.querySelector("#input").value;
    this.sendingDataHandler(value);
  };

  const sendingHandler = async () => {
    const response = await axios.get('/lisOfTeams.json');
    const teams = await response.data;
    if (incomes) {
      teams.forEach(team => sendingDataHandler(team));
    } else {
      console.log("Incomes not ready yet!");
    }
  };

    let incomesAfterSorting;
    if (teams) {
      incomesAfterSorting = teams.map(team => {
        return { link: `/transfers/sorted/${team.id}`, title: `${team.id}` };
      });
      console.log(sortedIncome);
    }
    let statusInfo;
    if (sendingTeam) {
      statusInfo = (
        <StatusInfo info={`Wysyłam dane dla ${sendingTeam}`} />
      );
    }

    return (
      <section className="Section">
        {statusInfo}
        {/* <button onClick={this.getInfo}>Udziel info w konsoli o propsach</button> */}
        {/* <button onClick={this.assignIncome}>
          Sortuj przelewy kodami do drużyn
        </button> */}
        <button onClick={sendingHandler}>Wyślij dane na serwer</button>

        {/* <input type="text" placeholder="Podaj ID drużyny" id="input" /> */}

        <h2>Przelewy posortowane według kodów:</h2>
        <div className="GridArea">
          <nav className={classes.Nav}>
            <Navigation list={incomesAfterSorting} navigation="main" />
          </nav>
          <main>
            {incomesAfterSorting.map((team, index) => {
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





export default SortedIncome;
