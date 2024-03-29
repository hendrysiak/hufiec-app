import { Button, Input } from '@mui/material';
import React, { useState } from 'react';

import { updateOnePercent } from 'helpers/editing-db.handler';

import classes from '../../pages/AddPercent/AddPercent.module.css';

function OneTeam({ team, amount }: { team: string, amount: number }) {
  const [inputValue, setInputValue] = useState<string>('');
  const [currentAmount, setCurrentAmount] = useState<number | undefined>();

  const handleInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue(e.target.value);
  };

  const handleSendNewValue = async () => {
    try {
      const getNewAmount = await updateOnePercent(team, Number(inputValue).toFixed(2));
      setCurrentAmount(getNewAmount);
      setInputValue('');
    } catch (err) {
      alert('Coś poszło nie tak, spróbuj dodać ponownie.');
    }
  };

  return (
    <div className={classes.oneRow}>
      <p>
        DRUŻYNA
        <span className={classes.bold}>{team}</span>
        {' '}
        - OBECNIE:
        {currentAmount !== undefined ? currentAmount : amount}
        {' '}
        zł
      </p>
      <label htmlFor="">
        {' '}
        Nowa kwota:
        <Input type="number" placeholder="kwota" onChange={handleInput} value={inputValue} />
      </label>
      <Button onClick={() => handleSendNewValue()} variant="contained" color="primary">ZAPISZ</Button>
    </div>
  );
}

export default OneTeam;
