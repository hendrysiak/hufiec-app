import { Checkbox, FormControlLabel, IconButton, MenuItem, TableRow, TextField, Tooltip } from '@mui/material';
import TableCell from '@mui/material/TableCell';
import CloseIcon from '@mui/icons-material/Close';

import EventIcon from '@mui/icons-material/Event';
import InsertCommentIcon from '@mui/icons-material/InsertComment';
import MailIcon from '@mui/icons-material/Mail';
import { KeyboardDatePicker } from '@material-ui/pickers';
import { MaterialUiPickersDate } from '@material-ui/pickers/typings/date';
import React from 'react';

import { useTeams } from 'helpers/hooks/useTeams';
import { BudgetEntry, FoundingSources, OutcomeCategory } from 'models/global.enum';
import store from 'store/store';

interface Props {
  editable: boolean;
  info: BudgetEntry;
  bilingNr?: string | null;
  index: number;
  foundingSources?: FoundingSources;
  outcomeCategory?: OutcomeCategory;
  name?: string | null;
  surname?: string | null;
  team: string | null;
  year: string | number | boolean | Date | null | undefined;
  event: string | null;
  title: string | null;
  cash: number | null;
  letterReceived?: boolean | null;
  dateOfLetter?: string | Date | null;
  comment?: string | null;
  onChange: (index: number, data: { key: string, value: string | number | Date | boolean }) => void;
  onClose: (index: number) => void;
}

const EditableRow = (props: Props): JSX.Element => {
  const teams = useTeams();
  const codes = store.getState().income.codes?.map(c => c.code);

  const currentYear = new Date().getFullYear();

  const dateOfLetterHandler = (index: number, value: MaterialUiPickersDate) => {
    if (!props.letterReceived) return alert('Żeby podac datę pisma, proszę zaznaczyć iż wpłynęło.');
    props.onChange(index, { key: 'dateOfLetter', value: value || '' });
  };

  return <>
    <TableRow>
      <TableCell>
        <Tooltip title="Zakończ edycję" aria-label="add-team">
          <IconButton size="large"><CloseIcon onClick={() => props.onClose(props.index)}/></IconButton>
        </Tooltip>
      </TableCell>
      <TableCell>{props.index + 1}</TableCell>
      {props.info === BudgetEntry.Outcome && <TableCell>
        <TextField
          size="medium"
          value={props.bilingNr}
          margin="dense"
          onChange={(e) => props.onChange(props.index, { key: 'bilingNr', value: e.target.value })}
        />
      </TableCell>}
      <TableCell>
        <TextField
          size="small"
          value={props.cash}
          margin="dense"
          onChange={
            (e) => props.onChange(
              props.index, 
              { 
                key: 'cash', 
                value: props.info === BudgetEntry.Outcome 
                  ? -Number(e.target.value) 
                  : Number(e.target.value) 
              })}
        />
      </TableCell>
      {props.info === BudgetEntry.Outcome && <TableCell>
        <TextField
          value={props.foundingSources}
          onChange={(e) => props.onChange(props.index, { key: 'foundingSources', value: e.target.value })}
          select={true}
          size="medium"
          margin="dense"
          SelectProps={{
            MenuProps: { disableScrollLock: true }
          }}
        >
          {Object.values(FoundingSources).map((item) => (
            <MenuItem key={item} value={item}>{item}</MenuItem>
          ))}
        </TextField>
      </TableCell>}
      {props.info === BudgetEntry.Outcome && <TableCell>
        <TextField
          value={props.outcomeCategory}
          onChange={(e) => props.onChange(props.index, { key: 'outcomeCategory', value: e.target.value })}
          select={true}
          size="medium"
          margin="dense"
          SelectProps={{
            MenuProps: { disableScrollLock: true }
          }}
        >
          {Object.values(OutcomeCategory).map((item) => (
            <MenuItem key={item} value={item}>{item}</MenuItem>
          ))}
        </TextField>
      </TableCell>}
      {props.info === BudgetEntry.Income && <TableCell>
        <TextField
          value={props.surname}
          onChange={(e) => props.onChange(props.index, { key: 'surname', value: e.target.value })}
          size="medium"
          margin="dense"
        />
      </TableCell>}
      {props.info === BudgetEntry.Income && <TableCell>
        <TextField
          value={props.name}
          onChange={(e) => props.onChange(props.index, { key: 'name', value: e.target.value })}
          size="medium"
          margin="dense"
        />
      </TableCell>}
      <TableCell>
        <TextField
          value={props.team}
          onChange={(e) => props.onChange(props.index, { key: 'team', value: e.target.value })}
          select={true}
          size="medium"
          margin="dense"
          SelectProps={{
            MenuProps: { disableScrollLock: true }
          }}
        >
          {teams && Object.keys(teams).map((item) => (
            <MenuItem key={item} value={item}>{item}</MenuItem>
          ))}
        </TextField>

      </TableCell>
      <TableCell>
        {props.editable ? <TextField
          value={props.event}
          onChange={(e) => props.onChange(props.index, { key: 'event', value: e.target.value })}
          select={true}
          size="medium"
          margin="dense"
          SelectProps={{
            MenuProps: { disableScrollLock: true }
          }}
        >
          {codes && codes.map((item) => (
            <MenuItem key={item} value={item}>{item}</MenuItem>
          ))}
        </TextField>
          : props.event}</TableCell>
      <TableCell>
        <TextField
          value={props.year}
          onChange={(e) => props.onChange(props.index, { key: 'year', value: e.target.value })}
          select={true}
          size="medium"
          margin="dense"
          SelectProps={{
            MenuProps: { disableScrollLock: true }
          }}
        >
          {[currentYear - 1, currentYear].map((item) => (
            <MenuItem key={item} value={item}>{item}</MenuItem>
          ))}
        </TextField>

      </TableCell>
      <TableCell>        
        <TextField
          value={props.title}
          onChange={(e) => props.onChange(props.index, { key: 'title', value: e.target.value })}
          size="medium"
          margin="dense"
        /></TableCell>
      <TableCell>
        {props.letterReceived ? <Tooltip title="Wpłynęło pismo" aria-label="letter-received">
          <IconButton size="large"><MailIcon/></IconButton>
        </Tooltip> : <></>}
        {props.dateOfLetter && props.dateOfLetter !== '' && props.dateOfLetter !== null ? <Tooltip title="Dodano datę pisma" aria-label="date-of-letter">
          <IconButton size="large"><EventIcon/></IconButton>
        </Tooltip> : <></>}
        {props.comment && props.comment !== '' ? <Tooltip title="Dodano komentarz" aria-label="added-comment">
          <IconButton size="large"><InsertCommentIcon/></IconButton>
        </Tooltip> : <></>}
      </TableCell>
    </TableRow>
    {props.info === BudgetEntry.Income && <TableRow>
      <TableCell colSpan={3}>
        { <FormControlLabel
          control={
            <Checkbox
              checked={!!props.letterReceived}
              name="checkedB"
              color="primary"
              onChange={(e) => props.onChange(props.index, { key: 'letterReceived', value: e.target.checked })}
            />
          }
          label="Czy wpłynęło pismo o zmianę?"
        />}
      </TableCell>
      <TableCell colSpan={3}>
        <KeyboardDatePicker
          disableToolbar
          variant="inline"
          margin="normal"
          id="date-picker-dialog"
          // label="Data dodania"
          format="dd/MM/yyyy"
          value={props.dateOfLetter ? new Date(props.dateOfLetter) : null}
          // onChange={(e) => props.onChange(props.index, { key: 'dateOfLetter', value: e || '' })}
          onChange={(e) => dateOfLetterHandler(props.index, e)}
          KeyboardButtonProps={{
            'aria-label': 'change date'
          }}
          label="Data wpłynięcia pisma"
        />
      </TableCell>
      <TableCell colSpan={4}>
        <TextField
          value={props.comment}
          onChange={(e) => props.onChange(props.index, { key: 'comment', value: e.target.value })}
          margin="dense"
          label="Komentarz"
          fullWidth
          multiline
        />
      </TableCell>

    
    </TableRow>}
  </>;
};

export default EditableRow;
