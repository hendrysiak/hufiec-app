import { Box, MenuItem, TablePagination, TextField } from '@material-ui/core';
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
import { Tab, Tabs } from '@mui/material';
import React, { useState, useEffect, FC } from 'react';

import { CSVLink } from 'react-csv';
import { useSelector } from 'react-redux';

import { useTeams } from 'helpers/hooks/useTeams';
import { sortOfSurname } from 'helpers/sorting.helper';
import { Rows } from 'models/global.enum';
import { APIPerson } from 'models/registry.models';
import TeamFinances from 'pages/Team/components/TeamFinances/TeamFinances';
import { countAmountOfFee, countingMemberFee } from 'pages/Team/helpers/member-fee.helper';
import { FiltersName } from 'shared/TableEditor/FiltersName';
import { TabPanel } from 'shared/TabPanel/TabPanel';
import { RootState } from 'store/models/rootstate.model';

import { editTeamMember } from '../../helpers/editing-db.handler';

import { CustomTableCell } from './components/newCell';
import SelectTeam from './components/SelectTeam';
import { controlerDate, filterMembers, handleDelete } from './helpers/helpers';
import { useStyles } from './stylesTable';

export interface IPerson extends APIPerson {
  lp?: number;
}

interface EditorTeamProps {
  isAdmin?: boolean;
}

const EditorTeam = (props: EditorTeamProps): JSX.Element => {
  const registry = useSelector((state: RootState) => state.income.registry);
  const dbIncomes = useSelector((state: RootState) => state.income.dbIncomes);
  const dbOutcomes = useSelector((state: RootState) => state.income.dbOutcomes);

  const teams = useTeams();

  const [rows, setRows] = useState<IPerson[]>([]);
  const [team, setTeam] = useState<string>('');
  const classes = useStyles();

  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(25);

  const [name, setName] = useState<string>('');
  const [surname, setSurname] = useState<string>('');

  const [activeRow, setActiveRow] = useState<string | null>(null);
  const [newData, setNewData] = useState<Partial<APIPerson> | null>(null);

  const [tab, setTab] = useState(0);

 
  const handleTabChange = (event: React.ChangeEvent<{}>, newValue: number) => {
    setTab(newValue);
  };

  const clearStateRow = () => {
    setActiveRow(null);
    setNewData(null);
  };

  const handleChangePage = (event: unknown, newPage: number) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };
    
  const handleAcceptChange = async (id: string) => {
    if (!newData || !window.confirm('Na pewno zapisać zmiany?')) return;

    try {
      await editTeamMember(team, newData);
      alert('Edycja zakończona sukcesem.');
      clearStateRow();
      return;
    }
    catch (err) {
      alert('Wystąpił błąd podczas edycji. Spróbuj ponownie.');
    }
    onToggleEditMode(id);
  };

  const onToggleEditMode = (id: string) => {
    if (activeRow && 
      !window.confirm(`Jesteś w trakcie edycji innej osoby. Naciśnij okej, a usuniesz wszelkie wprowadzone zmiany.`)) {
      return;
    };
    setNewData(null);
    setActiveRow(id);
    setNewData((prev) => {
      return ({
        ...prev,
        id,
        team
      });
    });
  };

  const onChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { value, name, } = e.target;
    
    setNewData((prev) => {
      return ({
        ...prev,
        [name]: value
      });
    });
  };

  const onRevert = () => {
    if (!window.confirm('jesteś pewien, że chcesz cofnąć zmiany?')) return;
    clearStateRow();
  };

  const handleChangeSelect = (value: string) => {
    if (activeRow && !window.confirm('Jestes w trakcie edycji, jestes pewien, że chcesz zakończyć bez zapisywania zmian?')) {
      return;
    }
    clearStateRow();
    setTeam(value);
  };

  useEffect(() => {
    let usedRegistry: APIPerson[] = [];

    if (team === 'Cały hufiec') {
      for (const currentTeam in registry) {
        usedRegistry = [...usedRegistry, ...Object.values(registry[currentTeam])];
      }

    } else usedRegistry = registry[team] ? [...Object.values(registry[team])] : [];

    if (usedRegistry) {
      sortOfSurname(usedRegistry, 'ŻŻŻ');
    }
    const rows = usedRegistry ? filterMembers(usedRegistry, name, surname) : ([]);
    setRows(rows);
  },[team, registry, name, surname]);


  const handleDateChange = (e: Date | null, row: IPerson, nameKey: string) => {
    
    const value = e;
    if (!value) return;

    if (controlerDate(value, newData, row, nameKey)) {
      alert('Data usunięcia członka nie może być wcześniej niż data dodania go do drużyny.');
      return;
    };
    
    setNewData((prev) => {
      return ({
        ...prev, 
        [nameKey]: value
      });
    });
  };

  const sumOfNeededFees = () => {
    const currentYear = new Date().getFullYear();
    const lastDayOfPreviousYear = new Date(currentYear - 1, 11, 31);

    return rows
      .reduce((sum: number, person: APIPerson) => {
        const fees = countingMemberFee(person, lastDayOfPreviousYear);

        if (Number(fees) < 0) return sum + Number(fees);

        return sum + 0;
      }, 0);
  };

  return (
    <>
      <Box display="flex" justifyContent="center" alignItems="center" p={4}>     
        <FiltersName 
          name={name}
          setName={setName}
          surname={surname}
          setSurname={setSurname}
        />
        <SelectTeam onChange={handleChangeSelect} team={team} disabled={activeRow ? true : false}/>
        <CSVLink data={rows} filename={`${team}.csv`} style={{ margin: '0 8px' }}>
          <Button variant="contained" color="primary" >Pobierz stan składek</Button>
        </CSVLink>
      </Box>
      <Tabs 
        value={tab} 
        variant="fullWidth"
        textColor="primary"
        indicatorColor="primary"
        onChange={handleTabChange}
      >
        <Tab label="Składki i ewidencja" />
        <Tab label="Stan finansów" />
      </Tabs>
      <TabPanel value={tab} index={0}>
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
              <TableCell align="left"></TableCell>
              <TableCell align="left">Usuń</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {rows && rows
              .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
              .map((row: IPerson) => (
                <TableRow key={row.id}>
                  <TableCell className={classes.selectTableCell}>
                    {row.id === activeRow ? (
                      <>
                        <IconButton
                          aria-label="done"
                          onClick={() => handleAcceptChange(row.id)}
                        >
                          <DoneIcon />
                        </IconButton>
                        <IconButton
                          aria-label="revert"
                          onClick={onRevert}
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
                  <CustomTableCell {...{ row, name: Rows.Lp, onChange, id: activeRow, newData }} />
                  <CustomTableCell {...{ row, name: Rows.Surname, onChange, id: activeRow, newData }} />
                  <CustomTableCell {...{ row, name: Rows.Name, onChange, id: activeRow, newData }} />
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
                      value={newData?.dateOfAdd && activeRow === row.id ? 
                        new Date(newData.dateOfAdd) : 
                        row.dateOfAdd ? new Date(row.dateOfAdd) : null }
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
                      value={newData?.dateOfDelete && activeRow === row.id ? 
                        new Date(newData.dateOfDelete) : 
                        row.dateOfDelete ? new Date(row.dateOfDelete) : null}
                      onChange={(e) => handleDateChange(e, row, 'dateOfDelete')}
                      KeyboardButtonProps={{
                        'aria-label': 'change date'
                      }}
                    /></TableCell>
                  <TableCell>{row.feeState}</TableCell>
                  {row.id === activeRow ? 
                    <TableCell>
                      <TextField
                        name={Rows.Team}
                        id="standard-select-currency"
                        select
                        label="Wybierz"
                        value={newData?.team}
                        onChange={(e) => onChange(e)}
                        helperText="Przenieś do innej drużyny"
                      >
                        {teams?.map(t => t.teamId).map((team) => (
                          <MenuItem key={team} value={team}>
                            {team}
                          </MenuItem>
                        ))}
                      </TextField>
                    </TableCell> : <TableCell></TableCell>}
                  <TableCell className={classes.selectTableCell}>
                    <IconButton
                      aria-label="delete"
                      color={row && Number(row.feeState) >= 0 ? 'secondary' : 'primary'}
                      onClick={() => handleDelete(rows, row.id, props.isAdmin)}
                    >
                      <DeleteIcon />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))}
          </TableBody>
        </Table>
        <TablePagination
          rowsPerPageOptions={[25, 50, 100]}
          count={rows.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onChangeRowsPerPage={handleChangeRowsPerPage}
          labelRowsPerPage="Ilość wierszy na stronie"
          onPageChange={handleChangePage}
        />
      </TabPanel>
      <TabPanel value={tab} index={1}>
        {team ? <TeamFinances neededFee={sumOfNeededFees()} incomes={dbIncomes.filter(i => i.team === `${team}`)} outcomes={dbOutcomes.filter(o => o.team === `${team}`)} currentTeam={team} /> : <p>Wybierz drużynę</p>}
      </TabPanel>
    </>
  );
};

export default EditorTeam;
