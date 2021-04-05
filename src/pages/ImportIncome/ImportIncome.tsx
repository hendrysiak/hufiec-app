
import { TextField } from '@material-ui/core';
import Button from '@material-ui/core/Button';
import React, { MouseEvent, useState } from 'react';
import { useHistory } from 'react-router-dom';
import { LogOut } from 'shared/LogOut/LogOut';

import { LogOut } from 'shared/LogOut/LogOut';

import Navigation from 'shared/Navigation/Navigation';


import { setIncomeInRedux } from './helpers/setReduxData.helper';

import classes from './ImportIncome.module.css';

const ImportIncome = (): JSX.Element => {

  const history = useHistory();
  const [dataUrl, setDataUrl] = useState('');

  const setUrl = (
    event: MouseEvent<HTMLButtonElement>): void => {
    event.preventDefault();
    setIncomeInRedux(dataUrl);
    history.push('/transfers/imported');
  };

  return (
    <>
      <LogOut />
      <Navigation />
      <section className="Section">
        <form className={classes.Form}>
          <h2>Wstaw URL z importem XML</h2>
          <TextField 
            style={{ width: '90%', margin: '16px 0' }}
            value={dataUrl}
            onChange={(e) => setDataUrl(e.target.value)}
            placeholder="Wstaw URL z importem XML"
            select={false}
            size="small"
            variant="outlined"
            margin="normal"
            label="Wstaw URL z importem XML"
          />
          <Button 
            variant="contained" 
            color="primary" 
            onClick={(e: MouseEvent<HTMLButtonElement>) => setUrl(e)}>
              Importuj
          </Button>
        </form>
      </section>
    </>
  );

};

export default ImportIncome;
