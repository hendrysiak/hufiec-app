import { FormGroup, FormControlLabel, Checkbox, TextField } from '@material-ui/core';
import { KeyboardDatePicker } from '@material-ui/pickers';
import { MaterialUiPickersDate } from '@material-ui/pickers/typings/date';
import { Button, Grid } from '@mui/material';
import { Box } from '@mui/system';
import React from 'react';
import { HexColorPicker } from 'react-colorful';

import { Resource } from 'models/resources.model';

interface ReservationEditorProps {
  resources: Resource[];
}

const ReservationEditor = (props: ReservationEditorProps) => {
  const [numberOfPersons, setNumberOfPersons] = React.useState(0);
  const [name, setName] = React.useState('');
  const [color, setColor] = React.useState('');
  const [startDate, setStartDate] = React.useState(new Date());
  const [endDate, setEndDate] = React.useState(new Date());
  const [reservedResources, setReservedResources] = React.useState<string[]>([]);


  const handleStartDateChange = (date: Date | null) => {
    date && setStartDate(date);
  };

  const handleEndDateChange = (date: Date | null) => {
    date && setEndDate(date);
  };

  const handleResource = (checked: boolean, resource: string) => {
    if (checked) {
      return setReservedResources([...reservedResources, resource]);
    }

    const index = reservedResources.findIndex(r => r === resource);
    const editedResources = [...reservedResources];
    editedResources.splice(index, 1);
    return setReservedResources(editedResources);
  };

  return (
    <Grid container spacing={2}>
      <Grid item xs={12}>
        <KeyboardDatePicker
          className="datePicker"
          disableToolbar
          disableFuture={true}
          inputVariant="outlined"
          format="dd/MM/yyyy"
          margin="normal"
          id="date-picker-inline"
          label="Wybierz datę rozpoczęcia"
          // renderDay={renderDayInPicker}
          value={startDate}
          onChange={handleStartDateChange}
          KeyboardButtonProps={{
            'aria-label': 'change date',
          }}
        />    
      </Grid>
      <Grid item xs={12}>
        <KeyboardDatePicker
          className="datePicker"
          disableToolbar
          disableFuture={true}
          inputVariant="outlined"
          format="dd/MM/yyyy"
          margin="normal"
          id="date-picker-inline"
          label="Wybierz datę zakończenia"
          // renderDay={renderDayInPicker}
          value={endDate}
          onChange={handleEndDateChange}
          KeyboardButtonProps={{
            'aria-label': 'change date',
          }}
        />    
      </Grid>
      <Grid item xs={12}>
        <FormGroup style={{ display: 'flex', flexDirection: 'row', justifyContent: 'center' }}>
          {props.resources.map(r => {
            return (<FormControlLabel
              key={r.name}
              control={<Checkbox checked={reservedResources.includes(r.name)} />}
              label={r.name}
              onChange={(e, checked) => handleResource(checked, r.name)}
            />);
            
          })}
        </FormGroup>
      </Grid>
      <Grid item xs={12}>
        <TextField
          classes={{ root: 'teamInput' }}
          label="Ilość osób"
          value={numberOfPersons}
          onChange={(e) => setNumberOfPersons(Number(e.target.value))}
          placeholder="Ilość osób"
          size="small"
          variant="outlined"
          margin="normal"
          type="number"
        />
      </Grid>
      <Grid item xs={12}>
        <TextField
          classes={{ root: 'teamInput' }}
          label="Wpisz nazwę zespołu"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Wpisz nazwę zespołu"
          size="small"
          variant="outlined"
          margin="normal"
        />
      </Grid>
      <Grid item xs={12}>
        <HexColorPicker style={{ margin: '0 auto' }} color={color} onChange={setColor} />
      </Grid>
      <Grid item xs={12}>
        <Button variant="contained" color="primary" onClick={() => console.log()}>Zapisz rezerwację</Button>
      </Grid>
    </Grid>
  );
};

export default ReservationEditor;
