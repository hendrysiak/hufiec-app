"use client";

import { CircularProgress, Input, Button } from "@mui/material";
import { FirebaseError } from "firebase/app";
import { useAuth } from "providers/AuthUserProvider/AuthUserProvider";
import { useState } from "react";

import classes from '../../legacy/Login/Login.module.css';

const checkErrorCode = (error: string | null) => {
    switch (error) {
      case 'auth/wrong-password':
        return 'Nieprawidłowy login lub hasło';
      case 'auth/invalid-email':
        return 'Niepoprawny login';
      default:
        return null;
    }
  };
  

export const Login = () => {
    const [formReset, setFormReset] = useState<boolean>(false);
    const [login, setLogin] = useState<string>('');
    const [password, setPassword] = useState<string>('');
    const [loadingLogin, setLoadingLogin] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);
    const { signInToApp, resetPassword } = useAuth();
  
    // const [email, setEmail] = useState<string>('');
    // const cookies = new Cookies();
  
    const checkLogin = async (login: string, password: string) => {
      setLoadingLogin(true);
      const emailRegex = /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i;
  
      if (!emailRegex.test(login)) {
        setError('auth/invalid-email');
        setLoadingLogin(false);
      } else {
        setLogin(login);
      }
  
      try {
        const user = await signInToApp(login, password);
      } catch (err: unknown) {
        setLoadingLogin(false);
        if (err instanceof FirebaseError) {
          setError(err.code);
        }
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
        {loadingLogin ? <CircularProgress className={classes.circularProgress} />
          : (
            <form className={classes.form} onSubmit={onSubmit}>
              <Input
              // type="text/submit"
                type="te"
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
            </form>
          )}
        <Button
          type="submit"
          variant="contained"
          color="secondary"
          onClick={() => resetPassword(login)}
        >
          PRZYWRÓĆ HASŁO
        </Button>
        <p style={{ color: 'red' }}>{checkErrorCode(error)}</p>
        <p>Żeby zresetowac hasło, wypełnij pole "LOGIN" właściwym mailem przypisanym do konta</p>
      </>
    );
}