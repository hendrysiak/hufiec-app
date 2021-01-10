import { Button, TextField } from '@material-ui/core';
import React, { useState } from 'react';

import { addTeamMember } from 'helpers/editing-db.handler';

import classes from '../EditorTeam.module.css';


const NewTeamMember = (team: { team:string }) => {
  const [input, setInput] = useState<{name: string, surname: string}>({ name: '', surname: '' });

  const handleInputChange = (e: React.FormEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setInput({
      ...input,
      [e.currentTarget.name]: e.currentTarget.value
    });
  };

  const handleAddTeamMemebr = () => {
    if (team.team.length && input.name.length && input.surname.length) addTeamMember(team.team, input);
  };

  return (
    <form className={classes.positionModal}>
      <TextField name="name" id="standard-basic" label="IMIĘ" onChange={handleInputChange} />
      <TextField name="surname" id="standard-basic" label="NAZWISKO" onChange={handleInputChange} />
      <Button className={classes.btnAddNewMember} variant="contained" color="primary" onClick={handleAddTeamMemebr} >DODAJ</Button>
    </form>
  );
};

export default NewTeamMember;