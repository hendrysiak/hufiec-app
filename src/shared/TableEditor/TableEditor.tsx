import { Tooltip, IconButton } from '@material-ui/core';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';

import TableContainer from '@material-ui/core/TableContainer';
import TablePagination from '@material-ui/core/TablePagination';
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
  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(25);

  const handleChangePage = (event: unknown, newPage: number) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

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
      <TableContainer>
        <Table size="small">
          <HeadRow info={props.info} />
          <TableBody>
            {props.rows && props.rows
              .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
              .map((row, index) => (
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
                    index={index + page * rowsPerPage}
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
                    index={index + page * rowsPerPage}
                    row={row}
                    onEdit={() => props.onEdit(index)}
                    onDelete={props.onDelete}
                  /> 
              ))}
          </TableBody>
        </Table>
      </TableContainer>
      <TablePagination
        rowsPerPageOptions={[25, 50, 100]}
        component="div"
        count={props.rows.length}
        rowsPerPage={rowsPerPage}
        page={page}
        onChangePage={handleChangePage}
        onChangeRowsPerPage={handleChangeRowsPerPage}
        labelRowsPerPage="Ilośc wierszy na stronie"
      />
    </>
  );
};

export default TableEditor;
