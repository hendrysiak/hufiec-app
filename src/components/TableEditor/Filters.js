import React, { useState, useEffect } from 'react';

import { TextField, MenuItem } from '@material-ui/core';
import { KeyboardDatePicker } from '@material-ui/pickers';

import { makeStyles } from '@material-ui/core/styles';

const Filters = (props) => {
    //filters
    
  const [selectedDate, setSelectedDate] = useState(new Date())
  
    useEffect(() => {
      const filteredIncomes = props.dbIncomes && props.dbIncomes.filter(i => {
        if (i.importDate !== selectedDate.toLocaleString().split(',')[0]) return false;
        if (props.team !== '' && i.team !== props.team) return false;
        if (props.event !== '' && i.event !== props.event) return false;
        return true;
      })
      console.log(filteredIncomes);
      props.setDisplayedIncome(filteredIncomes);
    },[props.event, props.team, selectedDate, props.dbIncomes]);
  
    useEffect(() => {
      const filteredOutcomes = props.dbOutcomes && props.dbOutcomes.filter(i => {
        if (i.importDate !== selectedDate.toLocaleString().split(',')[0]) return false;
        if (props.team !== '' && i.team !== props.team) return false;
        if (props.event !== '' && i.event !== props.event) return false;
        if (props.founding !== '' && i.foundingSource !== props.founding) return false;
        if (props.category !== '' && i.outcomeCategory !== props.event) return false;
        return true;
      })
      props.setDisplayedOutcome(filteredOutcomes);
    },[props.event, props.team, props.founding, props.category, selectedDate, props.dbOutcomes]);

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
      if (props.importDates && props.importDates.includes(date.toLocaleString().split(',')[0])) {
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
  
  const filtersToIncomes = (
    <>
    <TextField
    style={{marginTop: '16px'}}
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
      {props.registry && ['', ...props.registry].map((item) => (
    <MenuItem key={item} value={item}>{item}</MenuItem>
  ))}
    </TextField>
    <TextField
    style={{marginTop: '16px'}}
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
      {props.codes && ['', ...props.codes].map((item) => (
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
      value={props.team}
      onChange={(e) => props.setTeam('team', e.target.value)}
      placeholder="Wybierz drużynę z listy"
      select={true}
      size="small"
      variant="outlined"
      margin="normal"
      SelectProps={{
        MenuProps: { disableScrollLock: true }
      }}
    >
      {props.registry && ['', ...props.registry].map((item) => (
    <MenuItem key={item} value={item}>{item}</MenuItem>
  ))}
    </TextField>
    <TextField
    style={{marginTop: '16px'}}
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
      {props.codes && ['', ...props.codes].map((item) => (
    <MenuItem key={item} value={item}>{item}</MenuItem>
  ))}
    </TextField>
    <TextField
    style={{marginTop: '16px'}}
      label="Po finansowaniu"
      value={props.founding}
      onChange={(e) => props.setFounding(e.target.value)}
      placeholder="Wybierz źródło z listy"
      select={true}
      size="small"
      variant="outlined"
      margin="normal"
      SelectProps={{
        MenuProps: { disableScrollLock: true }
      }}
    >
      {props.foundingSources && ['', ...props.foundingSources].map((item) => (
    <MenuItem key={item} value={item}>{item}</MenuItem>
  ))}
    </TextField>
    <TextField
    style={{marginTop: '16px'}}
      label="Po kategorii"
      value={props.category}
      onChange={(e) => props.setCategory(e.target.value)}
      placeholder="Wybierz kategorię z listy"
      select={true}
      size="small"
      variant="outlined"
      margin="normal"
      SelectProps={{
        MenuProps: { disableScrollLock: true }
      }}
    >
      {props.outcomeCategory && ['', ...props.outcomeCategory].map((item) => (
    <MenuItem key={item} value={item}>{item}</MenuItem>
  ))}
    </TextField>
    </>
  );


  return (
    <>
        <div class="filters">
        {props.editedData === 'income' ? filtersToIncomes : filtersToOutcomes}
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
        </div>
    </>
  )
};

export default Filters;