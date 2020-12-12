import { TextField, MenuItem } from '@material-ui/core';
import Container from '@material-ui/core/Container';
import Grid from '@material-ui/core/Grid';
import Paper from '@material-ui/core/Paper';
import { makeStyles } from '@material-ui/core/styles';
import clsx from 'clsx';

import React, { useState, useEffect } from 'react';

import { useSelector } from 'react-redux';

import {
  useLocation
} from 'react-router-dom';

import axios from 'axios-income';

import ListContainer from 'shared/ListContainer/ListContainer';
import ListEl from 'shared/ListEl/ListEl';

import store from 'store/store';

import MembersTable from './MembersTable/MembersTable';


const Team = () => {
  const dbIncomes = useSelector(state => state.income.dbIncomes);
  const codes = useSelector(state => state.income.codes);
  const registry = useSelector(state => state.income.registry);

  const [currentTeamRegistry, setCurrentTeamRegistry] = useState([]);
  const [filteredCodes, setFilteredCodes] = useState([]);
  const [incomesByCode, setIncomeByCode] = useState([]);

  const location = useLocation();
  const currentTeam = location.pathname.split('/')[2];

  useEffect(() => {
    // const registry = store.getState().income.registry;
    // console.log(registry);
    const teamtRegistry = registry && registry[currentTeam];
    teamtRegistry && setCurrentTeamRegistry(registry[currentTeam]);
    const incomesToDisplay = dbIncomes && dbIncomes.filter(income => income.team === currentTeam);
    setIncomeByCode(incomesToDisplay);
  },[registry]);


  useEffect(() => {
    const currentIncomes = store.getState().income.dbIncomes;
    const filteredIncomes = currentIncomes && currentIncomes.filter(income => income.team === currentTeam);
    setIncomeByCode(filteredIncomes);
  },[]);

  useEffect(() => {
    const filteredCodes = codes && codes.map(code => code.code);
    setFilteredCodes(filteredCodes);
  },[codes]);

  const drawerWidth = 240;

  const useStyles = makeStyles((theme) => ({
    paper: {
      padding: theme.spacing(2),
      display: 'flex',
      overflow: 'auto',
      flexDirection: 'column',
    },
    fixedHeight: {
      height: 240,
    },
  }));

  const classes = useStyles();
  const fixedHeightPaper = clsx(classes.paper, classes.fixedHeight);

  //TODO filter income with no name, event, cash or another info
  const list = filteredCodes && filteredCodes.map((code, index) => {
    if (code !== 'unAssigned') {
      return (
        <ListContainer key={index} title={code}>
          {incomesByCode && incomesByCode.map((person, index) => (
            <ListEl
              key={index}
              cash={person.cash}
              title={`${person.name} ${person.surname}`}
            />
          ))}
        </ListContainer>
      ); 
    } else {
      return (
        <Paper className={fixedHeightPaper}>
          <ListContainer key={index} title={code}>
            {incomesByCode && incomesByCode.map((person, index) => (
              <ListEl
                key={index}
                cash={person.cash}
                title={person.title}
              />
            ))}
          </ListContainer>
        </Paper>
      );}

  });


  return (
    <div>
      <Container maxWidth="xl">
        <Grid container spacing={3}>
          <Grid item xs={12} md={8} lg={4}>
            <MembersTable members={currentTeamRegistry}/>
          </Grid>
          <Grid item xs={12} md={4} lg={8}>
            <h3>Stan wpłat zgodnie z kodami:</h3>
            <div>{list}</div>
          </Grid>
        </Grid>
      </Container>
    </div>
  );
};

export default Team;