import { TextField } from '@material-ui/core';
import React from 'react';

import DateAndPlace from 'pages/Letter/components/DateAndPlace/DateAndPlace';


const Main = (): JSX.Element => {
  return (
    <main className="main">
      <header className="main__header">
        <TextField
          multiline
          rows={3}
          style={{ width: '300px' }}  
        />
        <DateAndPlace />
      </header>
    </main>
  );
};

export default Main;
