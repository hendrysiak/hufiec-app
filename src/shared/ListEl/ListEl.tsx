import TextField from '@mui/material/TextField';
import makeStyles from '@mui/styles/makeStyles';
import React, { ChangeEvent } from 'react';

interface Props {
  cash: number;
  error: boolean;
  title: string;
  clicked?: (event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
}

const ListEl = (props: Props): JSX.Element => {
 
  const useStyles = makeStyles(() => ({
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
    <li className={classes.root} style={{ display: 'flex', justifyContent: 'space-around' }}>
      {props.cash && <TextField 
        className={classes.first}
        value={props.cash}
        error={props.error}
        margin="dense"
      />}
      <TextField
        size="medium"
        value={props.title}
        error={props.error}
        margin="dense"
        onChange={props.clicked}
      />
    </li>
  );
};

export default ListEl;
