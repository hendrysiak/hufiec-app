import ChevronLeftIcon from '@material-ui/icons/ChevronLeft';
import CloseIcon from '@material-ui/icons/Close';

import React, { useState } from 'react';


import { LogoutTimer } from 'shared/LogoutTimer/LogoutTimer';


import classes from './LogOut.module.css';

export const LogOut = () => {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  
  return (
    <>
      <LogoutTimer className={classes.timer}/>
      <div className={`${classes.container} ${isOpen && classes.close}`}>
        {isOpen ? <CloseIcon className={classes.arrow} onClick={() => setIsOpen(!isOpen)}/> : <ChevronLeftIcon className={classes.arrow} onClick={() => setIsOpen(!isOpen)}/>}
        <button type="button" className={`${classes.logout} clicked`} >WYLOGUJ</button>
      </div>
    </>
  );
};