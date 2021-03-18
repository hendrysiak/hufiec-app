import { FormControl, MenuItem, Select, TextField } from '@material-ui/core';
import CheckIcon from '@material-ui/icons/Check';
import ClearIcon from '@material-ui/icons/Clear';
import DeleteForeverIcon from '@material-ui/icons/DeleteForever';
import EditIcon from '@material-ui/icons/Edit';
import React, { useEffect, useState } from 'react';

import { useSelector } from 'react-redux';

import { editOutcome } from 'helpers/editing-db.handler';
import { FinanceMethod, FoundingSources, OutcomeCategory } from 'models/global.enum';
import { OutcomeDb } from 'models/income.models';

import { RootState } from 'store/models/rootstate.model';

import classes from './Outcome.module.css';

export const Outcome = ({ outcome } : {outcome: OutcomeDb[]}): JSX.Element => {
  const teamsList = useSelector((state: RootState) => state.income.registry);
  const codesList = useSelector((state: RootState) => state.income.codes);
  const [editData, setEditData] = useState<OutcomeDb[]>(outcome);
  const [editIndex, setEditIndex] = useState<number>(-1);

  const handleAcceptEdit = () => {
    editOutcome(editData[editIndex]);
    setEditIndex(-1);
  };
  const handleClearEdit = () => {
    if (!window.confirm('Wszystkie dane zostaną cofnięte do wartości sprzed rozpoczęcia edycji.\nJesteś pewien?')) return;
    setEditIndex(-1);
  };

  const handleEdit = (index: number) => {
    setEditIndex(index);
  };

  const handleChange = (el: string, value: string | number): void => {
    const updatedData = [ ...editData ];
    updatedData[editIndex][el] = value;
    setEditData(updatedData);
    
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
          <li key={index} className={`${classes.li} ${index === editIndex ? classes.liEdit : ''}`}>
            <div className={`${classes.editItem} ${classes.edit}`}>
              {index === editIndex ? <div><CheckIcon className={classes.pointer} onClick={handleAcceptEdit}/><ClearIcon onClick={() => handleClearEdit()}/> </div> : <EditIcon className={classes.pointer} onClick={() => handleEdit(index)}/>}
              <DeleteForeverIcon className={classes.pointer}/>
            </div>
            {index === editIndex ? 
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
                    onChange={(e) => handleChange('bilingNr', e.target.value)} 
                    className={classes.input} 
                    value={editData[editIndex].bilingNr} />
                </div>
                <div className={classes.cash}>
                  <TextField 
                    type="number"
                    onChange={(e) => handleChange('cash', e.target.value)} 
                    className={classes.input} 
                    value={editData[editIndex].cash} />
                </div>
                <div className={classes.financeMethod}>
                  <FormControl className={classes.input}>
                    <TextField
                      value={editData[editIndex].financeMethod}
                      onChange={(e) => handleChange('financeMethod', e.target.value)}
                      select={true}
                      size="small"
                      variant="standard"
                      margin="normal"
                      SelectProps={{
                        MenuProps: { disableScrollLock: true },
                      }}
                    >
                      {/* <Select
                      labelId="demo-simple-select-label"
                      id="demo-simple-select"
                      value={editData[editIndex].financeMethod ? editData.financeMethod : 'brak'}
                      onChange={(e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => handleChange('financeMethod', e)}
                    > */}
                      <MenuItem value={'transfer'}>transfer</MenuItem>
                      <MenuItem value={'cash'}>cash</MenuItem>
                      {/* </Select>*/}
                    </TextField>
                  </FormControl>
                </div>
                <div className={classes.outcomeCategory}>
                  <FormControl className={classes.input}>
                    {/* <Select
                      labelId="demo-simple-select-label"
                      id="demo-simple-select"
                      value={editData[editIndex].outcomeCategory ? editData.outcomeCategory : 'brak'}
                      onChange={(e) => handleChange('outcomeCategory', e)}
                    > */}
                    <TextField
                      value={editData[editIndex].outcomeCategory}
                      onChange={(e) => handleChange('outcomeCategory', e.target.value)}
                      select={true}
                      size="small"
                      variant="standard"
                      margin="normal"
                      SelectProps={{
                        MenuProps: { disableScrollLock: true },
                      }}
                    >
                      <MenuItem value={'materiały'}>materiały</MenuItem>
                      <MenuItem value={'zakwaterowanie'}>zakwaterowanie</MenuItem>
                      <MenuItem value={'nagrody'}>nagrody</MenuItem>
                      <MenuItem value={'bilety'}>bilety</MenuItem>
                      <MenuItem value={'wyżywienie'}>wyżywienie</MenuItem>
                      <MenuItem value={'konserwacja'}>konserwacja</MenuItem>
                      <MenuItem value={'media'}>media</MenuItem>
                      <MenuItem value={'składki'}>składki</MenuItem>
                      {/* </Select> */}
                    </TextField>
                  </FormControl>
                </div>
                <div className={classes.foundingSource}>
                  <FormControl className={classes.input}>
                    <TextField
                      value={editData[editIndex].foundingSources}
                      onChange={(e) => handleChange('foundingSources', e.target.value)}
                      select={true}
                      size="small"
                      variant="standard"
                      margin="normal"
                      SelectProps={{
                        MenuProps: { disableScrollLock: true },
                      }}
                    >
                      <MenuItem value={'1 %'}>1 %</MenuItem>
                      <MenuItem value={'dotacja'}>dotacja</MenuItem>
                      <MenuItem value={'konto drużyny'}>konto drużyny</MenuItem>
                      <MenuItem value={'wpłaty własne'}>wpłaty własne</MenuItem>
                      <MenuItem value={'własne środki'}>własne środki</MenuItem>
                      <MenuItem value={'inne'}>inne</MenuItem>
                    </TextField>
                    {/* <Select
                      labelId="demo-simple-select-label"
                      id="demo-simple-select"
                      value={editData[editIndex].foundingSources ? editData.foundingSources : 'brak'}
                      onChange={(e) => handleChange('foundingSources', e)}
                    >
                      <MenuItem value={'1 %'}>1 %</MenuItem>
                      <MenuItem value={'dotacja'}>dotacja</MenuItem>
                      <MenuItem value={'konto drużyny'}>konto drużyny</MenuItem>
                      <MenuItem value={'wpłaty własne'}>wpłaty własne</MenuItem>
                      <MenuItem value={'własne środki'}>własne środki</MenuItem>
                      <MenuItem value={'inne'}>inne</MenuItem>
                    </Select> */}
                  </FormControl>
                </div>
                <div className={classes.team}>
                  <FormControl className={classes.input}>
                    {/* <Select
                      labelId="demo-simple-select-label"
                      id="demo-simple-select"
                      value={editData[editIndex].team ? editData.team : 'brak'}
                      onChange={(e) => handleChange('team', e)}
                    > */}
                    <TextField
                      value={editData[editIndex].team}
                      onChange={(e) => handleChange('team', e.target.value)}
                      select={true}
                      size="small"
                      variant="standard"
                      margin="normal"
                      SelectProps={{
                        MenuProps: { disableScrollLock: true },
                      }}
                    >
                      {teamsList && Object.keys(teamsList).map((el, index: number) => <MenuItem key={index} value={el}>{el}</MenuItem>)}
                      {/* </Select> */}
                    </TextField>
                  </FormControl>
                </div>
                <div className={classes.code}>
                  <FormControl className={classes.input}>
                    {/* <Select
                      labelId="demo-simple-select-label"
                      id="demo-simple-select"
                      value={editData[editIndex].code ? editData.code : 'brak'}
                      onChange={(e) => handleChange('code', e)}
                    > */}
                    <TextField
                      value={editData[editIndex].code}
                      onChange={(e) => handleChange('code', e.target.value)}
                      select={true}
                      size="small"
                      variant="standard"
                      margin="normal"
                      SelectProps={{
                        MenuProps: { disableScrollLock: true },
                      }}
                    >
                      {codesList && Object.values(codesList).map((el, index: number) => <MenuItem key={index} value={el.code}>{el.code}</MenuItem>)}
                      {/* </Select> */}
                    </TextField>
                  </FormControl>
                </div>
                <div className={classes.title}>
                  <TextField onChange={(e) => handleChange('title', e.target.value)} className={classes.input} value={editData[editIndex].title} /> 
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