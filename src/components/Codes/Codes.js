import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { Route } from "react-router-dom";
import axios from "../../axios-income";
import Spinner from "../UI/Spinner/Spinner";
import Navigation from "../Navigation/Navigation";
import Code from "./Code/Code";

import { getInfo } from '../../helpers/getInfo';


import ListEl from "../ListEl/ListEl";
import ListContainer from "../ListContainer/ListContainer";

import { TextField, MenuItem } from '@material-ui/core';

import classes from "./Codes.module.css";

const Codes = () => {
  const dbIncomes = useSelector(state => state.income.dbIncomes);
  const codes = useSelector(state => state.income.codes);

  const [ currentCode, setCurrentCode ] = useState(codes[0])

  const children = currentCode === 'Brak kodu' 
  ? dbIncomes.filter(i => !i.event).map((income, index) => {
      return <ListEl key={index} title={income.title} cash={income.cash} />
    })
  : dbIncomes.filter(i => i.event === currentCode).map((income, index) => {
    return <ListEl key={index} title={income.title} cash={income.cash} />
  })

  return (
    <section className="Section">
      <header>

        <TextField 
          style={{width: '80%', marginTop: '16px'}}
          value={currentCode}
          onChange={(e) => setCurrentCode(e.target.value)}
          placeholder="Wybierz kod z listy"
          select={true}
          size="small"
          variant="outlined"
          Smargin="normal"
          SelectProps={{
            MenuProps: { disableScrollLock: true }
          }}
        >
          {[...codes, 'Brak kodu'].map((item) => (
        <MenuItem key={item} value={item}>{item}</MenuItem>
      ))}
        </TextField>
        <h2>Pokaż listę po kodzie</h2>

      </header>
      <main className={classes.Main}>
      <ListContainer
              title={currentCode}
            >
              {children}
            </ListContainer>
        </main>
    </section>
  );
};

export default Codes;
