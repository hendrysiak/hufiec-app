import { Button } from '@material-ui/core';
import Input from '@material-ui/core/Input';
import React, { FC, useEffect, useState } from 'react';
import { useSelector } from 'react-redux';

import Navigation from 'shared/Navigation/Navigation';
import { RootState } from 'store/models/rootstate.model';

import classes from './AddPercent.module.css';

const AddPercent: FC = () => {
  const kwota = 1200
  const registry = useSelector((state: RootState) => state.income.registry);
  const [inputValue, setInputValue] = useState<string>('');

  const handleInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue(e.target.value);
  };

  const handleSendNewValue = (team: string, value: string) => {
    if (/^[0-9]+(\.\d{2})$/.test(value)) {
      alert('poszedł zapis'); // function to send data
      return;
    }
    alert('Zły format, 2miejsca po przecinku oddziel kropką.');
  };

  return (
    <>
      <Navigation />
      {registry && Object.entries(registry).map((el, index) => (
        <div className={classes.oneRow} key={index}>
          <p>DRUŻYNA <span className={classes.bold}>{el[0]}</span> | OBECNIE: {kwota} zł</p>
          <label htmlFor=""> Nowa kwota: <Input type="text" placeholder="kwota" onChange={handleInput}/></label>
          <Button onClick={() => handleSendNewValue(el[0], inputValue)} variant="contained" color="primary">ZAPISZ</Button>
        </div>)) }
    </>
  );
};

export default AddPercent;