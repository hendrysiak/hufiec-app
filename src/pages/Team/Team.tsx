import { TextField, MenuItem } from '@material-ui/core';
import Checkbox from '@material-ui/core/Checkbox';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import { makeStyles } from '@material-ui/core/styles';
import { DataGrid } from '@material-ui/data-grid';
import { KeyboardDatePicker } from '@material-ui/pickers';
import { MaterialUiPickersDate } from '@material-ui/pickers/typings/date';
import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import {
  useLocation
} from 'react-router-dom';

import { IncomesDb, IncomesWithImportDate } from 'models/income.models';
import { Person } from 'models/registry.models';
import Tooltips from 'shared/Tooltips/Tooltips';
import { RootState } from 'store/models/rootstate.model';

import './style.css';

const Team = (): JSX.Element => {
  const codes = useSelector((state: RootState) => state.income.codes);
  const dbIncomes = useSelector((state: RootState) => state.income.dbIncomes);
  const registry = useSelector((state: RootState) => state.income.registry);
  const importDates = useSelector((state: RootState) => state.income.importDates);

  // const [editedData, setEditedData] = useState<string>('income');
  const [displayedIncome, setDisplayedIncome] = useState<IncomesDb[]>([]);
  
  const [event, setEvent] = useState<string>('');
  const [currentTeamRegistry, setCurrentTeamRegistry] = useState<Person[]>([]);
  const [incomesByCode, setIncomeByCode] = useState<IncomesWithImportDate[] | null>([]); 
  
  const [incomesSC, setIncomesSC] = useState<number | null>(null);

  const location = useLocation();
  const currentTeam = location.pathname.split('/')[2];

  const [rows, setRows] = useState<IncomesDb[]>([]);

  const [useDate, setUseDate] = useState<boolean>(true);

  const [selectedDate, setSelectedDate] = useState<Date>(new Date());

  const handleDateChange = (date: Date | null) => {
    date && setSelectedDate(date);
  };

  useEffect(() => {
    const teamtRegistry = registry && registry[currentTeam];
    teamtRegistry && registry && registry[currentTeam] && setCurrentTeamRegistry(registry[currentTeam]);
    const incomesToDisplay = dbIncomes && currentTeam && dbIncomes.filter(income => income.team === currentTeam);
    incomesToDisplay && setIncomeByCode(incomesToDisplay);
  },[registry, dbIncomes, currentTeam]);

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
      .reduce((sum: number, income) => sum + income.cash ,0); 

    setIncomesSC(sum);
  },[incomesByCode]);


  const columns = [
    { field: 'lp', headerName: 'LP', width: 80, },
    { field: 'name', headerName: 'IMIĘ', width: 150, },
    { field: 'surname', headerName: 'NAZWISKO', width: 150, },
    { field: 'cash', headerName: 'KWOTA', width: 150, },
    { field: 'title', headerName: 'TYTUŁ', width: 800, },
    { field: 'importDate', headerName: 'DATA', width: 150, },
  ];

  useEffect(() => {
    const filteredIncomes = rows && rows.filter(i => {
      if (useDate && selectedDate && i.importDate !== selectedDate.toLocaleString().split(',')[0]) return false;
      if (event !== '' && i.event !== event && event !== 'unAssigned') return false;
      if (event !== '' 
          && event !== 'unAssigned' 
          && !(i.name 
              && i.surname 
              && i.event 
              && i.importDate 
              && i.team 
              && i.title 
              && i.year 
              && i.cash)) return false;
      if (event !== '' 
          && event === 'unAssigned' 
          && i.name 
          && i.surname 
          && i.event 
          && i.importDate 
          && i.team 
          && i.title 
          && i.year 
          && i.cash) return false;
      return true;
    });
    setDisplayedIncome(filteredIncomes);

  },[event, selectedDate, incomesByCode, useDate, rows]);

  const useStyles = makeStyles(theme => ({
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

  const renderDayInPicker = (date: MaterialUiPickersDate, 
    selectedDate: unknown, 
    dayInCurrentMonth: unknown, 
    dayComponent: JSX.Element) => {
    if (importDates && date && importDates.includes(date.toLocaleString().split(',')[0])) {
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
              className="testowa"
              style={{ marginTop: '16px' }}
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
              className="datePicker"
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
              className="dateCheckbox"
              control={<Checkbox 
                checked={useDate} 
                onChange={(e) => setUseDate(e.target.checked)} 
                name="checkedA" 
                color="primary"
              />}
              label="Sortuj po dacie"
            />
          </div>
          <Tooltips members={currentTeamRegistry} incomes={incomesSC} currentTeam={currentTeam}/>
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