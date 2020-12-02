import React, { useState, useEffect } from "react";

import axios from "../../axios-income";

import { makeStyles } from '@material-ui/core/styles';

import { useSelector } from "react-redux";

import { TextField, MenuItem } from '@material-ui/core';
import { KeyboardDatePicker } from '@material-ui/pickers';

import { getTeamsWithAccountState } from '../DashBoard/api-handlers/account.handler';

import TableEditor from '../../components/TableEditor/TableEditor';

import Navigation from '../../shared/Navigation';

import FormControlLabel from '@material-ui/core/FormControlLabel';
import Checkbox from '@material-ui/core/Checkbox';

const Edit = () => {
  const registry = useSelector(state => state.income.registry);
  const dbIncomes = useSelector(state => state.income.dbIncomes);
  const dbOutcomes = useSelector(state => state.income.dbOutcomes);
  const codes = useSelector(state => state.income.codes);
  const importDates = useSelector(state => state.income.importDates);

  const [editedData, setEditedData] = useState('income');

  const [displayedIncome, setDisplayedIncome] = useState([]);
  const [displayedOutcome, setDisplayedOutcome] = useState([]);

  const [foundingSources, setFoundingSources] = useState([]);
  const [outcomeCategory, setOutcomeCategory] = useState([]);

  const [selectedDate, setSelectedDate] = useState(new Date())

  //filters
  const [event, setEvent] = useState('');
  const [team, setTeam] = useState('');
  const [founding, setFounding] = useState('');
  const [category, setCategory] = useState('');


  const [incomesInDb, setIncomesInDb] = useState([])
  const [outcomesInDb, setOutcomesInDb] = useState([])

  const [changesToSave, setChangesToSave] = useState(false);

  const [addingNewPosition, setAddingNewPosition] = useState(false);

  const [editedImportDates, setEditedImportDates] = useState([]);

  const [useDate, setUseDate] = useState(true);

  useEffect(() => {
    const downloadData = async () => {
      const foundingSources = await axios.get('/foundingSources.json');
      const outcomeCategory = await axios.get('/outcomeCategory.json');

      setFoundingSources(foundingSources.data);
      setOutcomeCategory(outcomeCategory.data);
    }
    downloadData();
  },[])

  useEffect(() => {
    dbIncomes && setIncomesInDb(dbIncomes);
    dbIncomes && setDisplayedIncome(dbIncomes);
    dbOutcomes && setOutcomesInDb(dbOutcomes);
    dbOutcomes && setDisplayedOutcome(dbOutcomes);
  },[dbIncomes, dbOutcomes])

  useEffect(() => {
    const filteredIncomes = dbIncomes && dbIncomes.filter(i => {
      if (useDate && i.importDate !== selectedDate.toLocaleString().split(',')[0]) return false;
      if (team !== '' && i.team !== team) return false;
      if (event !== '' && i.event !== event) return false;
      return true;
    })
    setDisplayedIncome(filteredIncomes);
  },[event, team, selectedDate, dbIncomes, useDate]);

  useEffect(() => {
    const filteredOutcomes = dbOutcomes && dbOutcomes.filter(i => {
      if (useDate && i.importDate !== selectedDate.toLocaleString().split(',')[0]) return false;
      if (team !== '' && i.team !== team) return false;
      if (event !== '' && i.event !== event) return false;
      if (founding !== '' && i.foundingSource !== founding) return false;
      if (category !== '' && i.outcomeCategory !== event) return false;
      return true;
    })
    setDisplayedOutcome(filteredOutcomes);
  },[event, team, founding, category, selectedDate, dbOutcomes, useDate]);

  useEffect(() => {
    importDates && setEditedImportDates(importDates);
  },[importDates])

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
}))

const classes = useStyles()

const renderDayInPicker = (date, selectedDate, dayInCurrentMonth, dayComponent) => {
  if (importDates && importDates.includes(date.toLocaleString().split(',')[0])) {
      return (<div className={classes.dayWithDotContainer}>
          {dayComponent}
          <div className={classes.dayWithDot}/>
      </div>)
  }

  return dayComponent    
}

  const handleDateChange = (date) => {
    setSelectedDate(date);
  };

  const editedDataHandler = (value) => {
    const editedData = value === 'Przychody' ? 'income' : 'outcome';
    setEditedData(editedData)
  }

  const saveIncome = async () => {
    await axios.put('/incomes.json', incomesInDb);
    await axios.put('/importDates.json', editedImportDates);
    await getTeamsWithAccountState();
    setChangesToSave(false);
  }

  const saveOutcome = async () => {
    await axios.put('/outcomes.json', outcomesInDb);
    await axios.put('/importDates.json', editedImportDates);
    await getTeamsWithAccountState();
    setChangesToSave(false);
  }

  const editIncome = (index, data, value) => {
      const incomeToEdit = [...displayedIncome];
      const updatedDb = [...incomesInDb];

      incomeToEdit[index][data] = value;
      const newIndex = updatedDb.findIndex(i => 
        i.title === incomeToEdit[index].title
        && i.cash === incomeToEdit[index].cash
        )

      updatedDb[newIndex][data] = value;

      setIncomesInDb(updatedDb);
      setDisplayedIncome(incomeToEdit);
      setChangesToSave(true);
    }

  const editOutcome = (index, data, value) => {
      const outcomeToEdit = [...displayedOutcome];
      const updatedDb = [...outcomesInDb];

      outcomeToEdit[index][data] = value;

      const newIndex = updatedDb.findIndex(i => 
        i.title === outcomeToEdit[index].title 
        && i.cash === outcomeToEdit[index].cash
        )

      updatedDb[newIndex][data] = value;

      setOutcomesInDb(updatedDb);
      setDisplayedOutcome(outcomeToEdit);
      setChangesToSave(true);
    }

    const saveHandler = () => {
      if (editedData === 'income') saveIncome()
      else saveOutcome();
    }

    const editHandler = (index, data, value) => {
      if (editedData === 'income') editIncome(index, data, value);
      else {

        if (data === 'outcomeCategory') {
          const foundedValue = outcomeCategory.find(c => c.name === value);
          editOutcome(index, data, foundedValue.category)
        }
        else editOutcome(index, data, value)
      };
    }

  const addNewPosition = (info, data) => {
    const currentDate = new Date();

    if (info === 'income') {
      const incomeToEdit = [...displayedIncome];
      const updatedDb = [...incomesInDb];
      const newIncome = {
        cash: data.cash,
        event: data.event,
        importDate: currentDate.toLocaleString().split(',')[0],
        name: data.name,
        surname: data.surname,
        team: data.team,
        title: "Przychód dodany ręcznie",
        year: currentDate.getFullYear()
      }

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
        event: data.event,
        importDate: currentDate.toLocaleString().split(',')[0],
        bilingNr: data.bilingNr,
        foundingSource: data.foundingSource,
        outcomeCategory: data.outcomeCategory,
        team: data.team,
        title: "Koszt dodany ręcznie",
        year: currentDate.getFullYear(),
        financeMethod: data.financeMethod
      }

      outcomeToEdit.push(newOutcome);
      updatedDb.push(newOutcome);

      setOutcomesInDb(updatedDb);
      setDisplayedOutcome(outcomeToEdit);
      setChangesToSave(true);
    }

    console.log(editedImportDates)
      
    const newImportDate = [...editedImportDates];
    newImportDate.push(currentDate.toLocaleString().split(',')[0]);
    setEditedImportDates(newImportDate);
  };

  const filtersToIncomes = (
    <>
    <TextField
    style={{marginTop: '16px'}}
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
    style={{marginTop: '16px'}}
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
    style={{marginTop: '16px'}}
      label="Po drużynie"
      value={team}
      onChange={(e) => setTeam('team', e.target.value)}
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
    style={{marginTop: '16px'}}
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
    style={{marginTop: '16px'}}
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
    style={{marginTop: '16px'}}
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
      {outcomeCategory && ['', ...outcomeCategory.map(cat => cat.name)].map((item) => (
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
        style={{width: '80%', marginTop: '16px'}}
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
        <div class="filters">
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
              foundingSources: foundingSources ? foundingSources : [],
              outcomeCategory: outcomeCategory ? outcomeCategory.map(cat => cat.name) : [],
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
