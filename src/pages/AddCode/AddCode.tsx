import { TextField, MenuItem, Table, TableBody, TableCell, TableHead, TableRow } from '@material-ui/core';
import Button from '@material-ui/core/Button';
import IconButton from '@material-ui/core/IconButton';
import Tooltip from '@material-ui/core/Tooltip';
import AddIcon from '@material-ui/icons/Add';


import React, { useState, useEffect } from 'react';

import { useSelector } from 'react-redux';

import axios from 'axios-income';
import { Event } from 'models/codes.models';

import Navigation from 'shared/Navigation/Navigation';
import { RootState } from 'store/models/rootstate.model';

const AddCode = (): JSX.Element => {
  const codes = useSelector((state: RootState) => state.income.codes);
  const registry = useSelector((state: RootState) => state.income.registry);

  const [currentCodes, setCurrentCodes] = useState(codes);
  const [generalCode, setGeneralCode] = useState<string>('');
  const [currentTeam, setCurrentTeam] = useState('Kod ogólny');

  useEffect(() => {
    setCurrentCodes(codes);
  }, [codes]);

  
  const addTeam = (code: Event) => {
    if (!currentTeam || currentTeam === 'Kod ogólny') {
      return alert('Nie wybrano drużyny!');
    }

    if (currentCodes) {
      const updatedCodes = currentCodes.map(c => {
        if (c.code === code.code) {
          const currentCodesTeam = c.teams ? [...c.teams] : [];
          if (!currentCodesTeam.includes(currentTeam)) currentCodesTeam.push(currentTeam);
          return { ...c, teams: currentCodesTeam };
        } else return { ...c };
      });
      setCurrentCodes(updatedCodes);
    }
    
  };

  let listOfCode;
  if (currentCodes && currentCodes.length > 0) {
    const rows = currentCodes.map((code, index) => {
      return {
        id: index,
        lp: index + 1,
        code: code.code,
        teams: code.teams ? code.teams.join(', ') : '',
        add:      <Tooltip title="Dodaj drużynę" aria-label="add-team">
          <IconButton><AddIcon onClick={() => addTeam(code)}/></IconButton>
        </Tooltip>
      };
    });
    listOfCode = <Table>
      <TableHead>
        <TableRow>
          <TableCell>LP</TableCell>
          <TableCell>KOD</TableCell>
          <TableCell>DRUŻYNY PRZYPISANE DO KODU</TableCell>
          <TableCell>DODAJ DRUŻYNĘ</TableCell>
        </TableRow>
      </TableHead>
      <TableBody>
        {rows.map((row) => (
          <TableRow key={row.code}>
            <TableCell>
              {row.lp}
            </TableCell>
            <TableCell>
              {row.code}
            </TableCell>
            <TableCell>{row.teams}</TableCell>
            <TableCell>{row.add}</TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>;
  }

  const saveCode = (): void => {
    const newCode = { code: generalCode, teams: currentTeam === 'Kod ogólny' ? undefined : [currentTeam] };
    const updatedCodes = currentCodes ? [...currentCodes] : [];
    updatedCodes.push(newCode);
    setCurrentCodes(updatedCodes);
  };

  const sendCode = async () => {
    if (!window.confirm('Czy jesteś pewien/pewna, że chcesz zapisac kody?')) return;
    try {
      await axios.put('/codes.json', currentCodes);
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <>
      <Navigation />
      <div style={{ overflowY: 'scroll', height: '100%' }}>
        <form id="general" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
          <h2>Dodaj kod</h2>
          <TextField 
            style={{ width: '40%', margin: '16px 0' }}
            value={generalCode}
            onChange={(e) => setGeneralCode(e.target.value)}
            select={false}
            size="small"
            variant="outlined"
            margin="normal"
            label="Wprowadź pełny kod"
          />
          <TextField
            style={{ width: '40%', margin: '16px 0' }}
            label="Wybierz drużynę"
            value={currentTeam}
            onChange={(e) => setCurrentTeam(e.target.value)}
            placeholder="Wybierz kod z listy"
            select={true}
            size="small"
            variant="outlined"
            margin="normal"
            SelectProps={{
              MenuProps: { disableScrollLock: true }
            }}
          >
            {registry && ['Kod ogólny', ...Object.keys(registry)].map((item) => (
              <MenuItem key={item} value={item}>{item}</MenuItem>
            ))}
          </TextField>
          <Button variant="contained" color="primary" onClick={() => saveCode()}>Zapisz kod tymczasowo</Button>
        </form>
        <section>
          <h2>Przypisane kody</h2>
          {listOfCode}
          <Button variant="contained" color="primary" onClick={() => sendCode()}>Zapisz kody do bazy</Button>
        </section>
      </div>
    </>
  );
};

export default AddCode;
