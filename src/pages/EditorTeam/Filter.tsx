import { TextField } from '@material-ui/core';

import React, { useEffect, useState } from 'react';

import { useDebounce } from 'helpers/hooks/useDebounce';

type Props = {
  name: string;
  setName: (team: string) => void;
  surname: string;
  setSurname: (team: string) => void;
  disabled: boolean;
};

export const Filter = (props: Props) => {
  const [name, setName] = useState<string>('');
  const [surname, setSurname] = useState<string>('');

  const debouncedName = useDebounce(name, 500);
  const debouncedSurname = useDebounce(surname, 500);

  useEffect(() => {
    props.setName(name);
  }, [debouncedName]);

  useEffect(() => {
    props.setSurname(surname);
  }, [debouncedSurname]);

  return (
    <>
      <TextField
        style={{ margin: '0 8px' }}
        label="Po nazwisku"
        value={surname}
        onChange={(e) => setSurname(e.target.value)}
        placeholder="Wpisz nazwisko"
        size="small"
        variant="outlined"
        margin="none"
        disabled={ props.disabled }
      />
      <TextField
        style={{ margin: '0 8px' }}
        label="Po imieniu"
        value={name}
        onChange={(e) => setName(e.target.value)}
        placeholder="Wpisz imię"
        size="small"
        variant="outlined"
        margin="none"
        disabled={ props.disabled }
      />
    </>
  );
};
