import React from "react";
// import classes from "./ListEl.module.css";

import TextField from '@material-ui/core/TextField';

import { makeStyles } from '@material-ui/core/styles';

const ListEl = props => {
 
  const useStyles = makeStyles((theme) => ({
    root: {
      '& > * ': {
        width: '75%',
      }
    },
    first: {
      width: '15%'
    }
  }));

  const classes = useStyles();

  return (
    <li className={classes.root} style={{display: 'flex', justifyContent: 'space-around'}}>
     {props.cash && <TextField 
        className={classes.first}
        value={props.cash}
        error={props.error}
        margin='dense'
      />}
      <TextField
        size='medium'
        value={props.title}
        error={props.error}
        margin='dense'
        onChange={props.clicked}
      />
    </li>
  );
};

export default ListEl;
