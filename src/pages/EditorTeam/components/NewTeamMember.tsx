import {
  Button, TextField, Checkbox, FormControlLabel,
} from '@mui/material';

import React, { useState } from 'react';

import { addTeamMember } from 'helpers/editing-db.handler';

import { Person } from 'models/registry.models';

import classes from '../EditorTeam.module.css';

function NewTeamMember({ team, handleCloseNewMember }: { team: number; handleCloseNewMember: () => void }): JSX.Element {
  const [input, setInput] = useState<Person>({
    name: '', surname: '', dateOfAdd: null, disability: false, instructor: false,
  });

  const handleInputChange = (e: React.FormEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setInput({
      ...input,
      [e.currentTarget.name]: e.currentTarget.value,
    });
  };
  const handleAddTeamMemebr = () => {
    if (team && input.name.length && input.surname.length) {
      addTeamMember(team, input);
    }
    handleCloseNewMember();
  };

  return (
    <form className={classes.positionModal}>
      <TextField name="name" id="standard-basic" label="IMIĘ" onChange={handleInputChange} />
      <TextField name="surname" id="standard-basic" label="NAZWISKO" onChange={handleInputChange} />
      {/* <FormControlLabel
        control={<Checkbox
          checked={input.disability}
          onChange={(e) => setInput({ ...input, disability: e.target.checked })}
          name="disability"
          color="primary"
        />}
        label="NS?"
      /> */}
      <FormControlLabel
        className="dateCheckbox"
        control={(
          <Checkbox
            checked={input.instructor}
            onChange={(e) => setInput({ ...input, instructor: e.target.checked })}
            name="instructor"
            color="primary"
          />
)}
        label="Instruktor?"
      />
      <Button className={classes.btnAddNewMember} variant="contained" color="primary" onClick={handleAddTeamMemebr}>DODAJ</Button>
    </form>
  );
}

export default NewTeamMember;
