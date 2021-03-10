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
  const [editData, setEditData] = useState<OutcomesWithFinanceMethod>({
    cash: outcome[0].cash,
    dateOfBook: outcome[0].dateOfBook,
    financeMethod: outcome[0].financeMethod,
    importDate: outcome[0].importDate,
    title: outcome[0].title,
  });
  const [editId, setEditId] = useState<string | null>(null);

  const handleAcceptEdit = () => {
    
  };
  const handleClearEdit = (id: string) => {
    if (!window.confirm('Wszystkie dane zostaną cofnięte do wartości sprzed rozpoczęcia edycji.\nJesteś pewien?')) return;
    const item = outcome.find(el => el.id === id);
    setEditData({
      cash: item?.cash ? item?.cash : 0,
      dateOfBook: item?.dateOfBook ? item?.dateOfBook : '',
      financeMethod: item?.financeMethod ? item?.financeMethod : FinanceMethod.Transfer, // we can't have undefined/null/ empty string ?
      importDate: item?.importDate ? item?.importDate : '',
      title: item?.title ? item?.title : '',
    });
    setEditId(null);
  };

  const handleEdit = (id: string) => {
    const item = outcome.find(el => el.id === id);
    setEditData({
      cash: item?.cash ? item?.cash : 0,
      dateOfBook: item?.dateOfBook ? item?.dateOfBook : '',
      financeMethod: item?.financeMethod ? item?.financeMethod : FinanceMethod.Transfer, // we can't have undefined/null/ empty string ?
      importDate: item?.importDate ? item?.importDate : '',
      title: item?.title ? item?.title : '',
    });
    setEditId(id);
  };

  const handleChange = (el: string, e: React.FormEvent<HTMLInputElement | HTMLTextAreaElement | EventTarget & { name?: string | undefined; value: unknown; }> ): void => {
    const target = e.target as HTMLInputElement ;
    setEditData((prevState: OutcomesWithFinanceMethod) => {
      return ({
        ...prevState,
        [el]: target.value,
      });
    });
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
        return (
          <li key={index} className={`${classes.li} ${editId === el.id ? classes.liEdit : ''}`}>
            <div className={`${classes.editItem} ${classes.edit}`}>
              {editId === el.id ? <div><CheckIcon className={classes.pointer} onClick={handleAcceptEdit}/><ClearIcon onClick={() => handleClearEdit(el.id)}/> </div> : <EditIcon className={classes.pointer} onClick={() => handleEdit(el.id)}/>}
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
                    value={editData?.bilingNr ? editData.bilingNr : el.bilingNr ? el.bilingNr : ''} />
                </div>
                <div className={classes.cash}>
                  <TextField 
                    type="number"
                    onChange={(e) => handleChange('cash', e)} 
                    className={classes.input} 
                    value={editData?.cash ? editData.cash : el.cash ? el.cash : ''} />
                </div>
                <div className={classes.financeMethod}>
                  <FormControl className={classes.input}>
                    <Select
                      labelId="demo-simple-select-label"
                      id="demo-simple-select"
                      value={editData?.financeMethod ? editData.financeMethod : 'brak'}
                      onChange={(e) => handleChange('financeMethod', e)}
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
                      value={editData?.outcomeCategory ? editData.outcomeCategory : 'brak'}
                      onChange={(e) => handleChange('outcomeCategory', e)}
                    >
                      <MenuItem value={'materiały'}>materiały</MenuItem>
                      <MenuItem value={'zakwaterowanie'}>zakwaterowanie</MenuItem>
                      <MenuItem value={'nagrody'}>nagrody</MenuItem>
                      <MenuItem value={'bilety'}>bilety</MenuItem>
                      <MenuItem value={'wyżywienie'}>wyżywienie</MenuItem>
                      <MenuItem value={'konserwacja'}>konserwacja</MenuItem>
                      <MenuItem value={'media'}>media</MenuItem>
                      <MenuItem value={'składki'}>składki</MenuItem>
                    </Select>
                  </FormControl>
                </div>
                <div className={classes.foundingSource}>
                  <FormControl className={classes.input}>
                    <Select
                      labelId="demo-simple-select-label"
                      id="demo-simple-select"
                      value={editData?.foundingSources ? editData.foundingSources : 'brak'}
                      onChange={(e) => handleChange('foundingSources', e)}
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
                      value={editData?.team ? editData.team : 'brak'}
                      onChange={(e) => handleChange('team', e)}
                    >
                      {teamsList && Object.keys(teamsList).map((el, index: number) => <MenuItem key={index} value={el}>{el}</MenuItem>)}
                    </Select>
                  </FormControl>
                </div>
                <div className={classes.code}>
                  <FormControl className={classes.input}>
                    <Select
                      labelId="demo-simple-select-label"
                      id="demo-simple-select"
                      value={editData?.code ? editData.code : 'brak'}
                      onChange={(e) => handleChange('code', e)}
                    >
                      {codesList && Object.values(codesList).map((el, index: number) => <MenuItem key={index} value={el.code}>{el.code}</MenuItem>)}
                    </Select>
                  </FormControl>
                </div>
                <div className={classes.title}>
                  <TextField onChange={(e) => handleChange('title', e)} className={classes.input} value={editData?.title ? editData.title : el.title ? el.title : ''} /> 
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