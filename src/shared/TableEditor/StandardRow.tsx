import { TableRow, TableCell, IconButton, Tooltip } from '@material-ui/core';

import DeleteForeverIcon from '@material-ui/icons/DeleteForever';
import EditIcon from '@material-ui/icons/Edit';

import React from 'react';

import { BudgetEntry } from 'models/global.enum';
import { IncomeDb, OutcomeDb } from 'models/income.models';

type Props = {
  info: BudgetEntry;
  index: number;
  row: IncomeDb | OutcomeDb;
  onEdit: (index: number) => void;
  onDelete: (id: string) => void;
}

const StandardRow = (props: Props): JSX.Element => {

  const oneRow = props.info === BudgetEntry.Outcome 
    ? (<TableRow>
      <TableCell>
        <Tooltip title="Edytuj koszt" aria-label="add-team">
          <IconButton>
            <EditIcon onClick={() => props.onEdit(props.index)}/>
          </IconButton>
        </Tooltip>
        <Tooltip title="Usuń koszt" aria-label="add-team">
          <IconButton>
            <DeleteForeverIcon onClick={() => props.onDelete(props.row.id)}/>
          </IconButton>
        </Tooltip>
      </TableCell>
      <TableCell>{props.index + 1}</TableCell>
      <TableCell>{props.row.bilingNr}</TableCell>
      <TableCell>{props.row.cash}</TableCell>
      <TableCell>{props.row.foundingSources}</TableCell>
      <TableCell>{props.row.outcomeCategory}</TableCell>
      <TableCell>{props.row.team}</TableCell>
      <TableCell>{props.row.event}</TableCell>
      <TableCell align="right">{props.row.title}</TableCell>
    </TableRow>
    )
    : (<TableRow>
      <TableCell>
        <Tooltip title="Edytuj przychód" aria-label="add-team">
          <IconButton>
            <EditIcon onClick={() => props.onEdit(props.index)}/>
          </IconButton>
        </Tooltip>
        <Tooltip title="Usuń koszt" aria-label="add-team">
          <IconButton>
            <DeleteForeverIcon onClick={() => props.onDelete(props.row.id)}/>
          </IconButton>
        </Tooltip>
      </TableCell>
      <TableCell>{props.index + 1}</TableCell>
      <TableCell>{props.row.cash}</TableCell>
      <TableCell>{props.row.surname}</TableCell>
      <TableCell>{props.row.name}</TableCell>
      <TableCell>{props.row.team}</TableCell>
      <TableCell>{props.row.event}</TableCell>
      <TableCell>{props.row.year}</TableCell>
      <TableCell>{props.row.title}</TableCell>
    </TableRow>
    );

  return oneRow;
};

export default StandardRow;