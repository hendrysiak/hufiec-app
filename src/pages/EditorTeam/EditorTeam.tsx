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

export interface IPerson extends APIPerson {
  lp?: number;
  isEditMode?: boolean;
}

interface DataToExport extends IPerson {
  team: string
}

const EditorTeam: FC = () => {
  const registry = useSelector((state: RootState) => state.income.registry);
  const [rows, setRows] = useState<IPerson[]>([]);
  const [dataToExport, setDataToExport] = useState<DataToExport[]>([]);
  const [team, setTeam] = useState<string>('');
  const classes = useStyles();
  const [actualValue, setActualValue] = useState<IPerson>(
    { name: '', surname:'', id: '', dateOfAdd: null }
  );
  const [prevValue, setPrevValue] = useState<IPerson>(
    { name: '', surname: '', id: '', dateOfAdd: null, dateOfDelete: null }
  );
  const [activeEdit, setActiveEdit] = useState<boolean>(false);
  const [activeRow, setActiveRow] = useState<string | null>(null);
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
      memberToDelete.dateOfDelete = new Date();
      if (activeRow !== memberToDelete.id) return alert('Wejdź w tryb edycji');
      if (window.confirm(`Jesteś pewien, że chcesz usunąć osobę: ${memberToDelete.name} ${memberToDelete.surname}`)) {
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
  };

  useEffect(() => {
    const usedRegistry = registry && team === 'Cały hufiec' ? [...Object.values(registry)].flat() : registry[team];
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
    sortOfSurname(rows, 'ŻŻŻ');
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
            <TableCell align="left">Stan składek</TableCell>
            <TableCell align="left">Usuń</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
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
                    <IconButton
                      aria-label="revert"
                      onClick={() => onRevert(row.id)}
                    >
                      <RevertIcon />
                    </IconButton>
                  </>
                ) : (
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
              {/* <TableCell>{row.dateOfAdd ? new Date(row.dateOfAdd).toLocaleDateString() : ''}</TableCell> */}
              {/* <TableCell>{row.dateOfDelete ? new Date(row.dateOfDelete).toLocaleDateString() : ''}</TableCell> */}
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
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table></>
  );
};

export default EditorTeam;
