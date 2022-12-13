import AddIcon from '@mui/icons-material/Add';
import GetAppIcon from '@mui/icons-material/GetApp';
import { Tooltip, IconButton } from '@mui/material';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';

import TableContainer from '@mui/material/TableContainer';
import TablePagination from '@mui/material/TablePagination';
import Typography from '@mui/material/Typography';

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
};

function TableEditor(props: Props): JSX.Element {
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
          <IconButton size="large"><AddIcon onClick={() => props.onAdd()} /></IconButton>
        </Tooltip>
        <Tooltip title="Pobierz do CSV" aria-label="add-position">
          <CSVLink data={props.rows} filename={`${props.info === BudgetEntry.Income ? 'przychody' : 'koszty'}.csv`}>
            <IconButton size="large">
              <GetAppIcon />
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
                  ? (
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
                      year={row.year as string}
                      title={row.title}
                      onChange={props.onChange}
                      onClose={props.onClose}
                    />
                  )
                  : (
                    <StandardRow
                      expandedIndex={props.expandedIndex}
                      key={index}
                      info={props.info}
                      index={index + page * rowsPerPage}
                      row={row}
                      onEdit={() => props.onEdit(index)}
                      onDelete={props.onDelete}
                    />
                  )
              ))}
          </TableBody>
        </Table>
      </TableContainer>
      <TablePagination
        rowsPerPageOptions={[25, 50, 100]}
        count={props.rows.length}
        rowsPerPage={rowsPerPage}
        page={page}
        onRowsPerPageChange={handleChangeRowsPerPage}
        labelRowsPerPage="Ilośc wierszy na stronie"
        onPageChange={handleChangePage}
      />
    </>
  );
}

export default TableEditor;
