import { TextField, MenuItem , makeStyles, createStyles } from '@material-ui/core';
import IconButton from '@material-ui/core/IconButton';
import Tooltip from '@material-ui/core/Tooltip';
import { DataGrid } from '@material-ui/data-grid';

import GetAppIcon from '@material-ui/icons/GetApp';
import React, { useEffect, useMemo, useState } from 'react';
import { CSVLink } from 'react-csv';
import { useSelector } from 'react-redux';

import { IncomeDb } from 'models/income.models';

// import ListContainer from 'shared/ListContainer/ListContainer';
import ListEl from 'shared/ListEl/ListEl';
import { LogOut } from 'shared/LogOut/LogOut';
import Navigation from 'shared/Navigation/Navigation';
import { RootState } from 'store/models/rootstate.model';

import classes from './Codes.module.css';


interface Row {
  id: string;
  lp: number;
  name: string | null;
  surname: string | null;
  team: string | null;
  cash: number;
  dateOfBook: string;
}

const Codes = (): JSX.Element => {
  const dbIncomes = useSelector((state: RootState) => state.income.dbIncomes);
  const codes = useSelector((state: RootState) => state.income.codes);

  const [ usedCodes, setUsedCodes ] = useState<string[]>([]);
  const [ currentCode, setCurrentCode ] = useState<string>('');

  const [dataToExport, setDataToExport] = useState<IncomeDb[]>([]);

  const [rows, setRows] = useState<Row[]>();
  
  const columns = [
    { field: 'lp', headerName: 'LP', width: 60, },
    { field: 'name', headerName: 'Imię', width: 150 },
    { field: 'surname', headerName: 'Nazwisko', width: 150 },
    { field: 'team', headerName: 'Drużyna', width: 150 },
    { field: 'cash', headerName: 'Kwota', width: 150 },
    { field: 'dateOfBook', headerName: 'Data wpłaty', width: 120 },
    { field: 'title', headerName: 'Tytuł', width: 340 }
  ];

  useEffect(() => {
    if (codes) {
      const codesToUse = codes.map(code => code.code);
      setCurrentCode(codesToUse[0]);
      setUsedCodes(codesToUse);
    }
  }, [codes]);

  useEffect(() => {
    let rows = [];
    
    if (currentCode === 'Błedy niewyjaśnione') {
      const filteredIncomes = dbIncomes && dbIncomes.filter(i => !i.event || !i.name || !i.surname || !i.team || !i.year );
      setDataToExport(filteredIncomes);
      
      rows = filteredIncomes.map((income, index) => {
        return {
          ...income,
          lp: index + 1,
          dateOfBook: new Date(income.dateOfBook).toLocaleDateString()
        };
      });

    } else {
      const filteredIncomes = dbIncomes && dbIncomes.filter(i => i.event === currentCode);
      setDataToExport(filteredIncomes);

      rows = filteredIncomes.map((income, index) => {
        return {
          ...income,
          lp: index + 1,
          dateOfBook: new Date(income.dateOfBook).toLocaleDateString()
        };
      });
    }
    setRows(rows);
  },[currentCode]);

  const tooltipStyles = useMemo(() => makeStyles(() => 
    createStyles({
      tooltip: {
        fontSize: 16
      },
    })), []);

  const tooltipsClasses = tooltipStyles();


  return (
    <>
      <LogOut />
      <Navigation />
      <header>

        <TextField 
          style={{ width: '80%', marginTop: '16px' }}
          value={currentCode}
          onChange={(e) => setCurrentCode(e.target.value)}
          placeholder="Wybierz kod z listy"
          select={true}
          size="small"
          variant="outlined"
          margin="normal"
          SelectProps={{
            MenuProps: { disableScrollLock: true }
          }}
        >
          {usedCodes && [...usedCodes, 'Błedy niewyjaśnione'].map((item) => (
            <MenuItem key={item} value={item}>{item}</MenuItem>
          ))}
        </TextField>
        <Tooltip title="Wyeksportuj widok do CSV" classes={tooltipsClasses}>
          <CSVLink data={dataToExport} filename={`${currentCode}.csv`}>
            <IconButton aria-label="account-state">
              <GetAppIcon/>
            </IconButton>
          </CSVLink>
        </Tooltip>
        <h2>Lista po kodzie</h2>

      </header>
      <main className={classes.Main}>
        {/* {children && <ListContainer
            title={currentCode}
          >
            {children}
          </ListContainer>} */}
        {rows?.length ? (
          <DataGrid rows={rows} columns={columns} pageSize={rows.length - 1} autoHeight={true}/> 
        ) : (
          <div>Brak wpłat na kod</div>
        )
        }
      </main>
    </>
  );
};

export default Codes;
