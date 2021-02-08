import React, { useState } from 'react';
import { BsArrowBarLeft, BsArrowBarRight } from 'react-icons/bs';

import Cookies from 'universal-cookie';

import classes from './LogOut.module.css';

export const LogOut = () => {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const cookies = new Cookies();
  
  const handleLogOut = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    cookies.remove('token');
    window.location.reload();
  };

  return (
    <>
      <div className={`${classes.container} ${isOpen && classes.close}`}>
        {isOpen ? <BsArrowBarRight className={classes.arrow} onClick={() => setIsOpen(!isOpen)}/> : <BsArrowBarLeft className={classes.arrow} onClick={() => setIsOpen(!isOpen)}/>}
        <button type="button" className={`${classes.logout} clicked`} onClick={handleLogOut}>WYLOGUJ</button>
      </div>
    </>
  );
};