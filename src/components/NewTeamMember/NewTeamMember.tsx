import {
  Button, TextField, Checkbox, FormControlLabel,
} from '@mui/material';

import React, { useState } from 'react';

import { addTeamMember } from 'helpers/editing-db.handler';

import { Person } from 'models/registry.models';

import { useSelector } from 'react-redux';
import { RootState } from 'store/models/rootstate.model';
import { contains } from 'helpers/utils/contains';

function NewTeamMember({ team, handleCloseNewMember }: { team: number; handleCloseNewMember: () => void }): JSX.Element {
  const registry = useSelector((state: RootState) => state.income.registry);
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
      const userExist = contains(registry, input.evidenceNumber);

      if (!userExist) {
        addTeamMember(team, input);
        handleCloseNewMember();
        return;

      } else {
        window.alert('Użytkownik o podanym numerze ewidencji już istnieje.')
        return;
      }
    }

    if (window.confirm('Nie wypełniono wszystkich pól. Chcesz poprawić?')) {
      return;
    };

    handleCloseNewMember();
  };

  return (
    <form>
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
      <Button variant="contained" color="primary" onClick={handleAddTeamMemebr}>DODAJ</Button>
    </form>
  );
}

export default NewTeamMember;
