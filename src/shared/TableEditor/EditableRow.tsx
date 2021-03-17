import { IconButton, MenuItem, TextField, Tooltip } from '@material-ui/core';
import TableCell from '@material-ui/core/TableCell';
import CloseIcon from '@material-ui/icons/Close';
import React from 'react';

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
  onChange: (index: number, data: { key: string, value: string | number }) => void;
  onClose: (index: number) => void;
}

const EditableRow = (props: Props): JSX.Element => {
  const teams = store.getState().income.registry;
  const codes = store.getState().income.codes?.map(c => c.code);

  const currentYear = new Date().getFullYear();

  return (
    <>
      <TableCell>
        <Tooltip title="Zakończ edycję" aria-label="add-team">
          <IconButton><CloseIcon onClick={() => props.onClose(props.index)}/></IconButton>
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
    </>
  );
};

export default EditableRow;
