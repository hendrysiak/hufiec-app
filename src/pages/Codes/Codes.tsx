import { TextField, MenuItem } from '@material-ui/core';
import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';

import ListContainer from 'shared/ListContainer/ListContainer';
import ListEl from 'shared/ListEl/ListEl';

import Navigation from '../../shared/Navigation';

import classes from './Codes.module.css';

const Codes = () => {
  const dbIncomes = useSelector(state => state.income.dbIncomes);
  const codes = useSelector(state => state.income.codes);

  const [usedCodes, setUsedCodes] = useState(codes);
  const [ currentCode, setCurrentCode ] = useState();

  useEffect(() => {
    if (codes) {
      const codesToUse = codes.map(code => code.code);
      setCurrentCode(codesToUse[0]);
      setUsedCodes(codesToUse);
    }
  }, [codes]);


  const children = currentCode === 'Brak kodu' 
    ? dbIncomes && dbIncomes.filter(i => !i.event).map((income, index) => {
      return <ListEl key={index} title={income.title} cash={income.cash} />;
    })
    : dbIncomes && dbIncomes.filter(i => i.event === currentCode).map((income, index) => {
      return <ListEl key={index} title={income.title} cash={income.cash} />;
    });

  return (
    <>
      <Navigation />
      <section className="Section">
        <header>

          <TextField 
            style={{ width: '80%', marginTop: '16px' }}
            value={currentCode}
            onChange={(e) => setCurrentCode(e.target.value)}
            placeholder="Wybierz kod z listy"
            select={true}
            size="small"
            variant="outlined"
            margin="normal"
            SelectProps={{
              MenuProps: { disableScrollLock: true }
            }}
          >
            {usedCodes && [...usedCodes, 'Brak kodu'].map((item) => (
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
    </>
  );
};

export default Codes;
