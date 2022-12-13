import ExitToAppIcon from '@mui/icons-material/ExitToApp';
import { Tooltip, IconButton } from '@mui/material';

import makeStyles from '@mui/styles/makeStyles';

import React from 'react';

import { useLocation } from 'react-router-dom';

import { useAuth } from 'providers/AuthUserProvider/AuthUserProvider';

import classes from './LogOut.module.css';

export function LogOut(): JSX.Element {
  const { signOutFromApp } = useAuth();

  const useStyles = makeStyles(() => ({
    button: {
      color: 'white',
    },
  }));

  const materialClasses = useStyles();

  const currentPath = useLocation();

  const disableLogout = currentPath.pathname === '/login';

  return disableLogout ? <></> : (
    <>
      {/* <LogOutTimer className={classes.timer}/> */}
      <div className={`${classes.container} ${classes.close}`}>
        <Tooltip title="Wyloguj" aria-label="log-out">
          <IconButton onClick={() => signOutFromApp()?.then(() => window.location.reload())} classes={{ root: materialClasses.button }} size="large"><ExitToAppIcon className="clicked" /></IconButton>
        </Tooltip>
      </div>
    </>
  );
}
