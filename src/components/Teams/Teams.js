import React, { useState, useEffect } from "react";

import axios from "../../axios-income";

import ListContainer from "../ListContainer/ListContainer";
import ListEl from "../ListEl/ListEl";

import { useSelector } from "react-redux";

import { TextField, MenuItem } from '@material-ui/core';

import classes from "./Teams.module.css";

const Teams = () => {
  const registry = useSelector(state => state.income.registry);
  const dbIncomes = useSelector(state => state.income.dbIncomes);
  const codes = useSelector(state => state.income.codes);

  const [currentTeam, setCurrentTeam] = useState(6673);
  const [currentTeamRegistry, setCurrentTeamRegistry] = useState([]);
  const [filteredCodes, setFilteredCodes] = useState([]);
  const [incomesByCode, setIncomeByCode] = useState([]);

  useEffect(() => {
    registry && setCurrentTeamRegistry(registry[currentTeam]);
    const incomesToDisplay = dbIncomes && dbIncomes.filter(income => income.team === currentTeam);
    setIncomeByCode(incomesToDisplay);
  },[currentTeam, registry]);

  useEffect(() => {
    const filteredCodes = codes && codes.map(code => code.code);
    setFilteredCodes(filteredCodes);
  },[codes]);

  const members = (<ListContainer title={currentTeam}>
    {currentTeamRegistry && currentTeamRegistry.map((person, index) => (
      <ListEl
        key={index}
        cash={index + 1}
        title={`${person.name} ${person.surname}`}
      />
    ))}
  </ListContainer>);

    const list = filteredCodes && filteredCodes.map((code, index) => {
      if (code !== "unAssigned") {
        return (
          <ListContainer key={index} title={code}>
            {incomesByCode && incomesByCode.map((person, index) => (
              <ListEl
                key={index}
                cash={person.value}
                title={`${person.name} ${person.surname}`}
              />
            ))}
          </ListContainer>
        ) 
      } else {
        return (
        <ListContainer key={index} title={code}>
          {incomesByCode && incomesByCode.map((person, index) => (
            <ListEl
              key={index}
              cash={person.cash}
              title={person.title}
            />
          ))}
        </ListContainer>
      )}

    })


  return (
    <div>
      <header>
        <TextField
        style={{width: '80%', marginTop: '16px'}}
          label="Wybierz drużynę"
          value={currentTeam}
          onChange={(e) => setCurrentTeam(e.target.value)}
          placeholder="Wybierz kod z listy"
          select={true}
          size="small"
          variant="outlined"
          Smargin="normal"
          SelectProps={{
            MenuProps: { disableScrollLock: true }
          }}
        >
          {registry && [...Object.keys(registry)].map((item) => (
        <MenuItem key={item} value={item}>{item}</MenuItem>
      ))}
        </TextField>
      </header>

      <main className={classes.Main}>
        <aside className={classes.Aside}>
          <h3>Lista członków drużyny (stan z SEH):</h3>
          <ul className={classes.ListContainer}>{members}</ul>
        </aside>
        <section className={classes.Section}>
          <h3>Stan wpłat zgodnie z kodami:</h3>
          <div className={classes.IncomeWrapper}>{list}</div>
        </section>
      </main>
    </div>
  );
};

export default Teams;
