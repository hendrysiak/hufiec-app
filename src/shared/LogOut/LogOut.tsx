import { Tooltip, IconButton, makeStyles } from '@material-ui/core';

import ExitToAppIcon from '@material-ui/icons/ExitToApp';

import React from 'react';

import { LogOutTimer } from 'shared/LogOutTimer/LogOutTimer';

import classes from './LogOut.module.css';

export const LogOut = (): JSX.Element => {

  const useStyles = makeStyles(() => ({
    button: {
      color: 'white'
    },
  }));

  const materialClasses = useStyles();
  
  return (
    <>
      <LogOutTimer className={classes.timer}/>
      <div className={`${classes.container} ${classes.close}`}>
        <Tooltip title="Wyloguj" aria-label="log-out">
          <IconButton classes={{ root: materialClasses.button }} ><ExitToAppIcon className="clicked" /></IconButton>
        </Tooltip>
      </div>
    </>
  );
};