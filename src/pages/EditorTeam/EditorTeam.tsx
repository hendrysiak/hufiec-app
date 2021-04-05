import { TablePagination, TextField } from '@material-ui/core';
import Button from '@material-ui/core/Button';
import IconButton from '@material-ui/core/IconButton';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import DeleteIcon from '@material-ui/icons/Delete';
import DoneIcon from '@material-ui/icons/DoneAllTwoTone';
import EditIcon from '@material-ui/icons/EditOutlined';
import RevertIcon from '@material-ui/icons/NotInterestedOutlined';
import { KeyboardDatePicker } from '@material-ui/pickers';
import React, { useState, useEffect, FC } from 'react';

import { CSVLink } from 'react-csv';
import { useSelector } from 'react-redux';

import { useDebounce } from 'helpers/hooks/useDebounce';
import { sortOfSurname } from 'helpers/sorting.helper';
import { Rows } from 'models/global.enum';
import { APIPerson } from 'models/registry.models';
import { countingMemberFee } from 'pages/Team/helpers/member-fee.helper';
import { LogOut } from 'shared/LogOut/LogOut';
import Navigation from 'shared/Navigation/Navigation';
import { RootState } from 'store/models/rootstate.model';

import { deleteTeamMember, editTeamMember, permanentDeleteTeamMember } from '../../helpers/editing-db.handler';

import SelectTeam from './components/SelectTeam';
import { CustomTableCell } from './functions/newCell';
import { useStyles } from './stylesTable';
import { FilterName } from 'pages/EditorTeam/components/FilterName';
import { TextField } from '@material-ui/core';

export interface IPerson extends APIPerson {
  lp?: number;
  isEditMode?: boolean;
}

interface DataToExport extends IPerson {
  team: string
}

const EditorTeam: FC = () => {
  const registry = useSelector((state: RootState) => state.income.registry);
<<<<<<< HEAD
  const [filteredRows, setFilteredRows] = useState<IPerson[] | null>(null)
  const [rows, setRows] = useState<IPerson[] | null>(null);
=======
  const [rows, setRows] = useState<IPerson[]>([]);
  const [dataToExport, setDataToExport] = useState<DataToExport[]>([]);
>>>>>>> master
  const [team, setTeam] = useState<string>('');
  const [name, setName] = useState<string>('');
  const [surname, setSurname] = useState<string>('')
  const classes = useStyles();
  const [actualValue, setActualValue] = useState<IPerson>(
    { name: '', surname:'', id: '', dateOfAdd: null }
  );
  const [prevValue, setPrevValue] = useState<IPerson>(
    { name: '', surname: '', id: '', dateOfAdd: null, dateOfDelete: null }
  );
  const [activeEdit, setActiveEdit] = useState<boolean>(false);
<<<<<<< HEAD
  const [newTeam, setNewTeam] = useState<string>('')
    
=======
  const [activeRow, setActiveRow] = useState<string | null>(null);

  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(25);
>>>>>>> master

  const handleChangePage = (event: unknown, newPage: number) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };
    
  const handleAcceptChange = (id: string) => {
    setActualValue(prev => {
      return {
        ...prev,
        dateOfDelete: null
      };
    });
    setActiveRow(null);
    rows && rows.map(el => {
      if (el.id === id && (prevValue.name !== actualValue.name 
        || prevValue.surname !== actualValue.surname 
        || prevValue.dateOfAdd !== actualValue.dateOfAdd 
        || prevValue.dateOfDelete !== actualValue.dateOfDelete)) {
        editTeamMember(team,
          { id: actualValue.id,
            name: actualValue.name,
            surname: actualValue.surname,
            dateOfAdd: actualValue.dateOfAdd,
            dateOfDelete: actualValue.dateOfDelete && Date.parse(`${actualValue.dateOfDelete}`) ? actualValue.dateOfDelete : null });
        setPrevValue((prev) => (
          {
            ...prev,
            name: actualValue.name,
            surname: actualValue.surname,
            dateOfAdd: actualValue.dateOfAdd,
            dateOfDelete: actualValue.dateOfDelete,
          }
        ));
      }
      return el;
    });
    onToggleEditMode(id);
  };

  const onToggleEditMode = (id: string) => {
    if (activeEdit && rows && prevValue.id !== id) {
      alert(`Jesteś w trakcie edycji innej osoby.`);
      return;
    };
    !activeRow && setActiveRow(id);
    setActiveEdit(!activeEdit);
    rows && rows.find(el => {
      if (el.id === id) {
        setActualValue(el);
      };
    });
    rows && setRows(() => {
      return rows.map((row) => { 
        if (row.id === id) {
          setPrevValue({ ...row, dateOfDelete: row.dateOfDelete ? row.dateOfDelete : null });
          return { ...row, isEditMode: !row.isEditMode };
        }
        return row;
      });
    });
  };

  const onChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>, row: IPerson) => {
    if (e.target.getAttribute(Rows.Name) === Rows.Lp) return;
    const value = e.target.value;
    const name = e.target.name;
    const { id } = row;
    if (rows) {
      const newRows = rows.map(row => {
        if (row.id === id) {
          setActualValue((prev: IPerson) => {
            return { ...prev, [name]: value };
          });
          return { ...row, [name]: value };
        }
        return row;
      });
      setRows(newRows);
    }
  };

  const onRevert = (id: string) => {
    if (!window.confirm('jesteś pewien, że chcesz cofnąć zmiany?')) return;
    setActiveRow(null);
    setActiveEdit(false);
    
    if (rows) { // if
      const newRows = rows.map((row ) => {
        if (row.id === id) {
          setActualValue(prevValue);
          return {
            ...row,
            name: prevValue.name,
            surname: prevValue.surname,
            dateOfAdd: prevValue.dateOfAdd,
            dateOfDelete: prevValue.dateOfDelete ? prevValue.dateOfDelete : null,
            isEditMode: false,
          };
        }
        return row;
      });
      setRows(newRows);
    }
  };

  const handleDelete = (id: string) => {
    if (rows) {
      const memberToDelete = rows.filter((el: IPerson) => el.id === id)[0];
      if (activeRow !== memberToDelete.id) return alert('Wejdź w tryb edycji');
      if (window.confirm(`Jesteś pewien, że chcesz usunąć osobę: ${memberToDelete.name} ${memberToDelete.surname}`)) {
        memberToDelete.dateOfDelete = new Date();
        memberToDelete.feeState && memberToDelete.feeState < 0 ? 
          deleteTeamMember(memberToDelete) : permanentDeleteTeamMember(memberToDelete);
        setActualValue(prev => {
          return {
            ...prev,
            dateOfDelete: memberToDelete.dateOfDelete,
          };
        });
      }
    };
  };

  const handleChangeSelect = (value: string) => {
    setTeam(value);
    console.log(registry);
  };

  useEffect(() => {
    const usedRegistry = registry && team === 'Cały hufiec' ? [...Object.values(registry)].flat() : registry[team];

    if (usedRegistry) {
      sortOfSurname(usedRegistry, 'ŻŻŻ');
    }
    
    const rows = usedRegistry ? (
      usedRegistry.map((member, index) => {
        return (
          {
            lp: index + 1,
            ...member,
            feeState: countingMemberFee(member)
          }
        );
      })) : ([]);
    setRows(rows);

    let usedData: DataToExport[] = []; 
    if (registry) {
      if (team === 'Cały hufiec') {
        usedData = Object.entries(registry)
          .map(([key, value]: [string, APIPerson[]]) => [...value.map((p: APIPerson) => {
            return { ...p, team: key, feeState: countingMemberFee(p) };
          })]).flat();
      } else {
        usedData = registry[team] ? registry[team].map(p => {
          return { ...p, team, feeState: countingMemberFee(p) };
        }) : [];
      }
    }

    setDataToExport(usedData);
  },[team, registry]);


  const handleDateChange = (e: Date | null, row: IPerson, nameKey: string) => {
    const name = nameKey;
    let value = e;
    const valueDate = e && Date.parse(`${e}`) ? actualValue.dateOfDelete : null;
    if (valueDate && nameKey === 'dateOfAdd') {
      if (new Date(`${prevValue.dateOfDelete}`).getTime() - new Date(`${e}`).getTime() > 0) {
        value = e;
      } else value = prevValue.dateOfAdd;
    }
    if (valueDate && nameKey === 'dateOfDelete') {
      if (new Date(`${e}`).getTime() - new Date(`${prevValue.dateOfAdd}`).getTime() > 0) {
        value = e;
      } else value = prevValue.dateOfDelete ? prevValue.dateOfDelete : null;
    }
    const { id } = row;
    if (rows) {
      const newRows = rows.map(row => {
        if (row.id === id) {
          setActualValue((prev: IPerson) => {
            return { ...prev, [name]: value };
          });
          return { ...row, [name]: value };
        }
        return row;
      });
      setRows(newRows);
    }

  };

  return (
    <>
      <LogOut />
      <Navigation />
      <FilterName 
        name={name}
        setName={setName}
        surname={surname}
        setSurname={setSurname}
      />
      <SelectTeam onChange={handleChangeSelect} team={team}/>
      <CSVLink data={dataToExport} filename={`${team}.csv`}>
        <Button variant="contained" color="primary" >Pobierz stan składek</Button>
      </CSVLink>
      <Table className={classes.table} aria-label="caption table">
        <TableHead>
          <TableRow>
            <TableCell align="left">Edytuj</TableCell>
            <TableCell align="left">LP</TableCell>
            <TableCell align="left">Nazwisko</TableCell>
            <TableCell align="left">Imię</TableCell>
            <TableCell align="left">Data dodania</TableCell>
            <TableCell align="left">Data usunięcia</TableCell>
<<<<<<< HEAD
            <TableCell align="left"></TableCell>
=======
            <TableCell align="left">Stan składek</TableCell>
>>>>>>> master
            <TableCell align="left">Usuń</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
<<<<<<< HEAD
          {console.log(rows)}
          {rows && rows.map((row: IPerson) => (
            <TableRow key={row.id}>
              <TableCell className={classes.selectTableCell}>
                {row.isEditMode ? (
                  <>
                    <IconButton
                      aria-label="done"
                      onClick={() => handleAcceptChange(row.id)}
                    >
                      <DoneIcon />
                    </IconButton>
=======
          {rows && rows
            .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
            .map((row: IPerson) => (
              <TableRow key={row.id}>
                <TableCell className={classes.selectTableCell}>
                  {row.isEditMode ? (
                    <>
                      <IconButton
                        aria-label="done"
                        onClick={() => handleAcceptChange(row.id)}
                      >
                        <DoneIcon />
                      </IconButton>
                      <IconButton
                        aria-label="revert"
                        onClick={() => onRevert(row.id)}
                      >
                        <RevertIcon />
                      </IconButton>
                    </>
                  ) : (
>>>>>>> master
                    <IconButton
                      aria-label="delete"
                      onClick={() => onToggleEditMode(row.id)}
                    >
                      <EditIcon />
                    </IconButton>
                  )}
                </TableCell>
                <CustomTableCell {...{ row, name: Rows.Lp, onChange }} />
                <CustomTableCell {...{ row, name: Rows.Surname, onChange }} />
                <CustomTableCell {...{ row, name: Rows.Name, onChange }} />
                {/* <CustomTableCell {...{ row, name: 'dateOfAdd', onChange }} /> */}
                <TableCell >
                  <KeyboardDatePicker
                    disabled={activeRow !== row.id}
                    disableToolbar
                    variant="inline"
                    key={row.id}
                    margin="normal"
                    id="date-picker-dialog"
                    // label="Data dodania"
                    format="dd/MM/yyyy"
                    value={row.dateOfAdd ? new Date(row.dateOfAdd) : null}
                    onChange={(e) => handleDateChange(e, row, 'dateOfAdd')}
                    KeyboardButtonProps={{
                      'aria-label': 'change date'
                    }}
                  />
                </TableCell>
                <TableCell>
                  <KeyboardDatePicker
                    disabled={activeRow !== row.id}
                    disableToolbar
                    variant="inline"
                    key={row.id}
                    margin="normal"
                    id="date-picker-dialog"
                    // label="Data usunięcia"
                    format="dd/MM/yyyy"
                    value={row.dateOfDelete ? new Date(row.dateOfDelete) : null}
                    onChange={(e) => handleDateChange(e, row, 'dateOfDelete')}
                    KeyboardButtonProps={{
                      'aria-label': 'change date'
                    }}
                  /></TableCell>
                <TableCell>{row.feeState}</TableCell>
                <TableCell className={classes.selectTableCell}>
                  <IconButton
                    aria-label="delete"
                    onClick={() => handleDelete(row.id)}
                  >
                    <DeleteIcon />
                  </IconButton>
<<<<<<< HEAD
                )}
              </TableCell>
              <CustomTableCell {...{ row, name: Rows.Lp, onChange }} />
              <CustomTableCell {...{ row, name: Rows.Name, onChange }} />
              <CustomTableCell {...{ row, name: Rows.Surname, onChange }} />
              <TableCell>{row.dateOfAdd ? new Date(row.dateOfAdd).toLocaleDateString() : ''}</TableCell>
              <TableCell>{row.dateOfDelete ? new Date(row.dateOfDelete).toLocaleDateString() : ''}</TableCell>
              <TableCell>
                {row.isEditMode && <TextField
                    id="standard-select-currency-native"
                    select
                    label="Wybierz"
                    value={newTeam}
                    onChange={handleChangeTeam}
                    SelectProps={{
                      native: true,
                    }}
                    helperText="Przenieś do innej drużyny"
                  ></TextField>}
              </TableCell>
              <TableCell className={classes.selectTableCell}>
                <IconButton
                  aria-label="delete"
                  onClick={() => handleDelete(row.id)}
                >
                  <DeleteIcon />
                </IconButton>
              </TableCell>
            </TableRow>
          ))}
=======
                </TableCell>
              </TableRow>
            ))}
>>>>>>> master
        </TableBody>
      </Table>
      <TablePagination
        rowsPerPageOptions={[25, 50, 100]}
        component="div"
        count={rows.length}
        rowsPerPage={rowsPerPage}
        page={page}
        onChangePage={handleChangePage}
        onChangeRowsPerPage={handleChangeRowsPerPage}
        labelRowsPerPage="Ilośc wierszy na stronie"
      />
    </>
  );
};

export default EditorTeam;
