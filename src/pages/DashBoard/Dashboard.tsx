import { AppBar, Button } from '@material-ui/core';
import CircularProgress from '@material-ui/core/CircularProgress';
import Paper from '@material-ui/core/Paper';
import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';

import axios from 'axios-income';

import { LogOut } from 'shared/LogOut/LogOut';
import Navigation from 'shared/Navigation/Navigation';

import { RootState } from 'store/models/rootstate.model';

import * as actions from '../../store/actions/index';
import store from '../../store/store';

import classes from './Dashboard.module.css';

// import classes from './Dashboard.module.css';

// import Navigation from '../../components/Navigation/Navigation';
// import Transfers from '../Transfers/containers/Transfers';
// import Codes from '../../components/Codes/Codes';
// import AddCode from '../../components/AddCode/AddCode';
// import Teams from '../../components/Teams/Teams';
// import ForCoders from '../../components/ForCoders/ForCoders';

// import * as actions from '../../store/actions/index';

// import { getTeamsWithAccountState, getCodes } from './api-handlers/account.handler'
// import EventBilling from '../EventBilling/containers/EventBilling';

// import { organizationStateVerification } from './helpers/dashboard.helpers';

export interface IMessValue {
  content: string;
  mail: string;
  team: string;
  title: string;
}

export interface IMessages {
  [key: string]: IMessValue;
}

const Dashboard = (): JSX.Element => {
  const isAuth = useSelector((state: RootState) => state.user.isAuthenticated);
  const incomeDb = useSelector((state: RootState) => state.income);
  const [messages, setMessages] = useState<IMessages>();
  const [loadingMess, setLoadingMess] = useState<boolean>(false);
  const [amount, setAmount] = useState<number>(0);
  const getMessages = async () => {
    const result = await axios.get('/ticket.json/');
    setLoadingMess(true);
    return setMessages(result.data);
  };

  const handleDeleteMess = async (el: string, title: string, mess: string) => {
    if (!window.confirm(`na pewno chcesz usunąć?\n ${title}, \n ${mess.length > 20 ? 
      'początek wiadomośći: ' + mess.slice(0, 40) + '...'
      : 
      'wiadomość: ' + mess}`)) return;

    await axios.delete(`/ticket/${el}.json`)
      .then(() => getMessages())
      .catch(() => alert('coś poszło nie tak, spróbuj ponownie'));
  };

  useEffect(() => {
    const sumIncomes = incomeDb.dbIncomes.reduce((sum: number, income) => sum + income.cash,0);
    const sumOutcomes = incomeDb.dbOutcomes.reduce((sum: number, income) => sum + income.cash,0);
    setAmount(Number((sumIncomes + sumOutcomes).toFixed(2)));
  },[incomeDb]);

  useEffect(() => {
    const token = localStorage.getItem('token');
    token && !isAuth && store.dispatch(actions.reduxIsAuthentication(true));
    getMessages();
  }, []);

  return (
    <>
      <LogOut />
      <Navigation />
      <div>
        <h1>Aplikacja Hufcowa - v. 0.1</h1>
        <Paper style={{ background: 'transparent' }}>
          <AppBar position="static" className={classes.appBar}>
            <h2>Stan hufca:</h2>
            <p>{amount} zł</p>
          </AppBar>
          {/* <p><strong>Przychody:</strong>{accountState.incomesAccountState}</p>
          <p><strong>Koszty:</strong>{accountState.outcomesAccountState}</p>
          <hr/>
          <p><strong>Stan hufca:</strong>{accountState.incomesAccountState - accountState.outcomesAccountState}</p> */}
          <AppBar position="static" color="transparent">
            <h2>Wiadomości</h2>
            <ul className={classes.listMessages}>
              {messages ? (
                Object.keys(messages).map((el, i: number) => {
                  // console.log(messages[el]);
                  return (
                    <li key={i}>
                      {
                        <div className={classes.containerMessage}>
                          <h2>Drużyna: {messages[el].team}</h2>
                          <h3>Tytuł: {messages[el].title}</h3>
                          <p>Treść zgłoszenia: {messages[el].content}</p>
                          {messages[el].mail && (
                            <p>
                              Proszę o odpowiedź na maila: {messages[el].mail}
                            </p>
                          )}
                          <Button onClick={() => handleDeleteMess(el, messages[el].title, messages[el].content)} variant="contained" color="secondary">USUŃ</Button>
                          {/* <button onClick={() => handleDeleteMess(el)}>USUN</button> */}
                        </div>
                      }
                    </li>
                  );
                })
              ) : loadingMess ? (
                <div>Brak wiadomośći</div>
              ) : (
                <CircularProgress />
              )}
            </ul>
            
          </AppBar>
        </Paper>
      </div>
    </>
  );
};

export default Dashboard;
