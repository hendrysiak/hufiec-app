import { TextField, MenuItem, Input } from '@material-ui/core';

import DeleteForeverIcon from '@material-ui/icons/DeleteForever';
import EditIcon from '@material-ui/icons/Edit';
import { MaterialUiPickersDate } from '@material-ui/pickers/typings/date';
import React, { useState, useEffect } from 'react';
import CheckIcon from '@material-ui/icons/Check';
import { useSelector } from 'react-redux';
import ClearIcon from '@material-ui/icons/Clear';
import axios from 'axios-income';
import {
  addIncome,
  addOutcome,
  deleteIncome,
  deleteOutcome,
  editIncome,
  editOutcome,
} from 'helpers/editing-db.handler';
import {
  BudgetEntry,
  FinanceMethod,
  FoundingSources,
  OutcomeCategory,
} from 'models/global.enum';
import {
  IncomeDb,
  IncomesWithImportDate,
  OutcomeDb,
  OutcomesWithEvent,
} from 'models/income.models';
import { LogOut } from 'shared/LogOut/LogOut';
import Navigation from 'shared/Navigation/Navigation';
import Filters from 'shared/TableEditor/Filters';
import TableEditor from 'shared/TableEditor/TableEditor';
import * as actions from 'store/actions/index';
import { RootState } from 'store/models/rootstate.model';
import store from 'store/store';

import classes from './Edit.module.css';
import Team from '../Team/Team';


const Edit = (): JSX.Element => {
  const isAuth = useSelector((state: RootState) => state.user.isAuthenticated);
  const dbIncomes = useSelector((state: RootState) => state.income.dbIncomes);
  const dbOutcomes = useSelector((state: RootState) => state.income.dbOutcomes);
  const importDates = useSelector(
    (state: RootState) => state.income.importDates
  );

  const [editedData, setEditedData] = useState(BudgetEntry.Income);

  const [displayedIncome, setDisplayedIncome] = useState<IncomeDb[]>([]);
  const [displayedOutcome, setDisplayedOutcome] = useState<OutcomeDb[]>([]);

  const [selectedDate, setSelectedDate] = useState<MaterialUiPickersDate>(
    new Date()
  );
  const [editableRow, setEditableRow] = useState<IncomeDb>();

  //filters
  const [event, setEvent] = useState('Brak');
  const [team, setTeam] = useState('Brak');
  const [founding, setFounding] = useState('Brak');
  const [category, setCategory] = useState<OutcomeCategory | 'Brak'>('Brak');
  const [name, setName] = useState('');
  const [surname, setSurname] = useState('');
  const [editedImportDates, setEditedImportDates] = useState<Date[]>([]);

  const [editedIndex, setEditedIndex] = useState(-1);
  const [editId, setEditId] = useState<string>('');
  const [useDate, setUseDate] = useState(true);
  // editableRow
  const [editCash, setEditCash] = useState<string | number | null>(null);
  const [editTeam, setEditTeam] = useState<string | null>(null);
  const [editName, setEditName] = useState<string | null>(null);
  const [editSurname, setEditSurname] = useState<string | null>(null);
  const [editEvent, setEditEvent] = useState<string | null>(null);
  const [editYear, setEditYear] = useState<string | number | null>(null);
  const [editTitle, setEditTitle] = useState<string | null>(null);

  useEffect(() => {
    const token = localStorage.getItem('token');
    token && !isAuth && store.dispatch(actions.reduxIsAuthentication(true));
  }, []);

  useEffect(() => {
    dbIncomes && setDisplayedIncome(dbIncomes);
    dbOutcomes && setDisplayedOutcome(dbOutcomes);
  }, [dbIncomes, dbOutcomes]);

  useEffect(() => {
    const filteredIncomes = dbIncomes && dbIncomes.filter(i => {
      if (useDate && selectedDate && new Date(i.importDate).toLocaleDateString() !== selectedDate.toLocaleDateString()) return false;
      if (team !== 'Brak' && i.team !== team) return false;
      if (event !== 'Brak' && i.event !== event) return false;
      if (name !== '' && !(new RegExp(name, 'gi').test(`${i.name}`))) return false;
      if (surname !== '' && !(new RegExp(surname, 'gi').test(`${i.surname}`))) return false;
      return true;
    });
    filteredIncomes && setDisplayedIncome(filteredIncomes);
  },[event, team, selectedDate, dbIncomes, useDate, editedData, name, surname, editedImportDates]);

  useEffect(() => {
    const filteredOutcomes = dbOutcomes && dbOutcomes.filter(i => {
      if (useDate && selectedDate && new Date(i.importDate).toLocaleDateString() !== selectedDate.toLocaleDateString()) return false;
      if (team !== 'Brak' && i.team !== team) return false;
      if (event !== 'Brak' && i.event !== event) return false;
      if (founding !== 'Brak' && i.foundingSource !== founding) return false;
      if (category !== 'Brak' && i.outcomeCategory !== event) return false;
      return true;
    });
    filteredOutcomes && setDisplayedOutcome(filteredOutcomes);
  },[event, team, founding, category, selectedDate, dbOutcomes, useDate, editedData, editedImportDates]);

  useEffect(() => {
    importDates && setEditedImportDates(importDates);
  }, [importDates]);

  // const filterIncomes = (incomes: IncomeDb[]) => {
  //   return incomes.filter(i => {
  //     if (useDate && selectedDate && new Date(i.dateOfBook).toLocaleDateString() !== selectedDate.toLocaleDateString()) return false;
  //     if (team !== 'Brak' && i.team !== team) return false;
  //     if (event !== 'Brak' && i.event !== event) return false;
  //     if (founding !== 'Brak' && i.foundingSource !== founding) return false;
  //     if (category !== 'Brak' && i.outcomeCategory !== event) return false;
  //     return true;
  //   });
  // };

  // const filterOutcomes = (outcomes: OutcomeDb[]) => {
  //   return outcomes.filter(o => {
  //     if (useDate && selectedDate && new Date(o.dateOfBook).toLocaleDateString() !== selectedDate.toLocaleDateString()) return false;
  //     if (team !== 'Brak' && o.team !== team) return false;
  //     if (event !== 'Brak' && o.event !== event) return false;
  //     if (founding !== 'Brak' && o.foundingSource !== founding) return false;
  //     if (category !== 'Brak' && o.outcomeCategory !== event) return false;
  //     return true;
  //   });
  // };

  // const editedDataHandler = (value: string) => {
  //   const editedData =
  //     value === 'Przychody' ? BudgetEntry.Income : BudgetEntry.Outcome;
  //   setEditedData(editedData);
  // };

  // const handleEdit = (
  //   index: number,
  //   data: { key: string; value: string | number }
  // ) => {
  //   const usedData: (IncomeDb | OutcomeDb)[] =
  //     editedData === BudgetEntry.Income
  //       ? [...displayedIncome]
  //       : [...displayedOutcome];
  //   usedData[index][data.key] = data.value;

  //   editedData === BudgetEntry.Income
  //     ? setDisplayedIncome(usedData as IncomeDb[])
  //     : setDisplayedOutcome(usedData as OutcomeDb[]);
  // };

  // const handleClose = (index: number): void => {
  //   editedData === BudgetEntry.Income
  //     ? editIncome(displayedIncome[index])
  //     : editOutcome(displayedOutcome[index]);
  //   setEditedIndex(-1);
  // };

  // const handleDelete = (id: string) => {
  //   editedData === BudgetEntry.Income ? deleteIncome(id) : deleteOutcome(id);
  // };

  // const addNewPosition = (): void => {
  //   const currentDate = new Date();

  //   if (editedData === BudgetEntry.Income) {
  //     const newIncome: IncomesWithImportDate = {
  //       cash: 0,
  //       event: null,
  //       importDate: currentDate,
  //       name: null,
  //       surname: null,
  //       team: '',
  //       title: '',
  //       year: currentDate.getFullYear(),
  //       dateOfBook: currentDate,
  //     };

  //     addIncome(newIncome);
  //   } else {
  //     const newOutcome: OutcomesWithEvent = {
  //       cash: 0,
  //       event: null,
  //       importDate: currentDate,
  //       bilingNr: null,
  //       foundingSource: FoundingSources.Other,
  //       outcomeCategory: OutcomeCategory.Fee,
  //       team: '',
  //       title: '',
  //       year: currentDate.getFullYear(),
  //       financeMethod: FinanceMethod.Cash,
  //       dateOfBook: currentDate,
  //     };

  //     addOutcome(newOutcome);
  //   }

  //   const newImportDate = [...editedImportDates];
  //   newImportDate.push(currentDate);
  //   setEditedImportDates(newImportDate);
  //   axios.put('/importDates.json', newImportDate);
  // };

  const handleEdit = (id: string) => {

    if (editId !== '' && !window.confirm('Już modyfikujesz jakiś wpis. \nChcesz anulować tamte zmiany i zminienić na edycje tego wiersza?')) return
    setEditId(id);
    const el = displayedIncome.find(el => el.id === id);

    el && setEditCash(el.cash);
    el && setEditTeam(el.team);
    el && setEditName(el.name);
    el && setEditSurname(el.surname);
    el && setEditEvent(el.event);
    el && setEditYear(el.year);
    el && setEditTitle(el.title);



    const obj = el && {
      name: el.name,
      surname: el.surname,
      id: el.id,
      importDate: el.importDate,
      team: el.team,
      cash: el.cash,
      event: el.event,
      title: el.title,
      dateOfBook: el.dateOfBook,
      year: el.year
    }
    el && setEditableRow(obj);
  };

  const handleChange = (el: any, e: any) => {
    switch (el) 
    {
      case 'cash':
        setEditCash(e.target.value);
        break;
      case 'title':
        setEditTitle(e.target.value);
        break;
      case 'team':
        setEditTeam(e.target.value);
        break;
      case 'name':
        setEditName(e.target.value);
        break;
      case 'surname':
        setEditSurname(e.target.value);
        break;
      case 'year':
        setEditYear(e.target.value);
        break;
      case 'event':
        setEditEvent(e.target.value);
        break;
      default:
        return;
    }
  };

  const handleAcceptEdit = () => {
    console.group()
    console.log(editCash)
    console.log(editTitle)
    console.log(editName)
    console.log(editSurname)
    console.log(editYear)
    console.log(editEvent)
  }

  const handleClearEdit = () => {
    const editElement = displayedIncome.find(el => el.id === editId);
    if ((editElement?.name !== editName 
      || editElement?.surname !== editSurname 
      || editElement?.cash !== editCash  
      || editElement?.team !== editTeam  
      || editElement?.title !== editTitle) 
      && !window.confirm('zmiany zostaną usunięte')) return
    setEditCash(null);
    setEditTeam(null);
    setEditName(null);
    setEditSurname(null);
    setEditEvent(null);
    setEditYear(null);
    setEditTitle(null);
    setEditId('');
  }

  return (
    <>
      <LogOut />
      <Navigation />
      <Filters
        editedData={editedData}
        selectedDate={selectedDate}
        setSelectedDate={setSelectedDate}
        category={category}
        setCategory={setCategory}
        event={event}
        setEvent={setEvent}
        founding={founding}
        setFounding={setFounding}
        team={team}
        setTeam={setTeam}
        name={name}
        setName={setName}
        surname={surname}
        setSurname={setSurname}
        useDate={useDate}
        setUseDate={setUseDate}
      />
      {/* <div>
        <header>
          <TextField
            style={{ width: '79%', marginTop: '16px' }}
            label="Co edytujesz?"
            value={editedData === 'income' ? 'Przychody' : 'Koszty'}
            onChange={(e) => editedDataHandler(e.target.value)}
            placeholder="Wybierz kod z listy"
            select={true}
            size="small"
            variant="outlined"
            margin="normal"
            SelectProps={{
              MenuProps: { disableScrollLock: true },
            }}
          >
            {['Przychody', 'Koszty'].map((item) => (
              <MenuItem key={item} value={item}>
                {item}
              </MenuItem>
            ))}
          </TextField>
        </header>

        <main>
          <section>
            <TableEditor
              editable={true}
              title={`Lista ${
                editedData === BudgetEntry.Income ? 'przychodów' : 'kosztów'
              } do edycji:`}
              info={editedData}
              editedIndex={editedIndex}
              rows={
                editedData === BudgetEntry.Income
                  ? displayedIncome
                  : displayedOutcome
              }
              onChange={handleEdit}
              onClose={handleClose}
              onDelete={handleDelete}
              onEdit={setEditedIndex}
              onAdd={addNewPosition}
            />
          </section>
        </main>
      </div> */}
      <ul>
        <li className={`${classes.firstLi} ${classes.li}`}>
          <p className={classes.edit}>Edytuj</p>
          <p className={classes.lp}>LP</p>
          <p className={classes.cash}>Kwota</p>
          <p className={classes.name}>Imię</p>
          <p className={classes.surname}>Nazwisko</p>
          <p className={classes.unit}>Jednostka</p>
          <p className={classes.code}>Kod Imprezy (automatycznie)</p>
          <p className={classes.year}>Rok</p>
          <p className={classes.title}>Pełny tytuł</p>
        </li>
        {displayedIncome?.map((el, index: number) => {
          // LP assigned when render list, always from 1 to upwards
          return (
            <li key={index} className={`${classes.li} ${editId === el.id ? classes.liEdit : ''}`}>
              <p className={`${classes.editItem} ${classes.edit}`}>
                {editId === el.id ? <div><CheckIcon className={classes.pointer} onClick={handleAcceptEdit}/><ClearIcon onClick={handleClearEdit}/> </div> : <EditIcon className={classes.pointer} onClick={() => handleEdit(el.id)}/>}
                <DeleteForeverIcon className={classes.pointer}/>
              </p>
              {editId === el.id ? 
                <>
                  <div className={classes.lp}>
                    <TextField classes={{root: classes.input}} className={classes.lp} defaultValue={index} disabled />
                  </div>
                  <div className={classes.cash}>
                    <TextField onChange={(e) => handleChange('cash', e)} className={classes.input} value={editCash ? editCash : el.cash} />
                  </div>
                  <div className={classes.name}>
                    <TextField onChange={(e) => handleChange('name', e)} className={classes.input} value={editName? editName: el.name}/>
                  </div>
                  <div className={classes.surname}>
                    <TextField onChange={(e) => handleChange('surname', e)} className={classes.input} value={editSurname ? editSurname : el.surname } />
                  </div>
                  <div className={classes.unit}>
                    <TextField onChange={(e) => handleChange('team', e)} className={classes.input} value={editTeam ? editTeam : el.unit } />
                  </div>
                  <div className={classes.code}>
                    <TextField onChange={(e) => handleChange('event', e)} className={classes.input} value={editEvent ? editEvent : el.event } />
                  </div>
                  <div className={classes.year}>
                    <TextField onChange={(e) => handleChange('year', e)} className={classes.input} value={editYear ? editYear : el.year } />
                  </div>
                  <div className={classes.title}>
                    <TextField onChange={(e) => handleChange('title', e)} className={classes.input} value={editTitle ? editTitle : el.title} /> 
                  </div>
                </>
                :
                <>
                  <p className={classes.lp}> {index}</p>
                  <p className={classes.cash}> {el.cash} </p>
                  <p className={classes.name}> {el.name} </p>
                  <p className={classes.surname}> {el.surname}</p>
                  <p className={classes.unit}> {el.team}</p>
                  <p className={classes.code}> {el.event}</p>
                  <p className={classes.year}> {el.year}</p>
                  <p className={classes.title}> {el.title}</p>
                </>
              }
            </li>
          );})}
          

      </ul>
      {console.log(displayedIncome)}
    </>
  );
};

export default Edit; 
// {`${el.cash} ${el.name} ${el.surname} ${el.team} ${el.title} ${el.event} ${el.team} ${el.importDate} ${el.year}`}