import { Tooltip, IconButton } from '@material-ui/core';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';

import TableRow from '@material-ui/core/TableRow';
import Typography from '@material-ui/core/Typography';

import AddIcon from '@material-ui/icons/Add';
import GetAppIcon from '@material-ui/icons/GetApp';
import React from 'react';

import { CSVLink } from 'react-csv';

import { BudgetEntry, FoundingSources, OutcomeCategory } from 'models/global.enum';
import { IncomeDb, OutcomeDb } from 'models/income.models';

import EditableRow from './EditableRow';
import HeadRow from './HeadRow';
import StandardRow from './StandardRow';

type Props = {
  editable: boolean;
  title: string;
  editedIndex: number;
  expandedIndex?: number;
  info: BudgetEntry;
  rows: (OutcomeDb | IncomeDb)[];
  onChange: (index: number, data: { key: string, value: string | number | Date | boolean }) => void;
  onClose: (index: number) => void;
  onEdit: (index: number) => void;
  onDelete: (id: string) => void;
  onAdd: () => void;
}

const TableEditor = (props: Props): JSX.Element => {
  return (
    <>
      <div className="table__add">
        <Tooltip title={`Dodaj ${props.info === BudgetEntry.Income ? 'przychód' : 'koszt'}`} aria-label="add-position">
          <IconButton><AddIcon onClick={() => props.onAdd()}/></IconButton>
        </Tooltip>
        <Tooltip title="Pobierz do CSV" aria-label="add-position">
          <CSVLink data={props.rows} filename={`${props.info === BudgetEntry.Income ? 'przychody' : 'koszty'}.csv`}>
            <IconButton>
              <GetAppIcon/>
            </IconButton>
          </CSVLink>
        </Tooltip>
      </div>
      <Typography component="h2" variant="h6" color="primary" gutterBottom>
        {props.title}
      </Typography>
      <Table size="small">
        <HeadRow info={props.info} />
        <TableBody>
          {props.rows && props.rows.map((row, index) => (
            index === props.editedIndex 
              ? 
              <EditableRow 
                key={index}
                editable={props.editable}
                info={props.info}
                bilingNr={row.bilingNr as string | null}
                cash={row.cash}
                event={row.event}
                name={row.name as string | null}
                surname={row.surname as string | null}
                letterReceived={row.letterReceived as boolean | null}
                dateOfLetter={row.dateOfLetter as string | null | Date}
                comment={row.comment as string | null}
                foundingSources={row.foundingSources as FoundingSources}
                index={index}
                outcomeCategory={row.outcomeCategory as OutcomeCategory}
                team={row.team}
                year={row.year}
                title={row.title}
                onChange={props.onChange}
                onClose={props.onClose}
              />
              : <StandardRow 
                expandedIndex={props.expandedIndex}
                key={index}
                info={props.info}
                index={index}
                row={row}
                onEdit={props.onEdit}
                onDelete={props.onDelete}
              /> 
          ))}
        </TableBody>
      </Table>
    </>
  );
};

export default TableEditor;
