import {
  Button,
  Input,
  Paper,
} from '@material-ui/core';

import CircularProgress from '@material-ui/core/CircularProgress';
import React, { useState } from 'react';
import { useHistory } from 'react-router';

import Cookies from 'universal-cookie';

import { getAccount } from 'helpers/account.helper';
import { Decrypt, EncryptCookie } from 'helpers/password.helper';
import {
  reduxSetRoles,
  reduxSetTeam,
} from 'store/actions/user';


import store from 'store/store';

import classes from './Login.module.css';

const Login = () => {
  const history = useHistory();
  const [formReset, setFormReset] = useState<boolean>(false);
  const [login, setLogin] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [loadingLogin, setLoadingLogin] = useState<boolean>(false);
  // const [email, setEmail] = useState<string>('');
  const cookies = new Cookies();


  const checkLogin = async (login: string, password: string) => {
    setLoadingLogin(true);
    const accountData = await getAccount(login);
    try {
      if (password === Decrypt(accountData.password)) {
        store.dispatch(reduxSetRoles(accountData.roles));
        store.dispatch(reduxSetTeam('6673'));
        cookies.set('token', EncryptCookie(login, password), { path: '/', maxAge: 9 });
        // if(accountData.team) return history.push(`/info${accountData.team}`);
        //TODO - this only to test ->


        const team = '6673'; 
        //
        if (accountData.roles.includes('admin')) return history.push('/');
        return history.push(`/info/${team}`);
      }
    } catch (err) {
      setLoadingLogin(false);
      console.error(err);
    }
    setLoadingLogin(false);
  };

  const onSubmit = (e: React.FormEvent<HTMLFormElement | HTMLDivElement>) => {
    e.preventDefault();
    if (!formReset) checkLogin(login, password);
    // if (formReset) {
    //   /^\S+@\S+\.\S+$/.test(email) ? alert('odbierz e-mail') : alert('popraw e-mail');
    //   return;
    // }
  };

  return (
    <>
      {loadingLogin ? <CircularProgress className={classes.circularProgress}/> : 
        <Paper className={classes.form} component="form" onSubmit={onSubmit}>
          <Input
            type="text/submit"
            className={classes.input}
            id="standard-basic"
            placeholder="Login"
            disabled={formReset}
            onChange={(e) => setLogin(e.target.value)}
          />
          <Input
            type="password"
            className={classes.input}
            id="standard-basic"
            placeholder="Hasło"
            disabled={formReset}
            onChange={(e) => setPassword(e.target.value)}
          />
          <Button
            type="submit"
            className={classes.btn}
            variant="contained"
            color="primary"
            disabled={formReset}
          >
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
        </Paper>}
    </>
  );
};

export default Login;
