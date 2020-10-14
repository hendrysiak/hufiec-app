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
import { Switch } from "@material-ui/core";

import { sendingDataHandler } from '../../helpers/sending.handlers'

import { sortingIncome } from '../../../../helpers/sorting.helper';

const SortedIncome = (props) => {
  
    const [income, setIncome] = useState(null);
    const [codes, setCodes] = useState(null);
    const [sortedIncome, setSortedIncome] = useState(null);
    // const [sendingTeam, setSendingTeam] = useState(null);
    const [incomes, setIncomes] = useState([]);

    const teams  = useSelector(state => state.income.teams);
    const init  = useSelector(state => state.income.initIncome);
    const assignedIncome  = useSelector(state => state.income.assignedIncome);
    const accountState = useSelector(state => state.income.accountState);

    const sendingTeam = useSelector(state => state.ui.sendingTeam);


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
    console.log('Data downloaded');
  }, [accountState]);

  useEffect(() => {
    getData();
  }, []) 


  
  const assignIncome = () => {

    const membersByTeam = {};
    const teams = Object.keys(accountState);
    teams.forEach(team => {
        membersByTeam[team] = accountState[team].members
    })

    const updatedCodes = Object.values(codes).flat();

    const { sortedIncomes, sortedOutcomes } = sortingIncome(init, membersByTeam, updatedCodes)

    store.dispatch(actions.assignIncomesToAccount(sortedIncomes));
  };

  useEffect(() => {
    if (codes && init && teams) assignIncome();
  }, [codes, init, teams]) 


  const getInfo = () => {
    const value = document.querySelector("#input").value;
    sendingDataHandler(value, axios, incomes);
  };

  const sendingHandler = async () => {
    axios.put('/teams.json', accountState)
  };

    let incomesAfterSorting;
    if (teams) {
      incomesAfterSorting = teams.map(team => {
        return { link: `/transfers/sorted/${team.id}`, title: `${team.id}` };
      });
      // console.log(sortedIncome);
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
              return (<main>{props.routingForSortedTeam}</main>)
                // // <Switch>
                // <Route
                //   key={index}
                //   path={`/transfers/sorted/${team.title}`}
                //   component={props => <Team teamNum={team.title} />}
                // />
                // // </Switch>
              // );
            })}
          </main>
        </div>
      </section>
    );
  
}





export default SortedIncome;
