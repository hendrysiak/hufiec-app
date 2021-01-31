import {
  Button,
  Checkbox,
  FormControl,
  FormControlLabel,
  Input,
  InputBase,
  InputLabel,
  Paper,
  TextField,
} from '@material-ui/core';
import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useHistory } from 'react-router';
// import { useHistory } from "react-router-dom";

import Cookies from 'universal-cookie';

import { Decrypt, DecryptCookie, Encrypt, EncryptCookie, getAccount } from 'helpers/password.helper';
import {
  reduxIsAuthenticated,
  reduxSetRoles,
} from 'store/actions/user';

import { Authorization } from '../../store/actions/action.types';

import classes from './Login.module.css';

const Login = () => {
  const history = useHistory();
  const [formReset, setFormReset] = useState<boolean>(false);
  const [login, setLogin] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  // const [email, setEmail] = useState<string>('');
  const dispatch = useDispatch();
  const cookies = new Cookies();
  // const isAuth = useSelector(
  //   (state: any) => state.user.isAuthorization
  // );

  // const handleRemindBtn = () => {
  //   console.log(email, 'email wysyłanie zapytania');
  // };

  // useEffect(() => {
  //   const token = localStorage.getItem('token');
  //   if (token) dispatch(reduxIsAuthenticated(true));
  // }, []);

  const checkLogin = async (login: string, password: string) => {
    const accountData = await getAccount(login);
    if (password === Decrypt(accountData.password)) {
      dispatch(reduxSetRoles(accountData.roles));
      cookies.set('token', EncryptCookie(login, password), { path: '/', maxAge: 20});
      return history.push('/addpercent');
    }
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
      </Paper>
    </>
  );
};

export default Login;
