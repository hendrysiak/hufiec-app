import { Button, Checkbox, FormControl, FormControlLabel, Input, InputBase, InputLabel, Paper, TextField } from '@material-ui/core';
import React, { useState, useEffect } from 'react';

import classes from './Login.module.css';

const Login = () => {
  const [formReset, setFormReset] = useState<boolean>(false);
  const [login, setLogin] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [email, setEmail] = useState<string>('');

  const handleRemindBtn = () => {
    console.log(email, 'email wysyłanie zapytania');
  };

  const onSubmit = (e: any) => {
    e.preventDefault();
    // if (formReset) {
    //   /^\S+@\S+\.\S+$/.test(email) ? alert('odbierz e-mail') : alert('popraw e-mail');
    //   return;
    // }
    if (!formReset) console.log('funkcja przyjmująca login hasło');
  }
  return (

    <>
      <Paper className={classes.form} component="form" onSubmit={onSubmit}>
        <Input type="text/submit" className={classes.input} id="standard-basic" placeholder="Login" disabled={formReset} onChange={(e) => setLogin(e.target.value)}/>
        <Input type="test/submit" className={classes.input} id="standard-basic" placeholder="Hasło" disabled={formReset} onChange={(e) => setPassword(e.target.value)}/>
        <Button type="submit" className={classes.btn} variant="contained" color="primary" disabled={formReset}>
          ZALOGUJ
        </Button>
        {/* <FormControlLabel 
          label="Zapomniałem Hasła"
          control={
            <Checkbox
              defaultChecked={false}
              color="primary"
              inputProps={{ 'aria-label': 'secondary checkbox' }}
              onChange={() => setFormReset(!formReset)}
            />
          }
        />
        {formReset &&
        <>
          <Input type="text/submit" className={classes.input} id="standard-basic" placeholder="E-MAIL" onChange={(e) => setEmail(e.target.value)} />
          <Button type="submit" className={classes.btn} variant="contained" color="primary" onClick={handleRemindBtn}>
            RESET HASŁA
          </Button>
        </>
        } */}
      </Paper>
    
    </>
  );
};

export default Login;