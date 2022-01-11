import { Box, Button, FormControl, MenuItem, Modal, Select, TextField } from '@material-ui/core';
import { AddIcon } from '@material-ui/data-grid';
import ChevronLeftIcon from '@material-ui/icons/ChevronLeft';
import ChevronRightIcon from '@material-ui/icons/ChevronRight';
import EditIcon from '@mui/icons-material/Edit';
import { IconButton, Tooltip } from '@mui/material';
import React, { useEffect, useRef, useState } from 'react';

import { useSelector } from 'react-redux';

import { useLocation } from 'react-router';

import { saveProposal } from 'helpers/api-helpers/proposal';
import { ProposalArea, ProposalKind } from 'models/global.enum';
import { IncomeDb } from 'models/income.models';

import './style.css';

import { Proposal } from 'models/proposal.models';
import { useSnackbar } from 'providers/SnackbarProvider/SnackbarProvider';
import { teamsMap } from 'shared/team.helper';
import { RootState } from 'store/models/rootstate.model';

enum ActionPagination {
  Next = 'next',
  Prev = 'prev'
}

export const List = ({ navHeight, scrollPosition, rows }: 
{navHeight: number | null, scrollPosition: number, rows: IncomeDb[]}): JSX.Element => {
  const codes = useSelector((state: RootState) => state.income.codes)?.map(c => c?.code);
  const user = useSelector((state: RootState) => state.user);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(25);
  const [displayRows, setDisplayRows] = useState<IncomeDb[]>(rows);
  const [barFixed, serBarFixed] = useState<boolean>(false);
  const [heightFirstLi, setHeightFirstLi] = useState<number>(0);
  const [newValues, setNewValues] = useState<IncomeDb>({
    cash: 0,
    title: '',
    dateOfBook: new Date(),
    importDate: new Date(),
    year: new Date().getFullYear(),
    event: '',
    id: '',
    name: '',
    surname: '',
    team: '',
  });
  const [currentValues, setCurrentValues] = useState<IncomeDb>({
    cash: 0,
    title: '',
    dateOfBook: new Date(),
    importDate: new Date(),
    year: new Date().getFullYear(),
    event: '',
    id: '',
    name: '',
    surname: '',
    team: '',
  });
  const [openChangeModal, setOpenChangeModal] = useState(false);

  const { setSnackbar } = useSnackbar();

  const { pathname } = useLocation();

  const handleRowsPerPage = (value: string) => { 
    setRowsPerPage(Number(value));

    if ((page * rowsPerPage) > displayRows.length) {
      setPage(0);
    }

  };

  const handleChangeIncome = async() => {
    try {
      if (user.evidenceNumber) {
        const newProposal: Proposal = {
          elementId: currentValues.id,
          author: user.evidenceNumber,
          area: ProposalArea.Income,
          kind: ProposalKind.Edit,
          oldValues: currentValues, 
          newValues: newValues,
          team: pathname.slice(1),
          dateOfCreation: new Date(),
        };

        await saveProposal(newProposal);
        setSnackbar({ children: 'Propozycja zmiany zapisana pomyślnie', severity: 'success' });
      } else {
        setSnackbar({ children: 'Wystąpił błąd - odśwież', severity: 'error' });
      }
      
    } catch (err) {
      setSnackbar({ children: 'Nieoczekiwany błąd - spróbuj ponownie', severity: 'error' });
    }

    setOpenChangeModal(false);
    setNewValues({
      cash: 0,
      title: '',
      dateOfBook: new Date(),
      event: '',
      id: '',
      importDate: new Date(),
      name: '',
      surname: '',
      team: '',
      year: new Date().getFullYear(),
    });
  };

  useEffect(() => {
    if (navHeight && navHeight < scrollPosition) {
      if (firstLi?.current?.clientHeight) {
        setHeightFirstLi(firstLi?.current?.clientHeight);
      }
      serBarFixed(true);
    } else {
      setHeightFirstLi(0);
      serBarFixed(false);
    };
  },[scrollPosition]);

  useEffect(() => {
    const min = page * rowsPerPage;
    const max = min + rowsPerPage;
    const copyRows = [...rows].slice(min,max);
    setDisplayRows(copyRows);
  },[rowsPerPage, page, rows]);
  
  useEffect(() => {
    window.scrollTo(0,0);
  },[page]);

  const handleChangePage = (action: string) => {
    
    if (action === ActionPagination.Next && rows.length > page * rowsPerPage + rowsPerPage) {
      setPage(prev => prev + 1);
    }
    if (action === ActionPagination.Prev && page > 0) {
      setPage(prev => prev - 1);
    }
  };

  const firstLi = useRef<HTMLLIElement>(null);

  const controlEntireDataRow = (el: IncomeDb) => {
    if (el.name && el.surname && el.dateOfBook && el.title && el.event && el.cash) {
      return true;
    }
    return false;
  };

  return (
    <div className="containerList">
      <ul className="ul">
        <li ref={firstLi} className={`first ${barFixed ? 'fixedBar' : ''}`}>
          <div className="containerGroup">
            <p className="name">NAZWISKO I IMIĘ</p>
            <p className="date">DATA</p>
            <p className="title">TYTUŁ</p>
          </div>
          <p className="event">KOD</p>
          <p className="cash">KWOTA</p>
          <p className="cash">AKCJA</p>
        </li>
        {displayRows.map((el: IncomeDb, index: number) => {
          return (
            <li 
              key={index} 
              style={{ marginTop: `${index === 0 && barFixed ? heightFirstLi + 'px' : '0'}` }} 
              className={`li ${controlEntireDataRow(el) ? '' : 'incompleteData'}`}>
              <div className="containerGroup">
                <p className="name">{el.surname} {el.name}</p>
                <p className="date">{el.dateOfBook} </p>
                <p className="title">{el.title}</p>
              </div>
              <p className="event">{el.event}</p>
              <p className="cash">{el.cash}</p>
              <p className="cash">
                <Tooltip title="Podejmij akcję">
                  <IconButton aria-label="account-state" onClick={() => {
                    setOpenChangeModal(true);
                    setCurrentValues(el);
                    setNewValues(el);
                  }}>
                    <EditIcon fontSize="large" color="inherit" />
                  </IconButton>
                </Tooltip>
              </p>
            </li>
          );
        })}
        <li className="li paginationContainer">
          <div className="paginationItem">
            <p className="textRowPag">Ilość wierszy na stronie:</p> 
            <FormControl>
              <Select
                value={rowsPerPage}
                onChange={(e: React.ChangeEvent<{ value: unknown }>): void => handleRowsPerPage(e.target.value as string)}
                displayEmpty
                inputProps={{ 'aria-label': 'Without label' }}
              >
                <MenuItem value={25}>25</MenuItem>
                <MenuItem value={50}>50</MenuItem>
                <MenuItem value={100}>100</MenuItem>
              </Select>
            </FormControl>
          </div>
          <div className="paginationItem">
            od {page * rowsPerPage + 1} do {page * rowsPerPage + rowsPerPage < rows.length ? 
              page * rowsPerPage + rowsPerPage : rows.length } of {rows.length}
          </div>
          <div className="paginationItem">
            <ChevronLeftIcon onClick={() => handleChangePage(ActionPagination.Prev)} style={{ cursor: 'pointer', fontSize: '44px' }}/> 
            <ChevronRightIcon onClick={() => handleChangePage(ActionPagination.Next)} style={{ cursor: 'pointer', fontSize: '44px' }}/>
          </div>
        </li>
      </ul>
      <Modal
        open={openChangeModal}
      >
        <div style={{ width: '80%', backgroundColor: 'white', transform: 'translate(13%, 10%)', display: 'flex', flexDirection: 'column' }}>
          <h3 style={{ textAlign: 'center', margin: '32px' }}>STARE WARTOŚCI</h3>
          <li className="first">
            <div className="containerGroup">
              <p className="name">NAZWISKO I IMIĘ</p>
              <p className="date">DATA</p>
              <p className="title">TYTUŁ</p>
            </div>
            <p className="event">KOD</p>
            <p className="cash">KWOTA</p>
          </li>
          <li 
            className={`li ${controlEntireDataRow(currentValues) ? '' : 'incompleteData'}`}>
            <div className="containerGroup">
              <p className="name">{currentValues.surname} {currentValues.name}</p>
              <p className="date">{currentValues.dateOfBook} </p>
              <p className="title">{currentValues.title}</p>
            </div>
            <p className="event">{currentValues.event}</p>
            <p className="cash">{currentValues.cash}</p>
          </li>
          <h3 style={{ textAlign: 'center', margin: '32px' }}>NOWE WARTOŚCI</h3>
          <Box style={{ width: '100%' }} p={4} display="flex" justifyContent="space-between">
            <TextField
              style={{ margin: '16px', width: '40%' }}
              value={newValues.name}
              onChange={(e) => setNewValues({ ...newValues, name: e.target.value })}
              label="Imię"
              variant="standard"
            />
            <TextField 
              style={{ margin: '16px', width: '40%' }}
              value={newValues.surname}
              onChange={(e) => setNewValues({ ...newValues, surname: e.target.value })}
              label="Nazwisko"
              variant="standard"
            />

          </Box>
          <Box style={{ width: '100%' }} p={4} display="flex" justifyContent="space-between">
            <TextField 
              style={{ margin: '16px', width: '40%' }}
              value={newValues.team}
              onChange={(e) => setNewValues({ ...newValues, team: e.target.value })}
              select
              label="Drużyna"
              variant="standard"
            >
              {teamsMap.map((team) => (
                <MenuItem key={team.teamId} value={team.teamId}>{team.name}</MenuItem>
              ))}
            </TextField>
            <TextField 
              style={{ margin: '16px', width: '40%' }}
              value={newValues.event}
              onChange={(e) => setNewValues({ ...newValues, event: e.target.value })}
              label="Kod"
              variant="standard"
              select
            >
              {codes && codes.map((code) => (
                <MenuItem key={code} value={code}>{code}</MenuItem>
              ))}
            </TextField>

          </Box>
          <Box p={4} style={{ width: '100%' }} display="flex" justifyContent="space-between">
            <Button style={{ width: '40%' }} color="secondary" variant="contained" onClick={() => {
              setOpenChangeModal(false);
              setNewValues({
                cash: 0,
                title: '',
                dateOfBook: new Date(),
                event: '',
                id: '',
                importDate: new Date(),
                name: '',
                surname: '',
                team: '',
                year: new Date().getFullYear(),
              });
            }}>
            Anuluj
            </Button>
            <Button style={{ width: '40%' }}color="primary" variant="contained" startIcon={<AddIcon />} onClick={handleChangeIncome}>
            Dodaj
            </Button>
          </Box>
        </div>
      </Modal>
    </div>
  );
};