
import { TextField, MenuItem, FormControlLabel, Checkbox } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import { KeyboardDatePicker } from '@material-ui/pickers';
import { MaterialUiPickersDate } from '@material-ui/pickers/typings/date';

import React from 'react';
import { useSelector } from 'react-redux';

import { BudgetEntry, FoundingSources, OutcomeCategory } from 'models/global.enum';

import { RootState } from 'store/models/rootstate.model';

import './style.css';

type Props = {
  editedData: BudgetEntry;
  selectedDate: MaterialUiPickersDate | null;
  setSelectedDate: (date: MaterialUiPickersDate) => void;
  team: string;
  setTeam: (team: string) => void;
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

    const mappedImportDates = importDates?.map(id => new Date(id).toLocaleString());

    if (mappedImportDates && date && mappedImportDates.includes(date.toLocaleString())) {
      
      return (<div className={classes.dayWithDotContainer}>
        {dayComponent}
        <div className={classes.dayWithDot}/>
      </div>);
    }

    return dayComponent;    
  };
    
  const handleDateChange = (date: MaterialUiPickersDate) => {
    props.setSelectedDate(date);
  };
  
  const filtersToIncomes = (
    <>
      <TextField
        style={{ marginTop: '16px' }}
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
        style={{ marginTop: '16px' }}
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
    </>
  );
  const filtersToOutcomes = (
    <>
      <TextField
        style={{ marginTop: '16px' }}
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
        style={{ marginTop: '16px' }}
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
        style={{ marginTop: '16px' }}
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
        style={{ marginTop: '16px' }}
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
        <KeyboardDatePicker
          disableToolbar
          disableFuture={true}
          inputVariant="outlined"
          format="dd/MM/yyyy"
          margin="normal"
          id="date-picker-inline"
          label="Wybierz datę importu"
          renderDay={renderDayInPicker}
          value={props.selectedDate}
          onChange={handleDateChange}
          KeyboardButtonProps={{
            'aria-label': 'change date',
          }}
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