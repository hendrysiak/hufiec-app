import { TextField, MenuItem } from '@material-ui/core';
import Checkbox from '@material-ui/core/Checkbox';
import Container from '@material-ui/core/Container';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Grid from '@material-ui/core/Grid';
import Paper from '@material-ui/core/Paper';
import { makeStyles, Theme, createStyles } from '@material-ui/core/styles';
import { DataGrid } from '@material-ui/data-grid';
import { KeyboardDatePicker } from '@material-ui/pickers';
import clsx from 'clsx';
import React, { useState, useEffect } from 'react';

// const cla

import { useSelector } from 'react-redux';

import {
  useLocation
} from 'react-router-dom';

import Tooltips from 'components/Tooltips/Tooltips';

import axios from '../../axios-income';

import ListContainer from '../../components/ListContainer/ListContainer';
import ListEl from '../../components/ListEl/ListEl';

import store from '../../store/store';

import MembersTable from './MembersTable/MembersTable';

import './style.css';


// interface IRegistry {
//   [key: string]: IRegistry[]
// };
// interface IState {
//   income: IRegistry
// }

const Team = () => {
  const codes = useSelector(state => state.income.codes);
  const dbIncomes = useSelector(state => state.income.dbIncomes);
  const registry = useSelector(state => state.income.registry);
  const importDates = useSelector(state=> state.income.importDates);

  // const [team, setTeam] = useState('');
  const [editedData, setEditedData] = useState('income');
  const [displayedIncome, setDisplayedIncome] = useState([]);
  
  const [event, setEvent] = useState('');
  const [currentTeamRegistry, setCurrentTeamRegistry] = useState([]);
  const [filteredCodes, setFilteredCodes] = useState([]); 
  const [incomesByCode, setIncomeByCode] = useState([]);
  
  const [incomesSC, setIncomesSC] = useState(null);

  const location = useLocation();
  const currentTeam = location.pathname.split('/')[2];

  const [rows, setRows] = useState([]);

  const [useDate, setUseDate] = useState(true);

  const [editedImportDates, setEditedImportDates] = useState([]);
  const [selectedDate, setSelectedDate] = useState(new Date());

  const handleDateChange = (date) => {
    setSelectedDate(date);
  };

  useEffect(() => {
    const teamtRegistry = registry && registry[currentTeam];
    teamtRegistry && setCurrentTeamRegistry(registry[currentTeam]);
    const incomesToDisplay = dbIncomes && dbIncomes.filter(income => income.team === currentTeam);
    setIncomeByCode(incomesToDisplay);
  },[registry]);

  useEffect(() => {
    const helper = incomesByCode?.length ? (incomesByCode.map((el, index) => {
      return ({
        ...el,
        lp: index + 1,
        id: index,
      });
    })) : ([]);
    setRows(helper);
    const sum = incomesByCode && incomesByCode
      .filter(income => income.event === 'SC')
      .reduce((sum,income) => sum + income.cash ,0); 

    setIncomesSC(sum);
  },[incomesByCode]);


  const columns = [
    { field: 'lp', headerName: 'LP', width: 80, center: true, },
    { field: 'name', headerName: 'IMIĘ', width: 150, align: 'center',},
    { field: 'surname', headerName: 'NAZWISKO', width: 150, alignItems: 'center', },
    { field: 'cash', headerName: 'KWOTA', width: 150, alignItems: 'center', },
    { field: 'title', headerName: 'TYTUŁ', width: 800, alignItems: 'center', },
    { field: 'importDate', headerName: 'DATA', width: 150, alignItems: 'center',},
  ];

  useEffect(() => {
    importDates && setEditedImportDates(importDates);
  },[importDates]);


  useEffect(() => {
    const filteredIncomes = rows && rows.filter(i => {
      if (useDate && i.importDate !== selectedDate.toLocaleString().split(',')[0]) return false;
      console.log(i.name , i.surname , i.event , i.importDate , i.team , i.title , i.year , i.cash);
      if (event !== '' && i.event !== event && event !== 'unAssigned') return false;
      if (event !== '' && event !== 'unAssigned' && !(i.name && i.surname && i.event && i.importDate && i.team && i.title && i.year && i.cash)) return false;
      if (event !== '' && event === 'unAssigned' && i.name && i.surname && i.event && i.importDate && i.team && i.title && i.year && i.cash) return false;
      return true;
    });
    setDisplayedIncome(filteredIncomes);
  },[event, selectedDate, incomesByCode, useDate, rows]);

  const useStyles = makeStyles((theme) => ({
    dayWithDotContainer: {
      position: 'relative'
    },
    dayWithDot: {
      position: 'absolute',
      height: 0,
      width: 0,
      border: '2px solid',
      borderRadius: 4,
      borderColor: theme.palette.primary.main,
      right: '50%',
      transform: 'translateX(1px)',
      top: '80%'
    }
  }));

  const classes = useStyles();

  const renderDayInPicker = (date, selectedDate, dayInCurrentMonth, dayComponent) => {
    if (importDates && importDates.includes(date.toLocaleString().split(',')[0])) {
      return (<div className={classes.dayWithDotContainer}>
        {dayComponent}
        <div className={classes.dayWithDot}/>
      </div>);
    }

    return dayComponent ;   
  };

  return (
    <>
      <section className="container">
        <div className="header">
          <div className="filters">
            <TextField
              style={{marginTop: '16px'}}
              label="Po wydarzeniu"
              value={event}
              onChange={(e) => setEvent(e.target.value)}
              // placeholder="Wybierz kod z listy"
              select={true}
              size="small"
              variant="outlined"
              margin="normal"
              SelectProps={{
                MenuProps: { disableScrollLock: true }
              }}
            >
              <MenuItem value={''}>{`Wszystkie wydarzenia`}</MenuItem>
              {codes && ['', ...codes.map(code => code.code)].map((item) => (
                item ? <MenuItem key={item} value={item}>{item}</MenuItem> : null
              ))}
            </TextField>
            <KeyboardDatePicker
              disableToolbar
              disableFuture={true}
              inputVariant="outlined"
              format="dd/MM/yyyy"
              margin="normal"
              id="date-picker-inline"
              label="Wybierz datę importu"
              renderDay={renderDayInPicker}
              value={selectedDate}
              onChange={handleDateChange}
              KeyboardButtonProps={{
                'aria-label': 'change date',
              }}
            />
            <FormControlLabel
              control={<Checkbox 
                checked={useDate} 
                onChange={(e) => setUseDate(e.target.checked)} 
                name="checkedA" 
                color="primary"
              />}
              label="Sortuj po dacie"
            />
          </div>
          <Tooltips members={currentTeamRegistry} incomes={incomesSC}/>
        </div>
        <h1>Drużyna: {currentTeam}</h1>
        <div style={{ width: 1500 }}>
          {displayedIncome?.length ? (
            <DataGrid rows={displayedIncome} columns={columns} pageSize={10} autoHeight={true}/>
          ) : (
            <div className="loadingInfo">wczytywanie płatności drużyny / brak wpłat na ten filtr</div>
          )}
        </div>
      </section>
    </>
  );
};

export default Team;