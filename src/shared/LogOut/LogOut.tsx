import ChevronLeftIcon from '@material-ui/icons/ChevronLeft';
import CloseIcon from '@material-ui/icons/Close';

import React, { useState } from 'react';


import { LogOutTimer } from 'shared/LogOutTimer/LogOutTimer';


import classes from './LogOut.module.css';

export const LogOut = (): JSX.Element => {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  
  return (
    <>
      <LogOutTimer className={classes.timer}/>
      <div className={`${classes.container} ${isOpen && classes.close}`}>
        {isOpen ? <CloseIcon className={classes.arrow} onClick={() => setIsOpen(!isOpen)}/> : <ChevronLeftIcon className={classes.arrow} onClick={() => setIsOpen(!isOpen)}/>}
        <button type="button" className={`${classes.logout} clicked`} >WYLOGUJ</button>
      </div>
    </>
  );
};