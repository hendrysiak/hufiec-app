
import { TextField, MenuItem, FormControlLabel, Checkbox } from '@mui/material';
import makeStyles from '@mui/styles/makeStyles';
import { DesktopDatePicker } from '@mui/x-date-pickers';

import React from 'react';
import { useSelector } from 'react-redux';


import { BudgetEntry, FoundingSources, OutcomeCategory } from 'models/global.enum';

import { RootState } from 'store/models/rootstate.model';

import './style.css';
import { FiltersName } from './FiltersName';



type Props = {
  editedData: BudgetEntry;
  selectedDate: any | null;
  setSelectedDate: (date: any) => void;
  team: string;
  setTeam: (team: string) => void;
  name: string;
  setName: (team: string) => void;
  surname: string;
  setSurname: (team: string) => void;
  event: string;
  setEvent: (event: string) => void;
  founding: FoundingSources | string;
  setFounding: (founding: FoundingSources) => void;
  category: OutcomeCategory | string;
  setCategory: (category: OutcomeCategory) => void;
  useDate: boolean;
  setUseDate: (info: boolean) => void;
}

const Filters = (props: Props): JSX.Element => {
  const importDates = useSelector((state: RootState) => state.income.importDates);
  const registry = useSelector((state: RootState) => state.income.registry);

  const codes = useSelector((state: RootState) => state.income.codes);

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
      right: '50%',
      transform: 'translateX(1px)',
      top: '80%'
    }
  }));
  
  const classes = useStyles();

  const renderDayInPicker = (
    date: any, 
    selectedDate: unknown, 
    dayInCurrentMonth: unknown, 
    dayComponent: JSX.Element) => {

    const mappedImportDates = importDates?.map(id => new Date(id).toLocaleDateString());

    if (mappedImportDates && date && mappedImportDates.includes(date.toLocaleDateString())) {
      
      return (<div className={classes.dayWithDotContainer}>
        {dayComponent}
        <div className={classes.dayWithDot}/>
      </div>);
    }

    return dayComponent;    
  };
    
  const handleDateChange = (date: any) => {
    props.setSelectedDate(date);
  };
  
  const filtersToIncomes = (
    <>
      <TextField
        label="Po drużynie"
        value={props.team}
        onChange={(e) => props.setTeam(e.target.value)}
        placeholder="Wybierz drużynę z listy"
        select={true}
        size="small"
        variant="outlined"
        margin="normal"
        SelectProps={{
          MenuProps: { disableScrollLock: true }
        }}
      >
        {registry && ['Brak', ...Object.keys(registry)].map((item) => (
          <MenuItem key={item} value={item}>{item}</MenuItem>
        ))}
      </TextField>
      <TextField
        label="Po wydarzeniu"
        value={props.event}
        onChange={(e) => props.setEvent(e.target.value)}
        placeholder="Wybierz kod z listy"
        select={true}
        size="small"
        variant="outlined"
        margin="normal"
        SelectProps={{
          MenuProps: { disableScrollLock: true }
        }}
      >
        {codes && ['Brak', ...codes.map(code => code.code)].map((item) => (
          <MenuItem key={item} value={item}>{item}</MenuItem>
        ))}
      </TextField>

      <FiltersName 
        name={props.name}
        setName={props.setName}
        surname={props.surname}
        setSurname={props.setSurname}
      />
    </>
  );
  const filtersToOutcomes = (
    <>
      <TextField
        label="Po drużynie"
        value={props.team}
        onChange={(e) => props.setTeam(e.target.value)}
        placeholder="Wybierz drużynę z listy"
        select={true}
        size="small"
        variant="outlined"
        margin="normal"
        SelectProps={{
          MenuProps: { disableScrollLock: true }
        }}
      >
        {registry && ['Brak', ...Object.keys(registry)].map((item) => (
          <MenuItem key={item} value={item}>{item}</MenuItem>
        ))}
      </TextField>
      <TextField
        label="Po wydarzeniu"
        value={props.event}
        onChange={(e) => props.setEvent(e.target.value)}
        placeholder="Wybierz kod z listy"
        select={true}
        size="small"
        variant="outlined"
        margin="normal"
        SelectProps={{
          MenuProps: { disableScrollLock: true }
        }}
      >
        {codes && ['Brak', ...codes.map(code => code.code)].map((item) => (
          <MenuItem key={item} value={item}>{item}</MenuItem>
        ))}
      </TextField>
      <TextField
        label="Po finansowaniu"
        value={props.founding}
        onChange={(e) => props.setFounding(e.target.value as FoundingSources)}
        placeholder="Wybierz źródło z listy"
        select={true}
        size="small"
        variant="outlined"
        margin="normal"
        SelectProps={{
          MenuProps: { disableScrollLock: true }
        }}
      >
        {['Brak', ...Object.keys(FoundingSources)].map((item) => (
          <MenuItem key={item} value={item}>{item}</MenuItem>
        ))}
      </TextField>
      <TextField
        label="Po kategorii"
        value={props.category}
        onChange={(e) => props.setCategory(e.target.value as OutcomeCategory)}
        placeholder="Wybierz kategorię z listy"
        select={true}
        size="small"
        variant="outlined"
        margin="normal"
        SelectProps={{
          MenuProps: { disableScrollLock: true }
        }}
      >
        {['Brak', ...Object.keys(OutcomeCategory)].map((item) => (
          <MenuItem key={item} value={item}>{item}</MenuItem>
        ))}
      </TextField>
    </>
  );


  return (
    <>
      <div className="filters">
        {props.editedData === BudgetEntry.Income ? filtersToIncomes : filtersToOutcomes}
        <DesktopDatePicker
          disableFuture={true}
          inputFormat="dd/MM/yyyy"
          label="Wybierz datę importu"
          renderInput={(params) => <TextField {...params} />}
          value={props.selectedDate}
          onChange={handleDateChange}
        />
        <FormControlLabel
          control={<Checkbox 
            checked={props.useDate} 
            onChange={(e) => props.setUseDate(e.target.checked)} 
            name="checkedA" 
            color="primary"
          />}
          label="Sortuj po dacie"
        />
      </div>
    </>
  );
};

export default Filters;