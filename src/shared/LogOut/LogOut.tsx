import ChevronLeftIcon from '@material-ui/icons/ChevronLeft';
import CloseIcon from '@material-ui/icons/Close';
import React, { useState } from 'react';
import Cookies from 'universal-cookie';

import classes from './LogOut.module.css';

export const LogOut = () => {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const cookies = new Cookies();
  
  // const handleLogOut = (e: React.MouseEvent<HTMLButtonElement>) => {
  //   e.preventDefault();
  //   cookies.remove('token');
  //   window.location.reload();
  // };

  return (
    <>
      <div className={`${classes.container} ${isOpen && classes.close}`}>
        {isOpen ? <CloseIcon className={classes.arrow} onClick={() => setIsOpen(!isOpen)}/> : <ChevronLeftIcon className={classes.arrow} onClick={() => setIsOpen(!isOpen)}/>}
        <button type="button" className={`${classes.logout} clicked`} >WYLOGUJ</button>
      </div>
    </>
  );
};