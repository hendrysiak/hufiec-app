import { FormControl, MenuItem, Select, TextField } from '@material-ui/core';
import CheckIcon from '@material-ui/icons/Check';
import ClearIcon from '@material-ui/icons/Clear';
import DeleteForeverIcon from '@material-ui/icons/DeleteForever';
import EditIcon from '@material-ui/icons/Edit';
import React, { useEffect, useState } from 'react';

import { editOutcome } from 'helpers/editing-db.handler';
import { FinanceMethod, FoundingSources, OutcomeCategory } from 'models/global.enum';
import { OutcomeDb, OutcomesWithFinanceMethod } from 'models/income.models';

import classes from './Outcome.module.css';
import { useSelector } from 'react-redux';
import { RootState } from 'store/models/rootstate.model';

export const Outcome = ({ outcome } : {outcome: OutcomeDb[]}): JSX.Element => {
  console.log(outcome);
  const teamsList = useSelector((state: RootState) => state.income.registry);
  const codesList = useSelector((state: RootState) => state.income.codes);
  // const [allControl, setAllControl] = useState<OutcomeDb>();
  const [editCash, setEditCash] = useState<string | number | null>(null);
  const [editTitle, setEditTitle] = useState<string | null>(null);
  const [editDateOfBook, setEditDateOfBook] = useState<Date | string | null>(null);
  const [editImportDate, setEditImportDate] = useState<Date | string | null>(null);
  const [editFinanceMethod, setEditFinanceMethod] = useState<FinanceMethod>();
  const [editOutcomeCategory, setEditOutcomeCategory] = useState<OutcomeCategory | null>(null);
  const [editTeam, setEditTeam] = useState<string | null>(null);
  const [editEvent, setEditEvent] = useState<string | null>(null);
  const [editFoundingSources, setEditFoundingSources] = useState<FoundingSources | null>(null);
  // const [testTS, setTestTS] = useState<OutcomesWithFinanceMethod>();
  const [testTS, setTestTS] = useState<OutcomesWithFinanceMethod>();
  // const [editInvoice, setEditInvoice] = useState<string | null>(null);
  // const [editFinanceMethod, setEditFinanceMethod] = useState<string>('');
  const [editBilingNr, setEditBilingNr] = useState<string>('');
  const [editId, setEditId] = useState<string | null>(null);

  useEffect(() => {
    setEditFinanceMethod('');
  },[])
  const handleAcceptEdit = () => {
    if (typeof editCash === 'number' 
      && editTitle 
      && editDateOfBook 
      && editImportDate 
      && editId 
      && editFinanceMethod) {
      const objOutcome = {
        cash: Number(editCash),
        title: editTitle,
        dateOfBook: editDateOfBook,
        importDate: editImportDate,
        financeMethod: editFinanceMethod,
        outcomeCategory: editOutcomeCategory,
        foundingSource: editFoundingSources,
        team: editTeam,
        event: editEvent,
        bilingNr: editBilingNr,
        id: editId,
      };
      // editOutcome(objOutcome);
      return;
    }
    alert('uzupełnij wymagane dane');
  };

  const handleClearEdit = (): void => {
    const editElement = outcome.find(el => el.id === editId);
    if ((
      editElement?.cash !== editCash  
      || editElement?.team !== editTeam  
      || editElement?.title !== editTitle) 
      && !window.confirm('zmiany zostaną usunięte')) return;
    setEditCash(null);
    setEditTeam(null);
    setEditEvent(null);
    setEditTitle(null);
    setEditId(null);
  };

  const handleEdit = (id: string) => {
    const item = outcome.find(el => el.id === id);
    item?.cash && setEditCash(item.cash);
    setTestTS({
      cash: item?.cash ? item?.cash : 0,
      dateOfBook: item?.dateOfBook ? item?.dateOfBook : '',
      financeMethod: item?.financeMethod ? item?.financeMethod : FinanceMethod.Transfer, // we can't have undefined/null/ empty string ?
      importDate: item?.importDate ? item?.importDate : '',
      title: item?.title ? item?.title : '',
    });
    setEditId(id);
    // if (editId !== null 
    //     && !window
    //       .confirm(`Już modyfikujesz jakiś wpis. 
    //         \nNa pewno zmienć? 
    //         \nJeżeli coś zmieniałeś, zostanie anulowane.`)) return;
    // const el = outcome.find(el => el.id === id);
    // el?.cash && setEditCash(el.cash);
    // el?.team && setEditTeam(el.team);
    // el?.event && setEditEvent(el.event);
    // el?.title && setEditTitle(el.title);
    // el?.financeMethod 
    //   && setEditFinanceMethod(el.financeMethod);
    // el?.outcomeCategory 
    //   && setEditOutcomeCategory(el.outcomeCategory);
    // el?.foundingSource
    //   && setEditFoundingSources(el.foundingSource);
    // el?.dateOfBook && setEditDateOfBook(el.dateOfBook);
    // el?.importDate && setEditImportDate(el.importDate);
    // el?.bilingNr && setEditBilingNr(el.bilingNr);

    // setAllControl({
    //   cash: el?.cash ? el.cash : 0,
    //   title: el?.title ? el.title : '',
    //   dateOfBook: el?.dateOfBook ? el.dateOfBook : '',
    //   importDate: el?.importDate ? el.importDate : '',
    //   financeMethod: el?.financeMethod ? el.financeMethod : null,
    //   outcomeCategory: el?.outcomeCategory ? el.outcomeCategory : null,
    //   foundingSource: el?.foundingSource ? el.foundingSource : null,
    //   team: el?.team ? el.team : null,
    //   event: el?.event ? el.event : null,
    //   bilingNr: el?.bilingNr ? el.bilingNr : null,
    //   id: editId? editId : '',
    // })
  };

  // const onChangeTest = () => {

  // }

  // useEffect(() => {
    
  // },[])
  

  const handleChange = (el: string, e: React.FormEvent<HTMLInputElement | HTMLTextAreaElement>): void => {
    const target = e.target as HTMLInputElement;
    console.log(target, el);
    console.log(testTS);
    setTestTS((prev: any) => {
      return ({
        ...prev,
        [el]: target.value,
      });
    });
    console.log(testTS)
    // switch (el) 
    // {
    //   case 'cash':
    //     setEditCash(target.value);
    //     break;
    //   case 'title':
    //     setEditTitle(target.value);
    //     break;
    //   case 'team':
    //     setEditTeam(target.value);
    //     break;
    //   case 'bilingNr':
    //     setEditBilingNr(target.value);
    //     break;
    //   // case 'financeMethod':
    //   //   setEditFinanceMethod(target.value);
    //   //   break;
    //   // case 'kategoryOutcome':
    //   //   setEditOutcomeCategory(target.value);
    //   //   break;
    //   // case 'year':
    //   //   setEditYear(target.value);
    //   //   break;
    //   case 'event':
    //     setEditEvent(target.value);
    //     break;
    //   default:
    //     return;
    // }
  };

  const test = (event: React.ChangeEvent<any>): void => {
    const target = event.target.value as OutcomeCategory;
    event.target.value && setEditOutcomeCategory(target);
  };
  const handleChangeFinanceMethod = (event: React.ChangeEvent<any>): void => {
    const target = event.target.value as FinanceMethod;
    event.target.value && setEditFinanceMethod(target);
  };
  const handleChangeFounding = (event: React.ChangeEvent<any>): void => {
    const target = event.target.value as FoundingSources;
    event.target.value && setEditFoundingSources(target);
  };

  return (
    <ul style={{ width: '100%' }}>
      <li className={`${classes.firstLi} ${classes.li}`}>
        <p className={classes.edit}>Edytuj</p>
        <p className={classes.lp}>LP</p>
        <p className={classes.bilingNr}>NR faktury</p>
        <p className={classes.cash}>Kwota</p>
        <p className={classes.financeMethod}>Sposób finansowania</p>
        <p className={classes.outcomeCategory}>Kategoria wydatku</p>
        <p className={classes.foundingSource}>Źródło</p>
        <p className={classes.team}>Jednostka</p>
        <p className={classes.code}>Kod Imprezy (automatycznie)</p>
        <p className={classes.title}>Pełny tytuł</p>
      </li>
      {outcome?.map((el, index: number) => {
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
                  <TextField 
                    classes={{ root: classes.input }} 
                    className={classes.lp} 
                    defaultValue={index} 
                    disabled />
                </div>
                <div className={classes.bilingNr}>
                  <TextField 
                    onChange={(e) => handleChange('bilingNr', e)} 
                    className={classes.input} 
                    value={testTS?.bilingNr ? testTS.bilingNr : el.bilingNr ? el.bilingNr : ''} />
                </div>
                <div className={classes.cash}>
                  <TextField 
                    onChange={(e) => handleChange('cash', e)} 
                    className={classes.input} 
                    value={testTS?.cash ? testTS.cash : el.cash ? el.cash : ''} />
                </div>
                <div className={classes.financeMethod}>
                  <FormControl className={classes.input}>
                    <Select
                      labelId="demo-simple-select-label"
                      id="demo-simple-select"
                      value={testTS?.financeMethod ? testTS.financeMethod : 'brak'}
                      onChange={handleChangeFinanceMethod}
                    >
                      <MenuItem value={'transfer'}>transfer</MenuItem>
                      <MenuItem value={'cash'}>cash</MenuItem>
                    </Select>
                  </FormControl>
                </div>
                <div className={classes.outcomeCategory}>
                  <FormControl className={classes.input}>
                    <Select
                      labelId="demo-simple-select-label"
                      id="demo-simple-select"
                      value={testTS?.outcomeCategory ? testTS.outcomeCategory : 'brak'}
                      onChange={test}
                    >
                      <MenuItem value={'materiały'}>materiały</MenuItem>
                      <MenuItem value={'zakwaterowanie'}>zakwaterowanie</MenuItem>
                      <MenuItem value={'nagrody'}>nagrody</MenuItem>
                      <MenuItem value={'bilety'}>bilety</MenuItem>
                      <MenuItem value={'wyżywienie'}>wyżywienie</MenuItem>
                      <MenuItem value={'konserwacja'}>konserwacja</MenuItem>
                      <MenuItem value={'media'}>media</MenuItem>
                      <MenuItem value={'składki'}>składki</MenuItem>
                      <MenuItem value={'brak'}>brak</MenuItem>
                    </Select>
                  </FormControl>
                </div>
                <div className={classes.foundingSource}>
                  <FormControl className={classes.input}>
                    <Select
                      labelId="demo-simple-select-label"
                      id="demo-simple-select"
                      value={editFoundingSources ? editFoundingSources : 'brak'}
                      onChange={handleChangeFounding}
                    >
                      <MenuItem value={'1 %'}>1 %</MenuItem>
                      <MenuItem value={'dotacja'}>dotacja</MenuItem>
                      <MenuItem value={'konto drużyny'}>konto drużyny</MenuItem>
                      <MenuItem value={'wpłaty własne'}>wpłaty własne</MenuItem>
                      <MenuItem value={'własne środki'}>własne środki</MenuItem>
                      <MenuItem value={'inne'}>inne</MenuItem>
                    </Select>
                  </FormControl>
                </div>
                <div className={classes.team}>
                  <FormControl className={classes.input}>
                    <Select
                      labelId="demo-simple-select-label"
                      id="demo-simple-select"
                      value={editFoundingSources ? editFoundingSources : 'brak'}
                      onChange={handleChangeFounding}
                    >
                      {/* {console.log(Object.keys(teamsList))} */}
                      {teamsList && Object.keys(teamsList).map((el, index: number) => <MenuItem key={index} value={el}>{el}</MenuItem>)}
                      {/* // <MenuItem value={'1 %'}>1 %</MenuItem>
                      // <MenuItem value={'dotacja'}>dotacja</MenuItem>
                      // <MenuItem value={'konto drużyny'}>konto drużyny</MenuItem>
                      // <MenuItem value={'wpłaty własne'}>wpłaty własne</MenuItem>
                      // <MenuItem value={'własne środki'}>własne środki</MenuItem>
                      // <MenuItem value={'inne'}>inne</MenuItem> */}
                    </Select>
                  </FormControl>
                </div>
                {/* <div className={classes.team}>
                  <TextField onChange={(e) => handleChange('team', e)} className={classes.input} value={testTS?.team ? testTS.team : el.team ? el.team : '' } />
                </div> */}
                <div className={classes.code}>
                  <FormControl className={classes.input}>
                    <Select
                      labelId="demo-simple-select-label"
                      id="demo-simple-select"
                      value={editFoundingSources ? editFoundingSources : 'brak'}
                      onChange={handleChangeFounding}
                    >
                      {/* {console.log(Object.keys(teamsList))} */}
                      {codesList && Object.values(codesList).map((el, index: number) => <MenuItem key={index} value={el.code}>{el.code}</MenuItem>)}
                      {/* // <MenuItem value={'1 %'}>1 %</MenuItem>
                      // <MenuItem value={'dotacja'}>dotacja</MenuItem>
                      // <MenuItem value={'konto drużyny'}>konto drużyny</MenuItem>
                      // <MenuItem value={'wpłaty własne'}>wpłaty własne</MenuItem>
                      // <MenuItem value={'własne środki'}>własne środki</MenuItem>
                      // <MenuItem value={'inne'}>inne</MenuItem> */}
                    </Select>
                  </FormControl>
                </div>
                {/* <div className={classes.code}>
                  <TextField onChange={(e) => handleChange('event', e)} className={classes.input} value={testTS?.event ? testTS.event : el.event ? el.event : '' } />
                </div> */}
                <div className={classes.title}>
                  <TextField onChange={(e) => handleChange('title', e)} className={classes.input} value={testTS?.title ? testTS.title : el.title ? el.title : ''} /> 
                </div>
              </>
              :
              <>
                <p className={classes.lp}> {index}</p>
                <p className={classes.bilingNr}> {el.bilingNr ? el.bilingNr : ''} </p>
                <p className={classes.cash}> {el.cash} </p>
                <p className={classes.financeMethod}> {el.financeMethod ? el.financeMethod : ''} </p>
                <p className={classes.outcomeCategory}>{el.catOut}</p>
                <p className={classes.foundingSource}>{el.foundingSource}</p>
                <p className={classes.team}> {el.team}</p>
                <p className={classes.code}> {el.event}</p>
                <p className={classes.title}> {el.title}</p>
              </>}
          </li>
        );})}
    </ul>
  );
};