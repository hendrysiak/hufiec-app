import { IncomeDb } from 'models/income.models';
import React, { useState } from 'react';
import classes from './Income.module.css';
import EditIcon from '@material-ui/icons/Edit';
import CheckIcon from '@material-ui/icons/Check';
import ClearIcon from '@material-ui/icons/Clear';
import { TextField } from '@material-ui/core';
import DeleteForeverIcon from '@material-ui/icons/DeleteForever';
import { editIncome } from 'helpers/editing-db.handler';

export const Income = ({income} : {income: IncomeDb[]}): JSX.Element => {
  const [editCash, setEditCash] = useState<string | number | null>(null);
  const [editTeam, setEditTeam] = useState<string | null>(null);
  const [editName, setEditName] = useState<string | null>(null);
  const [editSurname, setEditSurname] = useState<string | null>(null);
  const [editEvent, setEditEvent] = useState<string | null>(null);
  const [editYear, setEditYear] = useState<string | number | null>(null);
  const [editTitle, setEditTitle] = useState<string | null>(null);
  const [editImportDate, setEditImportDate] = useState<Date | string | null>(null);
  const [editDateOfBook, setEditDateOfBook] = useState<Date | string |null>(null);
  const [editInvoice, setEditInvoice] = useState<string | null>(null);
  const [wayFinancing, setWayFinancing] = useState<string | null>(null);
  const [kategoryOutcome, setKategoryOutcome] = useState<string | null>(null);
  const [editId, setEditId] = useState<string>('');

  const handleAcceptEdit = () => {
    if(editId !== null
      && editCash !== null
      && editYear !== null
      && editSurname !== null
      && editSurname !== null
      && editTitle !== null
      && editEvent !== null
      && editImportDate !== null
      && editDateOfBook !== null) {
      const objData = {
        id: editId,
        cash: Number(editCash),
        year: Number(editYear),
        name: editName,
        surname: editSurname,
        title: editTitle,
        event: editEvent,
        team: editTeam,
        importDate: editImportDate,
        dateOfBook: editDateOfBook,
      };
      console.log(objData);
      editIncome(objData);
    }
  }

  const handleClearEdit = () => {
    const editElement = income.find(el => el.id === editId);
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
  };

  const handleEdit = (id: string) => {

    if (editId !== '' && !window.confirm('Już modyfikujesz jakiś wpis. \nNa pewno zmienć? \nJeżeli coś zmieniałeś, zostanie anulowane.')) return
    setEditId(id);
    const el = income.find(el => el.id === id);

    el && setEditCash(el.cash);
    el && setEditTeam(el.team);
    el && setEditName(el.name);
    el && setEditSurname(el.surname);
    el && setEditEvent(el.event);
    el && setEditYear(el.year);
    el && setEditTitle(el.title);
    el && setEditImportDate(el.importDate);
    el && setEditDateOfBook(el.dateOfBook);


    // const obj = el && {
    //   name: el.name,
    //   surname: el.surname,
    //   id: el.id,
    //   importDate: el.importDate,
    //   team: el.team,
    //   cash: el.cash,
    //   event: el.event,
    //   title: el.title,
    //   dateOfBook: el.dateOfBook,
    //   year: el.year
    // }
    // el && setEditableRow(obj);
  };

  const handleChange = (el: string, e: React.FormEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const target = e.target as HTMLInputElement;
    switch (el) 
    {
      case 'cash':
        setEditCash(target.value);
        break;
      case 'title':
        setEditTitle(target.value);
        break;
      case 'team':
        setEditTeam(target.value);
        break;
      case 'name':
        setEditName(target.value);
        break;
      case 'surname':
        setEditSurname(target.value);
        break;
      case 'year':
        setEditYear(target.value);
        break;
      case 'event':
        setEditEvent(target.value);
        break;
      default:
        return;
    }
  };

  return (
    <ul>
      <li className={`${classes.firstLi} ${classes.li}`}>
        <p className={classes.edit}>Edytuj</p>
        <p className={classes.lp}>LP</p>
        <p className={classes.cash}>Kwota</p>
        <p className={classes.name}>Imię</p>
        <p className={classes.surname}>Nazwisko</p>
        <p className={classes.team}>Jednostka</p>
        <p className={classes.code}>Kod Imprezy (automatycznie)</p>
        <p className={classes.year}>Rok</p>
        <p className={classes.title}>Pełny tytuł</p>
      </li>
      {income?.map((el, index: number) => {
        // LP assigned when render list, always from 1 to upwards
        return (
          <li key={index} className={`${classes.li} ${editId === el.id ? classes.liEdit : ''}`}>
            <div className={`${classes.editItem} ${classes.edit}`}>
              {editId === el.id ? <div><CheckIcon className={classes.pointer} onClick={handleAcceptEdit}/><ClearIcon onClick={handleClearEdit}/> </div> : <EditIcon className={classes.pointer} onClick={() => handleEdit(el.id)}/>}
              <DeleteForeverIcon className={classes.pointer}/>
            </div>
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
                <div className={classes.team}>
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
                <p className={classes.team}> {el.team}</p>
                <p className={classes.code}> {el.event}</p>
                <p className={classes.year}> {el.year}</p>
                <p className={classes.title}> {el.title}</p>
              </>
            }
          </li>
        );})}
    </ul>
  )
}