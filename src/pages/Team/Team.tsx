import { TextField, MenuItem, Theme } from '@material-ui/core';
import Checkbox from '@material-ui/core/Checkbox';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import { makeStyles } from '@material-ui/core/styles';
import { DataGrid } from '@material-ui/data-grid';
import BuildIcon from '@material-ui/icons/Build';
import ListIcon from '@material-ui/icons/List';
import { SpeedDial, SpeedDialAction, SpeedDialIcon } from '@material-ui/lab';
import { KeyboardDatePicker } from '@material-ui/pickers';
import { MaterialUiPickersDate } from '@material-ui/pickers/typings/date';
import { size } from 'lodash';
import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import {
  useLocation
} from 'react-router-dom';

import styles from './components/NavTeam/NavTeam.module.css';

import { useDebounce } from 'helpers/hooks/useDebounce';
import { IncomeDb, OutcomeDb } from 'models/income.models';

import { APIPerson } from 'models/registry.models';
import Tooltips from 'pages/Team/components/Tooltips/Tooltips';
import { LogOut } from 'shared/LogOut/LogOut';
import { RootState } from 'store/models/rootstate.model';

import './style.css';
import { NavTeam } from './components/NavTeam/NavTeam';

const Team = (): JSX.Element => {
  const codes = useSelector((state: RootState) => state.income.codes);
  const dbIncomes = useSelector((state: RootState) => state.income.dbIncomes);
  const dbOutcomes = useSelector((state: RootState) => state.income.dbOutcomes);
  const registry = useSelector((state: RootState) => state.income.registry);
  const importDates = useSelector((state: RootState) => state.income.importDates);

  const [displayedIncome, setDisplayedIncome] = useState<IncomeDb[]>([]);
  const [event, setEvent] = useState<string>('');
  const [currentTeamRegistry, setCurrentTeamRegistry] = useState<APIPerson[]>([]);

  const [incomesByCode, setIncomeByCode] = useState<IncomeDb[]>([]); 
  const [outcomesByCode, setOutcomeByCode] = useState<OutcomeDb[]>([]); 

  const location = useLocation();
  const currentTeam = location.pathname.split('/')[1];

  const [rows, setRows] = useState<IncomeDb[]>([]);
  const [view, setView] = useState<any>('tooltips');
  const [useDate, setUseDate] = useState<boolean>(true);

  const [selectedDate, setSelectedDate] = useState<Date>(new Date());

  const [name, setName] = useState<string>('');
  const [surname, setSurname] = useState<string>('');

  const debouncedName = useDebounce(name, 500);
  const debouncedSurname = useDebounce(surname, 500);

  const handleDateChange = (date: Date | null) => {
    date && setSelectedDate(date);
  };

  useEffect(() => {
    const teamRegistry = registry && registry[currentTeam];
    teamRegistry && setCurrentTeamRegistry(teamRegistry);
    const incomesToDisplay = dbIncomes && currentTeam && dbIncomes.filter(income => income.team === currentTeam);
    const outcomesToDisplay = dbOutcomes && currentTeam && dbOutcomes.filter(income => income.team === currentTeam);
    incomesToDisplay && setIncomeByCode(incomesToDisplay);
    outcomesToDisplay && setOutcomeByCode(outcomesToDisplay);
  },[registry, dbIncomes, dbOutcomes, currentTeam]);

  useEffect(() => {
    const row = incomesByCode?.length ? (incomesByCode.map((el, index) => {
      return ({
        ...el,
        lp: index + 1,
        dateOfBook: el.dateOfBook.toLocaleString().split(',')[0].split('T')[0]
      });
    })) : ([]);
    setRows(row);     
  },[incomesByCode]);

  const columns = [
    { field: 'lp', headerName: 'LP', width: 80, },
    { field: 'name', headerName: 'IMIĘ', width: 150, },
    { field: 'surname', headerName: 'NAZWISKO', width: 150, },
    { field: 'cash', headerName: 'KWOTA', width: 150, },
    { field: 'title', headerName: 'TYTUŁ', width: 700, },
    { field: 'event', headerName: 'KOD PRZYPISANY', width: 150, },
    { field: 'dateOfBook', headerName: 'DATA WPŁYWU', width: 150, },
  ];

  useEffect(() => {
    //Write date checker
    const filteredIncomes = rows && rows.filter(i => {
      if (useDate && selectedDate && new Date(i.dateOfBook).toLocaleDateString() !== selectedDate.toLocaleDateString()) return false;
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
      if (name !== '' && !(new RegExp(name, 'gi').test(`${i.name}`))) return false;
      if (surname !== '' && !(new RegExp(surname, 'gi').test(`${i.surname}`))) return false;
      return true;
    });
    setDisplayedIncome(filteredIncomes);

  },[event, selectedDate, incomesByCode, useDate, rows, debouncedName, debouncedSurname]);

  const useStyles = makeStyles((theme: Theme) => ({
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
    if (importDates && date && importDates.includes(date)) {
      return (<div className={classes.dayWithDotContainer}>
        {dayComponent}
        <div className={classes.dayWithDot}/>
      </div>);
    }

    return dayComponent ;   
  };

  const [open, setOpen] = useState<boolean>(false);
  const handleClose = () => {
    setOpen(false);
  };

  const handleOpen = () => {
    setOpen(true);
  };

  const handleMenu = (view: string) => {
    setOpen(false);
    setView(view);
  };
  
  return (
    <>
      <LogOut />
      {/* <NavTeam team={currentTeam}/> */}
      <div className={styles.navTeam}>
        <p className={styles.team}>{currentTeam}</p>
        <SpeedDial
          classes={{ fab: styles.rootCircle }}
          ariaLabel="SpeedDial example"
          // classes={{root: classes.test,}}
          hidden={false}
          icon={<SpeedDialIcon classes={{ root: styles.iconRoot, icon: styles.icon }}/>}
          onClose={handleClose}
          onOpen={handleOpen}
          open={open}
          direction= "left"
        >
          {/* {actions.map((action) => ( */}
          <SpeedDialAction
            classes={{ fab: styles.actionRoot }}
            key={1}
            icon={<ListIcon classes={{ root: styles.actionIcon }} />}
            tooltipTitle={''}
            onClick={() => handleMenu('list')}
          />
          <SpeedDialAction
            classes={{ fab: styles.actionRoot }}
            key={2}
            icon={<BuildIcon classes={{ root: styles.actionIcon }}/>}
            tooltipTitle={''}
            onClick={() => handleMenu('tooltips')}
          />
          {/* ))} */}
        </SpeedDial>
      </div>
      <section className="container">
        <div className="header">
          {view === 'list' && <div className="filters">
            <TextField
              className="testowa"
              label="Po wydarzeniu"
              value={event}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => setEvent(e.target.value)}
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
            <TextField
              className="name"
              label="Po imieniu"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Wpisz imię"
              size="small"
              variant="outlined"
              margin="none"
            />

            <TextField
              label="Po nazwisku"
              value={surname}
              onChange={(e) => setSurname(e.target.value)}
              placeholder="Wpisz nazwisko"
              size="small"
              variant="outlined"
              margin="normal"

            />
            <KeyboardDatePicker
              className="datePicker"
              disableToolbar
              disableFuture={true}
              inputVariant="outlined"
              format="dd/MM/yyyy"
              margin="normal"
              id="date-picker-inline"
              label="Wybierz datę wpływu"
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
          </div>}
          {view === 'tooltips' && <Tooltips 
            members={currentTeamRegistry} 
            incomes={incomesByCode} 
            outcomes={outcomesByCode} 
            currentTeam={currentTeam} 
            dataToExport={displayedIncome}
          />}
        </div>
        {/* <h1>Drużyna: {currentTeam}</h1> */}
        {view === 'list' && <div style={{ width: '100%', height: '79vh', overflow: 'auto' }}>
          {displayedIncome?.length ? (
            <DataGrid rows={displayedIncome} columns={columns} autoHeight={true} scrollbarSize={1}/>
          ) : (
            <div className="loadingInfo">wczytywanie płatności drużyny / brak wpłat na ten filtr</div>
          )}
        </div>}
      </section>
    </>
  );
};

export default Team;