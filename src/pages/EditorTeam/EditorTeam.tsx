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
import React, { useState, useEffect, FC } from 'react';

import { useSelector } from 'react-redux';

import { APIPerson } from 'models/registry.models';
import Navigation from 'shared/Navigation/Navigation';
import { RootState } from 'store/models/rootstate.model';

import { deleteTeamMember, editTeamMember } from '../../helpers/editing-db.handler';

import SelectTeam from './components/SelectTeam';
import { CustomTableCell } from './functions/newCell';
import { useStyles } from './stylesTable';

export interface IPerson extends APIPerson {
  lp?: number;
  isEditMode?: boolean;
}

const EditorTeam: FC = () => {
  const registry = useSelector((state: RootState) => state.income.registry);
  const [rows, setRows] = useState<IPerson[] | undefined>();
  const [team, setTeam] = useState<string>('');
  const classes = useStyles();
  const [actualValue, setActualValue] = useState<IPerson>(
    { name: '', surname:'', id: '' }
  );
  const [prevValue, setPrevValue] = useState<IPerson>(
    { name: '', surname: '', id: '' }
  );
  const [activeEdit, setActiveEdit] = useState<boolean>(false);

  const handleAcceptChange = (id: string) => {
    rows && rows.map(el => {
      if (el.id === id && (prevValue.name !== actualValue.name || prevValue.surname !== actualValue.surname )) {
        editTeamMember(team, actualValue);
        setPrevValue((prev) => (
          {
            ...prev,
            name: actualValue.name,
            surname: actualValue.surname
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
    setActiveEdit(!activeEdit);
    rows && rows.find(el => {
      if (el.id === id) {
        setActualValue(el);
      };
    });
    rows && setRows(() => {
      return rows.map((row) => { 
        if (row.id === id) {
          setPrevValue(row);
          return { ...row, isEditMode: !row.isEditMode };
        }
        return row;
      });
    });
  };

  const onChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>, row: IPerson) => {
    if (e.target.getAttribute('name') === 'lp') return;
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
            surname: prevValue.surname 
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
      if (window.confirm(`Jesteś pewien, że chcesz usunąć osobę: ${memberToDelete.name} ${memberToDelete.surname}`)) deleteTeamMember(team, memberToDelete);
    };
  };

  const handleChangeSelect = (value: string) => {
    setTeam(value);
  };

  useEffect(() => {
    const rows = registry && registry[team] ? (
      registry[team].map((member, index) => {
        return (
          {
            lp: index + 1,
            ...member
          }
        );
      })) : ([]);
    setRows(rows);
  },[team, registry]);

  return (
    <>
      <Navigation />
      <SelectTeam onChange={handleChangeSelect} team={team}/>
      <Table className={classes.table} aria-label="caption table">
        <TableHead>
          <TableRow>
            <TableCell align="left">Edytuj</TableCell>
            <TableCell align="left">LP</TableCell>
            <TableCell align="left">Name</TableCell>
            <TableCell align="left">Surname</TableCell>
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
              <CustomTableCell {...{ row, name: 'lp', onChange }} />
              <CustomTableCell {...{ row, name: 'name', onChange }} />
              <CustomTableCell {...{ row, name: 'surname', onChange }} />
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
