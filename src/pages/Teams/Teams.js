

import { TextField, MenuItem } from '@material-ui/core';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Typography from '@material-ui/core/Typography';
import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';

import axios from '../../axios-income';

import TableEditor from '../../components/TableEditor/TableEditor';


import Navigation from '../../shared/Navigation';
import { getTeamsWithAccountState } from '../DashBoard/api-handlers/account.handler';
import MembersTable from '../Team/MembersTable/MembersTable';

import classes from './Teams.module.css';

const Teams = () => {
  const registry = useSelector(state => state.income.registry);
  const dbIncomes = useSelector(state => state.income.dbIncomes);
  const codes = useSelector(state => state.income.codes);

  const [currentTeam, setCurrentTeam] = useState(6673);
  const [currentTeamRegistry, setCurrentTeamRegistry] = useState([]);
  const [filteredCodes, setFilteredCodes] = useState([]);
  const [incomesByCode, setIncomeByCode] = useState([]);
  const [incomesInDb, setIncomesInDb] = useState([]);

  const [changesToSave, setChangesToSave] = useState(false);

  useEffect(() => {
    dbIncomes && setIncomesInDb(dbIncomes);
  },[dbIncomes]);

  useEffect(() => {
    registry && setCurrentTeamRegistry(registry[currentTeam]);
    const incomesToDisplay = incomesInDb && incomesInDb.filter(income => income.team === currentTeam);
    setIncomeByCode(incomesToDisplay);
  },[currentTeam, registry]);

  useEffect(() => {
    const filteredCodes = codes && codes.map(code => code.code);
    setFilteredCodes(filteredCodes);
  },[codes]);

  const saveIncome = async () => {
    await axios.put('/incomes.json', incomesInDb);
    await getTeamsWithAccountState();
    setChangesToSave(false);
  };

  const editIncome = (index, data, value) => {
    const incomeToEdit = [...incomesByCode];
    const updatedDb = [...incomesInDb];

    incomeToEdit[index][data] = value;
    const newIndex = updatedDb.findIndex(i => 
      i.title === incomeToEdit[index].title
        && i.cash === incomeToEdit[index].cash
    );
    updatedDb[newIndex][data] = value;

    setIncomesInDb(updatedDb);
    setIncomeByCode(incomeToEdit);
    setChangesToSave(true);
  };

  return (
    <div>
      <Navigation />
      <header>
        <TextField
          style={{ width: '80%', marginTop: '16px' }}
          label="Wybierz drużynę"
          value={currentTeam}
          onChange={(e) => setCurrentTeam(e.target.value)}
          placeholder="Wybierz kod z listy"
          select={true}
          size="small"
          variant="outlined"
          margin="normal"
          SelectProps={{
            MenuProps: { disableScrollLock: true }
          }}
        >
          {registry && [...Object.keys(registry)].map((item) => (
            <MenuItem key={item} value={item}>{item}</MenuItem>
          ))}
        </TextField>
      </header>

      <main className={classes.Main} >
        <section className={classes.Section}>
          <TableEditor 
            data={incomesByCode} 
            onChange={editIncome}
            info="income"
            save={changesToSave}
            saveHandler={saveIncome}
          />
        </section>
      </main>
    </div>
  );
};

export default Teams;