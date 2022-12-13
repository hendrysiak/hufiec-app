import DeleteForeverIcon from '@mui/icons-material/DeleteForever';
import EditIcon from '@mui/icons-material/Edit';

import EventIcon from '@mui/icons-material/Event';
import InsertCommentIcon from '@mui/icons-material/InsertComment';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';

import MailIcon from '@mui/icons-material/Mail';
import {
  TableRow, TableCell, IconButton, Tooltip,
} from '@mui/material';
import Checkbox from '@mui/material/Checkbox';
import FormControlLabel from '@mui/material/FormControlLabel';

import React from 'react';

import { BudgetEntry } from 'models/global.enum';
import { IncomeDb, OutcomeDb } from 'models/income.models';

type Props = {
  info: BudgetEntry;
  index: number;
  expandedIndex?: number;
  row: IncomeDb | OutcomeDb;
  onEdit: () => void;
  onDelete: (id: string) => void;
};

const StandardRow = (props: Props): JSX.Element => {
  const [isExpanded, setIsExpanded] = React.useState(false);

  const handleDelete = (row: IncomeDb | OutcomeDb) => {
    if (window.confirm(`Na pewno chcesz usunąć?\n
    Kwota: ${row.cash}
    Nazwisko: ${row.surname}
    Team: ${row.team}
    `)) props.onDelete(row.id);
  };

  const expandedRow = isExpanded
    ? (
      <TableRow>
        <TableCell colSpan={3}>
          <FormControlLabel
            control={(
              <Checkbox
                checked={!!props.row.letterReceived}
                name="checkedB"
                color="primary"
                disabled
              />
          )}
            label="Czy wpłynęło pismo o zmianę?"
          />
        </TableCell>
        <TableCell colSpan={3}>
          Data pisma o zmianę:
          <b>{props.row.dateOfLetter}</b>
        </TableCell>
        <TableCell colSpan={4}>
          Komentarz:
          <b>{props.row.comment}</b>
        </TableCell>

      </TableRow>
    )
    : <></>;
  const oneRow = props.info === BudgetEntry.Outcome
    ? (
      <TableRow>
        <TableCell>
          <Tooltip title="Edytuj koszt" aria-label="add-team">
            <IconButton size="large">
              <EditIcon onClick={props.onEdit} />
            </IconButton>
          </Tooltip>
          <Tooltip title="Usuń koszt" aria-label="add-team">
            <IconButton size="large">
              <DeleteForeverIcon onClick={() => props.onDelete(props.row.id)} />
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
        <TableCell>{props.row.title}</TableCell>
      </TableRow>
    )
    : (
      <>
        <TableRow>
          <TableCell>
            <Tooltip title="Edytuj przychód" aria-label="add-team">
              <IconButton size="large">
                <EditIcon onClick={props.onEdit} />
              </IconButton>
            </Tooltip>
            <Tooltip title="Usuń koszt" aria-label="add-team">
              <IconButton size="large">
                <DeleteForeverIcon onClick={() => handleDelete(props.row)} />
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
          <TableCell>
            {props.row.letterReceived ? (
              <Tooltip title="Wpłynęło pismo" aria-label="letter-received">
                <IconButton size="large"><MailIcon /></IconButton>
              </Tooltip>
            ) : <></>}
            {props.row.dateOfLetter && props.row.dateOfLetter !== '' && props.row.dateOfLetter !== null ? (
              <Tooltip title="Dodano datę pisma" aria-label="date-of-letter">
                <IconButton size="large"><EventIcon /></IconButton>
              </Tooltip>
            ) : <></>}
            {props.row.comment && props.row.comment !== '' ? (
              <Tooltip title="Dodano komentarz" aria-label="added-comment">
                <IconButton size="large"><InsertCommentIcon /></IconButton>
              </Tooltip>
            ) : <></>}
          </TableCell>
          <TableCell padding="checkbox">
            <IconButton onClick={() => setIsExpanded(!isExpanded)} size="large">
              {isExpanded ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
            </IconButton>
          </TableCell>
        </TableRow>
        {expandedRow}
      </>
    );

  return oneRow;
};

export default StandardRow;
