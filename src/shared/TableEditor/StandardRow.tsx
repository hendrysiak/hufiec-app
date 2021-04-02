import { TableRow, TableCell, IconButton, Tooltip } from '@material-ui/core';

import Checkbox, { CheckboxProps } from '@material-ui/core/Checkbox';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import DeleteForeverIcon from '@material-ui/icons/DeleteForever';
import EditIcon from '@material-ui/icons/Edit';

import EventIcon from '@material-ui/icons/Event';
import InsertCommentIcon from '@material-ui/icons/InsertComment';
import KeyboardArrowDownIcon from '@material-ui/icons/KeyboardArrowDown';
import KeyboardArrowUpIcon from '@material-ui/icons/KeyboardArrowUp';

import MailIcon from '@material-ui/icons/Mail';

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
}

const StandardRow = (props: Props): JSX.Element => {
  const [isExpanded, setIsExpanded] = React.useState(false);

  const handleDelete = (row: IncomeDb | OutcomeDb) => {
    if (window.confirm(`Na pewno chcesz usunąć?\n
    Kwota: ${row.cash}
    Nazwisko: ${row.surname}
    Team: ${row.team}
    `)) props.onDelete(row.id);
  };

  const expandedRow = isExpanded ? 
    <TableRow>
      <TableCell colSpan={3}>
        { <FormControlLabel
          control={
            <Checkbox
              checked={!!props.row.letterReceived}
              name="checkedB"
              color="primary"
              disabled
            />
          }
          label="Czy wpłynęło pismo o zmianę?"
        />}
      </TableCell>
      <TableCell colSpan={3}>Data pisma o zmianę: <b>{props.row.dateOfLetter}</b>
      </TableCell>
      <TableCell colSpan={4}>Komentarz: <b>{props.row.comment}</b>
      </TableCell>
      
    </TableRow>
    : <></>;
  const oneRow = props.info === BudgetEntry.Outcome 
    ? (<><TableRow>
      <TableCell>
        <Tooltip title="Edytuj koszt" aria-label="add-team">
          <IconButton>
            <EditIcon onClick={props.onEdit}/>
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
      <TableCell>{props.row.title}</TableCell>
    </TableRow>
    </>
    )
    : (<><TableRow>
      <TableCell>
        <Tooltip title="Edytuj przychód" aria-label="add-team">
          <IconButton>
            <EditIcon onClick={props.onEdit}/>
          </IconButton>
        </Tooltip>
        <Tooltip title="Usuń koszt" aria-label="add-team">
          <IconButton>
            <DeleteForeverIcon onClick={() => handleDelete(props.row)}/>
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
        {props.row.letterReceived ? <Tooltip title="Wpłynęło pismo" aria-label="letter-received">
          <IconButton><MailIcon/></IconButton>
        </Tooltip> : <></>}
        {props.row.dateOfLetter && props.row.dateOfLetter !== '' && props.row.dateOfLetter !== null ? <Tooltip title="Dodano datę pisma" aria-label="date-of-letter">
          <IconButton><EventIcon/></IconButton>
        </Tooltip> : <></>}
        {props.row.comment && props.row.comment !== '' ? <Tooltip title="Dodano komentarz" aria-label="added-comment">
          <IconButton><InsertCommentIcon/></IconButton>
        </Tooltip> : <></>}
      </TableCell>
      <TableCell padding="checkbox">
        <IconButton onClick={() => setIsExpanded(!isExpanded)}>
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