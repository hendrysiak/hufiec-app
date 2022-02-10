
import { TextField } from '@material-ui/core';
import Button from '@material-ui/core/Button';
import React, { MouseEvent, useState } from 'react';
import { useHistory } from 'react-router-dom';

import { setIncomeInRedux } from './helpers/setReduxData.helper';

import classes from './ImportIncome.module.css';

const ImportIncome = (): JSX.Element => {

  const history = useHistory();
  const [xmlFile, setXmlFile] = useState<File | string>('');

  const handleSetXmlFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e?.target?.files?.[0];
    if (file) setXmlFile(file);
  };

  const setUrl = (
    event: MouseEvent<HTMLButtonElement>): void => {
    event.preventDefault();
    setIncomeInRedux(xmlFile as File);
    history.push('/transfers/imported');
  };

  return (
    <>
      <section className="Section">
        <form className={classes.Form}>
          <h2>Zaimportuj XML</h2>
          <TextField 
            style={{ width: '90%', margin: '16px 0' }}
            // value={xmlFile.}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleSetXmlFile(e)}
            select={false}
            size="small"
            variant="outlined"
            margin="normal"
            type="file"
          />
          <Button 
            variant="contained" 
            color="primary"
            disabled={typeof xmlFile === 'string'}
            onClick={(e: MouseEvent<HTMLButtonElement>) => setUrl(e)}>
              Importuj
          </Button>
        </form>
      </section>
    </>
  );

};

export default ImportIncome;
