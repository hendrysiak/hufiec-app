import { Grid, TextField } from '@mui/material';

import React, { useEffect, useState } from 'react';

import { useDebounce } from 'helpers/hooks/useDebounce';

interface IProps {
  name: string;
  setName: (name: string) => void;
  surname: string;
  setSurname: (surname: string) => void;
}

export function FiltersName(props: IProps): JSX.Element {
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
    <Grid container gap={1}>
      <Grid item xs={12} md={5}>
        <TextField
          style={{ margin: 'auto 8px' }}
          label="Po nazwisku"
          value={surname}
          onChange={(e) => setSurname(e.target.value)}
          placeholder="Wpisz nazwisko"
          size="small"
          variant="outlined"
        />
      </Grid>
      <Grid item xs={12} md={5}>
        <TextField
          style={{ margin: 'auto 8px' }}
          label="Po imieniu"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Wpisz imię"
          size="small"
          variant="outlined"
        />
      </Grid>
    </Grid>
  );
}
