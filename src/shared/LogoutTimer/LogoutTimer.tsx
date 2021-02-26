import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import Cookies from 'universal-cookie';

import { timeToLogout } from 'constans/Constans';
import { RootState } from 'store/models/rootstate.model';

export const LogoutTimer = ({ className }: any): JSX.Element => {
  const user = useSelector((state: RootState) => state.user);
  const cookies = new Cookies();
  const [counter, setCounter] = useState(timeToLogout);

  useEffect(() => {
    const loop = setInterval(function() {
      counter === 0 && window.location.reload();
      setCounter((prev: number) => prev > 0 ? prev - 1 : 0);
    },1000);
    return () => clearInterval(loop);
  },[counter]);

  useEffect(() => {
    const eventClick = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      const token = cookies.get('token');
      if (target.classList.contains('clicked')) {
        cookies.remove('token', { path: '/' });
        return window.location.reload();
      }
      if (token) {
        cookies.set('token', token, { path: '/', maxAge: timeToLogout });
        setCounter(timeToLogout);
        return;
      };
      user.isAuthenticated && window.location.reload();
    };
    
    window.addEventListener('click', eventClick);
    return () => window.removeEventListener('click', eventClick);
  },[user]);

  return (
    <div className={className} style={{ color: counter < 60 ? 'red' : 'black' }}>
      {`${(counter / 60) > 9 ? parseInt((counter / 60).toString()) : '0' + parseInt((counter / 60).toString())}: ${counter % 60 >= 10 ? counter % 60 : '0' + counter % 60}`}
    </div>
  );
};