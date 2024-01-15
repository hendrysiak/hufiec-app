import {
  Button, TextField, Checkbox, FormControlLabel,
} from '@mui/material';

import React, { useState } from 'react';

import { addTeamMember } from 'helpers/editing-db.handler';

import { Person } from 'models/registry.models';

import classes from '../../pages/EditorTeam/EditorTeam.module.css';

function NewTeamMember({ team, handleCloseNewMember }: { team: number; handleCloseNewMember: () => void }): JSX.Element {
  const [input, setInput] = useState<Person>({
    name: '', surname: '', evidenceNumber: '', dateOfAdd: null, disability: false, instructor: false,
  });

  const handleInputChange = (e: React.FormEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setInput({
      ...input,
      [e.currentTarget.name]: e.currentTarget.value,
    });
  };
  const handleAddTeamMemebr = () => {
    if (team && input.name.length && input.surname.length && input.evidenceNumber?.length) {
      addTeamMember(team, input);
    }
    if (window.confirm('Nie wypełniono wszystkich pól. Chcesz poprawić?')) {
      return;
    };
    
    handleCloseNewMember();
  };

  return (
    <form className={classes.positionModal}>
      <TextField name="name" id="standard-basic" label="IMIĘ" onChange={handleInputChange} />
      <TextField name="surname" id="standard-basic" label="NAZWISKO" onChange={handleInputChange} />
      <TextField name="evidenceNumber" id="standard-basic" label="NR EWIDENCJI" onChange={handleInputChange} />
      <FormControlLabel
        className="dateCheckbox"
        control={<Checkbox
          checked={input.disability}
          onChange={(e) => setInput({ ...input, disability: e.target.checked })}
          name="disability"
          color="primary"
        />}
        label="NS?"
      />
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
