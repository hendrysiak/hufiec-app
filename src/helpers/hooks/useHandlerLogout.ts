import { useEffect } from 'react';
import Cookies from 'universal-cookie';


export const useHandlerLogout = () => {
  const cookies = new Cookies();
  
  const eventClick = (e: MouseEvent) => {
    const target = e.target as HTMLElement;
    const token = cookies.get('token');
    if (target.classList.contains('clicked')) {
      cookies.remove('token');
      setTimeout(() => {
        return window.location.reload();
      },500);
      return;
    }
    if (token && !target.classList.contains('clicked')) {
      cookies.set('token', token, { path: '/', maxAge: 180 });
      return;
    };
  };
  

  useEffect(() => {
    window.addEventListener('click', eventClick);
    return () => window.removeEventListener('click', eventClick);
  },[]);
};