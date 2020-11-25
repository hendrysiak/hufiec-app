import React, { useState } from "react";
import * as actions from "../../store/actions/index";
import classes from "./ImportIncome.module.css";
import { Link, useHistory } from "react-router-dom";

import { TextField } from '@material-ui/core';
import Button from '@material-ui/core/Button';

import Navigation from '../../shared/Navigation';

import store from "../../store/store";

const ImportIncome = () => {

  const history = useHistory();

  const [dataUrl, setDataUrl] = useState('');


  const setUrl = event => {
    event.preventDefault();
    // store.dispatch(actions.fetchIncome(event.target.children[1].value));
    store.dispatch(actions.fetchIncome(dataUrl));
    history.push('/transfers/imported')
  };


    return (
      <>
      <Navigation />
      <section className="Section">
          <form className={classes.Form} onSubmit={event => setUrl(event)}>
          <h2>Wstaw URL z importem XML</h2>
          <TextField 
          style={{width: '90%', margin: '16px 0'}}
          value={dataUrl}
          onChange={(e) => setDataUrl(e.target.value)}
          placeholder="Wstaw URL z importem XML"
          select={false}
          size="small"
          variant="outlined"
          margin="normal"
          label="Wstaw URL z importem XML"
        />
          <Button variant="contained" color="primary" onClick={(e) => setUrl(e)}>Importuj</Button>
        </form>
      </section>
      </>
    );

};

export default ImportIncome;
