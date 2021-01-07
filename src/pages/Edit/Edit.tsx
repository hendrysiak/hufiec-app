import { TextField, MenuItem } from '@material-ui/core';
import Checkbox from '@material-ui/core/Checkbox';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import { makeStyles } from '@material-ui/core/styles';
import { KeyboardDatePicker } from '@material-ui/pickers';
import { MaterialUiPickersDate } from '@material-ui/pickers/typings/date';
import React, { useState, useEffect } from 'react';

import { useSelector } from 'react-redux';

import axios from 'axios-income';
import { BudgetEntry, FinanceMethod, FoundingSources, OutcomeCategory } from 'models/global.enum';
import { IncomesWithImportDate, OutcomesWithFinanceMethod } from 'models/income.models';
import Navigation from 'shared/Navigation/Navigation';
import TableEditor from 'shared/TableEditor/TableEditor';

import { RootState } from 'store/models/rootstate.model';

import { getAccountState } from '../DashBoard/api-handlers/account.handler';

const Edit = (): JSX.Element => {
  const registry = useSelector((state: RootState) => state.income.registry);
  const dbIncomes = useSelector((state: RootState) => state.income.dbIncomes);
  const dbOutcomes = useSelector((state: RootState) => state.income.dbOutcomes);
  const codes = useSelector((state: RootState) => state.income.codes);
  const importDates = useSelector((state: RootState) => state.income.importDates);

  const [editedData, setEditedData] = useState('income');

  const [displayedIncome, setDisplayedIncome] = useState<IncomesWithImportDate[]>([]);
  const [displayedOutcome, setDisplayedOutcome] = useState<OutcomesWithFinanceMethod[]>([]);

  const [foundingSources, setFoundingSources] = useState<FoundingSources[]>([]);
  const [outcomeCategory, setOutcomeCategory] = useState<OutcomeCategory[]>([]);

  const [selectedDate, setSelectedDate] = useState<MaterialUiPickersDate>(new Date());

  //filters
  const [event, setEvent] = useState('');
  const [team, setTeam] = useState('');
  const [founding, setFounding] = useState('');
  const [category, setCategory] = useState('');


  const [incomesInDb, setIncomesInDb] = useState<IncomesWithImportDate[]>([]);
  const [outcomesInDb, setOutcomesInDb] = useState<OutcomesWithFinanceMethod[]>([]);

  const [changesToSave, setChangesToSave] = useState(false);

  const [addingNewPosition, setAddingNewPosition] = useState(false);

  const [editedImportDates, setEditedImportDates] = useState<string[]>([]);

  const [useDate, setUseDate] = useState(true);

  useEffect(() => {
    const downloadData = async () => {
      const foundingSources = await axios.get('/foundingSources.json');
      const outcomeCategory = await axios.get('/outcomeCategory.json');

      setFoundingSources(foundingSources.data);
      setOutcomeCategory(outcomeCategory.data);
    };
    downloadData();
  },[]);

  useEffect(() => {
    dbIncomes && setIncomesInDb(dbIncomes);
    dbIncomes && setDisplayedIncome(dbIncomes);
    dbOutcomes && setOutcomesInDb(dbOutcomes);
    dbOutcomes && setDisplayedOutcome(dbOutcomes);
  },[dbIncomes, dbOutcomes]);

  useEffect(() => {
    const filteredIncomes = dbIncomes && dbIncomes.filter(i => {
      if (useDate && selectedDate && i.importDate !== selectedDate.toLocaleString().split(',')[0]) return false;
      if (team !== '' && i.team !== team) return false;
      if (event !== '' && i.event !== event) return false;
      return true;
    });
    filteredIncomes && setDisplayedIncome(filteredIncomes);
  },[event, team, selectedDate, dbIncomes, useDate]);

  useEffect(() => {
    const filteredOutcomes = dbOutcomes && dbOutcomes.filter(i => {
      if (useDate && selectedDate && i.importDate !== selectedDate.toLocaleString().split(',')[0]) return false;
      if (team !== '' && i.team !== team) return false;
      if (event !== '' && i.event !== event) return false;
      if (founding !== '' && i.foundingSource !== founding) return false;
      if (category !== '' && i.outcomeCategory !== event) return false;
      return true;
    });
    filteredOutcomes && setDisplayedOutcome(filteredOutcomes);
  },[event, team, founding, category, selectedDate, dbOutcomes, useDate]);

  useEffect(() => {
    importDates && setEditedImportDates(importDates);
  },[importDates]);

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

  const renderDayInPicker = (
    date: MaterialUiPickersDate, 
    selectedDate: unknown, 
    dayInCurrentMonth: unknown, 
    dayComponent: JSX.Element) => {

    if (importDates && date && importDates.includes(date.toLocaleString().split(',')[0])) {
      return (<div className={classes.dayWithDotContainer}>
        {dayComponent}
        <div className={classes.dayWithDot}/>
      </div>);
    }

    return dayComponent;    
  };

  const handleDateChange = (date: MaterialUiPickersDate) => {
    setSelectedDate(date);
  };

  const editedDataHandler = (value: string) => {
    const editedData = value === 'Przychody' ? BudgetEntry.Income : BudgetEntry.Outcome;
    setEditedData(editedData);
  };

  const saveIncome = async () => {
    await axios.put('/incomes.json', incomesInDb);
    await axios.put('/importDates.json', editedImportDates);
    await getAccountState();
    setChangesToSave(false);
  };

  const saveOutcome = async () => {
    await axios.put('/outcomes.json', outcomesInDb);
    await axios.put('/importDates.json', editedImportDates);
    await getAccountState();
    setChangesToSave(false);
  };

  const editIncome = (index: number, data: string, value: string) => {
    const incomeToEdit = [...displayedIncome];
    const updatedDb = [...incomesInDb];

    incomeToEdit[index][data] = value;
    const newIndex = updatedDb.findIndex(i => 
      i.title === incomeToEdit[index].title
        && i.cash === incomeToEdit[index].cash
    );

    updatedDb[newIndex][data] = value;

    setIncomesInDb(updatedDb);
    setDisplayedIncome(incomeToEdit);
    setChangesToSave(true);
  };

  const editOutcome = (index: number, data: string, value: string) => {
    const outcomeToEdit = [...displayedOutcome];
    const updatedDb = [...outcomesInDb];

    outcomeToEdit[index][data] = value;

    const newIndex = updatedDb.findIndex(i => 
      i.title === outcomeToEdit[index].title 
        && i.cash === outcomeToEdit[index].cash
    );

    updatedDb[newIndex][data] = value;

    setOutcomesInDb(updatedDb);
    setDisplayedOutcome(outcomeToEdit);
    setChangesToSave(true);
  };

  const saveHandler = (): void => {
    if (editedData === BudgetEntry.Income) saveIncome();
    else saveOutcome();
  };

  const editHandler = (index: number, data: string, value: string): void => {
    if (editedData === BudgetEntry.Income) editIncome(index, data, value);
    else {

      if (data === 'outcomeCategory') {
        const foundedCategory = Object.values(outcomeCategory).find(c => c === value);
        
        foundedCategory && editOutcome(index, data, foundedCategory);
      }
      else editOutcome(index, data, value);
    };
  };

  const addNewPosition = (
    info: string, 
    data: OutcomesWithFinanceMethod | IncomesWithImportDate
  ): void => {

    const currentDate = new Date();

    if (info === 'income') {
      const incomeToEdit = [...displayedIncome];
      const updatedDb = [...incomesInDb];
      const newIncome = {
        cash: data.cash,
        event: data.event as string,
        importDate: currentDate.toLocaleString().split(',')[0],
        name: data.name as string,
        surname: data.surname as string,
        team: data.team as string,
        title: 'Przychód dodany ręcznie',
        year: currentDate.getFullYear(),
        dateOfBook: data.dateOfBook,
      };

      incomeToEdit.push(newIncome);
      updatedDb.push(newIncome);

      setIncomesInDb(updatedDb);
      setDisplayedIncome(incomeToEdit);
      setChangesToSave(true);
    } else {
      const outcomeToEdit = [...displayedOutcome];
      const updatedDb = [...outcomesInDb];
      const newOutcome = {
        cash: data.cash,
        event: data.event as string,
        importDate: currentDate.toLocaleString().split(',')[0],
        bilingNr: data.bilingNr,
        foundingSource: data.foundingSource as FoundingSources,
        outcomeCategory: data.outcomeCategory,
        team: data.team,
        title: 'Koszt dodany ręcznie',
        year: currentDate.getFullYear(),
        financeMethod: data.financeMethod as FinanceMethod,
        dateOfBook: data.dateOfBook
      };

      outcomeToEdit.push(newOutcome);
      updatedDb.push(newOutcome);

      setOutcomesInDb(updatedDb);
      setDisplayedOutcome(outcomeToEdit);
      setChangesToSave(true);
    }
      
    const newImportDate = [...editedImportDates];
    newImportDate.push(currentDate.toLocaleString().split(',')[0]);
    setEditedImportDates(newImportDate);
  };

  const filtersToIncomes = (
    <>
      <TextField
        style={{ marginTop: '16px' }}
        label="Po drużynie"
        value={team}
        onChange={(e) => setTeam(e.target.value)}
        placeholder="Wybierz drużynę z listy"
        select={true}
        size="small"
        variant="outlined"
        margin="normal"
        SelectProps={{
          MenuProps: { disableScrollLock: true }
        }}
      >
        {registry && ['', ...Object.keys(registry)].map((item) => (
          <MenuItem key={item} value={item}>{item}</MenuItem>
        ))}
      </TextField>
      <TextField
        style={{ marginTop: '16px' }}
        label="Po wydarzeniu"
        value={event}
        onChange={(e) => setEvent(e.target.value)}
        placeholder="Wybierz kod z listy"
        select={true}
        size="small"
        variant="outlined"
        margin="normal"
        SelectProps={{
          MenuProps: { disableScrollLock: true }
        }}
      >
        {codes && ['', ...codes.map(code => code.code)].map((item) => (
          <MenuItem key={item} value={item}>{item}</MenuItem>
        ))}
      </TextField>
    </>
  );
  const filtersToOutcomes = (
    <>
      <TextField
        style={{ marginTop: '16px' }}
        label="Po drużynie"
        value={team}
        onChange={(e) => setTeam(e.target.value)}
        placeholder="Wybierz drużynę z listy"
        select={true}
        size="small"
        variant="outlined"
        margin="normal"
        SelectProps={{
          MenuProps: { disableScrollLock: true }
        }}
      >
        {registry && ['', ...Object.keys(registry)].map((item) => (
          <MenuItem key={item} value={item}>{item}</MenuItem>
        ))}
      </TextField>
      <TextField
        style={{ marginTop: '16px' }}
        label="Po wydarzeniu"
        value={event}
        onChange={(e) => setEvent(e.target.value)}
        placeholder="Wybierz kod z listy"
        select={true}
        size="small"
        variant="outlined"
        margin="normal"
        SelectProps={{
          MenuProps: { disableScrollLock: true }
        }}
      >
        {codes && ['', ...codes.map(code => code.code)].map((item) => (
          <MenuItem key={item} value={item}>{item}</MenuItem>
        ))}
      </TextField>
      <TextField
        style={{ marginTop: '16px' }}
        label="Po finansowaniu"
        value={event}
        onChange={(e) => setFounding(e.target.value)}
        placeholder="Wybierz źródło z listy"
        select={true}
        size="small"
        variant="outlined"
        margin="normal"
        SelectProps={{
          MenuProps: { disableScrollLock: true }
        }}
      >
        {foundingSources && ['', ...foundingSources].map((item) => (
          <MenuItem key={item} value={item}>{item}</MenuItem>
        ))}
      </TextField>
      <TextField
        style={{ marginTop: '16px' }}
        label="Po kategorii"
        value={event}
        onChange={(e) => setCategory(e.target.value)}
        placeholder="Wybierz kategorię z listy"
        select={true}
        size="small"
        variant="outlined"
        margin="normal"
        SelectProps={{
          MenuProps: { disableScrollLock: true }
        }}
      >
        {outcomeCategory && ['', ...Object.values(outcomeCategory)].map((item) => (
          <MenuItem key={item} value={item}>{item}</MenuItem>
        ))}
      </TextField>
    </>
  );

  return (
    <>
      <Navigation />
      <div>
        <header>
          <TextField
            style={{ width: '80%', marginTop: '16px' }}
            label="Co edytujesz?"
            value={editedData === 'income' ? 'Przychody' : 'Koszty'}
            onChange={(e) => editedDataHandler(e.target.value)}
            placeholder="Wybierz kod z listy"
            select={true}
            size="small"
            variant="outlined"
            margin="normal"
            SelectProps={{
              MenuProps: { disableScrollLock: true }
            }}
          >
            {['Przychody', 'Koszty'].map((item) => (
              <MenuItem key={item} value={item}>{item}</MenuItem>
            ))}
          </TextField>
          <div className="filters">
            {editedData === 'income' ? filtersToIncomes : filtersToOutcomes}
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
        </header>

        <main>
          <section>
            <TableEditor 
              data={editedData === 'income' ? displayedIncome : displayedOutcome}
              onChange={editHandler}
              info={editedData}
              save={changesToSave}
              saveHandler={saveHandler}
              additionalData={{
                foundingSources: foundingSources ? Object.values(foundingSources) : [],
                outcomeCategory: outcomeCategory ? Object.values(outcomeCategory) : [],
                teams: registry ? Object.keys(registry) : [],
                codes: codes ? codes.map(code => code.code) : []
              }}
              currentTeam={team}
              currentEvent={event}
              currentCategory={category}
              currentFounding={founding}
              add={addingNewPosition}
              setAddingNewPosition={setAddingNewPosition}
              addNewPosition={addNewPosition}
            />
          </section>
        </main>
      </div>
    </>
  );
};

export default Edit;
