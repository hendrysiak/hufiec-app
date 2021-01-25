import { Button, Checkbox, FormControl, FormControlLabel, Input, InputBase, InputLabel, Paper, TextField } from '@material-ui/core';
import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Redirect, useHistory } from 'react-router';
// import { useHistory } from "react-router-dom";

import { reduxIsAuthenticated } from 'store/actions/authorization';

import classes from './Login.module.css';
import { Authorization } from '../../store/actions/action.types';

const Login = () => {
  const history = useHistory();
  const [formReset, setFormReset] = useState<boolean>(false);
  const [login, setLogin] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [email, setEmail] = useState<string>('');
  const dispatch = useDispatch();
  const isAuth = useSelector((state: any) => state.authorization.isAuthorization);

  const handleRemindBtn = () => {
    console.log(email, 'email wysyłanie zapytania');
  };

  useEffect(() => {
    setTimeout(() => {
      const token = true;
      if (token) dispatch(reduxIsAuthenticated(true));
      return history.push('/');
    },2000);
  },[]);

  const checkLogin = (login: string, password: string) => {
    if (login === 'aaa' && password === 'bbb') {
      dispatch(reduxIsAuthenticated(true));
      // return <Redirect to="/"/>;
      return history.push('/');
    }
  };

  const onSubmit = (e: any) => {
    e.preventDefault();
    // if (formReset) {
    //   /^\S+@\S+\.\S+$/.test(email) ? alert('odbierz e-mail') : alert('popraw e-mail');
    //   return;
    // }
    if (!formReset) checkLogin(login, password);
  };
  
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