import { IconButton, MenuItem, TextField, Tooltip } from '@material-ui/core';
import TableCell from '@material-ui/core/TableCell';
import CloseIcon from '@material-ui/icons/Close';
import React from 'react';

import { FoundingSources, OutcomeCategory } from 'models/global.enum';
import store from 'store/store';

interface Props {
  bilingNr: string | null;
  index: number;
  foundingSources: FoundingSources;
  outcomeCategory: OutcomeCategory;
  team: string | null;
  event: string | null;
  title: string | null;
  cash: number | null;
  onChange: (index: number, data: { key: string, value: string | number }) => void;
  onClose: () => void;
}

const EditableRow = (props: Props): JSX.Element => {
  const teams = store.getState().income.registry;
  
  return (
    <>
      <TableCell>
        <Tooltip title="Dodaj drużynę" aria-label="add-team">
          <IconButton><CloseIcon onClick={() => props.onClose()}/></IconButton>
        </Tooltip>
      </TableCell>
      <TableCell>{props.index + 1}</TableCell>
      <TableCell>
        <TextField
          size="medium"
          value={props.bilingNr}
          margin="dense"
          onChange={(e) => props.onChange(props.index, { key: 'bilingNr', value: e.target.value })}
        />
      </TableCell>
      <TableCell>
        <TextField
          size="small"
          value={props.cash}
          margin="dense"
          onChange={(e) => props.onChange(props.index, { key: 'cash', value: -Number(e.target.value) })}
        />
      </TableCell>
      <TableCell>
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
      </TableCell>
      <TableCell>
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
      </TableCell>
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
      <TableCell>{props.event}</TableCell>
      <TableCell align="right">{props.title}</TableCell>
    </>
  );
};

export default EditableRow;
