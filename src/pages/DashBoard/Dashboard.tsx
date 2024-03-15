import { AppBar, Box, Button, Grid, Typography } from '@mui/material';
import CircularProgress from '@mui/material/CircularProgress';
import Paper from '@mui/material/Paper';
import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';

import axios from 'axios-income';

import { RootState } from 'store/models/rootstate.model';

import appInfo from '../../../package.json';
import * as actions from '../../store/actions/index';
import store from '../../store/store';

import classes from './Dashboard.module.css';
import Importer from 'components/Importer/Importer';
import { deleteAllOutcomes, deleteIncomesByCode } from 'helpers/editing-db.handler';
import AdminActions from 'components/AdminActions/AdminActions';
import EventListGenerator from 'components/EventListGenerator/EventListGenerator';

export interface IMessValue {
  content: string;
  mail: string;
  team: string;
  title: string;
}

export interface IMessages {
  [key: string]: IMessValue;
}

function Dashboard(): JSX.Element {
  const isAuth = useSelector((state: RootState) => state.user.isAuthenticated);
  const incomeDb = useSelector((state: RootState) => state.income);
  const [messages, setMessages] = useState<IMessages>();
  const [loadingMess, setLoadingMess] = useState<boolean>(false);
  const [amount, setAmount] = useState<number>(0);
  const getMessages = async () => {
    const result = await axios.get('/ticket.json');
    setLoadingMess(true);
    return setMessages(result.data);
  };


  const handleDeleteMess = async (el: string, title: string, mess: string) => {
    if (!window.confirm(`na pewno chcesz usunąć?\n ${title}, \n ${mess.length > 20
      ? `początek wiadomośći: ${mess.slice(0, 40)}...`
      : `wiadomość: ${mess}`}`)) return;

    await axios.delete(`/ticket/${el}.json`)
      .then(() => getMessages())
      .catch(() => alert('coś poszło nie tak, spróbuj ponownie'));
  };

  const lastImportDate = incomeDb.dbIncomes.slice(-1)[0]?.importDate;

  useEffect(() => {
    const sumIncomes = incomeDb.dbIncomes.reduce((sum: number, income) => sum + Number(income.cash), 0);
    const sumOutcomes = incomeDb.dbOutcomes.reduce((sum: number, outcome) => sum + Number(outcome.cash), 0);

    setAmount(Number((Number(sumIncomes) + Number(sumOutcomes)).toFixed(2)));
  }, [incomeDb]);

  useEffect(() => {
    getMessages();
  }, []);

  const clearAccounts = async () => {
    if (window.confirm('Czy na pewno chcesz wyczyścić konta?')) {
      await deleteIncomesByCode('SC');
      await deleteAllOutcomes();
    }
  }

  return (
    <>
      <h1>{`Aplikacja Hufcowa - ${appInfo.version}`}</h1>
      <Grid container spacing={2}>
        <Grid item xs={12} md={6}>
          <Paper elevation={3}>
            <Box p={4}>
              <h2>Stan hufca:</h2>
              <p>
                {amount}
                {' '}
                zł
              </p>
            </Box>
          </Paper>
        </Grid>
        {/* <p><strong>Przychody:</strong>{accountState.incomesAccountState}</p>
          <p><strong>Koszty:</strong>{accountState.outcomesAccountState}</p>
          <hr/>
          <p><strong>Stan hufca:</strong>{accountState.incomesAccountState -
          accountState.outcomesAccountState}</p> */}
        <Grid item xs={12} md={6}>
          <Paper elevation={3}>
            <Box p={4}>
              <h2>Wiadomości</h2>
              <ul className={classes.listMessages}>
                {messages ? (
                  Object.keys(messages).map((el, i: number) =>
                  // console.log(messages[el]);
                  (
                    <li key={i}>
                      {
                        <div className={classes.containerMessage}>
                          <h2>
                            Drużyna:
                            {messages[el].team}
                          </h2>
                          <h3>
                            Tytuł:
                            {messages[el].title}
                          </h3>
                          <p>
                            Treść zgłoszenia:
                            {messages[el].content}
                          </p>
                          {messages[el].mail && (
                            <p>
                              Proszę o odpowiedź na maila:
                              {' '}
                              {messages[el].mail}
                            </p>
                          )}
                          <Button
                            onClick={() => handleDeleteMess(el, messages[el].title, messages[el].content)}
                            variant="contained"
                            color="secondary"
                          >
                            USUŃ
                          </Button>
                          {/* <button onClick={() => handleDeleteMess(el)}>USUN</button> */}
                        </div>
                      }
                    </li>
                  ))
                ) : loadingMess ? (
                  <div>Brak wiadomośći</div>
                ) : (
                  <CircularProgress />
                )}
              </ul>
            </Box>
          </Paper>
        </Grid>
        <Grid item xs={12} md={6}>
          <Importer />
        </Grid>
        <Grid item xs={12} md={6}>
          <Paper elevation={3}>
            <Box p={4}>
              <h2>Ostatni import był</h2>
              <p><b>{lastImportDate ? new Date(lastImportDate).toLocaleDateString() : ''}</b></p>
            </Box>
          </Paper>
        </Grid>
        <Grid item xs={12} md={6}>
          <EventListGenerator />
        </Grid>
        <Grid item xs={12} md={6}>
          <AdminActions />
        </Grid>
      </Grid>
    </>
  );
}

export default Dashboard;
