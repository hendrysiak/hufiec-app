import React, { useState, useEffect } from "react";
import axios from "../../axios-income";
import ListContainer from "../ListContainer/ListContainer";

import AddIcon from '@material-ui/icons/Add';
import IconButton from '@material-ui/core/IconButton';
import Tooltip from '@material-ui/core/Tooltip';

import { TextField, MenuItem } from '@material-ui/core';
import Button from '@material-ui/core/Button';

import { useSelector } from "react-redux";

const AddCode = () => {
  const codes = useSelector(state => state.income.codes);
  const registry = useSelector(state => state.income.registry);

  const [currentCodes, setCurrentCodes] = useState(codes);
  const [generalCode, setGeneralCode] = useState();
  const [currentTeam, setCurrentTeam] = useState("Kod ogólny");

  useEffect(() => {
    setCurrentCodes(codes);
  }, [codes]);

  
  const addTeam = (code) => {
    if (!currentTeam || currentTeam === "Kod ogólny") {
      return alert("Nie wybrano drużyny!")
    }

    const updatedCodes = currentCodes.map(c => {
      if (c.code === code.code) {
        console.log('Fire event');
        const currentCodesTeam = [...c.teams];
        if (!currentCodesTeam.includes(currentTeam)) currentCodesTeam.push(Number(currentTeam));
        return { ...c, teams: currentCodesTeam }
      } else return { ...c }
    });
    
    setCurrentCodes(updatedCodes);
  }

  let listOfCode;
  if (currentCodes && currentCodes.length > 0) {
    listOfCode = currentCodes.map((code, index) => (
      <ListContainer
        key={index}
        title={code.code}
      >
        <Tooltip title="Dodaj drużynę" aria-label="add-team">
          <IconButton><AddIcon onClick={() => addTeam(code)}/></IconButton>
      </Tooltip>
        {code.teams && code.teams.map((code, i) => (
          <li key={i}>{code}</li>
        ))}
      </ListContainer>
    ));
  }

  const saveCode = () => {
    const newCode = { code: generalCode, teams: currentTeam === "Kod ogólny" ? null : [currentTeam]}
    const updatedCodes = [...currentCodes];
    updatedCodes.push(newCode);
    setCurrentCodes(updatedCodes);
  };

  const sendCode = async () => {
    if (!window.confirm('Czy jesteś pewien/pewna, że chcesz zapisac kody?')) return;
    try {
      await axios.put("/codes.json", currentCodes);
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <div style={{ overflowY: "scroll", height: "100%" }}>
      <form id="general" style={{display: "flex", flexDirection: "column", alignItems: "center"}}>
        <h2>Dodaj kod</h2>
        <TextField 
          style={{width: '40%', margin: '16px 0'}}
          value={generalCode}
          onChange={(e) => setGeneralCode(e.target.value)}
          select={false}
          size="small"
          variant="outlined"
          margin="normal"
          label="Wprowadź pełny kod"
        />
        <TextField
          style={{width: '40%', margin: '16px 0'}}
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
          {registry && ["Kod ogólny", ...Object.keys(registry)].map((item) => (
        <MenuItem key={item} value={item}>{item}</MenuItem>
      ))}
        </TextField>
        <Button variant="contained" color="primary" onClick={() => saveCode()}>Zapisz kod tymczasowo</Button>
      </form>
      <section>
        <h2>Przypisane kody</h2>
        {listOfCode}
        <Button variant="contained" color="primary" onClick={() => sendCode()}>Zapisz kody do bazy</Button>
        {/* <button onClick={sendCode}>Zapisz kody do bazy</button> */}
      </section>
    </div>
  );
};

export default AddCode;
