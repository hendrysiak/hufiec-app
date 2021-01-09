

import { TextField, MenuItem } from '@material-ui/core';
import Button from '@material-ui/core/Button';
import IconButton from '@material-ui/core/IconButton';
import Input from '@material-ui/core/Input';
import { makeStyles } from '@material-ui/core/styles';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import DeleteIcon from '@material-ui/icons/Delete';
import DoneIcon from '@material-ui/icons/DoneAllTwoTone';
import EditIcon from '@material-ui/icons/EditOutlined';
import RevertIcon from '@material-ui/icons/NotInterestedOutlined';


import React, { useState, useEffect } from 'react';


import { useSelector } from 'react-redux';

import { APIPerson } from 'models/registry.models';

import Navigation from 'shared/Navigation/Navigation';
import { RootState } from 'store/models/rootstate.model';

import styles from './EditorTeam.module.css';

const useStyles = makeStyles(theme => ({
  root: {
    width: '100%',
    marginTop: theme.spacing(3),
    overflowX: 'auto'
  },
  table: {
    minWidth: 650
  },
  selectTableCell: {
    width: 60
  },
  tableCell: {
    width: 130,
    height: 40
  },
  input: {
    width: 130,
    height: 40
  }
}));

interface IPerson extends APIPerson{
  lp?: number;
  isEditMode?: boolean;
}

interface IProps {
  row: IPerson
  name: string;
  onChange: any;
}

const CustomTableCell = ({ row, name, onChange }: IProps) => {
  const classes = useStyles();
  const { isEditMode } = row;
  return (
    <TableCell align="left" className={classes.tableCell}>
      {isEditMode ? (
        <Input
          value={row[name]}
          name={name}
          onChange={e => onChange(e, row)}
          className={classes.input}
        />
      ) : (
        row[name]
      )}
    </TableCell>
  );
};

const EditorTeam = (): JSX.Element => {
  const registry = useSelector((state: RootState) => state.income.registry);
  const [rows, setRows] = useState<IPerson[] | undefined>();
  const [team, setTeam] = useState<string>('');
  const [previous, setPrevious] = useState<any>({});
  const classes = useStyles();


  const onToggleEditMode = (id: string) => {
    rows && setRows(() => {
      return rows.map((row) => { 
        if (row.id === id) {
          return { ...row, isEditMode: !row.isEditMode };
        }
        return row;
      });
    });
  };


  const onChange = (e: { target: { getAttribute: (arg0: string) => string; value: any; name: string; }; }, row: { id: string; }) => {
    if (e.target.getAttribute('name') === 'lp') return;
    if (!previous[row.id]) {
      setPrevious((state: any) => ({ ...state, [row.id]: row }));
    }
    const value = e.target.value;
    const name = e.target.name;
    const { id } = row;
    if (rows) {
      const newRows = rows.map(row => {
        if (row.id === id) {
          return { ...row, [name]: value };
        }
        return row;
      });
      console.log(newRows);
      setRows(newRows);
    }
  };

  const onRevert = (id: string) => {
    if (rows) { // if
      const newRows = rows.map((row: { id: string; } ) => {
        if (row.id === id) {
          return previous[id] ? previous[id] : row;
        }
        return row;
      });
      setRows(newRows);
    }
    setPrevious((state: any) => {
      delete state[id];
      return state;
    });
    onToggleEditMode(id);
  };

  const handleDelete = (id: string) => {
    if (rows) {
      const memberToDelete = rows.filter((el: { id: string; }) => el.id === id)[0];
      if (!window.confirm(`Jesteś pewien, że chcesz usunąć osobę: ${memberToDelete.name} ${memberToDelete.surname}`)) return;
    };
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
  },[team]);

  return (
    <>
      <Navigation />
      <div className={styles.div}>
        <TextField
          style={{ marginTop: '16px', width: '200px' }}
          label="Wybierz drużynę"
          value={team}
          onChange={(e) => setTeam(e.target.value)}
          placeholder="Wybierz drużynę z listy"
          select={true}
          size="small"
          variant="outlined"
          margin="normal"
          SelectProps={{
            MenuProps: { disableScrollLock: true }
          }}
        >
          {registry && ['', ...Object.keys(registry)].map((item) => (
            <MenuItem key={item} value={item}>{item}</MenuItem>
          ))}
        </TextField>
        <Button className={styles.button} variant="contained" color="primary" disabled={team ? false : true}>
             NOWY CZŁONEK
        </Button>
      </div>
      <Table className={classes.table} aria-label="caption table">
        <caption>A barbone structure table example with a caption</caption>
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
                      onClick={() => onToggleEditMode(row.id)}
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
              {console.log(row)}
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