import { Button, IconButton, Tooltip } from '@material-ui/core';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Typography from '@material-ui/core/Typography';
import DeleteForeverIcon from '@material-ui/icons/DeleteForever';
import EditIcon from '@material-ui/icons/Edit';
import { Alert } from '@material-ui/lab';
import React from 'react';

import { OutcomeDb } from 'models/income.models';

import EditableRow from './EditableRow';

type Props = {
  editedIndex: number;
  rows: OutcomeDb[];
  onChange: (index: number, data: { key: string, value: string | number }) => void;
  onClose: () => void;
  onEdit: (index: number) => void;
  onDelete: (id: string) => void;
}

const EventOutcomes = (props: Props): JSX.Element => {
  return (
    <>
      <Typography component="h2" variant="h6" color="primary" gutterBottom>
        {'Rozliczenie imprezy'}
      </Typography>
      {/* <Alert severity="warning">Masz niezapisane w bazie zmiany</Alert> */}

      <Table size="small">
        <TableHead>
          <TableRow>
            <TableCell>Edytuj</TableCell>
            <TableCell>LP</TableCell>
            <TableCell>NR faktury</TableCell>
            <TableCell>Kwota</TableCell>
            <TableCell>Sposób finansowania</TableCell>
            <TableCell>Kategoria wydatku</TableCell>
            <TableCell>Jednostka</TableCell>
            <TableCell>Kod imprezy (automatycznie)</TableCell>
            <TableCell align="right">Pełny tytuł</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {props.rows && props.rows.map((row, index) => (
            index === props.editedIndex 
              ? <TableRow key={index}>
                <EditableRow 
                  bilingNr={row.bilingNr}
                  cash={row.cash}
                  event={row.event}
                  foundingSources={row.foundingSources}
                  index={index}
                  outcomeCategory={row.outcomeCategory}
                  team={row.team}
                  title={row.title}
                  onChange={props.onChange}
                  onClose={props.onClose}
                />
                <TableCell>
                  <Tooltip title="Usuń koszt" aria-label="add-team">
                    <IconButton>
                      <DeleteForeverIcon onClick={() => props.onDelete(row.id)}/>
                    </IconButton>
                  </Tooltip>
                </TableCell>
              </TableRow> 
              : <TableRow key={index}>
                <TableCell>
                  <Tooltip title="Edytuj koszt" aria-label="add-team">
                    <IconButton>
                      <EditIcon onClick={() => props.onEdit(index)}/>
                    </IconButton>
                  </Tooltip>
                </TableCell>
                <TableCell>{index + 1}</TableCell>
                <TableCell>{row.bilingNr}</TableCell>
                <TableCell>{row.cash}</TableCell>
                <TableCell>{row.foundingSources}</TableCell>
                <TableCell>{row.outcomeCategory}</TableCell>
                <TableCell>{row.team}</TableCell>
                <TableCell>{row.event}</TableCell>
                <TableCell align="right">{row.title}</TableCell>
                <TableCell>
                  <Tooltip title="Usuń koszt" aria-label="add-team">
                    <IconButton>
                      <DeleteForeverIcon onClick={() => props.onDelete(row.id)}/>
                    </IconButton>
                  </Tooltip>
                </TableCell>
            
                {/* <TableCell align="right">{row.amount}</TableCell> */}
              </TableRow>
          ))}
        </TableBody>
      </Table>
    </>
  );
};

export default EventOutcomes;
