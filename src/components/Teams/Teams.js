import React, { useState, useEffect } from "react";

import axios from "../../axios-income";

import ListContainer from "../ListContainer/ListContainer";
import ListEl from "../ListEl/ListEl";

import classes from "./Teams.module.css";

const Teams = () => {
  const [teams, getTeams] = useState([]);
  const [incomes, getIncomes] = useState({});

  const getTeamsFromServer = async () => {
    try {
      const teams = await axios.get("/lisOfTeams.json");
      await getTeams(teams.data);
    } catch (err) {
      console.log(err);
    }
  };
  useEffect(() => {
    getTeamsFromServer();
  }, []);

  const getIncomesFromServer = async () => {
    const team = document.getElementById("teams").value;

    try {
      const incomes = await axios.get(`/teams/${team}.json`);
      await getIncomes(incomes.data);
    } catch (err) {
      console.log(err);
    }
    console.log(incomes);
  };

  let select;
  if (teams.length) {
    select = teams.map((team, index) => (
      <option key={index} value={team}>
        {team}
      </option>
    ));
  }

  let members;
  if (incomes.hasOwnProperty("members")) {
    members = incomes.members.map((member, index) => (
      <li key={index} className={classes.ListEl}>
        <span>{index + 1}</span>
        <span>{member.name}</span>
        <span>{member.surname}</span>
      </li>
    ));
  }

  let incomesByCode;
  if (incomes) {
    let fixedIncomes = [];
    for (let income in incomes) {
      fixedIncomes.push({ code: income, incomes: [...incomes[income]] });
    }
    incomesByCode = fixedIncomes.map((income, index) =>
      income.code !== "members" ? (
        <ListContainer key={index} title={income.code}>
          {income.code !== "nonAssigned"
            ? income.incomes.map((person, index) => (
                <ListEl
                  key={index}
                  cash={person.value}
                  title={`${person.name} ${person.surname}`}
                />
              ))
            : income.incomes.map((person, index) => (
                <ListEl key={index} cash={person.cash} title={person.title} />
              ))}
        </ListContainer>
      ) : null
    );
  }

  return (
    <div>
      <header>
        <label htmlFor="teams">Wybierz drużynę:</label>
        <select name="teams" id="teams">
          {select}
        </select>
        <button onClick={getIncomesFromServer}>Pobierz dane</button>
      </header>

      <main className={classes.Main}>
        <aside className={classes.Aside}>
          <h3>Lista członków drużyny (stan z SEH):</h3>
          <ul className={classes.ListContainer}>{members}</ul>
        </aside>
        <section className={classes.Section}>
          <h3>Stan wpłat zgodnie z kodami:</h3>
          <div className={classes.IncomeWrapper}>{incomesByCode}</div>
        </section>
      </main>
    </div>
  );
};

export default Teams;
