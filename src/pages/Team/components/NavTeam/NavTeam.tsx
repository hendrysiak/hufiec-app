import { SpeedDial, SpeedDialAction, SpeedDialIcon } from '@material-ui/lab';
import React, { useState } from 'react';

import classes from './NavTeam.module.css';

export const NavTeam = ({ team }: {team: string}) => {

  
  const [open, setOpen] = useState<boolean>(false);
  const handleClose = () => {
    setOpen(false);
  };

  const handleOpen = () => {
    setOpen(true);
  };


  return (
    <SpeedDial
      classes={{ fab: classes.rootCircle }}
      ariaLabel="SpeedDial example"
      // classes={{root: classes.test,}}
      hidden={false}
      icon={<SpeedDialIcon classes={{ root: classes.iconRoot, icon: classes.icon }}/>}
      onClose={handleClose}
      onOpen={handleOpen}
      open={open}
      direction= "left"
    >
      {/* {actions.map((action) => ( */}
      <SpeedDialAction
        classes={{ fab: classes.actionRoot }}
        key={1}
        icon={''}
        tooltipTitle={''}
        onClick={handleClose}
      />
      <SpeedDialAction
        classes={{ fab: classes.actionRoot }}
        key={2}
        icon={''}
        tooltipTitle={''}
        onClick={handleClose}
      />
      <SpeedDialAction
        classes={{ fab: classes.actionRoot }}
        key={3}
        icon={''}
        tooltipTitle={''}
        onClick={handleClose}
      />
      <SpeedDialAction
        classes={{ fab: classes.actionRoot }}
        key={4}
        icon={''}
        tooltipTitle={''}
        onClick={handleClose}
      />
      {/* ))} */}
    </SpeedDial>
  );
};