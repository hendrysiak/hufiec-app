import React, { useState, useEffect } from "react";

import axios from "../../axios-income";

import ListContainer from "../ListContainer/ListContainer";
import ListEl from "../ListEl/ListEl";
import MembersTable from '../MembersTable/MembersTable'

import { useSelector } from "react-redux";

import { TextField, MenuItem } from '@material-ui/core';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Typography from '@material-ui/core/Typography';

import { getTeamsWithAccountState } from '../../containers/DashBoard/api-handlers/account.handler';

import TableEditor from '../TableEditor/TableEditor';

const Edit = () => {
  const registry = useSelector(state => state.income.registry);
  const dbIncomes = useSelector(state => state.income.dbIncomes);
  const dbOutcomes = useSelector(state => state.income.dbOutcomes);
  const codes = useSelector(state => state.income.codes);

  const [editedData, setEditedData] = useState('income');

  const [displayedIncome, setDisplayedIncome] = useState([]);
  const [displayedOutcome, setDisplayedOutcome] = useState([]);

  const [foundingSources, setFoundingSources] = useState([]);
  const [outcomeCategory, setOutcomeCategory] = useState([]);

  //filters
  const [event, setEvent] = useState('');
  const [team, setTeam] = useState('');
  const [founding, setFounding] = useState('');
  const [category, setCategory] = useState('');


  const [incomesInDb, setIncomesInDb] = useState([])
  const [outcomesInDb, setOutcomesInDb] = useState([])

  const [changesToSave, setChangesToSave] = useState(false);

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
      if (team !== '' && i.team !== team) return false;
      if (event !== '' && i.event !== event) return false;
      return true;
    })
    setDisplayedIncome(filteredIncomes);
  },[event, team]);

  useEffect(() => {
    const filteredOutcomes = dbOutcomes && dbOutcomes.filter(i => {
      if (team !== '' && i.team !== team) return false;
      if (event !== '' && i.event !== event) return false;
      if (founding !== '' && i.foundingSource !== founding) return false;
      if (category !== '' && i.outcomeCategory !== event) return false;
      return true;
    })
    setDisplayedOutcome(filteredOutcomes);
  },[event, team, founding, category]);


  const editedDataHandler = (value) => {
    const editedData = value === 'Przychody' ? 'income' : 'outcome';
    setEditedData(editedData)
  }

  const saveIncome = async () => {
    await axios.put('/incomes.json', incomesInDb);
    await getTeamsWithAccountState();
    setChangesToSave(false);
  }

  const saveOutcome = async () => {
    await axios.put('/outcomes.json', outcomesInDb);
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

  const filtersToIncomes = (
    <>
    <TextField
    style={{width: '30%', marginTop: '16px'}}
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
    style={{width: '30%', marginTop: '16px'}}
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
    style={{width: '20%', marginTop: '16px'}}
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
    style={{width: '20%', marginTop: '16px'}}
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
    style={{width: '20%', marginTop: '16px'}}
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
    style={{width: '20%', marginTop: '16px'}}
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
    <div>
      <header>
        <TextField
        style={{width: '81%', marginTop: '16px'}}
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
        {editedData === 'income' ? filtersToIncomes : filtersToOutcomes}
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
          />
        </section>
      </main>
    </div>
  );
};

export default Edit;
